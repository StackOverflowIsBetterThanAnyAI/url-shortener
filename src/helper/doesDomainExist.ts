import { lookup } from 'node:dns/promises'

export const doesDomainExist = async (hostname: string): Promise<boolean> => {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
        await Promise.race([
            lookup(hostname),
            new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error('DNS timeout')), 5000)
            }),
        ])
        return true
    } catch {
        return false
    } finally {
        clearTimeout(timer)
    }
}
