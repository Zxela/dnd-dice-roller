/**
 * Audio Manager Module
 * Provides sound effects for dice rolling using the Web Audio API.
 * Generates sounds programmatically for low latency and no external dependencies.
 */

import { get, set } from './storage.js';

const STORAGE_KEY = 'audio-enabled';

/**
 * AudioManager class
 * Manages dice rolling sound effects with Web Audio API.
 * Handles browser autoplay restrictions gracefully.
 */
class AudioManager {
  constructor() {
    /** @type {AudioContext|null} */
    this.audioContext = null;
    /** @type {boolean} */
    this.initialized = false;
    /** @type {boolean} */
    this.enabled = this._loadEnabledState();
  }

  /**
   * Loads the enabled state from storage.
   * Defaults to true if not previously set.
   * @returns {boolean} Whether audio is enabled
   * @private
   */
  _loadEnabledState() {
    const stored = get(STORAGE_KEY);
    return stored !== null ? stored : true;
  }

  /**
   * Saves the enabled state to storage.
   * @private
   */
  _saveEnabledState() {
    set(STORAGE_KEY, this.enabled);
  }

  /**
   * Initializes the Web Audio context.
   * Must be called from a user interaction event handler (click, touch, keypress)
   * to comply with browser autoplay policies.
   * Safe to call multiple times - will only initialize once.
   * @returns {boolean} True if initialization succeeded, false otherwise
   */
  init() {
    if (this.initialized) {
      return true;
    }

    try {
      // Use standard AudioContext or webkit prefix for older Safari
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        console.warn('Web Audio API not supported in this browser');
        return false;
      }

      this.audioContext = new AudioContextClass();
      this.initialized = true;

      // Resume context if it's in suspended state (autoplay policy)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {
          // Silently handle resume failure - will try again on next user interaction
        });
      }

      return true;
    } catch (error) {
      console.warn('Failed to initialize audio context:', error.message);
      return false;
    }
  }

  /**
   * Plays a dice rolling sound effect.
   * Generates a short percussive sound using oscillators and noise.
   * Safe to call even if audio is disabled or not initialized.
   */
  play() {
    // Don't play if disabled or not initialized
    if (!this.enabled || !this.initialized || !this.audioContext) {
      return;
    }

    // Try to resume context if suspended (can happen after tab becomes inactive)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {
        // Silently ignore - sound just won't play this time
      });
      return;
    }

    try {
      this._playDiceSound();
    } catch (error) {
      // Silently handle playback errors to avoid disrupting the app
      console.warn('Audio playback failed:', error.message);
    }
  }

  /**
   * Generates and plays the dice rolling sound.
   * Creates a short, punchy percussive sound simulating dice hitting a surface.
   * @private
   */
  _playDiceSound() {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create a short noise burst for the "clack" sound
    const noiseBuffer = this._createNoiseBuffer(0.08);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Bandpass filter to shape the noise into a more wooden/plastic sound
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1800;
    bandpass.Q.value = 1.5;

    // Highpass to remove rumble
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 400;

    // Envelope for the noise
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    // Connect noise chain
    noiseSource.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Add a low-frequency "thump" component
    const thumpOsc = ctx.createOscillator();
    thumpOsc.type = 'sine';
    thumpOsc.frequency.setValueAtTime(150, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0.2, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    thumpOsc.connect(thumpGain);
    thumpGain.connect(ctx.destination);

    // Start and stop the sounds
    noiseSource.start(now);
    noiseSource.stop(now + 0.08);
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.08);
  }

  /**
   * Creates a buffer filled with white noise.
   * @param {number} duration - Duration in seconds
   * @returns {AudioBuffer} Buffer containing white noise
   * @private
   */
  _createNoiseBuffer(duration) {
    const ctx = this.audioContext;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  /**
   * Toggles audio on or off.
   * Persists the new state to storage.
   * @returns {boolean} The new enabled state
   */
  toggle() {
    this.enabled = !this.enabled;
    this._saveEnabledState();
    return this.enabled;
  }

  /**
   * Returns whether audio is currently enabled.
   * @returns {boolean} True if audio is enabled
   */
  isEnabled() {
    return this.enabled;
  }
}

// Export singleton instance
export const audio = new AudioManager();
