"use client";

import { useEffect } from "react";

export default function VoiceOverArbiter() {
  useEffect(() => {
    let settleTimer: number | null = null;
    let candidate: HTMLAudioElement | null = null;

    const OVERLAY_SELECTORS = [
      ".geppettoOverlay",
      ".villageOverlay",
      ".circusOverlay",
      ".forestOverlay",
      ".islandOverlay",
      ".section7Overlay",
      ".section8Overlay",
      ".section9Overlay",
    ] as const;

    const getSceneNumberFromAudio = (audio: HTMLAudioElement) => {
      const rawSrc = audio.currentSrc || audio.src;
      if (!rawSrc) return null;
      try {
        const pathname = new URL(rawSrc, window.location.origin).pathname;
        const match = pathname.match(/Escena(\d+)\.mp3$/i);
        if (!match) return null;
        return Number(match[1]);
      } catch {
        return null;
      }
    };

    const getPreferredAudioForCurrentScene = () => {
      const activeOverlay = OVERLAY_SELECTORS
        .map((selector) => document.querySelector(selector) as HTMLElement | null)
        .find((node) => node?.classList.contains("is-active"));

      if (!activeOverlay) return null;

      const photos = Array.from(activeOverlay.querySelectorAll<HTMLElement>(".scenePhoto"));
      if (photos.length === 0) return null;
      const activeIndex = photos.findIndex((photo) => photo.classList.contains("is-active"));
      if (activeIndex < 0) return null;

      const expectedSceneNumber = activeIndex + 1;
      const overlayVoices = Array.from(
        activeOverlay.querySelectorAll<HTMLAudioElement>("audio[data-audio-channel='voiceover']")
      );
      return (
        overlayVoices.find(
          (audio) => getSceneNumberFromAudio(audio) === expectedSceneNumber
        ) ?? null
      );
    };

    const settleSingleVoice = () => {
      const current = getPreferredAudioForCurrentScene() ?? candidate;
      if (!current) return;

      const voiceAudios = document.querySelectorAll<HTMLAudioElement>(
        "audio[data-audio-channel='voiceover']"
      );

      voiceAudios.forEach((audio) => {
        if (audio === current) return;
        audio.pause();
        audio.currentTime = 0;
      });

      if (current.paused) {
        void current.play().catch(() => {});
      }
    };

    const handlePlay = (event: Event) => {
      const current = event.target;
      if (!(current instanceof HTMLAudioElement)) return;
      if (current.dataset.audioChannel !== "voiceover") return;
      candidate = current;

      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
      settleTimer = window.setTimeout(() => {
        settleSingleVoice();
        settleTimer = null;
      }, 90);
    };

    document.addEventListener("play", handlePlay, true);
    return () => {
      document.removeEventListener("play", handlePlay, true);
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
    };
  }, []);

  return null;
}
