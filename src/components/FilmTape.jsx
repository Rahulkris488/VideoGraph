import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../core/gsap";
import "../styles/filmtape.css";

export default function FilmTape() {
    const tape1Ref = useRef(null);
    const tape2Ref = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;

                    if (tape1Ref.current) {
                        // Keep rotation constant, only animate X
                        tape1Ref.current.style.transform = `translate(-50%, -50%) rotate(-1.5deg) translateX(${progress * 200}px)`;
                    }

                    if (tape2Ref.current) {
                        // Keep rotation constant, only animate X
                        tape2Ref.current.style.transform = `translate(-50%, -50%) rotate(1.5deg) translateX(${-progress * 200}px)`;
                    }
                }
            });
        });

        return () => ctx.revert();
    }, []);

    const renderStrip = () => (
        <>
            <div className="holes-top">
                {[...Array(80)].map((_, i) => <span key={i} className="hole" />)}
            </div>
            <div className="frames">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="frame"><div className="frame-inner" /></div>
                ))}
            </div>
            <div className="holes-bottom">
                {[...Array(80)].map((_, i) => <span key={i} className="hole" />)}
            </div>
        </>
    );

    return (
        <div className="filmtape-section" ref={sectionRef}>
            <div className="strip strip-1" ref={tape1Ref}>{renderStrip()}</div>
            <div className="strip strip-2" ref={tape2Ref}>{renderStrip()}</div>
        </div>
    );
}
