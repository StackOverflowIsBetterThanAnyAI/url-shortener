import { FaRegCheckCircle } from 'react-icons/fa'
import { IoShieldCheckmarkOutline } from 'react-icons/io5'
import Logo from '@/components/logo'

const Main = () => {
    return (
        <main className="w-full">
            <div className="w-full max-w-7xl mx-auto p-6 xs:p-12 sm:p-16 md:p-24 flex flex-col items-center gap-8">
                <header className="flex flex-col items-center gap-2">
                    <Logo />
                    <h2>Long link. Made short.</h2>
                    <h3>Turn your URL into a short, unique link.</h3>
                </header>
                <form className="w-full max-w-2xl flex flex-col gap-4 rounded-2xl p-6 xs:p-8">
                    <label htmlFor="url">Enter your long URL here:</label>
                    <input
                        type="text"
                        id="url"
                        placeholder="https://example.com/articles/ideas"
                        className="rounded-md px-4 py-2"
                    />
                    <p className="valid-link-info flex gap-1 items-center">
                        <FaRegCheckCircle
                            color="#196348"
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                        />
                        Valid URL - your link is ready to be shortened.
                    </p>
                    <input
                        type="submit"
                        value="Shorten URL"
                        className="rounded-md mt-2 px-4 py-2"
                        title="Shorten URL"
                    />
                </form>
                <section className="flex flex-col gap-4 max-xs:text-center text-pretty">
                    <p className="flex gap-1 items-center">
                        <IoShieldCheckmarkOutline
                            color="#51545c"
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                        />{' '}
                        No sign-up needed. Free. Ready to share.
                    </p>
                    <p className="flex flex-wrap gap-1 max-md:flex-col">
                        <span>Sign in to save and revisit your own links.</span>
                        <span>Guest links are not saved to an account.</span>
                    </p>
                </section>
            </div>
        </main>
    )
}

export default Main
