import { connection, NextResponse } from 'next/server'
import { sql } from '@/lib/db/db'

const SHORT_PATTERN = /^[a-zA-Z0-9]{6}$/

const redirectToLinkNotFound = (request: Request) =>
    NextResponse.redirect(new URL('/link-not-found', request.url), 307)

export async function GET(request: Request, ctx: RouteContext<'/[short]'>) {
    await connection()

    const { short } = await ctx.params

    if (!SHORT_PATTERN.test(short)) {
        return redirectToLinkNotFound(request)
    }

    try {
        const rows = await sql`
            SELECT url FROM links
            WHERE short = ${short}
            LIMIT 1
        `

        if (!rows.length) {
            return redirectToLinkNotFound(request)
        }

        return NextResponse.redirect(rows[0].url, 307)
    } catch (error) {
        console.error('Failed to resolve short link:', error)
        return new NextResponse('Something went wrong.', { status: 500 })
    }
}
