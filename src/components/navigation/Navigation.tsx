'use client'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Logo from '@/components/logo'
import { authClient } from '@/lib/auth/client'
import { FetchLoading } from 'fetch-loading'

const Navigation = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const handleSignIn = () => {
        authClient.signIn.social({
            provider: 'google',
            callbackURL: window.location.origin,
        })
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
    console.log(session, isPending)

    return (
        <nav className="w-full min-h-20 flex items-center ">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6">
                <h1 className="flex items-center gap-2">
                    <Logo />
                    <span className="max-[384px]:hidden">URL Shortener</span>
                </h1>
                {isPending || isLoggingOut ? (
                    <FetchLoading
                        center
                        className="cursor-not-allowed rounded-md w-24! xs:w-30! h-8! xs:h-10! outline-2 outline-background-secondary"
                    />
                ) : session?.user.name.length ? (
                    <button
                        className="white flex gap-2 items-center justify-center min-w-24 xs:min-w-30 max-w-36 xs:max-w-48 w-fit"
                        title={session.user.name}
                        onClick={handleSignIn}
                    >
                        <span className="min-w-0 truncate">
                            {session.user.name}
                        </span>
                    </button>
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
                <button
                    className="white"
                    type="button"
                    onClick={handleLogout}
                    title="Log out"
                >
                    Log out
                </button>
            </div>
        </nav>
    )
}

export default Navigation
