// src/app/services/sound-service/sound.service.ts
import { Injectable } from '@angular/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize AudioContext on first interaction
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (error) {
        console.log('AudioContext not supported:', error);
      }
    }
  }

  // ==================== ANSWER SOUNDS ====================

  /**
   * Play success sound - pleasant chime (C major chord)
   */
  async playSuccessSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Pleasant success tone (C major chord - C, E, G)
      oscillator.frequency.setValueAtTime(
        523.25,
        this.audioContext.currentTime
      ); // C5
      oscillator.frequency.setValueAtTime(
        659.25,
        this.audioContext.currentTime + 0.1
      ); // E5
      oscillator.frequency.setValueAtTime(
        783.99,
        this.audioContext.currentTime + 0.2
      ); // G5

      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.5
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Error playing success sound:', error);
    }
  }

  /**
   * Play error sound - low buzz
   */
  async playErrorSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Lower error tone
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        150,
        this.audioContext.currentTime + 0.2
      );

      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.4
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.4);
    } catch (error) {
      console.log('Error playing error sound:', error);
    }
  }

  // ==================== UI INTERACTION SOUNDS ====================

  /**
   * Play button click sound - short tick
   */
  async playClickSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.05
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('Error playing click sound:', error);
    }
  }

  /**
   * Play pop sound - quick burst
   */
  async playPopSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        this.audioContext.currentTime + 0.1
      );
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.1
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Error playing pop sound:', error);
    }
  }

  /**
   * Play swipe sound - whoosh effect
   */
  async playSwipeSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        this.audioContext.currentTime + 0.2
      );
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.2
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Error playing swipe sound:', error);
    }
  }

  // ==================== ACHIEVEMENT SOUNDS ====================

  /**
   * Play level up sound - ascending chime
   */
  async playLevelUpSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        const startTime = this.audioContext!.currentTime + index * 0.1;
        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    } catch (error) {
      console.log('Error playing level up sound:', error);
    }
  }

  /**
   * Play achievement unlock sound - fanfare
   */
  async playAchievementSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const notes = [
        { freq: 523.25, time: 0 }, // C5
        { freq: 659.25, time: 0.15 }, // E5
        { freq: 783.99, time: 0.3 }, // G5
        { freq: 1046.5, time: 0.45 }, // C6
      ];

      notes.forEach((note) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        const startTime = this.audioContext!.currentTime + note.time;
        oscillator.frequency.setValueAtTime(note.freq, startTime);
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.25, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
      });
    } catch (error) {
      console.log('Error playing achievement sound:', error);
    }
  }

  /**
   * Play streak sound - quick beeps
   */
  async playStreakSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      for (let i = 0; i < 3; i++) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const startTime = this.audioContext.currentTime + i * 0.08;
        oscillator.frequency.setValueAtTime(800 + i * 200, startTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.06);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.06);
      }
    } catch (error) {
      console.log('Error playing streak sound:', error);
    }
  }

  // ==================== COMPLETION SOUNDS ====================

  /**
   * Play challenge complete sound - victory fanfare
   */
  async playChallengeCompleteSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const melody = [
        { freq: 523.25, time: 0, duration: 0.2 }, // C5
        { freq: 659.25, time: 0.2, duration: 0.2 }, // E5
        { freq: 783.99, time: 0.4, duration: 0.2 }, // G5
        { freq: 1046.5, time: 0.6, duration: 0.5 }, // C6 (longer)
      ];

      melody.forEach((note) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        const startTime = this.audioContext!.currentTime + note.time;
        oscillator.frequency.setValueAtTime(note.freq, startTime);
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          startTime + note.duration
        );

        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
      });
    } catch (error) {
      console.log('Error playing challenge complete sound:', error);
    }
  }

  /**
   * Play perfect score sound - triumphant
   */
  async playPerfectScoreSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C major chord

      chord.forEach((freq) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.setValueAtTime(
          freq,
          this.audioContext!.currentTime
        );
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext!.currentTime + 1
        );

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + 1);
      });
    } catch (error) {
      console.log('Error playing perfect score sound:', error);
    }
  }

  // ==================== NOTIFICATION SOUNDS ====================

  /**
   * Play notification sound - gentle bell
   */
  async playNotificationSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(
        1000,
        this.audioContext.currentTime + 0.05
      );
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.3
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  }

  /**
   * Play warning sound - attention getter
   */
  async playWarningSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      for (let i = 0; i < 2; i++) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const startTime = this.audioContext.currentTime + i * 0.15;
        oscillator.frequency.setValueAtTime(600, startTime);
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.1);
      }
    } catch (error) {
      console.log('Error playing warning sound:', error);
    }
  }

  // ==================== COUNTDOWN SOUNDS ====================

  /**
   * Play countdown tick sound
   */
  async playCountdownTickSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.05
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('Error playing countdown tick sound:', error);
    }
  }

  /**
   * Play countdown final beep (different pitch)
   */
  async playCountdownFinalSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.2
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Error playing countdown final sound:', error);
    }
  }

  // ==================== HAPTIC FEEDBACK ====================

  /**
   * Trigger success haptic feedback
   */
  async successHaptic(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  /**
   * Trigger error haptic feedback
   */
  async errorHaptic(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  /**
   * Trigger light haptic feedback (for UI interactions)
   */
  async lightHaptic(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  /**
   * Trigger heavy haptic feedback (for important events)
   */
  async heavyHaptic(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  /**
   * Trigger success notification haptic
   */
  async successNotificationHaptic(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  /**
   * Trigger warning notification haptic
   */
  async warningNotificationHaptic(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  // ==================== COMBINED METHODS ====================

  /**
   * Play success with sound and haptic feedback
   */
  async playSuccess(): Promise<void> {
    await Promise.all([this.playSuccessSound(), this.successHaptic()]);
  }

  /**
   * Play error with sound and haptic feedback
   */
  async playError(): Promise<void> {
    await Promise.all([this.playErrorSound(), this.errorHaptic()]);
  }

  /**
   * Play click with sound and light haptic
   */
  async playClick(): Promise<void> {
    await Promise.all([this.playClickSound(), this.lightHaptic()]);
  }

  /**
   * Play level up with sound and heavy haptic
   */
  async playLevelUp(): Promise<void> {
    await Promise.all([this.playLevelUpSound(), this.heavyHaptic()]);
  }

  /**
   * Play achievement with sound and success haptic
   */
  async playAchievement(): Promise<void> {
    await Promise.all([
      this.playAchievementSound(),
      this.successNotificationHaptic(),
    ]);
  }

  /**
   * Play challenge complete with sound and heavy haptic
   */
  async playChallengeComplete(): Promise<void> {
    await Promise.all([this.playChallengeCompleteSound(), this.heavyHaptic()]);
  }

  /**
   * Play warning with sound and warning haptic
   */
  async playWarning(): Promise<void> {
    await Promise.all([
      this.playWarningSound(),
      this.warningNotificationHaptic(),
    ]);
  }
}
