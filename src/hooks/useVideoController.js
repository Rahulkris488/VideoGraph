import { useEffect, useRef } from "react";

export function useVideoController(active) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (active) {
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => { });
            }
        } else {
            video.pause();
        }

        return () => {
            video.pause();
        };
    }, [active]);

    return videoRef;
}
