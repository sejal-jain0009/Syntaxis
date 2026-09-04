"use client";

import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import Navbar from "../components/Navbar";
import TransitionModal from "../components/TransitionModal";

/* ---------- helpers (visual only) ---------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(pointer: fine)").matches;

/* Magnetic wrapper — nudges its child toward the cursor. Purely presentational;
   it forwards all props/handlers/href untouched. */
function Magnetic({ children, strength = 0.4, className = "" }) {
  const ref = useRef(null);

  function handleMove(e) {
    if (!finePointer() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  }

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transition: "transform 250ms cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      {children}
    </span>
  );
}

/* Splits a string into per-word spans that reveal with a stagger. */
function RevealWords({ text, startDelay = 0 }) {
  return text.split(" ").map((word, i) => (
    <span
      key={`${word}-${i}`}
      className="reveal-word"
      style={{ animationDelay: `${startDelay + i * 0.08}s` }}
    >
      {word}
      {"\u00A0"}
    </span>
  ));
}

function LandingPage({ onNavigate }) {
  const [showTransition, setShowTransition] = useState(false);
  const [outputValue, setOutputValue] = useState(0);
  const pageRef = useRef(null);
  const editorRef = useRef(null);
  const editorStageRef = useRef(null);

  /* ----- functionality (UNCHANGED) ----- */
  function openPlayground(event) {
    event.preventDefault();
    setShowTransition(true);
  }

  function navigateTo(event, path) {
    event.preventDefault();
    onNavigate(path);
  }

  /* ----- cursor-following spotlight on the whole page ----- */
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = pageRef.current;
        if (!el) return;
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ----- scroll progress rail + scroll-driven parallax depth ----- */
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        el.style.setProperty("--scroll", p.toFixed(4));
        if (!reduce) el.style.setProperty("--sy", `${window.scrollY}`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ----- 3D tilt + glare on the editor preview ----- */
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const stage = editorStageRef.current;
    const card = editorRef.current;
    if (!stage || !card) return;

    const onMove = (e) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty("--ry", `${(px - 0.5) * -14}deg`);
      card.style.setProperty("--rx", `${(py - 0.5) * 12 + 3}deg`);
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    };
    const onLeave = () => {
      card.style.setProperty("--ry", "-6deg");
      card.style.setProperty("--rx", "3deg");
    };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ----- scroll-triggered reveals ----- */
  useEffect(() => {
    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ----- editor "runs": type-in lines, then count the output up to 10 ----- */
  useEffect(() => {
    const card = editorRef.current;
    if (!card) return;

    const run = () => {
      card.classList.add("typed");
      if (prefersReducedMotion()) {
        setOutputValue(10);
        return;
      }
      const start = performance.now();
      const delay = 1500; // after the line-in stagger
      let raf = 0;
      const tick = (now) => {
        const t = Math.min(1, Math.max(0, (now - start - delay) / 700));
        setOutputValue(Math.round(t * 10));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    if (!("IntersectionObserver" in window)) return run();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(card);
    return () => io.disconnect();
  }, []);

  /* ----- pointer spotlight coords inside bento / roadmap cards ----- */
  function trackCard(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--cx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--cy", `${e.clientY - rect.top}px`);
  }

  return (
    <div className="landing-page" ref={pageRef}>
      <span className="scroll-rail" aria-hidden="true" />
      <span className="aurora" aria-hidden="true" />
      <span className="grain" aria-hidden="true" />
      <Navbar />

      <main className="page-content" id="home">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">THE MODERN CODING PLAYGROUND</p>
            <h1>
              <RevealWords text="Where syntax meets" />
              <span className="accent-word reveal-word" style={{ animationDelay: "0.24s" }}>
                logic.
              </span>
            </h1>
            <p className="hero-text">
              Syntaxis is a focused workspace to write, run and save code — built for developers who
              want to learn, build and improve.
            </p>

            <div className="hero-actions">
              <Magnetic strength={0.35}>
                <a href="/playground" className="cta-button cta-primary" onClick={openPlayground}>
                  Start Coding
                  <span className="cta-arrow" aria-hidden="true">→</span>
                </a>
              </Magnetic>
              <a href="#features" className="cta-button cta-secondary">
                Explore Features
              </a>
            </div>
          </div>

          <div className="editor-stage" ref={editorStageRef}>
            <div className="editor-preview" ref={editorRef} aria-label="Code editor preview">
              <span className="editor-glare" aria-hidden="true" />
              <div className="editor-header">
                <div className="traffic-lights">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span className="editor-tab">main.py</span>
              </div>

              <div className="editor-body">
                <div className="code-lines">
                  <span className="line line-number">01</span>
                  <span className="line code-keyword">def</span>
                  <span className="line code-name">solve</span>
                  <span className="line code-symbol">():</span>
                </div>
                <div className="code-lines">
                  <span className="line line-number">02</span>
                  <span className="line code-value">nums</span>
                  <span className="line code-symbol">=</span>
                  <span className="line code-value">[1, 2, 3, 4]</span>
                </div>
                <div className="code-lines">
                  <span className="line line-number">03</span>
                  <span className="line code-keyword">return</span>
                  <span className="line code-value">sum</span>
                  <span className="line code-symbol">(</span>
                  <span className="line code-value">nums</span>
                  <span className="line code-symbol">)</span>
                </div>
                <div className="code-lines">
                  <span className="line line-number">04</span>
                  <span className="line code-keyword">print</span>
                  <span className="line code-symbol">(</span>
                  <span className="line code-name">solve</span>
                  <span className="line code-symbol">())</span>
                </div>
              </div>

              <div className="output-panel">
                <div className="output-header">Output</div>
                <div className="output-text">{outputValue}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section why-section">
          <div className="section-heading narrow-heading" data-reveal>
            <p className="section-kicker">Why Syntaxis</p>
            <h2>Everything you need to code with focus.</h2>
            <p>
              Syntaxis keeps coding simple, structured and distraction-free so you can stay in the
              flow.
            </p>
          </div>

          <div className="feature-grid feature-grid-four">
            {[
              { label: "Write", copy: "A clean editor designed for focused coding." },
              { label: "Run", copy: "Execute your code and see results instantly." },
              { label: "Save", copy: "Keep useful solutions and snippets organized." },
              { label: "Improve", copy: "Practice, review and improve your problem-solving." },
            ].map((item, i) => (
              <article
                key={item.label}
                className="feature-card"
                data-reveal
                style={{ "--reveal-delay": `${i * 70}ms` }}
                onMouseMove={trackCard}
              >
                <span className="card-index">{`0${i + 1}`}</span>
                <span className="card-label">{item.label}</span>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section languages-section">
          <div className="section-heading centered-heading" data-reveal>
            <p className="section-kicker">Languages</p>
            <h2>Code in your favorite language.</h2>
            <p>Switch between languages and practice in one place.</p>
          </div>

          <div className="language-pills" aria-label="Supported languages" data-reveal>
            <span>Java</span>
            <span>Python</span>
            <span>C++</span>
            <span>JavaScript</span>
            <span>C</span>
          </div>
        </section>

        <section className="content-section steps-section" id="how-it-works">
          <div className="section-heading centered-heading" data-reveal>
            <p className="section-kicker">How it works</p>
            <h2>From code to solution in three steps.</h2>
          </div>

          <div className="steps-grid">
            {[
              { n: "01", h: "Write", p: "Write your solution in a focused coding environment." },
              { n: "02", h: "Run", p: "Execute your code and instantly see the result." },
              { n: "03", h: "Improve", p: "Review your solution and keep getting better." },
            ].map((s, i) => (
              <article
                key={s.n}
                className="step-item"
                data-reveal
                style={{ "--reveal-delay": `${i * 100}ms` }}
              >
                <span className="step-number">{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section features-section" id="features">
          <div className="section-heading" data-reveal>
            <p className="section-kicker">Features</p>
            <h2>Built for your coding journey.</h2>
          </div>

          <div className="feature-grid feature-grid-two">
            {[
              { h: "Multi-language Playground", p: "Practice and experiment with multiple programming languages." },
              { h: "Code Snippets", p: "Save solutions and useful pieces of code for later." },
              { h: "Execution History", p: "Keep track of your previous coding attempts." },
              { h: "Personal Dashboard", p: "Manage your coding activity from one place." },
            ].map((f, i) => (
              <article
                key={f.h}
                className="feature-block"
                data-reveal
                style={{ "--reveal-delay": `${i * 70}ms` }}
              >
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section coming-section">
          <div className="section-heading narrow-heading" data-reveal>
            <p className="section-kicker">Coming soon</p>
            <h2>More is coming.</h2>
            <p>
              Syntaxis will continue to grow with features designed to make learning and
              problem-solving smarter.
            </p>
          </div>

          <div className="coming-grid">
            {[
              "AI Code Assistant",
              "Smart Code Analysis",
              "DSA Practice",
            ].map((label, i) => (
              <div
                key={label}
                className="coming-item"
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` }}
                onMouseMove={trackCard}
              >
                <span>{label}</span>
                <small>Coming Soon</small>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-box" data-reveal>
            <h2>Ready to start coding?</h2>
            <p>Build, experiment and improve your solutions with Syntaxis.</p>
            <Magnetic strength={0.3}>
              <a href="/playground" className="cta-button cta-primary" onClick={openPlayground}>
                Start Coding
                <span className="cta-arrow" aria-hidden="true">→</span>
              </a>
            </Magnetic>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand-block">
          <a className="brand footer-brand" href="#home">
            <span className="brand-mark">S</span>
            <span className="brand-name">syntaxis</span>
          </a>
          <p>Where syntax meets logic.</p>
          <p className="footer-description">
            A modern coding workspace for learning, building, experimenting, and turning logic into
            working code.
          </p>
        </div>

        <div className="footer-link-group">
          <strong>Navigation</strong>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="footer-link-group">
          <strong>Product</strong>
          <a href="/playground" onClick={openPlayground}>
            Playground
          </a>
          <a href="/login" onClick={(event) => navigateTo(event, "/login")}>
            Log In
          </a>
          <a href="/signup" onClick={(event) => navigateTo(event, "/signup")}>
            Sign Up
          </a>
        </div>

        <p className="copyright">© 2026 Syntaxis. Built for developers.</p>
      </footer>

      <TransitionModal
        open={showTransition}
        title="Opening Playground"
        message="Get ready to turn your logic into code."
        actionLabel="Opening Workspace"
        onComplete={() => onNavigate("/playground")}
      />
    </div>
  );
}

export default LandingPage;
