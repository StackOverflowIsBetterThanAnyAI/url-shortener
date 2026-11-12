export type StoredUser = {
    id: string
    name: string
    email: string
}

export const isStoredUser = (value: unknown): value is StoredUser => {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const { id, name, email } = value as Record<string, unknown>
    return (
        typeof id === 'string' &&
        typeof name === 'string' &&
        typeof email === 'string'
    )
}
