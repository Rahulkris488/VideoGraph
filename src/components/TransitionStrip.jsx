import React from "react";
import "../styles/transition-strip.css";

export default function TransitionStrip() {
    const text = " SHOWCASE • RECENT WORK • SELECTED PROJECTS • FEATURED • ";
    // repeat text to fill marque
    const repeatedText = text.repeat(10);

    return (
        <div className="transition-strip-section">
            <div className="transition-track">
                <div className="transition-content">
                    <span className="transition-text">{repeatedText}</span>
                    <span className="transition-text">{repeatedText}</span>
                </div>
            </div>
        </div>
    );
}
