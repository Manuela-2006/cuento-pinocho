"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisProvider() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // 🔗 Conectar Lenis con ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 🎯 Usar gsap.ticker para sincronizar
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 🔧 Desactivar lag smoothing (importante para Lenis)
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return null;
}
