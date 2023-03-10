import { useRouter } from "next/router";
import ThemeToggle from "@baseComponents/ThemeToggle"
import BreadCrumbNav from "@baseComponents/BreadCrumbNav"

const Header = () => {
    const router = useRouter();
    const noNavPath = ['/[username]/dashboard', '/login', '/signup']

    // useEffect(() => {
    //     console.log(router.pathname)
    // }, [router])

    return (
        <>
            <nav className="flex flex-row items-center justify-between">
                {
                    !noNavPath.includes(router.pathname) ?
                        <BreadCrumbNav /> :
                        <div className="mt-36" />
                }
                <ThemeToggle />
            </nav>
        </>
    )
}

export default Header