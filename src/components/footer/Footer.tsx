import { cacheLife } from 'next/cache'

const Footer = async () => {
    'use cache'
    cacheLife('days')

    const date = new Date()
    const year = date.getFullYear()

    return (
        <footer className="w-full py-3 px-8 mb-2 mt-auto min-h-16 sm:min-h-20 flex items-center ">
            <div className="flex flex-wrap justify-between gap-2 w-full max-w-7xl mx-auto">
                <span aria-hidden="true">
                    Copyright &#169; {year} Michael Münzenhofer.
                </span>
                <span className="sr-only">{`Copyright ${year} Michael Münzenhofer.`}</span>
                <a
                    href="https://github.com/StackOverflowIsBetterThanAnyAI/url-shortener"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository (opens in new tab)"
                    title="GitHub Repository (opens in new tab)"
                    className="flex items-center gap-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-text h-4 xs:h-5"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                    </svg>
                    <span>GitHub Repository</span>
                </a>
            </div>
        </footer>
    )
}

export default Footer
