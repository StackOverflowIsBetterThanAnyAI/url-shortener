import Logo from '@/components/logo'

const Header = () => {
    return (
        <header className="flex flex-col items-center gap-2">
            <Logo />
            <h2 className="text-center">Long link. Made short.</h2>
            <h3 className="text-center">
                Turn your URL into a short, unique link.
            </h3>
        </header>
    )
}

export default Header
