export const isValidUrl = (url: string) => {
    return /^(http(s?):\/\/.+\.[a-z]{2,})/i.test(url)
}
