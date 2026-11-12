import { buildSession } from '../support/e2e'

const USER = { name: 'Erika Mustermann', email: 'erika@example.com' }

describe('Authentication (stubbed session)', () => {
    describe('as guest', () => {
        beforeEach(() => {
            cy.stubSession(null)
            cy.visit('/')
            cy.wait('@getSession')
        })

        it('shows the sign in button', () => {
            cy.get('button[title="Sign in with Google"]').should(
                'contain',
                'Sign in'
            )
            cy.contains('button', 'Log out').should('not.exist')
        })

        it('starts the Google sign in with the current origin as callback', () => {
            cy.intercept('POST', '/api/auth/sign-in/social*', {
                statusCode: 200,
                body: { url: '/?google-stub', redirect: true },
            }).as('signIn')

            cy.get('button[title="Sign in with Google"]').click()

            cy.wait('@signIn')
                .its('request.body')
                .should((body) => {
                    const origin = Cypress.config('baseUrl') as string

                    expect(body.provider).to.eq('google')
                    expect(body.callbackURL).to.satisfy(
                        (url: string) =>
                            url === origin ||
                            url.startsWith(`${origin}/`) ||
                            url.includes(encodeURIComponent(origin))
                    )
                })
        })
    })

    describe('as signed in user', () => {
        it('shows the user name, "My links" and "Log out"', () => {
            cy.stubSession(USER)
            cy.visit('/')
            cy.wait('@getSession')

            cy.get('nav').should('contain', USER.name)
            cy.contains('button', 'My links')
            cy.contains('button', 'Log out')
            cy.get('button[title="Sign in with Google"]').should('not.exist')
        })

        it('falls back to the email if the user has no name', () => {
            cy.stubSession({ name: '', email: USER.email })
            cy.visit('/')
            cy.wait('@getSession')

            cy.get('nav').should('contain', USER.email)
        })

        it('logs the user out', () => {
            let signedOut = false

            cy.intercept('GET', '/api/auth/get-session*', (req) => {
                req.reply({ body: signedOut ? null : buildSession(USER) })
            }).as('getSession')

            cy.intercept('POST', '/api/auth/sign-out*', (req) => {
                signedOut = true
                req.reply({ body: { success: true } })
            }).as('signOut')

            cy.visit('/')
            cy.contains('button', 'Log out').click()
            cy.wait('@signOut')

            cy.get('button[title="Sign in with Google"]').should('be.visible')
            cy.get('nav').should('not.contain', USER.name)
            cy.window().then((win) => {
                expect(win.sessionStorage.getItem('url-shortener')).to.equal(null)
            })
        })
    })

    describe('cached user in sessionStorage', () => {
        const STORAGE = JSON.stringify({
            user: { id: 'user-e2e', ...USER },
            isDialogOpen: true,
            links: [],
        })

        const visitWithCache = () =>
            cy.visit('/', {
                onBeforeLoad(win) {
                    win.sessionStorage.setItem('url-shortener', STORAGE)
                },
            })

        it('shows the cached user and reopens the dialog before the session has loaded', () => {
            cy.intercept('GET', '/api/v1/links', { body: { links: [] } })
            cy.intercept('GET', '/api/auth/get-session*', {
                body: buildSession(USER),
                delay: 3000,
            }).as('getSession')

            visitWithCache()

            cy.get('nav', { timeout: 1500 }).should('contain', USER.name)
            cy.get('dialog', { timeout: 1500 }).should('have.attr', 'open')
        })

        it('drops the cached user when the session has expired', () => {
            cy.stubSession(null)

            visitWithCache()
            cy.wait('@getSession')

            cy.get('button[title="Sign in with Google"]').should('be.visible')
            cy.get('nav').should('not.contain', USER.name)
            cy.window().then((win) => {
                expect(win.sessionStorage.getItem('url-shortener')).to.equal(null)
            })
        })
    })
})
