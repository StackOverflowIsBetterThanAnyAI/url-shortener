import CopyButton from '@/components/copy-button'

export type DialogLinkType = {
    short: string
    url: string
    created_at: string
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
})

const DialogLink = ({ short, url, created_at }: DialogLinkType) => {
    const shortUrl = `${window.location.origin}/${short}`
    const shortUrlLabel = `${window.location.host}/${short}`

    return (
        <li className="flex items-center justify-between gap-4 py-4 border-b border-background-secondary">
            <div className="flex flex-col gap-1 min-w-0">
                <span
                    className="text-sm xs:text-base min-w-0 truncate"
                    title={url}
                >
                    {url}
                </span>
                <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-outline font-semibold no-underline hover:underline min-w-0 truncate"
                    title={`${shortUrl} (opens in new tab)`}
                    aria-label={`${shortUrl} (opens in new tab)`}
                >
                    {shortUrlLabel}
                </a>
                <time
                    dateTime={created_at}
                    className="text-xs xs:text-sm text-text-secondary"
                >
                    Created {dateFormatter.format(new Date(created_at))}
                </time>
            </div>
            <CopyButton
                text={shortUrl}
                label="Copy"
                copiedLabel="Copied"
                ariaLabel={`Copy ${shortUrlLabel}`}
                className="w-26 xs:w-30"
            />
        </li>
    )
}

export default DialogLink
