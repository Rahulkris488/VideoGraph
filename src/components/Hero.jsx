import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/hero.css";

export default function Hero() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero text reveal timeline
            const tl = gsap.timeline({ delay: 0.2 });

            tl.from(".hero-tag", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
                .from(".hero-headline .line", {
                    y: 100,
                    opacity: 0,
                    rotationX: -30,
                    stagger: 0.15,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.4")
                .from(".hero-subline", {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.5")
                .from(".hero-cta .btn", {
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power3.out"
                }, "-=0.4")
                .from(".hero-visual", {
                    y: 80,
                    opacity: 0,
                    scale: 0.9,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=0.6")
                .from(".scroll-indicator", {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out"
                }, "-=0.4");

            // Parallax on scroll
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
                onUpdate: (self) => {
                    const p = self.progress;
                    gsap.set(".hero-content", {
                        y: p * 150,
                        opacity: 1 - p * 1.5
                    });
                    gsap.set(".hero-visual", {
                        y: p * 100,
                        scale: 1 - p * 0.1,
                        opacity: 1 - p * 1.2
                    });
                }
            });

            // Magnetic effect on visual
            const visual = document.querySelector(".hero-visual");
            if (visual) {
                visual.addEventListener("mousemove", (e) => {
                    const rect = visual.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width / 2) / 20;
                    const y = (e.clientY - rect.top - rect.height / 2) / 20;
                    gsap.to(visual, {
                        x: x,
                        y: y,
                        rotationY: x * 0.5,
                        rotationX: -y * 0.5,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });

                visual.addEventListener("mouseleave", () => {
                    gsap.to(visual, {
                        x: 0,
                        y: 0,
                        rotationY: 0,
                        rotationX: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="home" className="hero-section">
            <div className="hero-bg">
                <div className="hero-grid"></div>
                <div className="hero-glow"></div>
            </div>

            <div className="container hero-container">
                <div className="hero-content">
                    <span className="tag tag-accent hero-tag">Real Estate Cinematography</span>

                    <h1 className="hero-headline heading-xl">
                        <span className="line">We Create</span>
                        <span className="line"><span className="accent-text">Cinematic</span></span>
                        <span className="line">Stories</span>
                    </h1>

                    <p className="hero-subline">
                        Premium video production for luxury properties.<br />
                        Professional editing. Stunning visuals. Results that sell.
                    </p>


                </div>


            </div>

            <div className="scroll-indicator">
                <span>Scroll</span>
                <div className="scroll-line">
                    <div className="scroll-dot"></div>
                </div>
            </div>
        </section>
    );
}
