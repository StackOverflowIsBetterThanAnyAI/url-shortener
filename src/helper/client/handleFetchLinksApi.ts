import type { DialogLinkType } from '@/components/dialog/DialogLink'
import { isDialogLinkArray } from '@/helper/client/isDialogLinkArray'
import { setItemInSessionStorage } from '@/helper/client/sessionStorage'

type handleFetchLinksApiProps = {
    setApiError: React.Dispatch<React.SetStateAction<string>>
    setDialogLinks: (links: DialogLinkType[]) => void
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const handleFetchLinksApi = async ({
    setApiError,
    setDialogLinks,
    setIsLoading,
}: handleFetchLinksApiProps) => {
    setIsLoading(true)
    setApiError('')
    try {
        const response = await fetch('/api/v1/links')
        const data = await response.json()

        if (!response.ok) {
            console.error(
                'An error occurred while trying to fetch your links:',
                data.error,
                response.status,
                response.statusText
            )
            setApiError(data.error)
            return
        }

        if (!isDialogLinkArray(data.links)) {
            throw new Error('Unexpected response format.')
        }

        setDialogLinks(data.links)
        setItemInSessionStorage('links', data.links)
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
