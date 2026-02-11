import { useEffect, useRef, useState } from "react";
import { gsap } from "../core/gsap";
import "../styles/contact.css";

export default function Contact() {
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", propertyType: "", budget: "", date: "", time: "", message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".contact-header", {
                scrollTrigger: { trigger: ".contact-header", start: "top 85%" },
                y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
            });

            gsap.from(".contact-form-wrapper", {
                scrollTrigger: { trigger: ".contact-form-wrapper", start: "top 80%" },
                y: 30, opacity: 0, duration: 0.7, ease: "power3.out"
            });

            gsap.from(".contact-info-card", {
                scrollTrigger: { trigger: ".contact-info", start: "top 80%" },
                y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitted(true);
        setSubmitting(false);
    };

    const propertyTypes = ["Single Family", "Penthouse/Condo", "Luxury Estate", "Commercial", "Vacation Rental"];
    const budgets = ["Essential ($1,500)", "Professional ($3,500)", "Premium ($6,500)", "Custom"];
    const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

    return (
        <section ref={sectionRef} id="contact" className="contact-section section">
            <div className="container">
                <div className="contact-header">
                    <span className="tag tag-accent">Contact</span>
                    <h2 className="heading-lg">
                        Let's <span className="accent-text">create</span> together
                    </h2>
                </div>

                <div className="contact-grid">
                    <div className="contact-form-wrapper">
                        {!submitted ? (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="hello@savagemedia.com" required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                                    </div>
                                    <div className="form-group">
                                        <label>Property Type *</label>
                                        <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                                            <option value="">Select type</option>
                                            {propertyTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Budget *</label>
                                    <select name="budget" value={formData.budget} onChange={handleChange} required>
                                        <option value="">Select budget</option>
                                        {budgets.map((b, i) => <option key={i} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div className="form-section-label">Book a Slot</div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Time</label>
                                        <select name="time" value={formData.time} onChange={handleChange}>
                                            <option value="">Select time</option>
                                            {times.map((t, i) => <option key={i} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your project..." rows="4"></textarea>
                                </div>

                                <button type="submit" className={`btn btn-primary submit-btn ${submitting ? "loading" : ""}`} disabled={submitting}>
                                    {submitting ? "Sending..." : "Submit Request"}
                                </button>
                            </form>
                        ) : (
                            <div className="form-success">
                                <span className="success-icon">✓</span>
                                <h3>Request Received</h3>
                                <p>We'll respond within 24 hours.</p>
                                <button className="btn btn-outline" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", propertyType: "", budget: "", date: "", time: "", message: "" }); }}>
                                    New Request
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="contact-info">
                        <div className="contact-info-card">
                            <h4>Email</h4>
                            <a href="mailto:hello@studio.com">hello@studio.com</a>
                        </div>
                        <div className="contact-info-card">
                            <h4>Phone</h4>
                            <a href="tel:+15551234567">+1 (555) 123-4567</a>
                        </div>
                        <div className="contact-info-card">
                            <h4>Location</h4>
                            <span>Los Angeles, CA</span>
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
