"use client";

import { useEffect, useState } from "react";
import MobileRestrictedView from "./MobileRestrictedView";

export default function ScreenSizeGuard({ children }) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener("resize", checkScreenSize);

        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // During SSR and initial mount, render both with CSS toggling to prevent hydration mismatch
    if (!mounted) {
        return (
            <>
                <div className="hidden lg:block">{children}</div>
                <div className="block lg:hidden">
                    <MobileRestrictedView />
                </div>
            </>
        );
    }

    // After hydration, render only what's needed
    if (isMobile) {
        return <MobileRestrictedView />;
    }

    return <>{children}</>;
}
