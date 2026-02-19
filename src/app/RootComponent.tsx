'use client'

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthInitializer from "@/components/AuthInitializer";
import { ToastProvider } from "@/context/ToastContext";
import LenisProvider from "@/components/LenisProvider";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

export default function RootComponent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/auth";

    const isOrganizerPage = pathname?.startsWith("/organizer");

    // Check if the current page is Home or Event Details (e.g., /events/123)
    // These pages should start under the navbar (transparent/overlay effect)
    const isTransparentNavPage = pathname === '/' || /^\/events\/[^/]+$/.test(pathname || '');

    return (
        <LenisProvider>
            <Provider store={store}>

                <ToastProvider>
                    <AuthInitializer />
                    <ServiceWorkerRegister />
                    <div className="">
                        {!isLoginPage && !isOrganizerPage && <Navbar />}
                        <main className={!isLoginPage && !isOrganizerPage && !isTransparentNavPage ? "pt-20" : ""}>{children}</main>
                        {!isLoginPage && !isOrganizerPage && <Footer />}

                    </div>
                </ToastProvider>
            </Provider>
        </LenisProvider>
    );
}
