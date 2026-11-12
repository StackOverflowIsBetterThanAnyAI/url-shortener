import { connection, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { sql } from '@/lib/db/db'

export async function GET() {
    await connection()

    try {
        const { data: session } = await auth.getSession()

        if (!session?.user) {
            return NextResponse.json(
                { error: 'User is not signed in.' },
                { status: 401 }
            )
        }

        const links = await sql`
        SELECT short, url, created_at
        FROM links
        WHERE user_id = ${session.user.id}
        ORDER BY created_at DESC
        `
        return NextResponse.json(
            { links },
            {
                status: 200,
                headers: { 'Cache-Control': 'private, no-store' },
            }
        )
    } catch (error) {
        console.error('Failed to fetch links:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}
