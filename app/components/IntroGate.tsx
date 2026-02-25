"use client";

import { useEffect, useState } from "react";
import IntroScreen from "./IntroScreen";

type IntroGateProps = {
  children: React.ReactNode;
};

export default function IntroGate({ children }: IntroGateProps) {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

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

  const handleIntroComplete = () => {
    sessionStorage.setItem("pinocho:intro-seen", "1");
    setShowIntro(false);
  };

  return (
    <>
      {children}
      {showIntro === true && <IntroScreen onComplete={handleIntroComplete} />}
    </>
  );
}
