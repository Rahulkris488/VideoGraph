import { useEffect } from "react";
import { refreshScroll } from "../core/scroll";

export function useResize() {
    useEffect(() => {
        let timeout;

        function handleResize() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                refreshScroll();
            }, 200);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
}
