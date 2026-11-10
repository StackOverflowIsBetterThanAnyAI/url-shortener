const allowDbWrites = String(Cypress.expose('ALLOW_DB_WRITES')) === 'true'

describe('Short link redirect (real database)', () => {
    before(function () {
        if (!allowDbWrites) {
            this.skip()
        }
    })

    it('creates a short link and redirects to the original URL', () => {
        const longUrl = `https://example.com/?e2e=${Date.now()}`

        cy.request('POST', '/api/v1/shorten', { url: longUrl }).then((res) => {
            expect(res.status).to.eq(201)

            const shortUrl: string = res.body.shortUrl
            expect(shortUrl).to.match(/\/[a-zA-Z0-9]{6}$/)

            const short = shortUrl.split('/').pop()

            cy.request({ url: `/${short}`, followRedirect: false }).then(
                (redirect) => {
                    expect(redirect.status).to.eq(307)
                    expect(redirect.redirectedToUrl).to.eq(longUrl)
                }
            )
        })
    })
})
