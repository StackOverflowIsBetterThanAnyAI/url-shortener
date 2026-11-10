describe('Home page', () => {
    beforeEach(() => {
        cy.stubSession(null)
        cy.visit('/')
    })

    it('shows the header with logo and claim', () => {
        cy.get('nav').contains('URL Shortener')
        cy.contains('h2', 'Long link. Made short.')
        cy.contains('h3', 'Turn your URL into a short, unique link.')
    })

    it('shows the info section', () => {
        cy.contains('No sign-up needed. Free. Ready to share.')
        cy.contains('Guest links are not saved to an account.')
    })

    it('shows the footer with the current year and the GitHub link', () => {
        const year = new Date().getFullYear()

        cy.get('footer')
            .should('contain', `Copyright © ${year} Michael Münzenhofer.`)
            .find('a')
            .should('have.attr', 'href')
            .and('include', 'github.com')

        cy.get('footer a')
            .should('have.attr', 'target', '_blank')
            .and('have.attr', 'rel')
            .and('include', 'noopener')
    })
})
