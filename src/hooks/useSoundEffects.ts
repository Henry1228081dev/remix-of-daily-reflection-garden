import { useCallback } from "react";

// Web Audio API sound effects - no external files needed
const createOscillatorSound = (
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.3
) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playMelody = (notes: { freq: number; dur: number }[], type: OscillatorType = "sine") => {
  let delay = 0;
  notes.forEach(({ freq, dur }) => {
    setTimeout(() => createOscillatorSound(freq, dur, type, 0.2), delay * 1000);
    delay += dur * 0.7;
  });
};

export const useSoundEffects = () => {
  const playClick = useCallback(() => {
    createOscillatorSound(800, 0.05, "square", 0.1);
  }, []);

  const playCookieEarned = useCallback(() => {
    // Happy ascending melody
    playMelody([
      { freq: 523, dur: 0.1 }, // C5
      { freq: 659, dur: 0.1 }, // E5
      { freq: 784, dur: 0.15 }, // G5
    ], "sine");
  }, []);

  const playPurchase = useCallback(() => {
    // Cash register / cha-ching sound
    playMelody([
      { freq: 880, dur: 0.08 }, // A5
      { freq: 1047, dur: 0.08 }, // C6
      { freq: 1319, dur: 0.15 }, // E6
    ], "triangle");
  }, []);

  const playEquip = useCallback(() => {
    // Magical equip sound
    playMelody([
      { freq: 392, dur: 0.08 }, // G4
      { freq: 523, dur: 0.08 }, // C5
      { freq: 659, dur: 0.08 }, // E5
      { freq: 784, dur: 0.12 }, // G5
    ], "sine");
  }, []);

  const playNotification = useCallback(() => {
    // Gentle notification chime
    playMelody([
      { freq: 659, dur: 0.12 }, // E5
      { freq: 784, dur: 0.15 }, // G5
    ], "sine");
  }, []);

  const playError = useCallback(() => {
    // Error / invalid sound
    createOscillatorSound(200, 0.2, "sawtooth", 0.15);
  }, []);

  const playSuccess = useCallback(() => {
    // Success fanfare
    playMelody([
      { freq: 523, dur: 0.1 }, // C5
      { freq: 659, dur: 0.1 }, // E5
      { freq: 784, dur: 0.1 }, // G5
      { freq: 1047, dur: 0.2 }, // C6
    ], "triangle");
  }, []);

  const playHover = useCallback(() => {
    createOscillatorSound(600, 0.03, "sine", 0.05);
  }, []);

  return {
    playClick,
    playCookieEarned,
    playPurchase,
    playEquip,
    playNotification,
    playError,
    playSuccess,
    playHover,
  };
};
