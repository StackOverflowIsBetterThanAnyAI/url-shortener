import { FcGoogle } from 'react-icons/fc'
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
                    className="white flex gap-2 items-center"
                    title="Sign in with Google"
                >
                    <FcGoogle
                        aria-hidden="true"
                        className="h-5 xs:h-6 w-5 xs:w-6 shrink-0"
                    />
                    <span>Sign in</span>
                </button>
            </div>
        </nav>
    )
}

export default Navigation
