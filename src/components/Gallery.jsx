import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/gallery.css";

export default function Gallery() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const deckRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);

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

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // DESKTOP: Fan-out card animation
    useEffect(() => {
        if (isMobile) return;

        const ctx = gsap.context(() => {
            const cards = cardsRef.current.filter(Boolean);
            const totalCards = cards.length;
            const centerIndex = Math.floor(totalCards / 2);

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

            cards.forEach((card, i) => {
                const offsetFromCenter = i - centerIndex;
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

    // MOBILE: Simple vertical reveal animation
    useEffect(() => {
        if (!isMobile) return;

        ScrollTrigger.batch(".vertical-card", {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }),
        });

        gsap.set(".vertical-card", { opacity: 0, y: 30 });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, [isMobile]);

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

    const renderMobile = () => (
        <div className="vertical-stackbox">
            {services.map((service, i) => (
                <div key={service.id} className="vertical-card">
                    <div
                        className="vertical-card-bg"
                        style={{ backgroundImage: `url(${service.image})` }}
                    />
                    <div className="vertical-card-overlay" />
                    <div className="vertical-card-content">
                        <span className="vertical-card-cat">{service.cat}</span>
                        <h3 className="vertical-card-title">{service.title}</h3>
                        <p className="vertical-card-desc">{service.desc}</p>
                    </div>
                    <div className="vertical-card-number">0{i + 1}</div>
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
