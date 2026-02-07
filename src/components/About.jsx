import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/about.css";

// Images in: public/assets/about/
const ABOUT_IMAGES = {
    main: "/assets/about/download (39).jpg",
    secondary: "/assets/about/download (40).jpg"
};

export default function About() {
    const sectionRef = useRef(null);
    const statsRef = useRef([]);
    const [counters, setCounters] = useState([0, 0, 0, 0]);

    const stats = [
        { value: 150, label: "Projects" },
        { value: 50, label: "Clients" },
        { value: 5, label: "Years" },
        { value: 24, label: "Awards" }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".about-title",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".about-title",
                        start: "top 85%"
                    }
                }
            );

            gsap.fromTo(".about-grid-item",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".about-grid",
                        start: "top 75%"
                    }
                }
            );

            statsRef.current.filter(Boolean).forEach((el, i) => {
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 85%",
                    onEnter: () => animateCounter(i, stats[i].value)
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const animateCounter = (index, target) => {
        let current = 0;
        const step = Math.ceil(target / 25);
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            setCounters(prev => {
                const newCounters = [...prev];
                newCounters[index] = current;
                return newCounters;
            });
        }, 30);
    };

    return (
        <section ref={sectionRef} id="about" className="about-section">
            <div className="container">
                {/* HEADER */}
                <h2 className="about-title">ABOUT US.</h2>

                {/* MAIN GRID */}
                <div className="about-grid">
                    {/* Left Column - Photo */}
                    <div className="about-grid-item photo-canvas-wrapper">
                        <div className="about-photo">
                            <img
                                src={ABOUT_IMAGES.main}
                                alt="Our Team"
                                className="about-image"
                            />
                            <div className="photo-label">Our Team</div>
                        </div>
                    </div>

                    {/* Right Column - Text */}
                    <div className="about-grid-item text-block">
                        <p className="about-text">
                            Studio Mares, communication agency based in Milan, has been created in 2012. Here Maurizio
                            Materni after his long tale experience with the advertising world, has created a new adventure.
                        </p>
                        <p className="about-text">
                            After a fortunate encounter with the copywriter and content manager Anna Scandurra, Studio
                            Mares grows and becomes functional member of the real brand family.
                        </p>
                    </div>
                </div>

                {/* QUOTE SECTION */}
                <div className="quote-section">
                    <div className="quote-mark">"</div>
                    <blockquote className="quote-text">
                        Our work does make sense<br />
                        only if it is a faithful witness<br />
                        of his time.
                    </blockquote>
                    <p className="quote-author">— Creative Director</p>
                </div>

                {/* SECOND GRID - Photo + Text */}
                <div className="about-grid reverse">
                    <div className="about-grid-item text-block">
                        <h3 className="section-heading">From humble beginnings<br />to a trusted partner</h3>
                        <p className="about-text">
                            What started as a small team of three developers working from a tiny office has grown into
                            a dynamic digital agency trusted by businesses across multiple industries.
                        </p>
                        <a href="#contact" className="about-link">
                            <span>↗</span> Get in Touch
                        </a>
                    </div>

                    <div className="about-grid-item photo-canvas-wrapper">
                        <div className="about-photo">
                            <img
                                src={ABOUT_IMAGES.secondary}
                                alt="Our Studio"
                                className="about-image"
                            />
                            <div className="photo-label">Our Studio</div>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="stats-row">
                    {stats.map((stat, i) => (
                        <div key={i} ref={el => statsRef.current[i] = el} className="stat-item">
                            <span className="stat-number">{counters[i]}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
