'use client'

import { FetchLoading } from 'fetch-loading'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Logo from '@/components/logo'
import { authClient } from '@/lib/auth/client'

const Navigation = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleSignIn = async () => {
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
            <div className="w-full max-w-7xl mx-auto flex justify-between gap-6 items-center px-4 sm:px-6">
                <h1 className="flex items-center gap-2">
                    <Logo />
                    <span className="max-xs:hidden">URL Shortener</span>
                </h1>
                {isPending || isLoggingOut ? (
                    <FetchLoading
                        center
                        className="cursor-not-allowed rounded-md w-24! xs:w-30! h-8! xs:h-10! outline-2 outline-background-secondary"
                    />
                ) : session ? (
                    <div className="flex gap-6">
                        <button
                            className="white flex gap-2 items-center justify-center min-w-24 xs:min-w-30 max-w-36 xs:max-w-48 w-fit"
                            title={session.user.name || session.user.email}
                            onClick={() => {}}
                        >
                            <span className="min-w-0 truncate">
                                {session.user.name || session.user.email}
                            </span>
                        </button>
                        <button
                            className="white w-24 xs:w-30"
                            type="button"
                            onClick={handleLogout}
                            title="Log out"
                        >
                            Log out
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
