"use client";

import { useEffect, useRef, useState } from "react";
import IntroScreen from "./IntroScreen";

type IntroGateProps = {
  children: React.ReactNode;
};

export default function IntroGate({ children }: IntroGateProps) {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [playMapIntroVoice, setPlayMapIntroVoice] = useState(false);
  const mapIntroVoiceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("pinocho:intro-seen") === "1";
    setShowIntro(!seen);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("intro-lock", showIntro === true);
    return () => {
      document.body.classList.remove("intro-lock");
    };
  }, [showIntro]);

  useEffect(() => {
    if (!(showIntro === false && playMapIntroVoice)) {
      return;
    }

    const audio = mapIntroVoiceRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => {});
    setPlayMapIntroVoice(false);
  }, [showIntro, playMapIntroVoice]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("pinocho:intro-seen", "1");
    setPlayMapIntroVoice(true);
    setShowIntro(false);
  };

  return (
    <>
      {children}
      <audio
        ref={mapIntroVoiceRef}
        src="/Sonidos/voz/Mapa-inicio.mp3"
        preload="auto"
        data-audio-channel="voiceover"
      />
      {showIntro === true && <IntroScreen onComplete={handleIntroComplete} />}
    </>
  );
}
