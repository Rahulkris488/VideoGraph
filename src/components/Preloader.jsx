import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

// List of all assets to preload
const ASSETS = [
    // Reels
    "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.44 PM.mp4",
    "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.45 PM (2).mp4",
    "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.00.44 PM.mp4",
    "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.45 PM.mp4",
    "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.43 PM.mp4",
    "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.44 PM (1).mp4",
    "/assets/work/reels/WhatsApp Video 2026-02-07 at 4.01.45 PM (1).mp4",
    // Photos
    "/assets/work/photos/IMA05179.jpg",
    "/assets/work/photos/IMA05232.jpg",
    "/assets/work/photos/IMA05207.jpg",
    "/assets/work/photos/IMA05247.jpg",
    "/assets/work/photos/IMA051792.jpg",
    "/assets/work/photos/IMA05342.jpg",
    "/assets/work/photos/IMA05222.jpg",
    "/assets/work/photos/IMA05242.jpg",
    "/assets/work/photos/IMA05237.jpg",
    "/assets/work/photos/IMA05257.jpg",
    // Base assets
    "/assets/services/photography_cinematic.jpg",
    "/assets/services/aeriel_drone.png",
    "/assets/services/interior_photo.png",
    "/assets/services/social_media.png",
    "/assets/services/virtual_tour.png",
    // About
    "/assets/about/download (39).jpg",
    "/assets/about/download (40).jpg"
];

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let loadedCount = 0;
        const totalAssets = ASSETS.length;

        const updateProgress = () => {
            loadedCount++;
            const newProgress = Math.round((loadedCount / totalAssets) * 100);
            setProgress(prev => Math.max(prev, newProgress));
        };

        // Load all assets
        ASSETS.forEach(src => {
            if (src.endsWith('.mp4')) {
                const video = document.createElement('video');
                video.src = src;
                video.onloadeddata = updateProgress;
                video.onerror = updateProgress; // Continue even if error
                video.load();
            } else {
                const img = new Image();
                img.src = src;
                img.onload = updateProgress;
                img.onerror = updateProgress;
            }
        });

        // Fallback timer in case something hangs
        const fallbackTimer = setTimeout(() => {
            setProgress(100);
        }, 8000); // 8s max wait

        return () => clearTimeout(fallbackTimer);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            // Animation out
            const tl = gsap.timeline();

            tl.to('.preloader-percent', {
                opacity: 0,
                duration: 0.5,
                delay: 0.5
            })
                .to('.preloader-bar', {
                    height: 0,
                    duration: 0.8,
                    ease: 'power4.inOut'
                })
                .to('.preloader-container', {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut'
                }, '-=0.6')
                .call(() => setIsComplete(true));
        }
    }, [progress]);

    if (isComplete) return null;

    return (
        <div className="preloader-container" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#050505',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
        }}>
            <div className="preloader-percent" style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                {Math.min(100, progress)}%
            </div>
            <div className="preloader-bar-bg" style={{
                width: '300px',
                height: '2px',
                background: 'rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="preloader-bar" style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#ccff00',
                    transition: 'width 0.2s ease-out'
                }} />
            </div>
        </div>
    );
}
