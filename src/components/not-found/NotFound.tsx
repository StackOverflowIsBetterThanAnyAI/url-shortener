import Link from 'next/link'
import Footer from '@/components/footer'
import Logo from '@/components/logo'
import Navigation from '@/components/navigation'

type NotFoundProps = {
    description: string
    title: string
}

const NotFound = ({ description, title }: NotFoundProps) => {
    return (
        <>
            <Navigation />
            <main className="w-full">
                <div className="w-full max-w-7xl mx-auto p-6 xs:p-12 sm:p-16 md:p-24 flex flex-col items-center">
                    <div className="w-full max-w-2xl flex flex-col items-center gap-6 rounded-2xl p-6 xs:p-8 bg-navigation shadow-2xl shadow-outline/20 outline-2 outline-outline/5 text-center">
                        <Logo />
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xl font-semibold text-outline">
                                404
                            </span>
                            <h2 className="text-center">{title}</h2>
                            <h3 className="text-center text-text-secondary text-pretty">
                                {description}
                            </h3>
                        </div>
                        <Link
                            href="/"
                            className="shorten mt-1 sm:mt-2 w-full xs:w-auto"
                        >
                            Shorten a new URL
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default NotFound
