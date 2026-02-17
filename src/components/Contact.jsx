import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../core/gsap";
import "../styles/contact.css";

export default function Contact() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".contact-header", {
                scrollTrigger: { trigger: ".contact-header", start: "top 85%" },
                y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
            });

            gsap.from(".contact-info-card", {
                scrollTrigger: { trigger: ".contact-info", start: "top 80%" },
                y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="contact" className="contact-section section">
            <div className="container">
                <div className="contact-header">
                    <span className="tag tag-accent">Contact</span>
                    <h2 className="heading-lg">
                        Let's <span className="accent-text">create</span> together
                    </h2>
                    <p className="contact-subtitle">Ready to showcase your property? Book a session and let us bring your listing to life.</p>
                    <Link to="/booking" className="btn btn-primary contact-book-btn">
                        Book Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                    </Link>
                </div>

                <div className="contact-info">
                    <div className="contact-info-card">
                        <h4>Email</h4>
                        <a href="mailto:Info@savagedigitalmedia.com">Info@savagedigitalmedia.com</a>
                    </div>
                    <div className="contact-info-card">
                        <h4>Phone</h4>
                        <a href="tel:+14379709902">+1 (437)-970-9902</a>
                    </div>
                    <div className="contact-info-card">
                        <h4>Location</h4>
                        <span>Greater Toronto Area</span>
                    </div>
                    <div className="contact-info-card social">
                        <h4>Follow</h4>
                        <div className="social-links">
                            <a href="#">IG</a>
                            <a href="#">YT</a>
                            <a href="#">VM</a>
                            <a href="#">LI</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Production Slate Overlay */}
            <div className="slate-overlay">
                <div className="slate">
                    <span className="slate-title">SAVAGE MEDIA</span>
                    <div className="slate-info">
                        <span>PROJECT: Your Property</span>
                        <span>DATE: __ / __ / ____</span>
                        <span>TAKE: 01</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
