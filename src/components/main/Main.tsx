'use client'

import { FetchLoading } from 'fetch-loading'
import { useState } from 'react'
import { CiCircleCheck } from 'react-icons/ci'
import { FaRegCheckCircle } from 'react-icons/fa'
import { LuCopy } from 'react-icons/lu'
import { LuCopyCheck } from 'react-icons/lu'
import { RiErrorWarningLine } from 'react-icons/ri'
import Header from '@/components/header'
import Section from '@/components/section'
import { isValidUrl } from '@/helper/isValidUrl'

const Main = () => {
    const [apiError, setApiError] = useState('')
    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [shortUrl, setShortUrl] = useState('')
    const [url, setUrl] = useState('')

    const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
        if (apiError.length) {
            setApiError('')
        }
    }

    const handleReset = () => {
        setApiError('')
        setIsCopied(false)
        setIsLoading(false)
        setShortUrl('')
        setUrl('')
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

    const updateClipboard = (newClip: string) => {
        navigator.clipboard.writeText(newClip).then(() => {
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 2500)
        })
    }

    return (
        <main className="w-full">
            <div className="w-full max-w-7xl mx-auto p-6 xs:p-12 sm:p-16 md:p-24 flex flex-col items-center gap-8">
                <Header />
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="w-full max-w-2xl flex flex-col gap-4 rounded-2xl p-6 xs:p-8 shadow-2xl shadow-outline/20 outline-2 outline-outline/5!"
                >
                    <label htmlFor="url">Enter your long URL here:</label>
                    <input
                        type="text"
                        id="url"
                        placeholder="https://example.com/articles/ideas"
                        className="rounded-md px-4 py-2"
                        onChange={handleChangeUrl}
                        disabled={isLoading || !!shortUrl.length}
                        value={url}
                    />
                    {!shortUrl.length ? (
                        apiError.length ? (
                            <p className="invalid-link-info flex gap-1 items-center">
                                <RiErrorWarningLine
                                    color="#5946df"
                                    aria-hidden="true"
                                    className="h-4 w-4 shrink-0"
                                />
                                {apiError}
                            </p>
                        ) : isValidUrl(url) ? (
                            <p className="valid-link-info flex gap-1 items-center">
                                <FaRegCheckCircle
                                    color="#196348"
                                    aria-hidden="true"
                                    className="h-4 w-4 shrink-0"
                                />
                                Valid URL format - your link is ready to be
                                shortened.
                            </p>
                        ) : (
                            <p className="link-info">
                                Paste a complete URL with the protocol http://
                                or https://.
                            </p>
                        )
                    ) : null}
                    {shortUrl.length ? (
                        <>
                            <div className="flex gap-2 items-center pt-4">
                                <CiCircleCheck
                                    color="#196348"
                                    aria-hidden="true"
                                    className="h-8 w-8 shrink-0 bg-green-50 rounded-full"
                                />
                                <div className="flex flex-col gap-1">
                                    <h4>Your short link is ready!</h4>
                                    <span className="link-info">
                                        Uniquely created. Just copy and share.
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between bg-outline-secondary text-outline font-semibold p-4 xs:p-2 xs:pl-4 gap-y-4 rounded-xl">
                                <span
                                    className="min-w-0 truncate max-xs:text-center"
                                    title={shortUrl}
                                >
                                    {shortUrl}
                                </span>
                                <button
                                    className="white flex items-center gap-2 min-w-36 shrink-0 justify-center"
                                    onClick={() => updateClipboard(shortUrl)}
                                    title={isCopied ? undefined : 'Copy link'}
                                    type="button"
                                >
                                    {isCopied ? (
                                        <>
                                            <LuCopyCheck
                                                color="#20232c"
                                                aria-hidden="true"
                                                className="h-4 w-4 shrink-0"
                                            />
                                            <span>Copied link</span>
                                        </>
                                    ) : (
                                        <>
                                            <LuCopy
                                                color="#20232c"
                                                aria-hidden="true"
                                                className="h-4 w-4 shrink-0"
                                            />
                                            <span>Copy link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <button
                                className="shorten rounded-md mt-2 px-4 py-2"
                                title="Shorten another URL"
                                onClick={handleReset}
                            >
                                Shorten another URL
                            </button>
                        </>
                    ) : isLoading ? (
                        <FetchLoading
                            className="rounded-md mt-2 bg-outline cursor-not-allowed h-10! xs:h-11!"
                            theme="#f5f5f5"
                            center
                        />
                    ) : (
                        <input
                            type="submit"
                            value="Shorten URL"
                            className="rounded-md mt-2 px-4 py-2"
                            title="Shorten URL"
                            disabled={!isValidUrl(url)}
                        />
                    )}
                </form>
                <Section />
            </div>
        </main>
    )
}

export default Main
