'use client'

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootComponent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
  const isLoginPage = pathname === "/auth";
    return (
        <div className="">
            {!isLoginPage &&  <Navbar/>}
            <main>{children}</main>
            {!isLoginPage &&  <Footer />}

        </div>
    );
}
