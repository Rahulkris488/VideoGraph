import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "./gsap";

let lenis = null;

export function initLenis() {
    if (lenis) return lenis;

    lenis = new Lenis({
        duration: 0.6,
        easing: t => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.2
    });

    function raf(time) {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return lenis;
}

export function destroyLenis() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
}
