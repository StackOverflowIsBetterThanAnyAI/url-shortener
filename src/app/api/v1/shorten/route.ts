import { doesDomainExist } from '@/helper/doesDomainExist'
import { isValidUrl } from '@/helper/isValidUrl'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    let url = ''
    try {
        const body = await request.json()
        if (typeof body?.url === 'string') {
            url = body.url.trim()
        }
    } catch {
        return NextResponse.json(
            { error: 'Invalid URL in request body.' },
            { status: 400 }
        )
    }

    if (!isValidUrl(url)) {
        return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 })
    }

    if (url.length > 2048) {
        return NextResponse.json({ error: 'URL is too long.' }, { status: 422 })
    }

    let parsedUrl: URL
    try {
        parsedUrl = new URL(url)
    } catch {
        return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 })
    }

    if (!(await doesDomainExist(parsedUrl.hostname))) {
        return NextResponse.json(
            { error: 'Domain does not exist.' },
            { status: 422 }
        )
    }

    const code = 'abc123'

    return NextResponse.json(
        { shortUrl: `https://kurz.de/${code}` },
        { status: 201 }
    )
}
