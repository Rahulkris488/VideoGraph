import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/services.css";

export default function Services() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const [hoveredCard, setHoveredCard] = useState(1);

    const packages = [
        {
            id: 0,
            name: "Essential",
            price: "$1,500",
            duration: "1 Day",
            desc: "Single property, quick turnaround",
            features: ["4K Cinematic Tour", "Drone Aerials", "3 Social Cuts", "48H Delivery"]
        },
        {
            id: 1,
            name: "Professional",
            price: "$3,500",
            duration: "2 Days",
            desc: "Most popular package",
            features: ["4K Cinematic Tour", "Advanced Aerials", "6 Social Cuts", "Agent Intro", "Twilight Session", "24H Delivery"],
            popular: true
        },
        {
            id: 2,
            name: "Premium",
            price: "$6,500",
            duration: "3 Days",
            desc: "Ultimate luxury production",
            features: ["4K Feature Film", "Full Aerial Package", "12 Social Cuts", "Brand Video", "Lifestyle B-Roll", "Virtual Tour", "Same-Day Rush"]
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header reveal
            gsap.from(".services-header", {
                scrollTrigger: {
                    trigger: ".services-header",
                    start: "top 85%"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });

            // Cards 3D flip reveal
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%"
                    },
                    rotationY: -30,
                    rotationX: 10,
                    y: 80,
                    opacity: 0,
                    scale: 0.9,
                    duration: 1,
                    delay: i * 0.15,
                    ease: "power3.out"
                });
            });

            // Process steps with line draw
            gsap.from(".process-step", {
                scrollTrigger: {
                    trigger: ".process-section",
                    start: "top 80%"
                },
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.7,
                ease: "power3.out"
            });

            // Animate the connecting line
            gsap.from(".process-line", {
                scrollTrigger: {
                    trigger: ".process-section",
                    start: "top 80%"
                },
                scaleX: 0,
                transformOrigin: "left center",
                duration: 1.2,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Magnetic card effect
    const handleMouseMove = (e, index) => {
        const card = cardsRef.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 15;
        const y = (e.clientY - rect.top - rect.height / 2) / 15;

        gsap.to(card, {
            rotationY: x,
            rotationX: -y,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = (index) => {
        const card = cardsRef.current[index];
        if (!card) return;

        gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    return (
        <section ref={sectionRef} id="services" className="services-section section">
            <div className="container">
                <div className="services-header">
                    <span className="tag tag-accent">Packages</span>
                    <h2 className="heading-lg">
                        Pricing for <span className="accent-text">every project</span>
                    </h2>
                </div>

                <div className="packages-grid">
                    {packages.map((pkg, i) => (
                        <div
                            key={pkg.id}
                            ref={el => cardsRef.current[i] = el}
                            className={`package-card ${pkg.popular ? "popular" : ""} ${hoveredCard === i ? "active" : ""}`}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseMove={(e) => handleMouseMove(e, i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {pkg.popular && <span className="popular-tag">Popular</span>}

                            <div className="package-header">
                                <span className="package-name">{pkg.name}</span>
                                <div className="package-price">
                                    <span className="price">{pkg.price}</span>
                                    <span className="duration">{pkg.duration}</span>
                                </div>
                                <p className="package-desc">{pkg.desc}</p>
                            </div>

                            <ul className="package-features">
                                {pkg.features.map((f, j) => (
                                    <li key={j}>
                                        <span className="check">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <a href="#contact" className={`btn ${pkg.popular ? "btn-primary" : "btn-outline"}`}>
                                Select Package
                            </a>
                        </div>
                    ))}
                </div>

                <div className="process-section">
                    <h3 className="process-title">How it works</h3>
                    <div className="process-grid">
                        <div className="process-line"></div>
                        {[
                            { num: "01", title: "Discovery", desc: "Goals & vision" },
                            { num: "02", title: "Pre-Production", desc: "Shot planning" },
                            { num: "03", title: "Production", desc: "On-site filming" },
                            { num: "04", title: "Post", desc: "Edit & deliver" }
                        ].map((step, i) => (
                            <div key={i} className="process-step">
                                <span className="step-num">{step.num}</span>
                                <h4 className="step-title">{step.title}</h4>
                                <p className="step-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
