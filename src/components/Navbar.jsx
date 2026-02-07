import { useState, useEffect } from "react";
import { gsap } from "../core/gsap";
import "../styles/navbar.css";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (menuOpen) {
            gsap.fromTo(".filmstrip-link",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: "power3.out" }
            );
        }
    }, [menuOpen]);

    const navLinks = [
        { label: "Home", href: "#home", icon: "⌂" },
        { label: "About", href: "#about", icon: "◎" },
        { label: "Services", href: "#services", icon: "◈" },
        { label: "Work", href: "#recent-work", icon: "▶" },
        { label: "Contact", href: "#contact", icon: "✉" }
    ];

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    return (
        <>
            {/* DESKTOP NAVBAR */}
            {!isMobile && (
                <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                    <div className="nav-container">
                        <a href="#home" className="nav-logo">
                            <span className="logo-text">STUDIO</span>
                            <span className="logo-dot"></span>
                        </a>

                        <div className="nav-links">
                            {navLinks.map((link, i) => (
                                <a key={i} href={link.href} className="nav-link">
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="nav-actions">
                            <a href="#contact" className="btn btn-primary nav-cta">
                                Book a Call
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </nav>
            )}

            {/* MOBILE: Top bar with logo and hamburger */}
            {isMobile && (
                <>
                    <nav className={`mobile-topbar ${scrolled ? "scrolled" : ""}`}>
                        <a href="#home" className="nav-logo">
                            <span className="logo-text">STUDIO</span>
                            <span className="logo-dot"></span>
                        </a>

                        <button
                            className={`hamburger-btn ${menuOpen ? "active" : ""}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </nav>

                    {/* FILMSTRIP MENU - Shows on toggle */}
                    <div className={`filmstrip-menu ${menuOpen ? "open" : ""}`}>
                        {/* Film holes top */}
                        <div className="filmstrip-holes">
                            {[...Array(8)].map((_, i) => <span key={i} className="film-hole" />)}
                        </div>

                        {/* Navigation items */}
                        <div className="filmstrip-links">
                            {navLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.href}
                                    className="filmstrip-link"
                                    onClick={handleNavClick}
                                >
                                    <span className="filmstrip-icon">{link.icon}</span>
                                    <span className="filmstrip-label">{link.label}</span>
                                </a>
                            ))}
                        </div>

                        {/* Film holes bottom */}
                        <div className="filmstrip-holes">
                            {[...Array(8)].map((_, i) => <span key={i} className="film-hole" />)}
                        </div>
                    </div>

                    {/* Backdrop */}
                    {menuOpen && (
                        <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
                    )}
                </>
            )}
        </>
    );
}
