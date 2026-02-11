import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/about.css";

export default function About() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title fade in
            gsap.fromTo(".about-title",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".about-section",
                        start: "top 75%"
                    }
                }
            );

            // Text stagger reveal
            gsap.fromTo(".about-text-p",
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".about-text-container",
                        start: "top 80%"
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="about-section">
            {/* 2D Cyberpunk Grid Background */}
            <div className="cyber-grid-bg">
                <div className="cyber-grid-plane"></div>
                <div className="cyber-grid-overlay"></div>
            </div>

            <div className="container relative-z">
                <div className="about-content-centered">

                    <div className="about-header-centered">
                        <span className="tag tag-accent">Philosophy</span>
                        <h2 className="about-title">BELIEVE.<br />BUILD.<br />BECOME.</h2>
                    </div>

                    <div className="about-text-container">
                        <p className="about-text-p lead">
                            At Savage Media, we believe powerful visuals don’t just look good — they communicate value, build trust, and move people to action.
                        </p>
                        <p className="about-text-p">
                            We don’t chase trends or shortcuts. Instead, we focus on clarity, consistency, and impact — producing visuals that feel premium, authentic, and timeless.
                        </p>
                        <p className="about-text-p">
                            More than a media company, we are a creative partner. We are here to support your journey, amplify your message, and help you present your work at the highest standard possible.
                        </p>

                        <div className="about-signature-centered">
                            <span className="accent-text">SAVAGE MEDIA</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
