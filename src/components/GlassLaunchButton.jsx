"use client";
import './glassbutton.css'

export default function GlassLaunchButton({ text, link, className = "" }) {
    return (
        <div className={`button-wrap-glasslaunch cursor-pointer ${className}`}>
            <button
                type="button"
                onClick={() => window.open(link, '_blank')}
                className={`glasslaunch-btn`}
            >
                <span className="text-white font-bold">{text}</span>
            </button>
            <div className="button-shadow-glasslaunch"></div>
        </div>
    );
}
