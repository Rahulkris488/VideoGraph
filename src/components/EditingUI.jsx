import { useEffect, useRef } from "react";
import { gsap } from "../core/gsap";
import "../styles/editing-ui.css";

export function TimelineBar() {
    const progressRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(progressRef.current, {
                width: "75%",
                duration: 8,
                repeat: -1,
                ease: "none"
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="editing-panel timeline-bar">
            <div className="panel-header">
                <span className="panel-dot"></span>
                <span className="panel-title">Timeline</span>
                <span className="panel-time">00:02:34:12</span>
            </div>
            <div className="timeline-tracks">
                <div className="track">
                    <span className="track-label">V1</span>
                    <div className="track-clips">
                        <div className="clip clip-video" style={{ width: "30%", left: "5%" }}></div>
                        <div className="clip clip-video" style={{ width: "45%", left: "40%" }}></div>
                    </div>
                </div>
                <div className="track">
                    <span className="track-label">V2</span>
                    <div className="track-clips">
                        <div className="clip clip-overlay" style={{ width: "20%", left: "15%" }}></div>
                    </div>
                </div>
                <div className="track">
                    <span className="track-label">A1</span>
                    <div className="track-clips">
                        <div className="clip clip-audio" style={{ width: "80%", left: "10%" }}>
                            <div className="waveform"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="playhead">
                <div ref={progressRef} className="playhead-line"></div>
            </div>
        </div>
    );
}

export function ColorGradePanel() {
    return (
        <div className="editing-panel color-panel">
            <div className="panel-header">
                <span className="panel-dot"></span>
                <span className="panel-title">Color</span>
            </div>
            <div className="color-wheels">
                <div className="wheel">
                    <div className="wheel-ring"></div>
                    <span className="wheel-label">Lift</span>
                </div>
                <div className="wheel">
                    <div className="wheel-ring"></div>
                    <span className="wheel-label">Gamma</span>
                </div>
                <div className="wheel">
                    <div className="wheel-ring"></div>
                    <span className="wheel-label">Gain</span>
                </div>
            </div>
            <div className="color-curves">
                <svg viewBox="0 0 100 60" className="curve-svg">
                    <path d="M 0 60 Q 30 50, 50 30 T 100 0" fill="none" stroke="#AEFF00" strokeWidth="1.5" />
                    <circle cx="30" cy="45" r="3" fill="#AEFF00" />
                    <circle cx="70" cy="15" r="3" fill="#AEFF00" />
                </svg>
            </div>
        </div>
    );
}

export function FrameCounter({ position = "top-right" }) {
    return (
        <div className={`frame-counter ${position}`}>
            <span className="frame-label">TC</span>
            <span className="frame-numbers">01:24:33:18</span>
        </div>
    );
}

export function ScopePanel() {
    return (
        <div className="editing-panel scope-panel">
            <div className="panel-header">
                <span className="panel-dot"></span>
                <span className="panel-title">Scopes</span>
            </div>
            <div className="scope-display">
                <div className="scope-waveform">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="scope-bar"
                            style={{
                                height: `${Math.random() * 60 + 20}%`,
                                opacity: 0.4 + Math.random() * 0.6
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PreviewWindow({ label = "Preview", isPlaying = false }) {
    return (
        <div className="editing-panel preview-window">
            <div className="panel-header">
                <span className="panel-dot"></span>
                <span className="panel-title">{label}</span>
                <div className="preview-controls">
                    <button className="preview-btn">{isPlaying ? "⏸" : "▶"}</button>
                </div>
            </div>
            <div className="preview-content">
                <div className="preview-placeholder">
                    <span className="placeholder-icon">🎬</span>
                </div>
                <div className="preview-overlay">
                    <div className="safe-area"></div>
                </div>
            </div>
            <div className="preview-info">
                <span>4K UHD</span>
                <span>23.976 fps</span>
                <span>ProRes 422 HQ</span>
            </div>
        </div>
    );
}

export function MediaBin() {
    const items = ["Clip_001.mov", "Clip_002.mov", "Audio_Mix.wav", "LUT_Cinematic.cube", "Titles.mogrt"];

    return (
        <div className="editing-panel media-bin">
            <div className="panel-header">
                <span className="panel-dot"></span>
                <span className="panel-title">Media</span>
                <span className="panel-count">{items.length}</span>
            </div>
            <div className="media-list">
                {items.map((item, i) => (
                    <div key={i} className="media-item">
                        <span className="media-icon">📁</span>
                        <span className="media-name">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function RenderProgress() {
    return (
        <div className="editing-panel render-progress">
            <div className="panel-header">
                <span className="panel-dot pulse"></span>
                <span className="panel-title">Rendering</span>
                <span className="render-percent">67%</span>
            </div>
            <div className="render-bar">
                <div className="render-fill" style={{ width: "67%" }}></div>
            </div>
            <div className="render-info">
                <span>Frame 1,892 / 2,820</span>
                <span>ETA: 4:32</span>
            </div>
        </div>
    );
}
