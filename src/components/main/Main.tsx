'use client'

import { FetchLoading } from 'fetch-loading'
import { useState } from 'react'
import { CiCircleCheck } from 'react-icons/ci'
import { FaRegCheckCircle } from 'react-icons/fa'
import { RiErrorWarningLine } from 'react-icons/ri'
import { handleShortenUrlApi } from '@/helper/client/handleShortenUrlApi'
import CopyButton from '@/components/copy-button'
import Header from '@/components/header'
import Section from '@/components/section'
import { isValidUrl } from '@/helper/client/isValidUrl'

const Main = () => {
    const [apiError, setApiError] = useState('')
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
        setIsLoading(false)
        setShortUrl('')
        setUrl('')
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        handleShortenUrlApi({
            e,
            isLoading,
            setApiError,
            setIsLoading,
            setShortUrl,
            url,
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
                        maxLength={2048}
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
                                <CopyButton
                                    text={shortUrl}
                                    className="min-w-36"
                                />
                            </div>
                            <button
                                className="shorten rounded-md mt-2 px-4 py-2"
                                title="Shorten another URL"
                                type="button"
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
