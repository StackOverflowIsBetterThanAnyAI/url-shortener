import type { DialogLinkType } from '@/components/dialog/DialogLink'

const isDialogLink = (value: unknown): value is DialogLinkType => {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const { short, url, created_at } = value as Record<string, unknown>
    return (
        typeof short === 'string' &&
        typeof url === 'string' &&
        typeof created_at === 'string'
    )
}

export const isDialogLinkArray = (value: unknown): value is DialogLinkType[] =>
    Array.isArray(value) && value.every(isDialogLink)
