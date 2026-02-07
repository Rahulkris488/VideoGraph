import React, { useEffect, useRef, useState } from 'react';
import '../styles/recent-work.css';

// ----------------------------------------------------------------------
// DATA - Row 1: Reels (videos) | Row 2: Photos (shuffled)
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

// Shuffled photos
const PHOTOS_ROW_2 = [
    { id: 1, src: "/assets/work/photos/IMA05179.jpg" },
    { id: 5, src: "/assets/work/photos/IMA05232.jpg" },
    { id: 3, src: "/assets/work/photos/IMA05207.jpg" },
    { id: 8, src: "/assets/work/photos/IMA05247.jpg" },
    { id: 2, src: "/assets/work/photos/IMA051792.jpg" },
    { id: 10, src: "/assets/work/photos/IMA05342.jpg" },
    { id: 4, src: "/assets/work/photos/IMA05222.jpg" },
    { id: 7, src: "/assets/work/photos/IMA05242.jpg" },
    { id: 6, src: "/assets/work/photos/IMA05237.jpg" },
    { id: 9, src: "/assets/work/photos/IMA05257.jpg" },
];

// ----------------------------------------------------------------------
// Lazy Video Card
// ----------------------------------------------------------------------

const ReelCard = ({ reel }) => {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, []);

    return (
        <div className="work-card reel-card">
            <div className="card-video-bg">
                <video
                    ref={videoRef}
                    src={reel.src}
                    muted
                    loop
                    playsInline
                    className="card-video"
                />
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
                style={isVisible ? { backgroundImage: `url(${photo.src})` } : {}}
            />
        </div>
    );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT - Scroll Triggered
// ----------------------------------------------------------------------

export default function RecentWork() {
    const sectionRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate progress from when section enters to when it leaves
            const sectionTop = rect.top;
            const sectionHeight = rect.height;

            // Progress goes from 0 (section at bottom of screen) to 1 (section at top)
            const start = windowHeight;
            const end = -sectionHeight;
            const current = sectionTop;

            const p = (start - current) / (start - end);
            setProgress(Math.max(0, Math.min(1, p)));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate movement based on scroll progress (faster = more movement)
    const row1Move = progress * 1500;
    const row2Move = progress * 1500;

    return (
        <section ref={sectionRef} id="recent-work" className="recent-work-section">
            <div className="recent-work-header">
                <span className="recent-work-label">Showcase</span>
                <h2 className="recent-work-title">Our <span className="subtitle">Work</span></h2>
            </div>

            <div className="perspective-container">
                {/* Row 1: REELS - Scrolls LEFT to RIGHT */}
                <div
                    className="video-row row-1"
                    style={{ transform: `translateX(${-2000 + row1Move * 2}px)` }}
                >
                    {[...REELS_ROW_1, ...REELS_ROW_1, ...REELS_ROW_1].map((reel, i) => (
                        <ReelCard key={`reel-${i}`} reel={reel} />
                    ))}
                </div>

                {/* Row 2: PHOTOS - Scrolls RIGHT to LEFT */}
                <div
                    className="video-row row-2"
                    style={{ transform: `translateX(${600 - row2Move * 2}px)` }}
                >
                    {[...PHOTOS_ROW_2, ...PHOTOS_ROW_2, ...PHOTOS_ROW_2].map((photo, i) => (
                        <PhotoCard key={`photo-${i}`} photo={photo} />
                    ))}
                </div>
            </div>
        </section>
    );
}
