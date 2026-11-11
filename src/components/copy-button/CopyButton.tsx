'use client'

import { useEffect, useRef, useState } from 'react'
import { LuCopy, LuCopyCheck } from 'react-icons/lu'

type CopyButtonProps = {
    text: string
    className?: string
    label?: string
    copiedLabel?: string
    ariaLabel?: string
}

const CopyButton = ({
    text,
    className = '',
    label = 'Copy link',
    copiedLabel = 'Copied link',
    ariaLabel,
}: CopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    useEffect(() => () => clearTimeout(timeoutRef.current), [])

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true)
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => setIsCopied(false), 2500)
        })
    }

    const Icon = isCopied ? LuCopyCheck : LuCopy

    return (
        <button
            className={`white flex items-center gap-2 justify-center shrink-0 ${className}`}
            type="button"
            onClick={handleCopy}
            aria-label={isCopied ? copiedLabel : ariaLabel}
            title={isCopied ? undefined : label}
        >
            <Icon
                color="#20232c"
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
            />
            <span>{isCopied ? copiedLabel : label}</span>
        </button>
    )
}

export default CopyButton
