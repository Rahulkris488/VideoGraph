import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/philosophy.css";

export default function Philosophy() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main title reveal
            gsap.from(".philosophy-tagline", {
                scrollTrigger: {
                    trigger: ".philosophy-tagline",
                    start: "top 85%"
                },
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            // Each principle reveals with stagger
            gsap.from(".principle", {
                scrollTrigger: {
                    trigger: ".principles-list",
                    start: "top 75%"
                },
                y: 60,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });

            // Quote reveal
            gsap.from(".philosophy-quote", {
                scrollTrigger: {
                    trigger: ".philosophy-quote",
                    start: "top 80%"
                },
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });

            // Line draw animation
            gsap.from(".principle-line", {
                scrollTrigger: {
                    trigger: ".principles-list",
                    start: "top 70%"
                },
                scaleX: 0,
                transformOrigin: "left center",
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const principles = [
        {
            number: "01",
            title: "Every Frame Tells a Story",
            desc: "We don't just shoot properties. We capture the feeling of coming home — the light through the window, the quiet of the morning, the promise of a new beginning."
        },
        {
            number: "02",
            title: "Patience is the Edit",
            desc: "Great cinema isn't rushed. We take the time to find the perfect cut, the right moment, the breath between scenes that makes viewers lean in."
        },
        {
            number: "03",
            title: "Light is Everything",
            desc: "The golden hour isn't just a time — it's a philosophy. We chase light because light creates emotion, and emotion creates connection."
        },
        {
            number: "04",
            title: "Sound Shapes Space",
            desc: "The gentle hum of a home, footsteps on hardwood, the distant ocean — audio isn't background. It's the soul of the story."
        }
    ];

    return (
        <section ref={sectionRef} id="services" className="philosophy-section section">
            <div className="container">
                <div className="philosophy-header">
                    <span className="tag tag-accent">Our Philosophy</span>
                    <p className="philosophy-tagline">
                        We believe in the quiet power of cinema.<br />
                        In moments captured. Stories told. Homes remembered.
                    </p>
                </div>

                <div className="principles-list">
                    {principles.map((p, i) => (
                        <div key={i} className="principle">
                            <div className="principle-number">{p.number}</div>
                            <div className="principle-content">
                                <h3 className="principle-title">{p.title}</h3>
                                <p className="principle-desc">{p.desc}</p>
                            </div>
                            <div className="principle-line"></div>
                        </div>
                    ))}
                </div>

                <div className="philosophy-quote">
                    <blockquote>
                        "A house is made of walls and beams.<br />
                        A home is made of love and dreams."
                    </blockquote>
                    <cite>— Our guiding light</cite>
                </div>
            </div>
        </section>
    );
}
