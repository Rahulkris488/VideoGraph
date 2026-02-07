import { useEffect, useRef } from 'react';
import { gsap } from '../core/gsap';

export default function Cursor3D() {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (!cursor || !follower) return;

        const onMouseMove = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        };

        const onMouseEnterLink = () => {
            gsap.to(cursor, { scale: 1.5 });
            gsap.to(follower, { scale: 1.5 });
        };

        const onMouseLeaveLink = () => {
            gsap.to(cursor, { scale: 1 });
            gsap.to(follower, { scale: 1 });
        };

        document.addEventListener('mousemove', onMouseMove);

        const links = document.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('mouseenter', onMouseEnterLink);
            link.addEventListener('mouseleave', onMouseLeaveLink);
        });

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            links.forEach(link => {
                link.removeEventListener('mouseenter', onMouseEnterLink);
                link.removeEventListener('mouseleave', onMouseLeaveLink);
            });
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="cursor-dot" />
            <div ref={followerRef} className="cursor-follower" />
        </>
    );
}
