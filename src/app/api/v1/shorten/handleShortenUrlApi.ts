import { isValidUrl } from '@/helper/isValidUrl'

type handleShortenUrlApiProps = {
    e: React.SubmitEvent<HTMLFormElement>
    isLoading: boolean
    setApiError: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setShortUrl: React.Dispatch<React.SetStateAction<string>>
    url: string
}

export const handleShortenUrlApi = async ({
    e,
    isLoading,
    setApiError,
    setIsLoading,
    setShortUrl,
    url,
}: handleShortenUrlApiProps) => {
    e.preventDefault()
    if (!isValidUrl(url) || isLoading) {
        return
    }

    setIsLoading(true)
    try {
        const response = await fetch('/api/v1/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        })

        if (!response.ok) {
            const data = await response.json()
            const error = data.error
            console.log(
                'An error occurred while trying to shorten the URL:',
                error,
                response.status,
                response.statusText
            )
            setApiError(error)
            return
        }

        const data = await response.json()
        setShortUrl(data.shortUrl)
    } catch (error) {
        console.error(
            'An unexpected error occurred while trying to shorten the URL: ',
            error
        )
    } finally {
        setIsLoading(false)
    }
}
