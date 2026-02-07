import { useEffect, useState } from "react";
import { ScrollTrigger } from "../core/gsap";

export function useScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const st = ScrollTrigger.create({
            start: 0,
            end: document.documentElement.scrollHeight - window.innerHeight,
            onUpdate: self => setProgress(self.progress)
        });

        return () => st.kill();
    }, []);

    return progress;
}
