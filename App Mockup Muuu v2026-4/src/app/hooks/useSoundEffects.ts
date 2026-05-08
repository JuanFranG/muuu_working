// ============================================================
//  MUUU APP · useSoundEffects
//  Sonidos sintéticos con Web Audio API.
//  Respeta el toggle de sonido del SettingsContext.
// ============================================================

import { useCallback, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export function useSoundEffects() {
  const { sound } = useSettings();
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback((freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.12) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur);
  }, [getCtx]);

  /** Sonido suave de click — toque corto y agudo */
  const playClick = useCallback(() => {
    if (!sound) return;
    try {
      const t = getCtx().currentTime;
      tone(880, t, 0.06, 'sine', 0.08);
    } catch { /* AudioContext not available */ }
  }, [sound, getCtx, tone]);

  /** Sonido de éxito — dos notas ascendentes (Do-Mi) */
  const playSuccess = useCallback(() => {
    if (!sound) return;
    try {
      const t = getCtx().currentTime;
      tone(523, t, 0.15, 'sine', 0.1);        // Do
      tone(659, t + 0.12, 0.2, 'sine', 0.1);  // Mi
    } catch { /* AudioContext not available */ }
  }, [sound, getCtx, tone]);

  /** Sonido de error — dos notas descendentes */
  const playError = useCallback(() => {
    if (!sound) return;
    try {
      const t = getCtx().currentTime;
      tone(400, t, 0.18, 'triangle', 0.1);
      tone(300, t + 0.15, 0.25, 'triangle', 0.1);
    } catch { /* AudioContext not available */ }
  }, [sound, getCtx, tone]);

  /** Sonido de toggle — click suave */
  const playToggle = useCallback(() => {
    if (!sound) return;
    try {
      const t = getCtx().currentTime;
      tone(660, t, 0.04, 'sine', 0.06);
    } catch { /* AudioContext not available */ }
  }, [sound, getCtx, tone]);

  /** Sonido de navegación — whoosh suave */
  const playNav = useCallback(() => {
    if (!sound) return;
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch { /* AudioContext not available */ }
  }, [sound, getCtx]);

  return { playClick, playSuccess, playError, playToggle, playNav };
}
