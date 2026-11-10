describe('404 pages', () => {
    beforeEach(() => {
        cy.stubSession(null)
    })

    it('shows the generic 404 page for unknown paths', () => {
        cy.request({ url: '/foo/bar', failOnStatusCode: false })
            .its('status')
            .should('eq', 404)

        cy.visit('/foo/bar', { failOnStatusCode: false })
        cy.title().should('eq', 'Page not found | URL Shortener')
        cy.contains('404')
        cy.contains('h2', 'Page not found.')
        cy.get('nav').should('exist')
        cy.get('footer').should('exist')
    })

    it('redirects short links with an invalid format to the link-not-found page', () => {
        cy.request({ url: '/abc', followRedirect: false }).then((res) => {
            expect(res.status).to.eq(307)
            expect(res.redirectedToUrl).to.eq(
                `${Cypress.config('baseUrl')}/link-not-found`
            )
        })
    })

    it('redirects unknown short links to the link-not-found page', () => {
        cy.visit('/zzzzzz')

        cy.location('pathname').should('eq', '/link-not-found')
        cy.title().should('eq', 'Link not found | URL Shortener')
        cy.contains('h2', 'Link not found.')
        cy.contains('Please check for typos.')
    })

    it('marks the 404 pages as noindex', () => {
        cy.visit('/link-not-found')
        cy.get('meta[name="robots"]')
            .should('have.attr', 'content')
            .and('include', 'noindex')
    })

    it('links back to the home page', () => {
        cy.visit('/link-not-found')
        cy.contains('a', 'Shorten a new URL').click()

        cy.location('pathname').should('eq', '/')
        cy.get('#url').should('exist')
    })
})
