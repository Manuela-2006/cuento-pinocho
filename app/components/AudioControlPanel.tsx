"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const EFFECTS_KEY = "pinocho:effects-enabled";
const VOICE_OVER_KEY = "pinocho:voiceover-enabled";
const EFFECTS_VOLUME = 0.35;
const RAIN_THUNDER_VOLUME = 0.12;
const FIRE_VOLUME = 1;
const YAY_VOLUME = 0.07;
const PARK_VOLUME = 0.1;
const LAUGH_VOLUME = 0.18;
const CRY_VOLUME = 0.16;
const VOICE_OVER_VOLUME = 1;
const VIDEO_AUDIO_VOLUME = 0.45;

function getAudioPath(node: HTMLAudioElement) {
  const rawSrc = node.currentSrc || node.src;
  if (!rawSrc) return "";
  try {
    return new URL(rawSrc, window.location.origin).pathname.toLowerCase();
  } catch {
    return rawSrc.toLowerCase();
  }
}

function isSonidosAudio(node: HTMLAudioElement) {
  const path = getAudioPath(node);
  return path.includes("/sonidos/");
}

function isVoiceOverAudio(node: HTMLAudioElement) {
  if (node.dataset.audioChannel === "voiceover") return true;
  const path = getAudioPath(node);
  return path.includes("/sonidos/voz/");
}

function isRainThunderAudio(node: HTMLAudioElement) {
  const path = getAudioPath(node);
  return path.endsWith("/sonidos/lluviaytrueno.mp3");
}

function isFireAudio(node: HTMLAudioElement) {
  const path = getAudioPath(node);
  return path.endsWith("/sonidos/fuego.mp3");
}

function isYayAudio(node: HTMLAudioElement) {
  const path = getAudioPath(node);
  return path.endsWith("/sonidos/yay.mp3");
}

function isParkAudio(node: HTMLAudioElement) {
  const path = getAudioPath(node);
  return path.endsWith("/sonidos/parquedejuegos.mp3");
}

function isLaughAudio(node: HTMLAudioElement) {
  const path = getAudioPath(node);
  return path.endsWith("/sonidos/risa.mp3");
}

function isCryAudio(node: HTMLAudioElement) {
  const path = getAudioPath(node);
  return path.endsWith("/sonidos/llorar.mp3");
}

function applyAudioMix() {
  const audios = document.querySelectorAll<HTMLAudioElement>("audio");
  const videos = document.querySelectorAll<HTMLVideoElement>("video");

  audios.forEach((node) => {
    if (!isSonidosAudio(node)) return;
    if (isVoiceOverAudio(node)) {
      node.volume = VOICE_OVER_VOLUME;
      return;
    }
    if (isRainThunderAudio(node)) {
      node.volume = RAIN_THUNDER_VOLUME;
      return;
    }
    if (isYayAudio(node)) {
      node.volume = YAY_VOLUME;
      return;
    }
    if (isParkAudio(node)) {
      node.volume = PARK_VOLUME;
      return;
    }
    if (isLaughAudio(node)) {
      node.volume = LAUGH_VOLUME;
      return;
    }
    if (isCryAudio(node)) {
      node.volume = CRY_VOLUME;
      return;
    }
    node.volume = isFireAudio(node) ? FIRE_VOLUME : EFFECTS_VOLUME;
  });

  videos.forEach((node) => {
    if (node.muted) return;
    node.volume = VIDEO_AUDIO_VOLUME;
  });
}

function applyEffectsEnabled(enabled: boolean) {
  document.body.dataset.effectsEnabled = enabled ? "true" : "false";

  const audios = document.querySelectorAll<HTMLAudioElement>("audio");
  const effectAudios = Array.from(audios).filter(
    (node) => node.dataset.audioChannel !== "voiceover"
  );
  const videos = document.querySelectorAll<HTMLVideoElement>("video");

  if (!enabled) {
    effectAudios.forEach((node) => {
      node.pause();
      node.currentTime = 0;
      node.muted = true;
    });

    videos.forEach((node) => {
      node.muted = true;
    });
    return;
  }

  // On enable: allow effects again, but do not unmute every video globally.
  // Each scene should explicitly unmute/play its own media when needed.
  effectAudios.forEach((node) => {
    node.muted = false;
  });

  applyAudioMix();
}

function emitAudioSettings(effectsEnabled: boolean, voiceOverEnabled: boolean) {
  window.dispatchEvent(
    new CustomEvent("pinocho-audio-settings", {
      detail: { effectsEnabled, voiceOverEnabled },
    })
  );
}

export default function AudioControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(false);
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const savedEffects = localStorage.getItem(EFFECTS_KEY);
      const savedVoice = localStorage.getItem(VOICE_OVER_KEY);
      setEffectsEnabled(savedEffects !== "false");
      setVoiceOverEnabled(savedVoice === "true");
      setSettingsReady(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    localStorage.setItem(EFFECTS_KEY, effectsEnabled ? "true" : "false");
    applyEffectsEnabled(effectsEnabled);

    const observer = new MutationObserver(() => {
      applyEffectsEnabled(effectsEnabled);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [effectsEnabled, settingsReady]);

  useEffect(() => {
    if (!settingsReady) return;

    applyAudioMix();

    const handleMediaPlay = (event: Event) => {
      const node = event.target;
      if (node instanceof HTMLAudioElement) {
        if (!isSonidosAudio(node)) return;
        if (isVoiceOverAudio(node)) {
          node.volume = VOICE_OVER_VOLUME;
          return;
        }
        if (isRainThunderAudio(node)) {
          node.volume = RAIN_THUNDER_VOLUME;
          return;
        }
        if (isYayAudio(node)) {
          node.volume = YAY_VOLUME;
          return;
        }
        if (isParkAudio(node)) {
          node.volume = PARK_VOLUME;
          return;
        }
        if (isLaughAudio(node)) {
          node.volume = LAUGH_VOLUME;
          return;
        }
        if (isCryAudio(node)) {
          node.volume = CRY_VOLUME;
          return;
        }
        node.volume = isFireAudio(node) ? FIRE_VOLUME : EFFECTS_VOLUME;
        return;
      }
      if (node instanceof HTMLVideoElement) {
        if (node.muted) return;
        node.volume = VIDEO_AUDIO_VOLUME;
        return;
      }
    };

    document.addEventListener("play", handleMediaPlay, true);
    return () => document.removeEventListener("play", handleMediaPlay, true);
  }, [settingsReady]);

  useEffect(() => {
    if (!settingsReady) return;
    localStorage.setItem(VOICE_OVER_KEY, voiceOverEnabled ? "true" : "false");
  }, [voiceOverEnabled, settingsReady]);

  useEffect(() => {
    if (!settingsReady) return;
    document.body.dataset.voiceOverEnabled = voiceOverEnabled ? "true" : "false";
    emitAudioSettings(effectsEnabled, voiceOverEnabled);
  }, [effectsEnabled, voiceOverEnabled, settingsReady]);

  return (
    <div className="audioControlDock" aria-label="Controles de audio">
      <div className={`audioControlShell ${isOpen ? "is-open" : ""}`} id="audio-control-panel">
        <div className="audioControlActions">
          <button
            type="button"
            className={`audioControlBtn ${effectsEnabled ? "is-on" : "is-off"}`}
            onClick={() => setEffectsEnabled((prev) => !prev)}
            aria-label={effectsEnabled ? "Desactivar efectos" : "Activar efectos"}
            title={effectsEnabled ? "Desactivar efectos" : "Activar efectos"}
          >
            <Image
              src="/Botonefectos.svg"
              alt=""
              width={18}
              height={18}
              className="audioControlIconImage"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className={`audioControlBtn ${voiceOverEnabled ? "is-on" : "is-off"}`}
            onClick={() => setVoiceOverEnabled((prev) => !prev)}
            aria-label={voiceOverEnabled ? "Desactivar voz en off" : "Activar voz en off"}
            title={voiceOverEnabled ? "Desactivar voz en off" : "Activar voz en off"}
          >
            <Image
              src="/BotonVoz.svg"
              alt=""
              width={18}
              height={18}
              className="audioControlIconImage"
              aria-hidden="true"
            />
          </button>
        </div>
        <button
          type="button"
          className="audioControlHandle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="audio-control-panel"
          aria-label={isOpen ? "Cerrar controles de audio" : "Abrir controles de audio"}
        >
          <span className="audioControlHandleLabel" aria-hidden="true">
            Sonido
          </span>
        </button>
      </div>
    </div>
  );
}
