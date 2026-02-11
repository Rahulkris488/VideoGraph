import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from "../core/gsap";
import '../styles/recent-work.css';

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const REELS_ROW_1 = [
    { id: 1, src: "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.44 PM.mp4" },
    { id: 2, src: "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.45 PM (2).mp4" },
    { id: 3, src: "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.00.44 PM.mp4" },
    { id: 4, src: "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.45 PM.mp4" },
    { id: 5, src: "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.43 PM.mp4" },
    { id: 6, src: "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.44 PM (1).mp4" },
    { id: 7, src: "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.45 PM (1).mp4" },
];

const PHOTOS_ROW_2 = [
    { id: 1, src: "/assets/work/photos/IMA05242.jpg" },
    { id: 5, src: "/assets/work/photos/IMA05237.jpg" },
    { id: 3, src: "/assets/work/photos/IMA05257.jpg" },
    { id: 8, src: "/assets/work/photos/IMA05179.jpg" },
    { id: 2, src: "/assets/work/photos/IMA05232.jpg" },
    { id: 10, src: "/assets/work/photos/IMA05207.jpg" },
    { id: 4, src: "/assets/work/photos/IMA05247.jpg" },
    { id: 7, src: "/assets/work/photos/IMA051792.jpg" },
    { id: 6, src: "/assets/work/photos/IMA05342.jpg" },
    { id: 9, src: "/assets/work/photos/IMA05222.jpg" },
];

// ----------------------------------------------------------------------
// Focus-Mode Reel Card
// ----------------------------------------------------------------------

const ReelCard = ({ reel, isActive, isMounted }) => {
    const videoRef = useRef(null);

    // Effect to toggle play/pause based on active state without unmounting
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Auto-play was prevented
                    console.warn("Autoplay prevented", error);
                });
            }
        } else {
            videoRef.current.pause();
            // Optional: Reset to 0 if we want it to always restart?
            // User asked for "Thumbnail", which implies static first frame.
            // Leaving it paused at current time is handled, but resetting to 0 ensures "Thumbnail" look.
            // videoRef.current.currentTime = 0; 
        }
    }, [isActive]);

    return (
        <div className={`work-card reel-card ${isActive ? 'is-active' : ''}`}>
            <div className="card-video-bg">
                {/* 
                   VIDEO LAYER
                   - Mounted if 'isMounted' is true (Near viewport)
                   - If !isActive, it is PAUSED (showing current frame/first frame)
                   - If isActive, it PLAYS
                */}
                {isMounted && (
                    <video
                        ref={videoRef}
                        src={`${reel.src}#t=0.001`} // Force first frame seek
                        muted
                        loop
                        playsInline
                        preload="metadata" // Save data, just get the frame
                        className="card-video"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 2,
                            opacity: 1,
                            backgroundColor: '#000' // Black background while loading
                        }}
                    />
                )}

                {/* Fallback if unmounted (far off screen) */}
                {!isMounted && (
                    <div style={{ width: '100%', height: '100%', background: '#111' }} />
                )}
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Lazy Photo Card
// ----------------------------------------------------------------------

const PhotoCard = ({ photo }) => {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={cardRef} className="work-card photo-card">
            <div
                className="card-photo-bg"
                style={isVisible ? { backgroundImage: `url(${photo.src})` } : { backgroundColor: '#111' }}
            />
        </div>
    );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function RecentWork() {
    const sectionRef = useRef(null);
    const row1Ref = useRef(null);
    const row2Ref = useRef(null);

    // State to track status
    const [activeIndices, setActiveIndices] = useState([]);
    const [mountedIndices, setMountedIndices] = useState([]);

    // ----------------------------------------------------------------------
    // Focus Mode Logic (3 Active, Others Paused)
    // ----------------------------------------------------------------------

    useEffect(() => {
        let rafId;

        const checkFocus = () => {
            if (!row1Ref.current) return;

            const viewportCenter = window.innerWidth / 2;
            const cards = Array.from(row1Ref.current.children);

            // Calculate distance for all visible cards
            const cardDistances = cards.map((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + (rect.width / 2);
                return {
                    index,
                    distance: Math.abs(cardCenter - viewportCenter),
                    // Check if it's "close enough" to be mounted (e.g., within 1.5 screens)
                    isClose: (rect.right > -window.innerWidth && rect.left < window.innerWidth * 2)
                };
            });

            // 1. Determine Mounted (Close to viewport)
            const mounted = cardDistances
                .filter(item => item.isClose)
                .map(item => item.index);

            setMountedIndices(prev => {
                // Optimization: compare simple arrays
                if (prev.length !== mounted.length) return mounted;
                return prev.every((val, i) => val === mounted[i]) ? prev : mounted;
            });

            // 2. Determine Active (Top 3 closest)
            cardDistances.sort((a, b) => a.distance - b.distance);

            const active = cardDistances
                .slice(0, 3)
                .filter(item => item.distance < window.innerWidth) // Sanity check
                .map(item => item.index);

            setActiveIndices(prev => {
                if (prev.length !== active.length) return active;
                return prev.every((val, i) => val === active[i]) ? prev : active;
            });

            rafId = requestAnimationFrame(checkFocus);
        };

        rafId = requestAnimationFrame(checkFocus);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // ----------------------------------------------------------------------
    // GSAP Scroll Animation
    // ----------------------------------------------------------------------

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Row 1: Move LEFT to RIGHT
            gsap.fromTo(row1Ref.current,
                { x: -1200 },
                {
                    x: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );

            // Row 2: Move RIGHT to LEFT
            gsap.fromTo(row2Ref.current,
                { x: 0 },
                {
                    x: -1200,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const doubledReels = [...REELS_ROW_1, ...REELS_ROW_1];

    return (
        <section ref={sectionRef} id="recent-work" className="recent-work-section">
            <div className="recent-work-header">
                <span className="recent-work-label">Showcase</span>
                <h2 className="recent-work-title">Our <span className="subtitle">Work</span></h2>
            </div>

            <div className="perspective-container">
                {/* Row 1: REELS */}
                <div
                    ref={row1Ref}
                    className="video-row row-1"
                >
                    {doubledReels.map((reel, i) => (
                        <ReelCard
                            key={`reel-${i}`}
                            reel={reel}
                            isActive={activeIndices.includes(i)}
                            isMounted={mountedIndices.includes(i)}
                        />
                    ))}
                </div>

                {/* Row 2: PHOTOS */}
                <div
                    ref={row2Ref}
                    className="video-row row-2"
                >
                    {[...PHOTOS_ROW_2, ...PHOTOS_ROW_2].map((photo, i) => (
                        <PhotoCard key={`photo-${i}`} photo={photo} />
                    ))}
                </div>
            </div>
        </section>
    );
}
