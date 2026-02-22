import { useLayoutEffect } from "react";

export const useLockBodyScroll = (isLocked: boolean) => {
    useLayoutEffect(() => {
        if (!isLocked) return;

        const scrollY = window.scrollY;

        // Lock body
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        return () => {
            // Restore body
            const top = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";

            if (top) {
                window.scrollTo(0, -parseInt(top));
            }
        };
    }, [isLocked]);
};