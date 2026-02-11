import "../styles/footer.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        services: [
            { label: "Cinematic Tours", href: "#services" },
            { label: "Aerial Cinematography", href: "#services" },
            { label: "Agent Branding", href: "#services" },
            { label: "Social Media Cuts", href: "#services" }
        ],
        company: [
            { label: "About Us", href: "#about" },
            { label: "Our Work", href: "#gallery" },
            { label: "Pricing", href: "#services" },
            { label: "Contact", href: "#contact" }
        ],
        legal: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookie Policy", href: "#" }
        ]
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <a href="#home" className="footer-logo">
                            <span className="logo-text">SAVAGE MEDIA</span>
                            <span className="logo-dot"></span>
                        </a>
                        <p className="footer-tagline">
                            believe. build. become.
                            Intentional, cinematic, and high-quality visual storytelling.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="YouTube">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Vimeo">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.875 10.063c-2.442 5.217-8.337 12.319-12.063 12.319-3.672 0-4.203-7.831-6.208-13.043-.987-2.565-1.624-1.976-3.474-.681l-1.128-1.455c2.698-2.372 5.398-5.127 7.057-5.28 1.868-.179 3.018 1.098 3.448 3.832.568 3.593 1.362 9.17 2.748 9.17 1.08 0 3.741-4.424 3.878-6.006.243-2.316-1.703-2.386-3.392-1.663 2.673-8.754 13.793-7.142 9.134 2.807z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="link-group">
                            <h4 className="link-group-title">Services</h4>
                            <ul>
                                {footerLinks.services.map((link, i) => (
                                    <li key={i}><a href={link.href}>{link.label}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="link-group">
                            <h4 className="link-group-title">Company</h4>
                            <ul>
                                {footerLinks.company.map((link, i) => (
                                    <li key={i}><a href={link.href}>{link.label}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="link-group">
                            <h4 className="link-group-title">Legal</h4>
                            <ul>
                                {footerLinks.legal.map((link, i) => (
                                    <li key={i}><a href={link.href}>{link.label}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">
                        © {currentYear} Savage Media. All rights reserved.
                    </p>
                    <p className="made-with">
                        Made with <span className="heart">♥</span> in Los Angeles
                    </p>
                </div>
            </div>
        </footer>
    );
}
