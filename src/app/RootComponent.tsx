'use client'

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootComponent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/auth";

    // Check if the current page is Home or Event Details (e.g., /events/123)
    // These pages should start under the navbar (transparent/overlay effect)
    const isTransparentNavPage = pathname === '/' || /^\/events\/[^/]+$/.test(pathname || '');

    return (
        <div className="">
            {!isLoginPage && <Navbar />}
            <main className={!isLoginPage && !isTransparentNavPage ? "pt-20" : ""}>{children}</main>
            {!isLoginPage && <Footer />}

        </div>
    );
}
