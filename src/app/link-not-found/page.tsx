import type { Metadata } from 'next'
import NotFound from '@/components/not-found'

export const metadata: Metadata = {
    title: 'Link not found | URL Shortener',
    robots: { index: false },
}

const LinkNotFoundPage = () => {
    return (
        <NotFound
            title="Link not found."
            description="This short link doesn't exist or has been removed. Please check for typos."
        />
    )
}

export default LinkNotFoundPage
