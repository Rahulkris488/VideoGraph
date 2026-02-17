import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/hero.css";

export default function Hero() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero text reveal timeline
            const tl = gsap.timeline({ delay: 0.2 });

            // Animate Logo
            tl.from(".hero-logo-large", {
                x: -50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })
                .from(".hero-tag", {
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
                }
            });
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
                <div className="hero-layout">
                    {/* Left Column: Logo */}
                    <div className="hero-logo-col">
                        <img
                            src="/assets/work/Logo.png"
                            alt="Savage Media Logo"
                            className="hero-logo-large"
                        />
                    </div>

                    {/* Right Column: Text */}
                    <div className="hero-text-col">
                        <div className="hero-content">
                            <span className="tag tag-accent hero-tag">Real Estate Cinematography</span>

                            <h1 className="hero-headline heading-xl">
                                <span className="line">We Don't Just</span>
                                <span className="line">Create <span className="accent-text">Videos</span></span>
                            </h1>

                            <p className="hero-subline">
                                We create high quality content to help<br />
                                agents sell faster and <span className="accent-text">stand out</span>.
                            </p>
                        </div>
                    </div>
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
