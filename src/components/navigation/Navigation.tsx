'use client'

import { FetchLoading } from 'fetch-loading'
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react'
import { FaRegFolder } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { MdOutlineLogout } from 'react-icons/md'
import { Dialog } from '@/components/dialog'
import Logo from '@/components/logo'
import { isStoredUser } from '@/helper/client/isStoredUser'
import {
    clearSessionStorage,
    getRawSessionData,
    parseSessionData,
    setItemInSessionStorage,
} from '@/helper/client/sessionStorage'
import { authClient } from '@/lib/auth/client'

const subscribeToNothing = () => () => {}

const Navigation = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const dialogRef = useRef<HTMLDialogElement>(null)

    const handleOpenDialog = () => {
        dialogRef.current?.showModal()
        setIsDialogOpen(true)
        setItemInSessionStorage('isDialogOpen', true)
    }

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
            clearSessionStorage()
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

    const storedData = useSyncExternalStore(
        subscribeToNothing,
        getRawSessionData,
        () => null
    )
    const storedUser = useMemo(() => {
        const { user } = parseSessionData(storedData)
        return isStoredUser(user) ? user : null
    }, [storedData])

    useEffect(() => {
        if (isPending) {
            return
        }

        if (session) {
            const { id, name, email } = session.user
            setItemInSessionStorage('user', { id, name, email })
        } else {
            clearSessionStorage()
        }
    }, [session, isPending])

    const user = session?.user ?? (isPending ? storedUser : null)

    return (
        <>
            <nav className="w-full min-h-20 flex items-center ">
                <div className="w-full max-w-7xl mx-auto flex justify-between gap-4 xs:gap-6 items-center px-4 sm:px-6">
                    <h1 className="flex items-center gap-2">
                        <Logo />
                        <span className="max-sm:hidden">URL Shortener</span>
                    </h1>
                    {(isPending && !user) || isLoggingOut || isLoggingIn ? (
                        <FetchLoading
                            center
                            className="cursor-not-allowed rounded-md w-26! xs:w-30! h-8! xs:h-10! outline-2 outline-background-secondary"
                        />
                    ) : user ? (
                        <div className="flex gap-4 xs:gap-6 items-center">
                            <span className="font-semibold text-sm xs:text-base min-w-0 max-w-36 xs:max-w-48 w-fit truncate max-md:hidden">
                                {user.name || user.email}
                            </span>
                            <button
                                className="white flex gap-2 items-center justify-center min-w-26 xs:min-w-30 max-w-36 xs:max-w-48 w-fit"
                                title={user.name || user.email}
                                onClick={handleOpenDialog}
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
                            <FcGoogle />
                            <span>Sign in</span>
                        </button>
                    )}
                </div>
            </nav>
            {user ? (
                <Dialog
                    dialogRef={dialogRef}
                    handleLogout={handleLogout}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    user={user}
                />
            ) : null}
        </>
    )
}

export default Navigation
