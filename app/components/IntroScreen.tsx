"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container } from "@tsparticles/engine";
import styles from "./IntroScreen.module.css";
import { burst, destroyChips } from "./Woodchips";

type IntroScreenProps = { onComplete: () => void };
type LetterAsset = { src: string; alt: string; isLast?: boolean };

const LETTERS: LetterAsset[] = [
  { src: "/intro/Group P.svg",  alt: "P" },
  { src: "/intro/Group i.svg",  alt: "I" },
  { src: "/intro/Group N.svg",  alt: "N" },
  { src: "/intro/Group O.svg",  alt: "O" },
  { src: "/intro/Group C.svg",  alt: "C" },
  { src: "/intro/Group H.svg",  alt: "H" },
  { src: "/intro/Groupo O.svg", alt: "O final", isLast: true },
];

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const overlayRef         = useRef<HTMLDivElement | null>(null);
  const titleRef           = useRef<HTMLDivElement | null>(null);
  const letterRefs         = useRef<Array<HTMLDivElement | null>>([]);
  const audioContextRef    = useRef<AudioContext | null>(null);
  const letterHitSoundsRef = useRef<HTMLAudioElement[]>([]);
  const letterHitCursorRef = useRef(0);
  const particlesRef       = useRef<Container | null>(null);
  const [particlesReady, setParticlesReady] = useState(false);
  const [audioUnlocked, setAudioUnlocked]   = useState(false);

  // ── Tras montar, dejamos que cada <img> cargue su SVG y
  //    usamos naturalWidth/naturalHeight para calcular el ancho real de celda
  useEffect(() => {
    const imgs = letterRefs.current
      .filter(Boolean)
      .map((el) => el!.querySelector<HTMLImageElement>(`.${styles.letterGroove}`));

    const applyRatios = () => {
      const titleEl = titleRef.current;
      if (!titleEl) return;
      const cellH = titleEl.getBoundingClientRect().height ||
                    (typeof window !== "undefined" ? window.innerHeight * 0.12 : 100);

      imgs.forEach((img, i) => {
        const el = letterRefs.current[i];
        if (!img || !el) return;
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (w && h) {
          el.style.width = `${Math.round(cellH * (w / h))}px`;
        }
      });
    };

    // Esperar a que todas las imágenes carguen
    let loaded = 0;
    imgs.forEach((img) => {
      if (!img) return;
      if (img.complete && img.naturalWidth) {
        loaded++;
        if (loaded === imgs.length) applyRatios();
      } else {
        img.addEventListener("load", () => {
          loaded++;
          if (loaded === imgs.length) applyRatios();
        }, { once: true });
      }
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    void initParticlesEngine(async (e) => { await loadSlim(e); })
      .then(() => { if (mounted) setParticlesReady(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const soundNames = ["hit1.mp3", "hit2.mp3", "hit3.mp3", "hit4.mp3"];
    letterHitSoundsRef.current = soundNames.map((name) => {
      const a = new Audio(`/intro/sonidos/${name}`);
      a.preload = "auto"; a.volume = 0.85; return a;
    });
    return () => {
      letterHitSoundsRef.current.forEach((a) => a.pause());
      letterHitSoundsRef.current = []; letterHitCursorRef.current = 0;
    };
  }, []);

  useEffect(() => {
    if (getAudioContext(audioContextRef)?.state === "running") setAudioUnlocked(true);
  }, []);

  const particleOptions = useMemo(() => ({
    fullScreen: { enable: false }, fpsLimit: 60, detectRetina: true,
    interactivity: { events: { resize: { delay: 0.5 } } },
    particles: {
      number: { value: 0 },
      color: { value: ["#caa47a", "#b98956", "#f0e5d3"] },
      shape: { type: ["square", "triangle"] },
      opacity: { value: { min: 0.25, max: 0.75 } },
      size:    { value: { min: 1, max: 3 } },
      move: { enable: true, speed: { min: 0.5, max: 1.4 },
        direction: "top" as const, outModes: { default: "destroy" as const } },
    },
    background: { color: "transparent" },
  }), []);

  useEffect(() => {
    if (!audioUnlocked) return;
    const overlay = overlayRef.current; const title = titleRef.current;
    if (!overlay || !title) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { onComplete(); return; }

    const letters = letterRefs.current.filter(Boolean) as HTMLDivElement[];
    const grooves = letters.map((n) => n.querySelector(`.${styles.letterGroove}`));

    gsap.set(overlay, { opacity: 1, pointerEvents: "all" });
    gsap.set(title,   { opacity: 1, scale: 1, filter: "none" });
    gsap.set(letters, { opacity: 1, x: 0, y: 0 });
    gsap.set(grooves, { opacity: 0.2, clipPath: "inset(0 100% 0 0)" });
    gsap.set(letters.map((n) => n.querySelector(`.${styles.letterFill}`)),
             { clipPath: "inset(0 100% 0 0)", opacity: 0 });
    gsap.set(letters.map((n) => n.querySelector(`.${styles.chisel}`)),
             { opacity: 0, xPercent: -120 });
    gsap.set(letters.map((n) => n.querySelector(`.${styles.carveScratch}`)),
             { opacity: 0, xPercent: -120 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete });
    tl.add(() => playWoodBed(audioContextRef), 0.0);

    letters.forEach((el, i) => {
      const t      = 0.62 + i * 0.49;
      const groove = el.querySelector(`.${styles.letterGroove}`) as HTMLElement | null;
      const fill   = el.querySelector(`.${styles.letterFill}`)   as HTMLElement | null;
      const chisel = el.querySelector(`.${styles.chisel}`)       as HTMLElement | null;
      const scratch = el.querySelector(`.${styles.carveScratch}`) as HTMLElement | null;

      tl.to(el, { x: 1, y: 1, duration: 0.02 }, t + 0.01)
        .to(el, { x:-1, y:-1, duration: 0.02 }, t + 0.03)
        .to(el, { x: 0, y: 0, duration: 0.02 }, t + 0.05)
        .to(chisel, { opacity: 0.92, xPercent: 165, duration: 0.24, ease: "none" }, t + 0.01)
        .to(scratch, { opacity: 0.88, xPercent: 160, duration: 0.24, ease: "steps(10)" }, t + 0.02)
        .to(groove, { opacity: 0.96, clipPath: "inset(0 0% 0 0)", duration: 0.24, ease: "steps(12)" }, t + 0.02)
        .add(() => {
          playLetterHitSound(letterHitSoundsRef, letterHitCursorRef, audioContextRef);
          fireChipsForLetter(el, i, "groove");
        }, t + 0.09)
        .to(chisel, { xPercent: 188, duration: 0.2, ease: "none" }, t + 0.26)
        .to(scratch, { opacity: 0.52, xPercent: 188, duration: 0.2, ease: "steps(10)" }, t + 0.26)
        .to(fill,   { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.26, ease: "steps(14)" }, t + 0.3)
        .to(chisel, { opacity: 0, duration: 0.06 }, t + 0.48)
        .to(scratch, { opacity: 0, duration: 0.07 }, t + 0.49)
        .to(groove, { opacity: 0.66, duration: 0.12, ease: "power1.out" }, t + 0.47)
        .add(() => {
          fireChipsForLetter(el, i, "fill");
        }, t + 0.34);
    });

    tl.add(() => {
      playSpark(audioContextRef);
      const last = letters[letters.length - 1];
      if (last) fireChipsForLetter(last, 6, "fill");
    }, 3.78);

    tl.to(title, {
      filter: "drop-shadow(0 0 16px rgba(255,220,150,0.72)) drop-shadow(0 0 30px rgba(255,180,90,0.34))",
      duration: 1.9,
    }, 4.3);

    tl.to(title, { scale: 1.055, duration: 0.42, ease: "sine.out"   }, 7.2)
      .to(title, { scale: 1.0,   duration: 0.62, ease: "sine.inOut" }, 7.62)
      .add(() => {
        const last = letters[letters.length - 1];
        if (last) {
          const r = last.getBoundingClientRect();
          overlay.style.setProperty("--reveal-x", `${((r.left + r.width * 0.7) / window.innerWidth) * 100}%`);
          overlay.style.setProperty("--reveal-y", `${((r.top + r.height * 0.48) / window.innerHeight) * 100}%`);
        }
        overlay.classList.add(styles.masked);
        overlay.style.setProperty("--reveal-size", "0px");
      }, 7.38)
      .to(
        overlay,
        { "--reveal-size": "190vmax", opacity: 0.9, duration: 1.55, ease: "sine.inOut" },
        7.44
      )
      .add(() => playWhoosh(audioContextRef), 7.52);

    tl.to(title, { opacity: 0, duration: 1.0, ease: "sine.out" }, 8.35)
      .to(overlay, { opacity: 0, duration: 0.95, ease: "sine.out" }, 8.62)
      .set(overlay, { pointerEvents: "none" }, 9.62);

    return () => { tl.kill(); destroyChips(); };
  }, [audioUnlocked, onComplete]);

  const unlockAudio = () => {
    const ctx = getAudioContext(audioContextRef);
    if (!ctx) { setAudioUnlocked(true); return; }
    void ctx.resume().finally(() => setAudioUnlocked(true));
  };

  return (
    <div className={styles.introRoot} aria-hidden="true">
      {!audioUnlocked && (
        <button type="button" className={styles.audioUnlock} onClick={unlockAudio}>
          <span>Toca para iniciar</span>
          <span className={styles.audioUnlockHint}>
            Recuarda pulsar en ciertas partes de las escenas o mover el puntero del ratón sobre todo
            <br />
            encima de Pepito Grillo para descubrir efectos y sonidos escondidos en esta maravillosa historia
          </span>
        </button>
      )}
      <div ref={overlayRef} className={styles.introOverlay}>
        {particlesReady && (
          <Particles
            id="intro-particles"
            className={styles.particlesLayer}
            options={particleOptions}
            particlesLoaded={async (c) => { particlesRef.current = c ?? null; }}
          />
        )}
        <div ref={titleRef} className={styles.titleRow}>
          {LETTERS.map((letter, index) => (
            <div
              key={letter.src}
              ref={(el) => { letterRefs.current[index] = el; }}
              className={styles.letter}
            >
              <img className={styles.letterGroove} src={letter.src} alt={letter.alt} draggable={false} />
              <div className={styles.letterFillWrap}>
                <span className={styles.chisel} />
                <span className={styles.carveScratch} />
                <img className={styles.letterFill} src={letter.src} alt={letter.alt} draggable={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Lanza virutas desde la posición correcta de cada letra.
 * Solo P(0), N(2), C(4), O-final(6) generan virutas.
 * Coordenadas calculadas en runtime desde el BoundingClientRect de la letra.
 */
function fireChipsForLetter(el: HTMLDivElement, index: number, phase: "groove" | "fill") {
  const r = el.getBoundingClientRect();
  const anchors: Array<{ x: number; y: number }> = [
    { x: 0.48, y: 0.7 },  // P
    { x: 0.5, y: 0.72 },  // I
    { x: 0.5, y: 0.71 },  // N
    { x: 0.5, y: 0.72 },  // O
    { x: 0.54, y: 0.71 }, // C
    { x: 0.5, y: 0.7 },   // H
    { x: 0.54, y: 0.74 }, // O final
  ];
  const anchor = anchors[index] ?? { x: 0.5, y: 0.72 };
  const sx = r.left + r.width * anchor.x;
  const sy = r.top + r.height * anchor.y;
  const isLast = index === 6;

  if (phase === "groove") {
    burst(
      sx,
      sy,
      345,
      88,
      isLast ? 16 : 11,
      [2.7, 6.4],
      [2.8, 7.8],
      0.52
    );
    return;
  }

  burst(
    sx,
    sy,
    18,
    118,
    isLast ? 24 : 14,
    [2.9, 6.8],
    [3.1, 8.6],
    0.62
  );
}

function getAudioContext(ref: React.MutableRefObject<AudioContext | null>) {
  const Ctx = window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!ref.current) ref.current = new Ctx();
  if (ref.current.state === "suspended") void ref.current.resume();
  return ref.current;
}
function playWoodBed(ref: React.MutableRefObject<AudioContext | null>) {
  try {
    const ctx = getAudioContext(ref); if (!ctx) return;
    const now = ctx.currentTime, osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(68, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.55);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.02, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc.connect(g); g.connect(ctx.destination); osc.start(now); osc.stop(now + 0.62);
  } catch { /**/ }
}
function playTac(ref: React.MutableRefObject<AudioContext | null>, isLast: boolean) {
  try {
    const ctx = getAudioContext(ref); if (!ctx) return;
    const now = ctx.currentTime, noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.sin(i * 0.23) + Math.sin(i * 0.47)) * 0.22;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = isLast ? 840 : 1180; f.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(isLast ? 0.19 : 0.14, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (isLast ? 0.11 : 0.08));
    noise.buffer = buf; noise.connect(f); f.connect(g); g.connect(ctx.destination);
    noise.start(now); noise.stop(now + 0.12);
  } catch { /**/ }
}
function playLetterHitSound(
  pool: React.MutableRefObject<HTMLAudioElement[]>,
  cur:  React.MutableRefObject<number>,
  ctx:  React.MutableRefObject<AudioContext | null>
) {
  const p = pool.current;
  if (!p.length) { playTac(ctx, false); return; }
  const a = p[cur.current % p.length]; cur.current++;
  a.currentTime = 0; void a.play().catch(() => playTac(ctx, false));
}
function playSpark(ref: React.MutableRefObject<AudioContext | null>) {
  try {
    const ctx = getAudioContext(ref); if (!ctx) return;
    const now = ctx.currentTime, osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(620, now); osc.frequency.exponentialRampToValueAtTime(270, now + 0.34);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.09, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
    osc.connect(g); g.connect(ctx.destination); osc.start(now); osc.stop(now + 0.5);
  } catch { /**/ }
}
function playWhoosh(ref: React.MutableRefObject<AudioContext | null>) {
  try {
    const ctx = getAudioContext(ref); if (!ctx) return;
    const now = ctx.currentTime, noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 1.05, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.sin(i * 0.008) + Math.sin(i * 0.017)) * 0.33;
    const f = ctx.createBiquadFilter(); f.type = "lowpass";
    f.frequency.setValueAtTime(2200, now); f.frequency.exponentialRampToValueAtTime(350, now + 1.02);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.065, now + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.02);
    noise.buffer = buf; noise.connect(f); f.connect(g); g.connect(ctx.destination);
    noise.start(now); noise.stop(now + 1.05);
  } catch { /**/ }
}
