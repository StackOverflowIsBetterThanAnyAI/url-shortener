const SHORT_URL = 'http://localhost:3000/aB3xY9'
const LONG_URL = 'https://example.com/articles/ideas'

const submitButton = () => cy.get('input[type="submit"]')
const urlInput = () => cy.get('#url')

describe('Shorten form', () => {
    beforeEach(() => {
        cy.stubSession(null)
        cy.visit('/', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'clipboard', {
                    value: { writeText: cy.stub().as('writeText').resolves() },
                    configurable: true,
                })
            },
        })
        cy.wait('@getSession')
    })

    describe('validation', () => {
        it('disables the submit button while the input is empty', () => {
            cy.contains(
                'Paste a complete URL with the protocol http:// or https://.'
            )
            submitButton().should('be.disabled')
        })

        it('keeps the button disabled for URLs without protocol', () => {
            urlInput().type('example.com')
            cy.contains('Paste a complete URL with the protocol')
            submitButton().should('be.disabled')
        })

        it('enables the button for a valid URL format', () => {
            urlInput().type(LONG_URL)
            cy.contains(
                'Valid URL format - your link is ready to be shortened.'
            )
            submitButton().should('be.enabled')
        })

        it('limits the input to 2048 characters', () => {
            urlInput().should('have.attr', 'maxlength', '2048')
        })
    })

    describe('successful shortening', () => {
        beforeEach(() => {
            cy.intercept('POST', '/api/v1/shorten', {
                statusCode: 201,
                body: { shortUrl: SHORT_URL },
                delay: 500,
            }).as('shorten')
        })

        it('sends the URL, shows a loading state and then the short link', () => {
            urlInput().type(LONG_URL)
            submitButton().click()

            submitButton().should('not.exist')
            urlInput().should('be.disabled')

            cy.wait('@shorten')
                .its('request.body')
                .should('deep.equal', { url: LONG_URL })

            cy.contains('h4', 'Your short link is ready!')
            cy.get(`span[title="${SHORT_URL}"]`).should('have.text', SHORT_URL)
            urlInput().should('be.disabled').and('have.value', LONG_URL)
        })

        it('submits with the Enter key without reloading the page', () => {
            cy.window().then((win) => {
                ;(win as Window & { __noReload?: boolean }).__noReload = true
            })

            urlInput().type(`${LONG_URL}{enter}`)
            cy.wait('@shorten')

            cy.contains('Your short link is ready!')
            cy.location('pathname').should('eq', '/')
            cy.window().its('__noReload').should('eq', true)
        })

        it('copies the short link to the clipboard', () => {
            urlInput().type(LONG_URL)
            submitButton().click()
            cy.wait('@shorten')

            cy.contains('button', 'Copy link').click()
            cy.get('@writeText').should('have.been.calledOnceWith', SHORT_URL)
            cy.contains('button', 'Copied link')
            cy.contains('button', 'Copy link', { timeout: 4000 })
        })

        it('resets the form without sending another request', () => {
            urlInput().type(LONG_URL)
            submitButton().click()
            cy.wait('@shorten')

            cy.contains('button', 'Shorten another URL').click()

            urlInput().should('be.enabled').and('have.value', '')
            submitButton().should('be.disabled')
            cy.contains('Your short link is ready!').should('not.exist')
            cy.get('@shorten.all').should('have.length', 1)
        })
    })

    describe('errors', () => {
        it('shows the error message returned by the API', () => {
            cy.intercept('POST', '/api/v1/shorten', {
                statusCode: 422,
                body: { error: 'Domain does not exist.' },
            }).as('shorten')

            urlInput().type('https://diese-domain-gibt-es-nicht.com')
            submitButton().click()
            cy.wait('@shorten')

            cy.contains('Domain does not exist.')
            cy.contains('Your short link is ready!').should('not.exist')
            submitButton().should('be.enabled')
        })

        it('clears the API error as soon as the user edits the URL', () => {
            cy.intercept('POST', '/api/v1/shorten', {
                statusCode: 422,
                body: { error: 'Domain does not exist.' },
            }).as('shorten')

            urlInput().type('https://diese-domain-gibt-es-nicht.com')
            submitButton().click()
            cy.wait('@shorten')
            cy.contains('Domain does not exist.')

            urlInput().type('x')
            cy.contains('Domain does not exist.').should('not.exist')
            cy.contains('Valid URL format')
        })

        it('shows a generic message on network errors', () => {
            cy.intercept('POST', '/api/v1/shorten', {
                forceNetworkError: true,
            }).as('shorten')

            urlInput().type(LONG_URL)
            submitButton().click()

            cy.contains('Something went wrong. Please try again.')
            submitButton().should('be.enabled')
        })
    })
})
