import { RefObject } from 'react'
import { IoClose, IoShieldCheckmarkOutline } from 'react-icons/io5'
import { MdOutlineLogout } from 'react-icons/md'
import type { authClient } from '@/lib/auth/client'

type Session = typeof authClient.$Infer.Session

type DialogProps = {
    dialogRef: RefObject<HTMLDialogElement | null>
    handleLogout: () => void
    session: Session
}

const Dialog = ({ dialogRef, handleLogout, session }: DialogProps) => {
    const handleCloseDialog = () => {
        dialogRef.current?.close()
    }

    return (
        <dialog
            ref={dialogRef}
            className="w-full max-w-4xl bg-background m-auto rounded-md p-8 open:flex flex-col gap-4 xs:gap-6 shadow-2xl shadow-text/20"
        >
            <div className="flex justify-between gap-4">
                <h2>My links</h2>
                <button
                    className="white flex gap-2 items-center w-24 xs:w-30"
                    title="Close Window"
                    onClick={handleCloseDialog}
                >
                    <IoClose
                        aria-hidden="true"
                        className="h-4 xs:h-5 w-4 xs:w-5 shrink-0"
                    />{' '}
                    <span>Close</span>
                </button>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4 bg-background-secondary rounded-md p-4">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg rounded-full h-10 w-10 shrink-0 items-center justify-center flex font-bold bg-navigation text-outline">
                        {session.user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                        <span
                            className="text-base font-semibold min-w-0 truncate"
                            title={session.user.name}
                        >
                            {session.user.name}
                        </span>
                        <span
                            className="text-sm min-w-0 truncate"
                            title={session.user.email}
                        >
                            {session.user.email}
                        </span>
                    </div>
                </div>
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
            <h3 className="font-semibold">Links saved to your account</h3>
            <p className="flex gap-1 items-center text-sm xs:text-base">
                <IoShieldCheckmarkOutline
                    color="#51545c"
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 max-xs:hidden"
                />{' '}
                Only links created while signed in appear here.
            </p>
        </dialog>
    )
}

export default Dialog
