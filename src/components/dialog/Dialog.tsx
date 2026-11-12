'use client'

import { FetchLoading } from 'fetch-loading'
import React, { RefObject, useEffect, useState } from 'react'
import { IoClose, IoShieldCheckmarkOutline } from 'react-icons/io5'
import { MdOutlineLogout } from 'react-icons/md'
import DialogLink from './DialogLink'
import type { DialogLinkType } from './DialogLink'
import { handleFetchLinksApi } from '@/helper/client/handleFetchLinksApi'
import type { Session } from '@/lib/auth/client'

type DialogProps = {
    dialogRef: RefObject<HTMLDialogElement | null>
    handleLogout: () => void
    isDialogOpen: boolean
    session: Session
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Dialog = ({
    dialogRef,
    handleLogout,
    isDialogOpen,
    session,
    setIsDialogOpen,
}: DialogProps) => {
    const [dialogLinks, setDialogLinks] = useState<DialogLinkType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    const fetchLinks = async () => {
        handleFetchLinksApi({
            session,
            setApiError,
            setDialogLinks,
            setIsLoading,
        })
    }

    useEffect(() => {
        if (isDialogOpen) {
            fetchLinks()
        }
    }, [isDialogOpen])

    const handleCloseDialog = () => {
        dialogRef.current?.close()
        setIsDialogOpen(false)
    }

    const LinksInfo = (
        <p className="flex gap-1 items-center text-sm xs:text-base">
            <IoShieldCheckmarkOutline
                color="#51545c"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 max-xs:hidden"
            />{' '}
            Only links created while signed in appear here.
        </p>
    )

    return (
        <dialog
            ref={dialogRef}
            closedby="any"
            className="w-full max-w-4xl bg-background m-auto rounded-md p-8 open:flex backdrop:bg-text/40 flex-col gap-4 xs:gap-6 shadow-2xl shadow-navigation/20"
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
                        {(session.user.name || session.user.email).charAt(0)}
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
            {dialogLinks?.length ? (
                <>
                    <h3 className="font-semibold">
                        Links saved to your account
                    </h3>
                    <ul className="flex flex-col">
                        {dialogLinks.map((item) => (
                            <DialogLink key={item.short} {...item} />
                        ))}
                    </ul>
                    {LinksInfo}
                </>
            ) : isLoading ? (
                <FetchLoading
                    center
                    theme="#5946df"
                    ariaLabel="Loading links"
                />
            ) : (
                <>
                    <p className="font-semibold">
                        You haven&apos;t shortened any links yet.
                    </p>

                    {LinksInfo}
                </>
            )}
        </dialog>
    )
}

export default Dialog
