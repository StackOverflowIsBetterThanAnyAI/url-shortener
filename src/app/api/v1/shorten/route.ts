import { NextResponse } from 'next/server'
import { doesDomainExist } from '@/helper/doesDomainExist'
import { generateKey } from '@/helper/generateKey'
import { isValidUrl } from '@/helper/isValidUrl'

export async function POST(request: Request) {
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

    if (!(await doesDomainExist(parsedUrl.hostname))) {
        return NextResponse.json(
            { error: 'Domain does not exist.' },
            { status: 422 }
        )
    }

    const short = generateKey()

    return NextResponse.json(
        { shortUrl: `https://kurz.de/${short}` },
        { status: 201 }
    )
}
