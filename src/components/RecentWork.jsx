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

// ----------------------------------------------------------------------
// Focus-Mode Reel C---------------------------------------

const ReelCard = React.memo(({ reel, isActive, isMounted }) => {
    const videoRef = useRef(null);
    const playTimeoutRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Clear any pending play request
        if (playTimeoutRef.current) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
        }

        if (isActive) {
            // "Stop the scroll and then a sec pause"
            // We add a delay before playing to ensure scrolling has likely stopped/slowed
            // and to prevent rapid play/pause calls during fast scrolls.
            playTimeoutRef.current = setTimeout(() => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Autoplay prevented or interrupted is common, ignore warning
                    });
                }
            }, 500); // 500ms delay
        } else {
            // Pause immediately when not active
            video.pause();
            // Reset to start so it's fresh when becoming active again
            video.currentTime = 0;
        }

        return () => {
            if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
        };
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
});

// ----------------------------------------------------------------------
// Lazy Photo Card
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Lazy Photo Card (Memoized)
// ----------------------------------------------------------------------

const PhotoCard = React.memo(({ photo }) => {
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
});

// ----------------------------------------------------------------------
// Row Navigation Arrows with Infinite Loop
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Row Navigation Arrows (Single Item Scroll)
// ----------------------------------------------------------------------

const RowArrows = ({ rowRef, originalCount }) => {
    const scrollRow = useCallback((scrollDirection) => {
        if (!rowRef.current) return;

        const card = rowRef.current.querySelector('.work-card');
        if (!card) return;


        const style = window.getComputedStyle(rowRef.current);
        const gap = parseFloat(style.gap) || 30;

        // Use getBoundingClientRect for accurate width
        const cardWidth = card.getBoundingClientRect().width;

        // SCROLL EXACTLY ONE ITEM
        const scrollAmount = cardWidth + gap;

        // Total width of one "set" of original items
        const oneSetWidth = originalCount * (cardWidth + gap);

        const currentX = gsap.getProperty(rowRef.current, 'x') || 0;
        let newX = scrollDirection === 'left'
            ? currentX + scrollAmount
            : currentX - scrollAmount;

        // Infinite loop: wrap around
        // We have 5 repeated sets. 
        // We keep position roughly in the middle sets (index 1, 2, 3).
        const minX = -(oneSetWidth * 3.5);
        const maxX = -(oneSetWidth * 0.5);

        // Immediate wrap-around check before animating
        // logic: if we are going too far, reset physically to an equivalent position
        // in a different set, then animate to the target.
        if (newX < minX) {
            const resetX = newX + oneSetWidth;
            gsap.set(rowRef.current, { x: currentX + oneSetWidth });
            newX = resetX; // destination
        } else if (newX > maxX) {
            const resetX = newX - oneSetWidth;
            gsap.set(rowRef.current, { x: currentX - oneSetWidth });
            newX = resetX; // destination
        }

        gsap.to(rowRef.current, {
            x: newX,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: true // Ensure we kill previous conflicting tweens
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
    const scrollRef1 = useRef(null);
    const scrollRef2 = useRef(null);

    const [activeIndices, setActiveIndices] = useState([]);
    const [mountedIndices, setMountedIndices] = useState([]);

    // Create repeated arrays (5x) for infinite loop
    const reelsData = React.useMemo(() => repeatArray(REELS_ROW_1, 5), []);
    const photosData = React.useMemo(() => repeatArray(PHOTOS_ROW_2, 5), []);

    // ----------------------------------------------------------------------
    // Focus Mode Logic
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    // Focus Mode Logic (Optimized for 60fps)
    // ----------------------------------------------------------------------

    useEffect(() => {
        let cardWidth = 300; // Default fallback
        let gap = 30; // Default fallback
        let totalItemWidth = 330;
        let viewportCenter = window.innerWidth / 2;

        const measure = () => {
            const row = row1Ref.current;
            if (!row) return;
            const card = row.querySelector('.work-card');
            if (card) {
                // Use getBoundingClientRect for width including transforms/borders
                cardWidth = card.getBoundingClientRect().width;
                const style = window.getComputedStyle(row);
                gap = parseFloat(style.gap) || 30;
                // Add tiny buffer to total width to avoid rounding flicker
                totalItemWidth = cardWidth + gap;
            }
            viewportCenter = window.innerWidth / 2;
        };

        // Measure initially and on resize
        measure();
        window.addEventListener('resize', measure);

        const tick = () => {
            if (!row1Ref.current) return;

            // Get current X position of the inner row (driven by arrows)
            const innerX = gsap.getProperty(row1Ref.current, "x") || 0;
            // Also account for the parallax wrapper offset so center detection
            // stays accurate as the user scrolls the page
            const wrapperX = scrollRef1.current
                ? (gsap.getProperty(scrollRef1.current, "x") || 0)
                : 0;
            const currentX = innerX + wrapperX;

            // Calculate float index at center
            const centerIndexFloat = (viewportCenter - currentX - (cardWidth / 2)) / totalItemWidth + 0.5;
            const centerIndex = Math.round(centerIndexFloat);

            // Determine active range (STRICTLY CENTER)
            // Only play the one video closest to center, with a tight threshold
            // "it's still rendering the leftest video" -> Ensure we are strict.
            const active = [];

            // Only set active if we are very close to the center (within 0.3 of the card width)
            // This prevents videos playing when they are half-scrolled
            if (Math.abs(centerIndexFloat - centerIndex) < 0.3) {
                active.push(centerIndex);
            }

            // Modulo logic to map virtually infinite index back to 0..length-1
            const realActive = active.map(i => {
                const len = reelsData.length;
                return ((i % len) + len) % len;
            });

            // WIDEN MOUNTED BUFFER SIGNIFICANTLY (±10)
            const startMount = Math.floor(centerIndex - 10);
            const endMount = Math.ceil(centerIndex + 10);
            const mountedIndicesTemp = [];
            for (let i = startMount; i <= endMount; i++) {
                const len = reelsData.length;
                mountedIndicesTemp.push(((i % len) + len) % len);
            }

            // Update state only if changed (prevents re-renders)
            setActiveIndices(prev => {
                if (prev.length === realActive.length && prev.every((v, k) => v === realActive[k])) return prev;
                return realActive;
            });

            setMountedIndices(prev => {
                // Simple length check optimization
                if (prev.length === mountedIndicesTemp.length && prev[0] === mountedIndicesTemp[0]) return prev;
                return [...new Set(mountedIndicesTemp)]; // Dedupe
            });
        };

        // Run on every frame using GSAP ticker (synced with RAF)
        gsap.ticker.add(tick);

        return () => {
            window.removeEventListener('resize', measure);
            gsap.ticker.remove(tick);
        };
    }, [reelsData.length]);

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

    /* ─── SCROLL ANIMATION (PARALLAX ON WRAPPERS) ─── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate wrapper 1 (moves right: -1200 -> 0)
            gsap.fromTo(scrollRef1.current,
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

            // Animate wrapper 2 (moves left: 0 -> -1200)
            gsap.fromTo(scrollRef2.current,
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
                    <div ref={scrollRef1} className="row-scroll-container">
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
                </div>

                {/* Row 2: PHOTOS */}
                <div className="row-wrapper">
                    <RowArrows rowRef={row2Ref} originalCount={PHOTOS_ROW_2.length} />
                    <div ref={scrollRef2} className="row-scroll-container">
                        <div ref={row2Ref} className="video-row row-2">
                            {photosData.map((photo, i) => (
                                <PhotoCard key={photo._key} photo={photo} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ScrollDownArrow />
        </section>
    );
}
