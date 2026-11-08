import Logo from '@/components/logo'

const Navigation = () => {
    return (
        <nav className="w-full min-h-20 flex items-center ">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6">
                <h1 className="flex items-center gap-2">
                    <Logo />
                    <span className="max-[384px]:hidden">URL Shortener</span>
                </h1>
                <button
                    className="px-3 xs:px-4 py-1.5 xs:py-2 rounded-md"
                    title="Sign in with Google"
                >
                    Sign in with Google
                </button>
            </div>
        </nav>
    )
}

export default Navigation
