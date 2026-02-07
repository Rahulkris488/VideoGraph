import { ScrollTrigger } from "./gsap";

export function refreshScroll() {
    ScrollTrigger.refresh(true);
}

export function killAllScrollTriggers() {
    ScrollTrigger.getAll().forEach(st => st.kill());
}
