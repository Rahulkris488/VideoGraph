import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger immediately at module load
gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
    ease: "power3.out",
    duration: 1
});

ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});

export function initGSAP() {
    // Already initialized at module load
    // This function kept for backwards compatibility
}

export { gsap, ScrollTrigger };
