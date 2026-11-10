export type StubUser = {
    name: string
    email: string
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            stubSession(user: StubUser | null): Chainable<void>
        }
    }
}

export const buildSession = (user: StubUser) => {
    const now = new Date().toISOString()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    return {
        session: {
            id: 'session-e2e',
            userId: 'user-e2e',
            token: 'token-e2e',
            expiresAt,
            createdAt: now,
            updatedAt: now,
        },
        user: {
            id: 'user-e2e',
            name: user.name,
            email: user.email,
            emailVerified: true,
            image: null,
            createdAt: now,
            updatedAt: now,
        },
    }
}

Cypress.Commands.add('stubSession', (user: StubUser | null) => {
    cy.intercept('GET', '/api/auth/get-session*', {
        statusCode: 200,
        body: user ? buildSession(user) : null,
    }).as('getSession')
})
