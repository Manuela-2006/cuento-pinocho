"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const EFFECTS_KEY = "pinocho:effects-enabled";
const VOICE_OVER_KEY = "pinocho:voiceover-enabled";

function applyEffectsEnabled(enabled: boolean) {
  document.body.dataset.effectsEnabled = enabled ? "true" : "false";

  const audios = document.querySelectorAll<HTMLAudioElement>("audio");
  const videos = document.querySelectorAll<HTMLVideoElement>("video");

  if (!enabled) {
    audios.forEach((node) => {
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
  audios.forEach((node) => {
    node.muted = false;
  });
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
          <Image
            src="/Flecha.svg"
            alt=""
            width={14}
            height={14}
            className={`audioControlArrowIcon ${isOpen ? "is-open" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
