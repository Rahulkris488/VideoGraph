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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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

                // Responsive spread calculation
                const isSmallLaptop = window.innerWidth < 1400;
                const isTablet = window.innerWidth < 1024;

                let spreadFactor = 280;
                if (isTablet) spreadFactor = 160;
                else if (isSmallLaptop) spreadFactor = 220;

                const spreadX = offsetFromCenter * spreadFactor;
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
                        start: "top 50%",
                        end: "top 0%",
                        scrub: 1.5
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [isMobile]);

    // MOBILE: Spicy Layout & Animation
    useEffect(() => {
        if (!isMobile) return;

        const ctx = gsap.context(() => {
            const cards = mobileCardsRef.current.filter(Boolean);
            const line = document.querySelector('.mobile-line');

            // Initial states
            gsap.set(line, { scaleX: 0 });
            gsap.set(cards, { opacity: 0 });

            // 1. Draw the line
            gsap.to(line, {
                scaleX: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: ".mobile-spicy-wrapper",
                    start: "top 60%",
                    end: "top 40%",
                    scrub: 1
                }
            });

            // 2. Card 1 (Top) comes UP from line
            gsap.fromTo(cards[0],
                { y: 80, opacity: 0 },
                {
                    y: -30, // Move up more
                    opacity: 1,
                    scrollTrigger: {
                        trigger: ".mobile-spicy-wrapper",
                        start: "top 40%",
                        end: "top 20%",
                        scrub: 1
                    }
                }
            );

            // 3. Card 2 (Bottom) comes DOWN from line
            gsap.fromTo(cards[1],
                { y: -80, opacity: 0 },
                {
                    y: 30, // Move down more
                    opacity: 1,
                    scrollTrigger: {
                        trigger: ".mobile-spicy-wrapper",
                        start: "top 20%",
                        end: "top 0%",
                        scrub: 1
                    }
                }
            );

            // 4. Other cards fade in normally later
            cards.slice(2).forEach((card, i) => {
                gsap.fromTo(card,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "top 65%",
                            scrub: 1
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

    // MOBILE RENDER - Spicy Layout
    const renderMobile = () => (
        <div className="mobile-services-list">

            {/* Spicy Wrapper for first two cards */}
            <div className="mobile-spicy-wrapper" style={{
                position: 'relative',
                padding: '40px 0',
                marginBottom: '40px',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '20px'
            }}>
                {/* The Line */}
                <div className="mobile-line" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '5%',
                    right: '5%',
                    height: '3px',
                    background: '#ccff00',
                    transform: 'scaleX(0)',
                    transformOrigin: 'center',
                    boxShadow: '0 0 10px #ccff00'
                }} />

                {/* Card 1 - Top */}
                <div
                    ref={el => mobileCardsRef.current[0] = el}
                    className="mobile-service-card spicy-card"
                    style={{ backgroundImage: `url(${services[0].image})`, marginBottom: '10px' }}
                >
                    <div className="mobile-card-overlay" />
                    <div className="mobile-card-content">
                        <span className="mobile-card-cat">{services[0].cat}</span>
                        <h3 className="mobile-card-title">{services[0].title}</h3>
                    </div>
                </div>

                {/* Card 2 - Bottom */}
                <div
                    ref={el => mobileCardsRef.current[1] = el}
                    className="mobile-service-card spicy-card"
                    style={{ backgroundImage: `url(${services[1].image})`, marginTop: '10px' }}
                >
                    <div className="mobile-card-overlay" />
                    <div className="mobile-card-content">
                        <span className="mobile-card-cat">{services[1].cat}</span>
                        <h3 className="mobile-card-title">{services[1].title}</h3>
                    </div>
                </div>
            </div>

            {/* Remaining Cards (Normal) */}
            {services.slice(2).map((service, i) => (
                <div
                    key={service.id}
                    ref={el => mobileCardsRef.current[i + 2] = el}
                    className="mobile-service-card"
                    style={{ backgroundImage: `url(${service.image})` }}
                >
                    <div className="mobile-card-overlay" />
                    <div className="mobile-card-content">
                        <div className="mobile-card-header">
                            <span className="mobile-card-number">0{i + 3}</span>
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
