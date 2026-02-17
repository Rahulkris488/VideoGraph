import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "../core/gsap";
import { sendBookingEmails } from "../services/emailService";
import "../styles/booking.css";

/* ─── SERVICE PACKS DATA ─── */
const SERVICE_PACKS = [
    {
        id: 1,
        name: "PHOTOGRAPHY",
        duration: "1 hour",
        description: "Interior and exterior HDR photography. Includes listing landing page.",
        includes: ["Photography", "Landing Page"],
        icon: "📷",
    },
    {
        id: 2,
        name: "PHOTO+VIDEO",
        duration: "1 hour 30 minutes",
        description: "Interior/exterior photography. Choose from a standard or vertical video to showcase your listing. Includes listing landing page.",
        includes: ["Photography", "Videography", "Landing Page"],
        icon: "🎬",
    },
    {
        id: 3,
        name: "3D TOUR AND FLOORPLANS",
        duration: "1 hour",
        description: "3D virtual tour, floor plans, and website landing page.",
        includes: ["Virtual Tour", "Floor Plans", "Landing Page"],
        icon: "🏠",
    },
    {
        id: 4,
        name: "PHOTO + 3D TOUR",
        duration: "1 hour 30 minutes",
        description: "3D virtual tour, floor plans, and website landing page. Floor plans include measurements and sq/ft calculations.",
        includes: ["Photography", "Virtual Tour", "Floor Plans", "Landing Page"],
        icon: "📐",
    },
    {
        id: 5,
        name: "PHOTO+VIRTUAL TOUR",
        duration: "—",
        description: "Interior/exterior photography with full virtual tour experience, floor plans, and landing page.",
        includes: ["Photography", "Virtual Tour", "Floor Plans", "Landing Page"],
        icon: "🔄",
    },
    {
        id: 6,
        name: "PHOTO + 3D TOUR + DRONE",
        duration: "2 hours",
        description: "Interior/exterior camera photos, drone photos, and 3D Virtual tour with floor plans.",
        includes: ["Photography", "Virtual Tour", "Floor Plans", "Landing Page", "Drone"],
        icon: "🚁",
    },
    {
        id: 7,
        name: "PHOTO+VIDEO+DRONE",
        duration: "—",
        description: "Interior/exterior photography, professional videography, and aerial drone footage with landing page.",
        includes: ["Photography", "Videography", "Drone", "Landing Page"],
        icon: "✈️",
    },
    {
        id: 8,
        name: "ONE STOP SHOP",
        duration: "2 hours",
        description: "All-in-one package for listing media. Includes: Interior/exterior photos, listing video, virtual tour, floor plans, and website landing page. *SEE ADD ON SERVICES*",
        includes: ["Photography", "Videography", "Virtual Tour", "Floor Plans", "Landing Page"],
        icon: "⭐",
    },
];

const COUNTRY_CODES = [
    { code: "+1", label: "US/CA", flag: "🇺🇸" },
    { code: "+44", label: "UK", flag: "🇬🇧" },
    { code: "+91", label: "IN", flag: "🇮🇳" },
    { code: "+971", label: "AE", flag: "🇦🇪" },
    { code: "+61", label: "AU", flag: "🇦🇺" },
    { code: "+49", label: "DE", flag: "🇩🇪" },
    { code: "+33", label: "FR", flag: "🇫🇷" },
    { code: "+86", label: "CN", flag: "🇨🇳" },
    { code: "+81", label: "JP", flag: "🇯🇵" },
    { code: "+55", label: "BR", flag: "🇧🇷" },
    { code: "+234", label: "NG", flag: "🇳🇬" },
    { code: "+27", label: "ZA", flag: "🇿🇦" },
    { code: "+52", label: "MX", flag: "🇲🇽" },
    { code: "+65", label: "SG", flag: "🇸🇬" },
    { code: "+82", label: "KR", flag: "🇰🇷" },
];

const TIME_SLOTS = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const STEP_LABELS = ["Package", "Date", "Time", "Details", "Property", "Review"];

/* ─── HELPERS ─── */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

/* ═══════════════════════════════════════
   BOOKING PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function BookingPage() {
    const navigate = useNavigate();
    const pageRef = useRef(null);

    const [step, setStep] = useState(1);
    const [selectedPack, setSelectedPack] = useState(null);

    // Calendar state
    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    // Time state
    const [selectedTime, setSelectedTime] = useState(null);

    // Personal details
    const [personalDetails, setPersonalDetails] = useState({
        firstName: "", lastName: "", countryCode: "+1", phone: "", email: ""
    });

    // Property details
    const [propertyDetails, setPropertyDetails] = useState({
        address: "", sqft: "", brokerage: "", lockbox: "No", listingDate: ""
    });

    // Submission state
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [emailResult, setEmailResult] = useState(null);

    // Validation state
    const [errors, setErrors] = useState({});

    // Address autocomplete state
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const addressTimeoutRef = useRef(null);
    const addressWrapperRef = useRef(null);

    // Debounced address search using OpenStreetMap Nominatim (free, no API key)
    const searchAddress = useCallback((query) => {
        if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);

        if (!query || query.length < 3) {
            setAddressSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        addressTimeoutRef.current = setTimeout(async () => {
            setAddressLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `q=${encodeURIComponent(query)}&countrycodes=ca&format=json&addressdetails=1&limit=5`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await res.json();
                setAddressSuggestions(data);
                setShowSuggestions(data.length > 0);
            } catch (err) {
                console.error('Address search failed:', err);
                setAddressSuggestions([]);
            } finally {
                setAddressLoading(false);
            }
        }, 300);
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (addressWrapperRef.current && !addressWrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Validation helpers
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
        return /^\d{10,}$/.test(phone.replace(/\D/g, ""));
    };

    /* Animate step changes */
    useEffect(() => {
        if (pageRef.current) {
            gsap.fromTo(".booking-step-content",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
            );
        }
    }, [step]);

    /* ─── NAVIGATION ─── */
    const goNext = () => setStep(prev => Math.min(prev + 1, 6));
    const goBack = () => setStep(prev => Math.max(prev - 1, 1));

    const canProceed = () => {
        switch (step) {
            case 1: return selectedPack !== null;
            case 2: return selectedDate !== null;
            case 3: return selectedTime !== null;
            case 4:
                const isEmailValid = validateEmail(personalDetails.email);
                const isPhoneValid = validatePhone(personalDetails.phone);
                return personalDetails.firstName && personalDetails.lastName
                    && personalDetails.phone && personalDetails.email
                    && isEmailValid && isPhoneValid;
            case 5: return true; // property details are optional-ish
            case 6: return true;
            default: return false;
        }
    };

    /* ─── SUBMIT ─── */
    const handleConfirm = async () => {
        setSubmitting(true);
        const bookingData = {
            selectedPack,
            selectedDate,
            selectedTime,
            personalDetails,
            propertyDetails,
        };

        try {
            const result = await sendBookingEmails(bookingData);
            setEmailResult(result);
        } catch {
            setEmailResult({ customerSent: false, providerSent: false, errors: ['Email send failed'] });
        }

        setSubmitted(true);
        setSubmitting(false);
    };

    /* ─── CALENDAR HELPERS ─── */
    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
        else setCalMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
        else setCalMonth(m => m + 1);
    };

    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const isDateDisabled = (day) => {
        if (!day) return true;
        const date = new Date(calYear, calMonth, day);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return date < todayStart;
    };

    const isDateSelected = (day) => {
        if (!day || !selectedDate) return false;
        const d = new Date(calYear, calMonth, day);
        return d.toDateString() === new Date(selectedDate).toDateString();
    };

    const handleDateSelect = (day) => {
        if (isDateDisabled(day)) return;
        setSelectedDate(new Date(calYear, calMonth, day).toISOString());
    };

    const formatSelectedDate = () => {
        if (!selectedDate) return "";
        return new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    };

    /* ─── RENDER STEPS ─── */
    const renderStep1 = () => (
        <div className="booking-packs-grid">
            {SERVICE_PACKS.map(pack => (
                <div
                    key={pack.id}
                    className={`pack-card ${selectedPack?.id === pack.id ? "selected" : ""}`}
                    onClick={() => setSelectedPack(pack)}
                >
                    <div className="pack-card-header">
                        <div className="pack-icon">{pack.icon}</div>
                        <div className="pack-info">
                            <h3 className="pack-name">{pack.name}</h3>
                            <span className="pack-duration">{pack.duration}</span>
                        </div>
                    </div>
                    <p className="pack-desc">{pack.description}</p>
                    <div className="pack-includes">
                        {pack.includes.map((item, i) => (
                            <span key={i} className="pack-tag">{item}</span>
                        ))}
                    </div>
                    <button
                        className={`btn ${selectedPack?.id === pack.id ? "btn-primary" : "btn-outline"} pack-book-btn`}
                        onClick={(e) => { e.stopPropagation(); setSelectedPack(pack); goNext(); }}
                    >
                        {selectedPack?.id === pack.id ? "✓ Selected" : "Book"}
                    </button>
                </div>
            ))}
        </div>
    );

    const renderStep2 = () => (
        <div className="booking-calendar">
            <div className="cal-header">
                <button className="cal-nav-btn" onClick={prevMonth}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="cal-title">
                    <span className="cal-month">{MONTHS[calMonth]}</span>
                    <select className="cal-year-select" value={calYear} onChange={e => setCalYear(Number(e.target.value))}>
                        {Array.from({ length: 5 }, (_, i) => today.getFullYear() + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <button className="cal-nav-btn" onClick={nextMonth}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>

            <div className="cal-weekdays">
                {DAYS.map(d => <span key={d} className="cal-weekday">{d}</span>)}
            </div>

            <div className="cal-grid">
                {calendarDays.map((day, i) => (
                    <button
                        key={i}
                        className={`cal-day ${!day ? "empty" : ""} ${isDateDisabled(day) ? "disabled" : ""} ${isDateSelected(day) ? "selected" : ""}`}
                        onClick={() => handleDateSelect(day)}
                        disabled={isDateDisabled(day) || !day}
                    >
                        {day || ""}
                    </button>
                ))}
            </div>

            {selectedDate && (
                <div className="cal-selected-display">
                    <span className="cal-selected-label">Selected:</span>
                    <span className="cal-selected-date">{formatSelectedDate()}</span>
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="booking-time">
            <p className="time-subtitle">Available slots — Morning 10 AM to Evening 5 PM</p>
            <div className="time-slots-grid">
                {TIME_SLOTS.map(time => (
                    <button
                        key={time}
                        className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                        onClick={() => setSelectedTime(time)}
                    >
                        <span className="time-slot-icon">🕐</span>
                        <span className="time-slot-label">{time}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="booking-form">
            <div className="booking-form-row">
                <div className="booking-form-group">
                    <label>First Name *</label>
                    <input
                        type="text" placeholder="John"
                        value={personalDetails.firstName}
                        onChange={e => setPersonalDetails(p => ({ ...p, firstName: e.target.value }))}
                        required
                    />
                </div>
                <div className="booking-form-group">
                    <label>Last Name *</label>
                    <input
                        type="text" placeholder="Doe"
                        value={personalDetails.lastName}
                        onChange={e => setPersonalDetails(p => ({ ...p, lastName: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="booking-form-group">
                <label>Phone Number *</label>
                <div className="phone-input-wrapper">
                    <select
                        className="country-code-select"
                        value={personalDetails.countryCode}
                        onChange={e => setPersonalDetails(p => ({ ...p, countryCode: e.target.value }))}
                    >
                        {COUNTRY_CODES.map(cc => (
                            <option key={cc.code} value={cc.code}>
                                {cc.flag} {cc.code} ({cc.label})
                            </option>
                        ))}
                    </select>
                    <input
                        type="tel" placeholder="(555) 000-0000"
                        value={personalDetails.phone}
                        onChange={e => {
                            const val = e.target.value;
                            setPersonalDetails(p => ({ ...p, phone: val }));
                            if (val && !validatePhone(val)) {
                                setErrors(prev => ({ ...prev, phone: "Please enter a valid phone number (digits only, at least 10)" }));
                            } else {
                                setErrors(prev => ({ ...prev, phone: null }));
                            }
                        }}
                        required
                    />
                </div>
                {errors.phone && <p className="error-text" style={{ color: "#ff4d4d", fontSize: "0.85rem", marginTop: "0.5rem" }}>{errors.phone}</p>}
            </div>

            <div className="booking-form-group">
                <label>Email Address *</label>
                <input
                    type="email" placeholder="john@example.com"
                    value={personalDetails.email}
                    onChange={e => {
                        const val = e.target.value;
                        setPersonalDetails(p => ({ ...p, email: val }));
                        if (val && !validateEmail(val)) {
                            setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
                        } else {
                            setErrors(prev => ({ ...prev, email: null }));
                        }
                    }}
                    required
                />
                {errors.email && <p className="error-text" style={{ color: "#ff4d4d", fontSize: "0.85rem", marginTop: "0.5rem" }}>{errors.email}</p>}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="booking-form">
            <div className="booking-form-group address-autocomplete-wrapper" ref={addressWrapperRef}>
                <label>Property Address</label>
                <div className="address-input-container">
                    <input
                        type="text"
                        placeholder="Start typing a Canadian address..."
                        value={propertyDetails.address}
                        onChange={e => {
                            setPropertyDetails(p => ({ ...p, address: e.target.value }));
                            searchAddress(e.target.value);
                        }}
                        onFocus={() => {
                            if (addressSuggestions.length > 0) setShowSuggestions(true);
                        }}
                        autoComplete="off"
                    />
                    {addressLoading && <span className="address-loading-spinner"></span>}
                </div>
                {showSuggestions && addressSuggestions.length > 0 && (
                    <ul className="address-suggestions">
                        {addressSuggestions.map((item, idx) => (
                            <li
                                key={item.place_id || idx}
                                className="address-suggestion-item"
                                onClick={() => {
                                    setPropertyDetails(p => ({ ...p, address: item.display_name }));
                                    setShowSuggestions(false);
                                    setAddressSuggestions([]);
                                }}
                            >
                                <span className="suggestion-icon">📍</span>
                                <span className="suggestion-text">{item.display_name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="booking-form-row">
                <div className="booking-form-group">
                    <label>Approximate Sq. Ft.</label>
                    <input
                        type="number" placeholder="2500"
                        value={propertyDetails.sqft}
                        onChange={e => setPropertyDetails(p => ({ ...p, sqft: e.target.value }))}
                    />
                </div>
                <div className="booking-form-group">
                    <label>Brokerage</label>
                    <input
                        type="text" placeholder="Keller Williams, RE/MAX..."
                        value={propertyDetails.brokerage}
                        onChange={e => setPropertyDetails(p => ({ ...p, brokerage: e.target.value }))}
                    />
                </div>
            </div>

            <div className="booking-form-row">
                <div className="booking-form-group">
                    <label>Lockbox</label>
                    <div className="lockbox-toggle">
                        <button
                            className={`lockbox-option ${propertyDetails.lockbox === "Yes" ? "active" : ""}`}
                            onClick={() => setPropertyDetails(p => ({ ...p, lockbox: "Yes" }))}
                        >Yes</button>
                        <button
                            className={`lockbox-option ${propertyDetails.lockbox === "No" ? "active" : ""}`}
                            onClick={() => setPropertyDetails(p => ({ ...p, lockbox: "No" }))}
                        >No</button>
                    </div>
                </div>
                <div className="booking-form-group">
                    <label>Expected Listing Date</label>
                    <input
                        type="date"
                        value={propertyDetails.listingDate}
                        onChange={e => setPropertyDetails(p => ({ ...p, listingDate: e.target.value }))}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep6 = () => (
        <div className="booking-review">
            <div className="review-section">
                <h4 className="review-section-title">Package</h4>
                <div className="review-card">
                    <span className="review-icon">{selectedPack?.icon}</span>
                    <div>
                        <strong>{selectedPack?.name}</strong>
                        <span className="review-sub">{selectedPack?.duration}</span>
                    </div>
                </div>
            </div>

            <div className="review-section">
                <h4 className="review-section-title">Appointment</h4>
                <div className="review-row">
                    <span className="review-label">Date</span>
                    <span className="review-value">{formatSelectedDate()}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Time</span>
                    <span className="review-value">{selectedTime}</span>
                </div>
            </div>

            <div className="review-section">
                <h4 className="review-section-title">Contact</h4>
                <div className="review-row">
                    <span className="review-label">Name</span>
                    <span className="review-value">{personalDetails.firstName} {personalDetails.lastName}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Phone</span>
                    <span className="review-value">{personalDetails.countryCode} {personalDetails.phone}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Email</span>
                    <span className="review-value">{personalDetails.email}</span>
                </div>
            </div>

            <div className="review-section">
                <h4 className="review-section-title">Property</h4>
                <div className="review-row">
                    <span className="review-label">Address</span>
                    <span className="review-value">{propertyDetails.address || "—"}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Sq. Ft.</span>
                    <span className="review-value">{propertyDetails.sqft || "—"}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Brokerage</span>
                    <span className="review-value">{propertyDetails.brokerage || "—"}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Lockbox</span>
                    <span className="review-value">{propertyDetails.lockbox}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Listing Date</span>
                    <span className="review-value">{propertyDetails.listingDate || "—"}</span>
                </div>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="booking-success">
            <div className="success-check">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>
                {emailResult?.customerSent
                    ? "A confirmation email with your booking invoice has been sent to your inbox."
                    : "Your booking has been recorded. Please check your email for confirmation."}
            </p>
            <p className="success-sub">
                {emailResult?.providerSent
                    ? "Our team has been notified and will reach out shortly."
                    : "Our team will be in touch soon."}
            </p>
            <div className="success-actions">
                <button className="btn btn-primary" onClick={() => navigate("/")}>
                    Back to Home
                </button>
                <button className="btn btn-outline" onClick={() => {
                    setStep(1); setSelectedPack(null); setSelectedDate(null);
                    setSelectedTime(null); setSubmitted(false); setEmailResult(null);
                    setPersonalDetails({ firstName: "", lastName: "", countryCode: "+1", phone: "", email: "" });
                    setPropertyDetails({ sqft: "", brokerage: "", lockbox: "No", listingDate: "" });
                }}>
                    Book Another
                </button>
            </div>
        </div>
    );

    const stepRenderers = { 1: renderStep1, 2: renderStep2, 3: renderStep3, 4: renderStep4, 5: renderStep5, 6: renderStep6 };
    const stepTitles = {
        1: "Choose Your Package",
        2: "Select a Date",
        3: "Pick a Time",
        4: "Your Details",
        5: "Property Information",
        6: "Review & Confirm"
    };

    return (
        <div ref={pageRef} className="booking-page">
            {/* Background Grain */}
            <div className="booking-bg-grain" />

            {/* Back to home */}
            <button className="booking-back-btn" onClick={() => navigate("/")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
            </button>

            {!submitted ? (
                <div className="booking-container">
                    {/* Step Progress */}
                    <div className="step-progress">
                        {STEP_LABELS.map((label, i) => (
                            <div key={i} className={`step-item ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "completed" : ""}`}>
                                <div className="step-number">
                                    {step > i + 1 ? "✓" : i + 1}
                                </div>
                                <span className="step-label">{label}</span>
                                {i < STEP_LABELS.length - 1 && <div className="step-line" />}
                            </div>
                        ))}
                    </div>

                    {/* Step Header */}
                    <div className="booking-step-header">
                        <span className="tag tag-accent">Step {step} of 6</span>
                        <h1 className="heading-lg">{stepTitles[step]}</h1>
                    </div>

                    {/* How It Works Note */}
                    <div className="how-it-works">
                        <p><strong>How it works:</strong> accurate details help us serve you better. please ensure your contact info is correct for seamless communication.</p>
                    </div>

                    {/* Step Content */}
                    <div className="booking-step-content">
                        {stepRenderers[step]()}
                    </div>

                    {/* Navigation */}
                    <div className="booking-nav">
                        {step > 1 && (
                            <button className="btn btn-outline" onClick={goBack}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                                Back
                            </button>
                        )}
                        <div className="booking-nav-spacer" />
                        {step < 6 ? (
                            <button className="btn btn-primary" onClick={goNext} disabled={!canProceed()}>
                                Continue
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        ) : (
                            <button
                                className={`btn btn-primary ${submitting ? "loading" : ""}`}
                                onClick={handleConfirm}
                                disabled={submitting}
                            >
                                {submitting ? "Sending..." : "Confirm Booking"}
                                {!submitting && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                renderSuccess()
            )}
        </div>
    );
}
