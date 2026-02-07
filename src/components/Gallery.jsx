import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/gallery.css";

export default function Gallery() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const deckRef = useRef(null);
    const mobileCardsRef = useRef([]);

    const [isMobile, setIsMobile] = useState(false);

    // Service-oriented titles with images
    // Images in: public/assets/services/
    const services = [
        {
            id: 1,
            title: "Property Cinematography",
            cat: "Production",
            desc: "Cinematic video tours that showcase properties in their best light",
            image: "/assets/services/photography_cinematic.jpg"
        },
        {
            id: 2,
            title: "Aerial Drone Coverage",
            cat: "Drone",
            desc: "Stunning aerial perspectives of estates and surrounding areas",
            image: "/assets/services/aeriel_drone.png"
        },
        {
            id: 3,
            title: "Interior Photography",
            cat: "Photography",
            desc: "Professional interior shots with perfect lighting and composition",
            image: "/assets/services/interior_photo.png"
        },
        {
            id: 4,
            title: "Social Media Reels",
            cat: "Content",
            desc: "Scroll-stopping vertical content for Instagram and TikTok",
            image: "/assets/services/social_media.png"
        },
        {
            id: 5,
            title: "Virtual Tours",
            cat: "Interactive",
            desc: "Immersive 360° experiences for remote property viewing",
            image: "/assets/services/virtual_tour.png"
        }
    ];

    // Check for mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // DESKTOP: Fan-out card animation - NO PIN for seamless flow
    useEffect(() => {
        if (isMobile) return;

        const ctx = gsap.context(() => {
            const cards = cardsRef.current.filter(Boolean);
            const totalCards = cards.length;
            const centerIndex = Math.floor(totalCards / 2);

            // Initial stacked state
            cards.forEach((card, i) => {
                gsap.set(card, {
                    x: 0,
                    y: 0,
                    rotation: (i - centerIndex) * 3,
                    scale: 1,
                    zIndex: totalCards - i,
                    opacity: 1
                });
            });

            // Single continuous scroll animation - NO PIN
            cards.forEach((card, i) => {
                const offsetFromCenter = i - centerIndex;
                const spreadX = offsetFromCenter * 280;
                const spreadY = Math.abs(offsetFromCenter) * 8;
                const rotation = offsetFromCenter * 4;
                const finalScale = 1 - Math.abs(offsetFromCenter) * 0.015;

                gsap.to(card, {
                    x: spreadX,
                    y: spreadY,
                    rotation: rotation,
                    scale: finalScale,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                        end: "top 10%",
                        scrub: 1.5
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    // MOBILE: Staggered scroll-reveal animation
    useEffect(() => {
        if (!isMobile) return;

        const ctx = gsap.context(() => {
            const cards = mobileCardsRef.current.filter(Boolean);

            cards.forEach((card, i) => {
                gsap.fromTo(card,
                    { y: 60, opacity: 0, scale: 0.95 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "top 60%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    // DESKTOP RENDER - With background images
    const renderDesktop = () => (
        <div className="gallery-deck-wrapper">
            <div className="gallery-deck" ref={deckRef}>
                {services.map((service, i) => (
                    <div
                        key={service.id}
                        ref={el => cardsRef.current[i] = el}
                        className="gallery-card"
                    >
                        <div className="card-inner">
                            {/* Background image */}
                            <div
                                className="card-bg-image"
                                style={{ backgroundImage: `url(${service.image})` }}
                            />
                            <div className="card-overlay-gradient" />
                            <div className="card-number">0{i + 1}</div>
                            <div className="card-content">
                                <span className="card-cat">{service.cat}</span>
                                <h3 className="card-title">{service.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // MOBILE RENDER - With background images
    const renderMobile = () => (
        <div className="mobile-services-list">
            {services.map((service, i) => (
                <div
                    key={service.id}
                    ref={el => mobileCardsRef.current[i] = el}
                    className="mobile-service-card"
                    style={{ backgroundImage: `url(${service.image})` }}
                >
                    <div className="mobile-card-overlay" />
                    <div className="mobile-card-content">
                        <div className="mobile-card-header">
                            <span className="mobile-card-number">0{i + 1}</span>
                            <span className="mobile-card-cat">{service.cat}</span>
                        </div>
                        <h3 className="mobile-card-title">{service.title}</h3>
                        <p className="mobile-card-desc">{service.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section ref={sectionRef} id="services" className={`gallery-section ${isMobile ? 'mobile-view' : ''}`}>
            <div className="container">
                <div className="gallery-header">
                    <h2 className="heading-lg py-8">
                        Our <span className="accent-text">Services</span>
                    </h2>
                </div>
            </div>

            {isMobile ? renderMobile() : renderDesktop()}
        </section>
    );
}
