"use client";

import { useEffect } from "react";

function TransitionModal({ open, title, message, actionLabel, onComplete }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onComplete && onComplete();
    }, 1600);
    return () => clearTimeout(timer);
  }, [open, onComplete]);

  if (!open) return null;

  return (
    <div className="transition-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="transition-card">
        <div className="transition-spinner" aria-hidden="true" />
        <h3>{title}</h3>
        <p>{message}</p>
        <span className="transition-action">{actionLabel}</span>
      </div>

      <style>{`
        .transition-modal {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          background: rgba(6, 8, 11, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: tmFade 0.3s ease both;
        }
        .transition-card {
          position: relative;
          width: min(360px, calc(100% - 40px));
          padding: 2.4rem 2rem;
          text-align: center;
          border: 1px solid var(--line-strong, rgba(233,240,250,0.17));
          border-radius: 22px;
          background: var(--bg-elev, #0d1015);
          box-shadow: 0 40px 90px -40px rgba(0,0,0,0.9);
          animation: tmRise 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .transition-spinner {
          width: 44px;
          height: 44px;
          margin: 0 auto 1.3rem;
          border-radius: 50%;
          border: 3px solid rgba(46,230,197,0.18);
          border-top-color: var(--teal, #2ee6c5);
          animation: tmSpin 0.8s linear infinite;
        }
        .transition-card h3 {
          margin: 0 0 0.5rem;
          font-family: var(--font-display, "Space Grotesk", sans-serif);
          font-size: 1.3rem;
          color: var(--text, #eef2f7);
        }
        .transition-card p {
          margin: 0 0 1.3rem;
          color: var(--text-soft, #a6b0bf);
          line-height: 1.6;
        }
        .transition-action {
          display: inline-block;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          background: rgba(46,230,197,0.1);
          border: 1px solid rgba(46,230,197,0.24);
          color: var(--teal, #2ee6c5);
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        @keyframes tmFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tmRise { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes tmSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .transition-spinner { animation-duration: 0.001ms; }
        }
      `}</style>
    </div>
  );
}

export default TransitionModal;
