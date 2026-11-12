const STORAGE_KEY = 'url-shortener'

export const getRawSessionData = (): string | null => {
    try {
        return sessionStorage.getItem(STORAGE_KEY)
    } catch {
        return null
    }
}

export const parseSessionData = (
    storedData: string | null
): Record<string, unknown> => {
    try {
        return storedData ? JSON.parse(storedData) : {}
    } catch {
        return {}
    }
}

export const getStoredSessionData = () => parseSessionData(getRawSessionData())

export const setItemInSessionStorage = (key: string, value: unknown) => {
    try {
        const parsedTracker = getStoredSessionData()
        parsedTracker[key] = value
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsedTracker))
    } catch (error) {
        console.error('Could not write to sessionStorage:', error)
    }
}

export const clearSessionStorage = () => {
    try {
        sessionStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Could not clear sessionStorage:', error)
    }
}
