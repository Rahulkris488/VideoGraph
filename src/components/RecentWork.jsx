import React, { useEffect, useRef, useState, useCallback } from 'react';
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

// Repeat arrays enough times for seamless infinite loop
const repeatArray = (arr, times) => {
    const result = [];
    for (let t = 0; t < times; t++) {
        arr.forEach((item, i) => {
            result.push({ ...item, _key: `${t}-${i}` });
        });
    }
    return result;
};

// ----------------------------------------------------------------------
// Focus-Mode Reel Card
// ----------------------------------------------------------------------

const ReelCard = ({ reel, isActive, isMounted }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Autoplay prevented", error);
                });
            }
        } else {
            videoRef.current.pause();
        }
    }, [isActive]);

    return (
        <div className={`work-card reel-card ${isActive ? 'is-active' : ''}`}>
            <div className="card-video-bg">
                {isMounted && (
                    <video
                        ref={videoRef}
                        src={`${reel.src}#t=0.001`}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="card-video"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 2,
                            opacity: 1,
                            backgroundColor: '#000'
                        }}
                    />
                )}

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
// Row Navigation Arrows with Infinite Loop
// ----------------------------------------------------------------------

const RowArrows = ({ rowRef, originalCount }) => {
    const scrollRow = useCallback((scrollDirection) => {
        if (!rowRef.current) return;

        const card = rowRef.current.querySelector('.work-card');
        if (!card) return;


        const style = window.getComputedStyle(rowRef.current);
        const gap = parseFloat(style.gap) || 30;

        const cardWidth = card.offsetWidth;
        const scrollAmount = (cardWidth + gap) * 2; // scroll 2 cards at a time

        // Total width of one "set" of original items
        const oneSetWidth = originalCount * (cardWidth + gap);

        const currentX = gsap.getProperty(rowRef.current, 'x') || 0;
        let newX = scrollDirection === 'left'
            ? currentX + scrollAmount
            : currentX - scrollAmount;

        // Infinite loop: wrap around using modulo
        // We have 5 repeated sets — keep x within the middle 3 sets range
        // so the user never sees the edge
        const minX = -(oneSetWidth * 4);  // don't go past 4th set
        const maxX = 0;          // don't go past 1st set boundary

        if (newX < minX) {
            // Jumped too far left — silently reset to equivalent position
            gsap.set(rowRef.current, { x: newX + oneSetWidth });
            newX = newX + oneSetWidth;
        } else if (newX > maxX) {
            // Jumped too far right — silently reset
            gsap.set(rowRef.current, { x: newX - oneSetWidth });
            newX = newX - oneSetWidth;
        }

        gsap.to(rowRef.current, {
            x: newX,
            duration: 0.6,
            ease: 'power2.out',
        });
    }, [rowRef, originalCount]);

    return (
        <div className="row-arrows">
            <button
                className="row-arrow row-arrow-left"
                onClick={() => scrollRow('left')}
                aria-label="Scroll left"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button
                className="row-arrow row-arrow-right"
                onClick={() => scrollRow('right')}
                aria-label="Scroll right"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                </svg>
            </button>
        </div>
    );
};

// ----------------------------------------------------------------------
// Scroll-to-Section Arrow
// ----------------------------------------------------------------------

const ScrollDownArrow = () => {
    const handleClick = () => {
        const section = document.getElementById('recent-work');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <button className="scroll-to-work-arrow" onClick={handleClick} aria-label="Scroll to our work">
            <span className="scroll-arrow-text">Our Work</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
    );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function RecentWork() {
    const sectionRef = useRef(null);
    const row1Ref = useRef(null);
    const row2Ref = useRef(null);

    const [activeIndices, setActiveIndices] = useState([]);
    const [mountedIndices, setMountedIndices] = useState([]);

    // Create repeated arrays (5x) for infinite loop
    const reelsData = repeatArray(REELS_ROW_1, 5);
    const photosData = repeatArray(PHOTOS_ROW_2, 5);

    // ----------------------------------------------------------------------
    // Focus Mode Logic
    // ----------------------------------------------------------------------

    useEffect(() => {
        let rafId;

        const checkFocus = () => {
            if (!row1Ref.current) return;

            const viewportCenter = window.innerWidth / 2;
            const cards = Array.from(row1Ref.current.children);

            const cardDistances = cards.map((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + (rect.width / 2);
                return {
                    index,
                    distance: Math.abs(cardCenter - viewportCenter),
                    isClose: (rect.right > -window.innerWidth && rect.left < window.innerWidth * 2)
                };
            });

            const mounted = cardDistances
                .filter(item => item.isClose)
                .map(item => item.index);

            setMountedIndices(prev => {
                if (prev.length !== mounted.length) return mounted;
                return prev.every((val, i) => val === mounted[i]) ? prev : mounted;
            });

            cardDistances.sort((a, b) => a.distance - b.distance);

            const active = cardDistances
                .slice(0, 3)
                .filter(item => item.distance < window.innerWidth)
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

    /* ─── SCROLL INITIALIZATION ─── */
    useEffect(() => {
        // Initialize rows to the middle set (index 2 of 5)
        // This ensures we have buffer on both left and right for infinite scrolling
        const initRow = (rowRef, count) => {
            if (!rowRef.current) return;
            const card = rowRef.current.querySelector('.work-card');
            if (card) {
                const style = window.getComputedStyle(rowRef.current);
                const gap = parseFloat(style.gap) || 30; // Get dynamic gap (30px desktop, 15px mobile)

                const cardWidth = card.offsetWidth;
                const oneSetWidth = count * (cardWidth + gap);

                // Start at the beginning of the 3rd set
                // 5 sets total: [0][1][2][3][4]
                // We want to see [2]. So we move left by 2 sets width.
                // x = -(oneSetWidth * 2)
                gsap.set(rowRef.current, { x: -(oneSetWidth * 2) });
            }
        };

        // Delay slightly to ensure layout is ready
        const timer = setTimeout(() => {
            initRow(row1Ref, REELS_ROW_1.length);
            initRow(row2Ref, PHOTOS_ROW_2.length);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section ref={sectionRef} id="recent-work" className="recent-work-section">
            <div className="recent-work-header">
                <span className="recent-work-label">Showcase</span>
                <h2 className="recent-work-title">Our <span className="subtitle">Work</span></h2>
            </div>

            <div className="perspective-container">
                {/* Row 1: REELS */}
                <div className="row-wrapper">
                    <RowArrows rowRef={row1Ref} originalCount={REELS_ROW_1.length} />
                    <div ref={row1Ref} className="video-row row-1">
                        {reelsData.map((reel, i) => (
                            <ReelCard
                                key={reel._key}
                                reel={reel}
                                isActive={activeIndices.includes(i)}
                                isMounted={mountedIndices.includes(i)}
                            />
                        ))}
                    </div>
                </div>

                {/* Row 2: PHOTOS */}
                <div className="row-wrapper">
                    <RowArrows rowRef={row2Ref} originalCount={PHOTOS_ROW_2.length} />
                    <div ref={row2Ref} className="video-row row-2">
                        {photosData.map((photo, i) => (
                            <PhotoCard key={photo._key} photo={photo} />
                        ))}
                    </div>
                </div>
            </div>

            <ScrollDownArrow />
        </section>
    );
}
