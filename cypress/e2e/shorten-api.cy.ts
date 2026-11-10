const shorten = (
    body: Cypress.RequestBody,
    headers: Record<string, string> = {}
) =>
    cy.request({
        method: 'POST',
        url: '/api/v1/shorten',
        body,
        headers: { 'Content-Type': 'application/json', ...headers },
        failOnStatusCode: false,
    })

describe('POST /api/v1/shorten', () => {
    it('rejects an invalid JSON body', () => {
        shorten('this is not json').then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body).to.deep.eq({ error: 'Invalid request body.' })
        })
    })

    it('rejects a body without url', () => {
        shorten({ link: 'https://example.com' }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body).to.deep.eq({ error: 'Invalid URL.' })
        })
    })

    it('rejects a url that is not a string', () => {
        shorten({ url: 12345 }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body).to.deep.eq({ error: 'Invalid URL.' })
        })
    })

    it('rejects a url without protocol', () => {
        shorten({ url: 'example.com' }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body).to.deep.eq({ error: 'Invalid URL.' })
        })
    })

    it('rejects a url with an unsupported protocol', () => {
        shorten({ url: 'ftp://example.com' }).then((res) => {
            expect(res.status).to.eq(400)
        })
    })

    it('rejects a url longer than 2048 characters', () => {
        const url = `https://example.com/${'a'.repeat(2048)}`

        shorten({ url }).then((res) => {
            expect(res.status).to.eq(422)
            expect(res.body).to.deep.eq({ error: 'URL is too long.' })
        })
    })

    it('rejects a domain that does not exist', () => {
        shorten({ url: 'https://diese-domain-gibt-es-nicht-xyz123.com' }).then(
            (res) => {
                expect(res.status).to.eq(422)
                expect(res.body).to.deep.eq({ error: 'Domain does not exist.' })
            }
        )
    })

    it('only allows POST', () => {
        cy.request({
            method: 'GET',
            url: '/api/v1/shorten',
            failOnStatusCode: false,
        })
            .its('status')
            .should('eq', 405)
    })
})
