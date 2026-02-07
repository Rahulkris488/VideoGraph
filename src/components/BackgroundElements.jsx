import "../styles/bg-elements.css";

export default function BackgroundElements() {
    return (
        <div className="bg-elements">
            {/* Glowing gradient orbs */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
            <div className="glow-orb orb-3"></div>

            {/* Grid overlay */}
            <div className="bg-grid"></div>

            {/* Premiere Pro Canvas */}
            <div className="premiere-canvas">
                <div className="canvas-border"></div>
                <div className="timeline">
                    <div className="track track-1">
                        <div className="clip" style={{ width: "30%", left: "5%" }}></div>
                        <div className="clip" style={{ width: "40%", left: "40%" }}></div>
                    </div>
                    <div className="track track-2">
                        <div className="clip audio" style={{ width: "70%", left: "15%" }}></div>
                    </div>
                    <div className="playhead"></div>
                </div>
            </div>

            {/* Camera Viewfinder */}
            <div className="camera-viewfinder">
                <div className="viewfinder-corner tl"></div>
                <div className="viewfinder-corner tr"></div>
                <div className="viewfinder-corner bl"></div>
                <div className="viewfinder-corner br"></div>
                <div className="viewfinder-crosshair"></div>
                <div className="rec-dot">
                    <span className="dot"></span>
                    <span className="text">REC</span>
                </div>
                <div className="timecode">00:02:34:18</div>
            </div>

            {/* Floating Cursors */}
            <div className="floating-cursor cursor-1">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4l16 7-7 2-2 7z" />
                </svg>
            </div>
            <div className="floating-cursor cursor-2">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4l16 7-7 2-2 7z" />
                </svg>
            </div>
            <div className="floating-cursor cursor-3">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4l16 7-7 2-2 7z" />
                </svg>
            </div>

            {/* Film grain */}
            <div className="film-grain"></div>
        </div>
    );
}
