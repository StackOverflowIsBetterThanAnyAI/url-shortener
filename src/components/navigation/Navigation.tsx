'use client'

import { FetchLoading } from 'fetch-loading'
import { useState } from 'react'
import { FaRegFolder } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { MdOutlineLogout } from 'react-icons/md'
import Logo from '@/components/logo'
import { authClient } from '@/lib/auth/client'

const Navigation = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleSignIn = async () => {
        setIsLoggingIn(true)
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: window.location.origin,
            })
        } catch (error) {
            console.error(
                'An unexpected error occurred while trying to sign in: ',
                error
            )
        } finally {
            setIsLoggingIn(false)
        }
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await authClient.signOut()
        } catch (error) {
            console.error(
                'An unexpected error occurred while trying to log out: ',
                error
            )
        } finally {
            setIsLoggingOut(false)
        }
    }

    const { data: session, isPending } = authClient.useSession()

    return (
        <nav className="w-full min-h-20 flex items-center ">
            <div className="w-full max-w-7xl mx-auto flex justify-between gap-4 xs:gap-6 items-center px-4 sm:px-6">
                <h1 className="flex items-center gap-2">
                    <Logo />
                    <span className="max-sm:hidden">URL Shortener</span>
                </h1>
                {isPending || isLoggingOut || isLoggingIn ? (
                    <FetchLoading
                        center
                        className="cursor-not-allowed rounded-md w-26! xs:w-30! h-8! xs:h-10! outline-2 outline-background-secondary"
                    />
                ) : session ? (
                    <div className="flex gap-4 xs:gap-6 items-center">
                        <span className="font-semibold text-sm xs:text-base min-w-0 max-w-36 xs:max-w-48 w-fit truncate max-md:hidden">
                            {session.user.name || session.user.email}
                        </span>
                        <button
                            className="white flex gap-2 items-center justify-center min-w-26 xs:min-w-30 max-w-36 xs:max-w-48 w-fit"
                            title={session.user.name || session.user.email}
                            onClick={() => {}}
                        >
                            <FaRegFolder
                                color="#20232c"
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0"
                            />
                            <span>My links</span>
                        </button>
                        <button
                            className="white flex gap-2 items-center justify-center w-26 xs:w-30"
                            type="button"
                            onClick={handleLogout}
                            title="Log out"
                        >
                            <MdOutlineLogout
                                color="#20232c"
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0"
                            />
                            <span>Log out</span>
                        </button>
                    </div>
                ) : (
                    <button
                        className="white flex gap-2 items-center w-24 xs:w-30"
                        title="Sign in with Google"
                        onClick={handleSignIn}
                    >
                        <FcGoogle
                            aria-hidden="true"
                            className="h-5 xs:h-6 w-5 xs:w-6 shrink-0"
                        />
                        <span>Sign in</span>
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navigation
