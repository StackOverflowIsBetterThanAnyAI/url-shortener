import { IoShieldCheckmarkOutline } from 'react-icons/io5'

const Section = () => {
    return (
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
    )
}

export default Section
