import { SignIn } from "@stackframe/stack"
import Link from "next/link"


export default function sinInPage() {

    return (
        <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-white-50 to-black">
            <div className="max-w-md w-full space-y-8">
                <SignIn />
                <Link href="/" className="cursor-pointer text-xs hover:border-b border-black-50  transition-all  duration-75 mt-1 "> Home Page</Link>

            </div>
        </div>
    )
}
