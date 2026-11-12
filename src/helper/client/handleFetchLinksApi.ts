import type { DialogLinkType } from '@/components/dialog/DialogLink'
import type { Session } from '@/lib/auth/client'

type handleFetchLinksApiProps = {
    session: Session
    setApiError: React.Dispatch<React.SetStateAction<string>>
    setDialogLinks: React.Dispatch<React.SetStateAction<DialogLinkType[]>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const handleFetchLinksApi = async ({
    session,
    setApiError,
    setDialogLinks,
    setIsLoading,
}: handleFetchLinksApiProps) => {
    if (!session) {
        return
    }

    setIsLoading(true)
    try {
        const response = await fetch('/api/v1/links', {
            method: 'GET',
        })

        if (!response.ok) {
            const data = await response.json()
            const error = data.error
            console.log(
                'An error occurred while trying to fetch your links:',
                error,
                response.status,
                response.statusText
            )
            setApiError(error)
            return
        }

        const data = await response.json()
        setDialogLinks(data.links)
    } catch (error) {
        setApiError('Something went wrong. Please try again.')
        console.error(
            'An unexpected error occurred while trying to fetch your links: ',
            error
        )
    } finally {
        setIsLoading(false)
    }
}
