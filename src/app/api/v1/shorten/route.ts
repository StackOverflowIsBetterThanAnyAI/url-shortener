import { NextResponse } from 'next/server'
import { doesDomainExist } from '@/helper/server/doesDomainExist'
import { generateKey } from '@/helper/server/generateKey'
import { isValidUrl } from '@/helper/client/isValidUrl'
import { auth } from '@/lib/auth/server'
import { sql } from '@/lib/db/db'

const normalizeHostname = (hostname: string) =>
    hostname.toLowerCase().replace(/\.$/, '')

const getRequestHostname = (request: Request) => {
    const host =
        request.headers.get('x-forwarded-host') ?? request.headers.get('host')

    try {
        return new URL(`http://${host}`).hostname
    } catch {
        return new URL(request.url).hostname
    }
}

const isOwnHost = (url: URL, request: Request) =>
    normalizeHostname(url.hostname) ===
    normalizeHostname(getRequestHostname(request))

export async function POST(request: Request) {
    const { data: session } = await auth.getSession()
    const userId = session?.user.id ?? null

    let url = ''
    try {
        const body = await request.json()
        if (typeof body?.url === 'string') {
            url = body.url.trim()
        }
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body.' },
            { status: 400 }
        )
    }

    if (url.length > 2048) {
        return NextResponse.json({ error: 'URL is too long.' }, { status: 422 })
    }

    if (!isValidUrl(url)) {
        return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 })
    }

    let parsedUrl: URL
    try {
        parsedUrl = new URL(url)
    } catch {
        return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 })
    }

    if (isOwnHost(parsedUrl, request)) {
        return NextResponse.json(
            { error: 'Links to this site cannot be shortened.' },
            { status: 422 }
        )
    }

    if (!(await doesDomainExist(parsedUrl.hostname))) {
        return NextResponse.json(
            { error: 'Domain does not exist.' },
            { status: 422 }
        )
    }

    try {
        while (true) {
            const short = generateKey()

            const rows = await sql`
            INSERT INTO links (short, url, user_id)
            VALUES (${short}, ${url}, ${userId})
            ON CONFLICT (short) DO NOTHING
            RETURNING short
        `

            if (rows.length) {
                const origin = new URL(request.url).origin
                return NextResponse.json(
                    { shortUrl: `${origin}/${short}` },
                    { status: 201 }
                )
            }
        }
    } catch (error) {
        console.error('Failed to insert link:', error)
        return NextResponse.json({ error: 'Database error.' }, { status: 500 })
    }
}
