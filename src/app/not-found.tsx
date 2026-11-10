import type { Metadata } from 'next'
import NotFound from '@/components/not-found'

export const metadata: Metadata = {
    title: 'Page not found | URL Shortener',
    robots: { index: false },
}

const NotFoundPage = () => {
    return (
        <NotFound
            title="Page not found."
            description="The page you are looking for doesn't exist or has been moved."
        />
    )
}

export default NotFoundPage
