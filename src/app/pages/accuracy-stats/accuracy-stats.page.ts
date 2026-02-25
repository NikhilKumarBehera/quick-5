import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { CategoryProgressService } from 'src/app/services/category-progress-service/category-progress-service';

Chart.register(...registerables);

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryStat {
  name: string;
  icon: string;
  accuracy: number;
  attempted: number;
  correct: number;
  type: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  label: string;
  color: string; // accent hex for ring glow and picker border
  bg: string; // gradient for picker card background
}

interface WeekDay {
  label: string;
  active: boolean;
  isToday: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LS_CHARACTER_KEY = 'accuracy_selected_character';

/**
 * Streak source keys — we merge ALL of these so streaks work even if the user
 * hasn't explicitly visited this page before.
 * - accuracy_daily_streak  : set by this page / recordPlayToday()
 * - memory_game_stats_v1   : set by the memory game (per-difficulty objects)
 * - bestStreak             : legacy simple integer
 */
const LS_STREAK_KEY = 'accuracy_daily_streak';
const LS_MEMORY_KEY = 'memory_game_stats_v1';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** SVG strings keyed by character id */
export const CHARACTER_SVGS: Record<string, string> = {
  nova: `<svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sk-nova" cx="38%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#F4C07A"/>
      <stop offset="100%" stop-color="#F4C07ACC"/>
    </radialGradient>
    <radialGradient id="sh-nova" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#a5b4fc"/>
      <stop offset="60%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#667eeaAA"/>
    </radialGradient>
    <filter id="sf-nova"><feDropShadow dx="0" dy="2.6" stdDeviation="2.86" flood-color="rgba(0,0,0,0.28)"/></filter>
    <filter id="gf-nova"><feGaussianBlur stdDeviation="2.34" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- body shadow -->
  <ellipse cx="65.0" cy="115.7" rx="28.6" ry="5.2" fill="rgba(0,0,0,0.18)"/>
  <!-- torso -->
  <ellipse cx="65.0" cy="104.0" rx="33.800000000000004" ry="26.0" fill="url(#sh-nova)" filter="url(#sf-nova)"/>
  <path d="M55.9,81.9 L65.0,89.69999999999999 L74.1,81.9" fill="none" stroke="#a5b4fc" stroke-width="2.34" stroke-linecap="round"/>
  <ellipse cx="54.6" cy="97.5" rx="4.550000000000001" ry="5.85" fill="rgba(255,255,255,0.18)" transform="rotate(-15 54.6 97.5)"/>
  <!-- neck -->
  <rect x="57.46" y="74.75" width="15.08" height="11.05" rx="5.2" fill="url(#sk-nova)"/>
  <!-- ears -->
  <ellipse cx="39.0" cy="55.9" rx="5.46" ry="7.15" fill="#F4C07ACC" filter="url(#sf-nova)"/>
  <ellipse cx="91.0" cy="55.9" rx="5.46" ry="7.15" fill="#F4C07ACC" filter="url(#sf-nova)"/>
  <ellipse cx="39.0" cy="55.9" rx="2.86" ry="3.9" fill="#F4C07A88"/>
  <ellipse cx="91.0" cy="55.9" rx="2.86" ry="3.9" fill="#F4C07A88"/>
  <!-- head -->
  <ellipse cx="65.0" cy="54.6" rx="26.0" ry="27.95" fill="url(#sk-nova)" filter="url(#sf-nova)"/>
  <ellipse cx="57.2" cy="41.6" rx="8.450000000000001" ry="7.15" fill="rgba(255,255,255,0.13)" transform="rotate(-20 57.2 41.6)"/>
  <!-- hair -->
  
      <ellipse cx="65.0" cy="36.4" rx="27.3" ry="16.900000000000002" fill="#5B21B6"/>
      <circle cx="46.8" cy="29.900000000000002" r="8.450000000000001" fill="#5B21B6"/>
      <circle cx="55.9" cy="28.6" r="8.450000000000001" fill="#5B21B6"/>
      <circle cx="65.0"       cy="28.6" r="8.450000000000001" fill="#5B21B6"/>
      <circle cx="74.1" cy="28.6" r="8.450000000000001" fill="#5B21B6"/>
      <circle cx="83.2" cy="29.900000000000002" r="8.450000000000001" fill="#5B21B6"/>
      <ellipse cx="39.0" cy="54.6" rx="6.76" ry="13.0" fill="#5B21B6"/>
      <ellipse cx="91.0" cy="54.6" rx="6.76" ry="13.0" fill="#5B21B6"/>
  <!-- eye whites -->
  <ellipse cx="55.64" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <ellipse cx="74.36" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <!-- iris -->
  <circle cx="55.64" cy="52.65" r="4.68" fill="#3730a3"/>
  <circle cx="74.36" cy="52.65" r="4.68" fill="#3730a3"/>
  <!-- pupil -->
  <circle cx="55.64" cy="52.65" r="2.6" fill="#080c14"/>
  <circle cx="74.36" cy="52.65" r="2.6" fill="#080c14"/>
  <!-- catchlights -->
  <circle cx="56.94" cy="50.96" r="1.17" fill="white"/>
  <circle cx="75.66" cy="50.96" r="1.17" fill="white"/>
  <!-- eyebrows -->
  <path d="M50.7,46.15 Q55.9,43.55 61.1,46.15" fill="none" stroke="#5B21B6" stroke-width="1.82" stroke-linecap="round"/>
  <path d="M68.9,46.15 Q74.1,43.55 79.3,46.15" fill="none" stroke="#5B21B6" stroke-width="1.82" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M62.66,61.1 Q65.0,63.050000000000004 67.34,61.1" fill="none" stroke="#F4C07A88" stroke-width="1.56" stroke-linecap="round"/>
  <!-- smile -->
  <path d="M55.64,67.6 Q65.0,73.45 74.36,67.6" fill="none" stroke="#F4C07A55" stroke-width="2.34" stroke-linecap="round"/>
  <path d="M57.46,67.86 Q65.0,72.80000000000001 72.54,67.86" fill="white" opacity="0.88"/>
  <!-- blush -->
  <ellipse cx="45.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <ellipse cx="84.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <!-- glasses -->
  
      <rect x="48.099999999999994" y="47.06" width="12.74" height="10.01" rx="2.86" fill="rgba(100,80,200,0.1)" stroke="#5B21B6" stroke-width="1.82"/>
      <rect x="69.16" y="47.06" width="12.74" height="10.01" rx="2.86" fill="rgba(100,80,200,0.1)" stroke="#5B21B6" stroke-width="1.82"/>
      <line x1="60.84" y1="52.0" x2="69.16" y2="52.0" stroke="#5B21B6" stroke-width="1.69"/>
      <line x1="39.0" y1="51.35" x2="48.099999999999994" y2="52.0" stroke="#5B21B6" stroke-width="1.56"/>
      <line x1="81.9" y1="52.0" x2="91.0" y2="51.35" stroke="#5B21B6" stroke-width="1.56"/>
  <!-- accessory -->
  
      <rect x="42.9" y="97.5" width="44.2" height="24.7" rx="2.86" fill="#1e293b"/>
      <rect x="44.85" y="99.06" width="40.3" height="20.15" rx="1.82" fill="#0f172a"/>
      <rect x="59.8" y="105.04" width="10.4" height="6.5" rx="1.04" fill="#334155" opacity="0.8"/>
      <rect x="40.3" y="121.42" width="49.4" height="3.64" rx="1.3" fill="#475569"/>
      <circle cx="65.0" cy="121.42" r="1.56" fill="#64748b"/>
</svg>`,

  aria: `<svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sk-aria" cx="38%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#F8C09A"/>
      <stop offset="100%" stop-color="#F8C09ACC"/>
    </radialGradient>
    <radialGradient id="sh-aria" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#fbcfe8"/>
      <stop offset="60%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#ec4899AA"/>
    </radialGradient>
    <filter id="sf-aria"><feDropShadow dx="0" dy="2.6" stdDeviation="2.86" flood-color="rgba(0,0,0,0.28)"/></filter>
    <filter id="gf-aria"><feGaussianBlur stdDeviation="2.34" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- body shadow -->
  <ellipse cx="65.0" cy="115.7" rx="28.6" ry="5.2" fill="rgba(0,0,0,0.18)"/>
  <!-- torso -->
  <ellipse cx="65.0" cy="104.0" rx="33.800000000000004" ry="26.0" fill="url(#sh-aria)" filter="url(#sf-aria)"/>
  <path d="M55.9,81.9 L65.0,89.69999999999999 L74.1,81.9" fill="none" stroke="#fbcfe8" stroke-width="2.34" stroke-linecap="round"/>
  <ellipse cx="54.6" cy="97.5" rx="4.550000000000001" ry="5.85" fill="rgba(255,255,255,0.18)" transform="rotate(-15 54.6 97.5)"/>
  <!-- neck -->
  <rect x="57.46" y="74.75" width="15.08" height="11.05" rx="5.2" fill="url(#sk-aria)"/>
  <!-- ears -->
  <ellipse cx="39.0" cy="55.9" rx="5.46" ry="7.15" fill="#F8C09ACC" filter="url(#sf-aria)"/>
  <ellipse cx="91.0" cy="55.9" rx="5.46" ry="7.15" fill="#F8C09ACC" filter="url(#sf-aria)"/>
  <ellipse cx="39.0" cy="55.9" rx="2.86" ry="3.9" fill="#F8C09A88"/>
  <ellipse cx="91.0" cy="55.9" rx="2.86" ry="3.9" fill="#F8C09A88"/>
  <!-- head -->
  <ellipse cx="65.0" cy="54.6" rx="26.0" ry="27.95" fill="url(#sk-aria)" filter="url(#sf-aria)"/>
  <ellipse cx="57.2" cy="41.6" rx="8.450000000000001" ry="7.15" fill="rgba(255,255,255,0.13)" transform="rotate(-20 57.2 41.6)"/>
  <!-- hair -->
  
      <ellipse cx="65.0" cy="37.7" rx="26.0" ry="18.200000000000003" fill="#DB2777"/>
      <ellipse cx="39.0" cy="57.2" rx="6.76" ry="13.0" fill="#DB2777"/>
      <ellipse cx="91.0" cy="57.2" rx="6.76" ry="13.0" fill="#DB2777"/>
      <path d="M87.1,41.6 Q111.8,61.1 101.4,93.6" fill="none" stroke="#DB2777" stroke-width="9.75" stroke-linecap="round"/>
  <!-- eye whites -->
  <ellipse cx="55.64" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <ellipse cx="74.36" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <!-- iris -->
  <circle cx="55.64" cy="52.65" r="4.68" fill="#9d174d"/>
  <circle cx="74.36" cy="52.65" r="4.68" fill="#9d174d"/>
  <!-- pupil -->
  <circle cx="55.64" cy="52.65" r="2.6" fill="#080c14"/>
  <circle cx="74.36" cy="52.65" r="2.6" fill="#080c14"/>
  <!-- catchlights -->
  <circle cx="56.94" cy="50.96" r="1.17" fill="white"/>
  <circle cx="75.66" cy="50.96" r="1.17" fill="white"/>
  <!-- eyebrows -->
  <path d="M50.7,46.15 Q55.9,43.55 61.1,46.15" fill="none" stroke="#DB2777" stroke-width="1.82" stroke-linecap="round"/>
  <path d="M68.9,46.15 Q74.1,43.55 79.3,46.15" fill="none" stroke="#DB2777" stroke-width="1.82" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M62.66,61.1 Q65.0,63.050000000000004 67.34,61.1" fill="none" stroke="#F8C09A88" stroke-width="1.56" stroke-linecap="round"/>
  <!-- smile -->
  <path d="M55.64,67.6 Q65.0,73.45 74.36,67.6" fill="none" stroke="#F8C09A55" stroke-width="2.34" stroke-linecap="round"/>
  <path d="M57.46,67.86 Q65.0,72.80000000000001 72.54,67.86" fill="white" opacity="0.88"/>
  <!-- blush -->
  <ellipse cx="45.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <ellipse cx="84.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <!-- glasses -->
  
  <!-- accessory -->
  
      <rect x="42.9" y="96.2" width="19.5" height="24.7" rx="1.3" fill="#ec4899" transform="rotate(-8 52.0 108.55)"/>
      <rect x="43.55" y="96.72" width="17.55" height="23.4" rx="1.3" fill="#fbcfe8" opacity="0.9" transform="rotate(-8 52.0 108.55)"/>
      <line x1="45.5" y1="102.05" x2="59.8" y2="101.4" stroke="#ec4899" stroke-width="1.04" opacity="0.5" transform="rotate(-8 52.0 108.55)"/>
      <line x1="45.5" y1="105.04" x2="59.8" y2="104.39" stroke="#ec4899" stroke-width="1.04" opacity="0.5" transform="rotate(-8 52.0 108.55)"/>
      <line x1="45.5" y1="108.03" x2="59.8" y2="107.38" stroke="#ec4899" stroke-width="1.04" opacity="0.5" transform="rotate(-8 52.0 108.55)"/>
</svg>`,

  rex: `<svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sk-rex" cx="38%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#F5D5A0"/>
      <stop offset="100%" stop-color="#F5D5A0CC"/>
    </radialGradient>
    <radialGradient id="sh-rex" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="60%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#059669AA"/>
    </radialGradient>
    <filter id="sf-rex"><feDropShadow dx="0" dy="2.6" stdDeviation="2.86" flood-color="rgba(0,0,0,0.28)"/></filter>
    <filter id="gf-rex"><feGaussianBlur stdDeviation="2.34" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- body shadow -->
  <ellipse cx="65.0" cy="115.7" rx="28.6" ry="5.2" fill="rgba(0,0,0,0.18)"/>
  <!-- torso -->
  <ellipse cx="65.0" cy="104.0" rx="33.800000000000004" ry="26.0" fill="url(#sh-rex)" filter="url(#sf-rex)"/>
  <path d="M55.9,81.9 L65.0,89.69999999999999 L74.1,81.9" fill="none" stroke="#6ee7b7" stroke-width="2.34" stroke-linecap="round"/>
  <ellipse cx="54.6" cy="97.5" rx="4.550000000000001" ry="5.85" fill="rgba(255,255,255,0.18)" transform="rotate(-15 54.6 97.5)"/>
  <!-- neck -->
  <rect x="57.46" y="74.75" width="15.08" height="11.05" rx="5.2" fill="url(#sk-rex)"/>
  <!-- ears -->
  <ellipse cx="39.0" cy="55.9" rx="5.46" ry="7.15" fill="#F5D5A0CC" filter="url(#sf-rex)"/>
  <ellipse cx="91.0" cy="55.9" rx="5.46" ry="7.15" fill="#F5D5A0CC" filter="url(#sf-rex)"/>
  <ellipse cx="39.0" cy="55.9" rx="2.86" ry="3.9" fill="#F5D5A088"/>
  <ellipse cx="91.0" cy="55.9" rx="2.86" ry="3.9" fill="#F5D5A088"/>
  <!-- head -->
  <ellipse cx="65.0" cy="54.6" rx="26.0" ry="27.95" fill="url(#sk-rex)" filter="url(#sf-rex)"/>
  <ellipse cx="57.2" cy="41.6" rx="8.450000000000001" ry="7.15" fill="rgba(255,255,255,0.13)" transform="rotate(-20 57.2 41.6)"/>
  <!-- hair -->
  
      <ellipse cx="65.0" cy="37.7" rx="27.3" ry="16.900000000000002" fill="#065F46"/>
      <ellipse cx="52.0"  cy="26.0" rx="5.85" ry="9.75" transform="rotate(-12 52.0 26.0)" fill="#065F46"/>
      <ellipse cx="60.45" cy="24.050000000000004" rx="5.85" ry="9.75" transform="rotate(-4 60.45 24.050000000000004)" fill="#065F46"/>
      <ellipse cx="69.55" cy="24.050000000000004" rx="5.85" ry="9.75" transform="rotate(4 69.55 24.050000000000004)" fill="#065F46"/>
      <ellipse cx="78.0"  cy="26.0" rx="5.85" ry="9.75" transform="rotate(12 78.0 26.0)" fill="#065F46"/>
      <ellipse cx="39.0" cy="55.9" rx="6.5" ry="11.7" fill="#065F46"/>
      <ellipse cx="91.0" cy="55.9" rx="6.5" ry="11.7" fill="#065F46"/>
  <!-- eye whites -->
  <ellipse cx="55.64" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <ellipse cx="74.36" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <!-- iris -->
  <circle cx="55.64" cy="52.65" r="4.68" fill="#064e3b"/>
  <circle cx="74.36" cy="52.65" r="4.68" fill="#064e3b"/>
  <!-- pupil -->
  <circle cx="55.64" cy="52.65" r="2.6" fill="#080c14"/>
  <circle cx="74.36" cy="52.65" r="2.6" fill="#080c14"/>
  <!-- catchlights -->
  <circle cx="56.94" cy="50.96" r="1.17" fill="white"/>
  <circle cx="75.66" cy="50.96" r="1.17" fill="white"/>
  <!-- eyebrows -->
  <path d="M50.7,46.15 Q55.9,43.55 61.1,46.15" fill="none" stroke="#065F46" stroke-width="1.82" stroke-linecap="round"/>
  <path d="M68.9,46.15 Q74.1,43.55 79.3,46.15" fill="none" stroke="#065F46" stroke-width="1.82" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M62.66,61.1 Q65.0,63.050000000000004 67.34,61.1" fill="none" stroke="#F5D5A088" stroke-width="1.56" stroke-linecap="round"/>
  <!-- smile -->
  <path d="M55.64,67.6 Q65.0,73.45 74.36,67.6" fill="none" stroke="#F5D5A055" stroke-width="2.34" stroke-linecap="round"/>
  <path d="M57.46,67.86 Q65.0,72.80000000000001 72.54,67.86" fill="white" opacity="0.88"/>
  <!-- blush -->
  <ellipse cx="45.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <ellipse cx="84.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <!-- glasses -->
  
  <!-- accessory -->
  
      <rect x="52.0" y="93.6" width="26.0" height="31.2" rx="2.86" fill="#1e293b"/>
      <rect x="53.82" y="95.28999999999999" width="22.36" height="26.65" rx="1.82" fill="#6ee7b7" opacity="0.7"/>
      <circle cx="65.0" cy="108.67999999999999" r="5.46" fill="#059669" opacity="0.9"/>
      <circle cx="65.0" cy="108.67999999999999" r="2.86" fill="white"/>
</svg>`,

  luna: `<svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sk-luna" cx="38%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FDDBA0"/>
      <stop offset="100%" stop-color="#FDDBA0CC"/>
    </radialGradient>
    <radialGradient id="sh-luna" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#c7d2fe"/>
      <stop offset="60%" stop-color="#4338ca"/>
      <stop offset="100%" stop-color="#4338caAA"/>
    </radialGradient>
    <filter id="sf-luna"><feDropShadow dx="0" dy="2.6" stdDeviation="2.86" flood-color="rgba(0,0,0,0.28)"/></filter>
    <filter id="gf-luna"><feGaussianBlur stdDeviation="2.34" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- body shadow -->
  <ellipse cx="65.0" cy="115.7" rx="28.6" ry="5.2" fill="rgba(0,0,0,0.18)"/>
  <!-- torso -->
  <ellipse cx="65.0" cy="104.0" rx="33.800000000000004" ry="26.0" fill="url(#sh-luna)" filter="url(#sf-luna)"/>
  <path d="M55.9,81.9 L65.0,89.69999999999999 L74.1,81.9" fill="none" stroke="#c7d2fe" stroke-width="2.34" stroke-linecap="round"/>
  <ellipse cx="54.6" cy="97.5" rx="4.550000000000001" ry="5.85" fill="rgba(255,255,255,0.18)" transform="rotate(-15 54.6 97.5)"/>
  <!-- neck -->
  <rect x="57.46" y="74.75" width="15.08" height="11.05" rx="5.2" fill="url(#sk-luna)"/>
  <!-- ears -->
  <ellipse cx="39.0" cy="55.9" rx="5.46" ry="7.15" fill="#FDDBA0CC" filter="url(#sf-luna)"/>
  <ellipse cx="91.0" cy="55.9" rx="5.46" ry="7.15" fill="#FDDBA0CC" filter="url(#sf-luna)"/>
  <ellipse cx="39.0" cy="55.9" rx="2.86" ry="3.9" fill="#FDDBA088"/>
  <ellipse cx="91.0" cy="55.9" rx="2.86" ry="3.9" fill="#FDDBA088"/>
  <!-- head -->
  <ellipse cx="65.0" cy="54.6" rx="26.0" ry="27.95" fill="url(#sk-luna)" filter="url(#sf-luna)"/>
  <ellipse cx="57.2" cy="41.6" rx="8.450000000000001" ry="7.15" fill="rgba(255,255,255,0.13)" transform="rotate(-20 57.2 41.6)"/>
  <!-- hair -->
  
      <ellipse cx="65.0" cy="37.7" rx="26.0" ry="18.200000000000003" fill="#4338CA"/>
      <ellipse cx="39.0" cy="57.2" rx="6.76" ry="13.0" fill="#4338CA"/>
      <ellipse cx="91.0" cy="57.2" rx="6.76" ry="13.0" fill="#4338CA"/>
      <path d="M41.6,35.1 Q26.0,54.6 41.6,74.1" fill="none" stroke="#4338CA" stroke-width="10.4" stroke-linecap="round"/>
  <!-- eye whites -->
  <ellipse cx="55.64" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <ellipse cx="74.36" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <!-- iris -->
  <circle cx="55.64" cy="52.65" r="4.68" fill="#3730a3"/>
  <circle cx="74.36" cy="52.65" r="4.68" fill="#3730a3"/>
  <!-- pupil -->
  <circle cx="55.64" cy="52.65" r="2.6" fill="#080c14"/>
  <circle cx="74.36" cy="52.65" r="2.6" fill="#080c14"/>
  <!-- catchlights -->
  <circle cx="56.94" cy="50.96" r="1.17" fill="white"/>
  <circle cx="75.66" cy="50.96" r="1.17" fill="white"/>
  <!-- eyebrows -->
  <path d="M50.7,46.15 Q55.9,43.55 61.1,46.15" fill="none" stroke="#4338CA" stroke-width="1.82" stroke-linecap="round"/>
  <path d="M68.9,46.15 Q74.1,43.55 79.3,46.15" fill="none" stroke="#4338CA" stroke-width="1.82" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M62.66,61.1 Q65.0,63.050000000000004 67.34,61.1" fill="none" stroke="#FDDBA088" stroke-width="1.56" stroke-linecap="round"/>
  <!-- smile -->
  <path d="M55.64,67.6 Q65.0,73.45 74.36,67.6" fill="none" stroke="#FDDBA055" stroke-width="2.34" stroke-linecap="round"/>
  <path d="M57.46,67.86 Q65.0,72.80000000000001 72.54,67.86" fill="white" opacity="0.88"/>
  <!-- blush -->
  <ellipse cx="45.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <ellipse cx="84.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <!-- glasses -->
  
  <!-- accessory -->
  
      <text x="36.4" y="36.400000000000006" font-size="9.100000000000001" fill="#c7d2fe" opacity="0.75">★</text>
      <text x="88.4" y="41.6" font-size="8.450000000000001" fill="#c7d2fe" opacity="0.65">★</text>
      <text x="33.8" y="96.2" font-size="7.8" fill="#c7d2fe" opacity="0.6">★</text>
      <text x="91.0"  y="91.0" font-size="7.15" fill="#c7d2fe" opacity="0.55">★</text>
</svg>`,

  bolt: `<svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sk-bolt" cx="38%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FDE8A0"/>
      <stop offset="100%" stop-color="#FDE8A0CC"/>
    </radialGradient>
    <radialGradient id="sh-bolt" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="60%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#F59E0BAA"/>
    </radialGradient>
    <filter id="sf-bolt"><feDropShadow dx="0" dy="2.6" stdDeviation="2.86" flood-color="rgba(0,0,0,0.28)"/></filter>
    <filter id="gf-bolt"><feGaussianBlur stdDeviation="2.34" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- body shadow -->
  <ellipse cx="65.0" cy="115.7" rx="28.6" ry="5.2" fill="rgba(0,0,0,0.18)"/>
  <!-- torso -->
  <ellipse cx="65.0" cy="104.0" rx="33.800000000000004" ry="26.0" fill="url(#sh-bolt)" filter="url(#sf-bolt)"/>
  <path d="M55.9,81.9 L65.0,89.69999999999999 L74.1,81.9" fill="none" stroke="#fde68a" stroke-width="2.34" stroke-linecap="round"/>
  <ellipse cx="54.6" cy="97.5" rx="4.550000000000001" ry="5.85" fill="rgba(255,255,255,0.18)" transform="rotate(-15 54.6 97.5)"/>
  <!-- neck -->
  <rect x="57.46" y="74.75" width="15.08" height="11.05" rx="5.2" fill="url(#sk-bolt)"/>
  <!-- ears -->
  <ellipse cx="39.0" cy="55.9" rx="5.46" ry="7.15" fill="#FDE8A0CC" filter="url(#sf-bolt)"/>
  <ellipse cx="91.0" cy="55.9" rx="5.46" ry="7.15" fill="#FDE8A0CC" filter="url(#sf-bolt)"/>
  <ellipse cx="39.0" cy="55.9" rx="2.86" ry="3.9" fill="#FDE8A088"/>
  <ellipse cx="91.0" cy="55.9" rx="2.86" ry="3.9" fill="#FDE8A088"/>
  <!-- head -->
  <ellipse cx="65.0" cy="54.6" rx="26.0" ry="27.95" fill="url(#sk-bolt)" filter="url(#sf-bolt)"/>
  <ellipse cx="57.2" cy="41.6" rx="8.450000000000001" ry="7.15" fill="rgba(255,255,255,0.13)" transform="rotate(-20 57.2 41.6)"/>
  <!-- hair -->
  
      <ellipse cx="65.0" cy="39.0" rx="26.0" ry="15.6" fill="#D97706"/>
      <polygon points="46.8,31.200000000000003 46.8,16.900000000000006 51.22,31.200000000000003" fill="#D97706"/>
      <polygon points="55.9,29.900000000000002 55.9,15.600000000000001  60.32,29.900000000000002" fill="#D97706"/>
      <polygon points="64.35,29.900000000000002 65.0,14.300000000000004      69.55,29.900000000000002" fill="#D97706"/>
      <polygon points="69.68,29.900000000000002 74.1,15.600000000000001  78.78,29.900000000000002" fill="#D97706"/>
      <polygon points="78.78,31.200000000000003 83.2,16.900000000000006 87.62,31.200000000000003" fill="#D97706"/>
      <ellipse cx="40.3" cy="55.9" rx="6.24" ry="11.7" fill="#D97706"/>
      <ellipse cx="89.7" cy="55.9" rx="6.24" ry="11.7" fill="#D97706"/>
  <!-- eye whites -->
  <ellipse cx="55.64" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <ellipse cx="74.36" cy="52.0" rx="7.54" ry="7.15" fill="white"/>
  <!-- iris -->
  <circle cx="55.64" cy="52.65" r="4.68" fill="#78350f"/>
  <circle cx="74.36" cy="52.65" r="4.68" fill="#78350f"/>
  <!-- pupil -->
  <circle cx="55.64" cy="52.65" r="2.6" fill="#080c14"/>
  <circle cx="74.36" cy="52.65" r="2.6" fill="#080c14"/>
  <!-- catchlights -->
  <circle cx="56.94" cy="50.96" r="1.17" fill="white"/>
  <circle cx="75.66" cy="50.96" r="1.17" fill="white"/>
  <!-- eyebrows -->
  <path d="M50.7,46.15 Q55.9,43.55 61.1,46.15" fill="none" stroke="#D97706" stroke-width="1.82" stroke-linecap="round"/>
  <path d="M68.9,46.15 Q74.1,43.55 79.3,46.15" fill="none" stroke="#D97706" stroke-width="1.82" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M62.66,61.1 Q65.0,63.050000000000004 67.34,61.1" fill="none" stroke="#FDE8A088" stroke-width="1.56" stroke-linecap="round"/>
  <!-- smile -->
  <path d="M55.64,67.6 Q65.0,73.45 74.36,67.6" fill="none" stroke="#FDE8A055" stroke-width="2.34" stroke-linecap="round"/>
  <path d="M57.46,67.86 Q65.0,72.80000000000001 72.54,67.86" fill="white" opacity="0.88"/>
  <!-- blush -->
  <ellipse cx="45.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <ellipse cx="84.5" cy="63.7" rx="5.85" ry="3.64" fill="rgba(255,120,120,0.22)"/>
  <!-- glasses -->
  
  <!-- accessory -->
  
      <polygon points="75.4,88.4 70.2,104.0 76.7,105.30000000000001 70.2,122.19999999999999 85.8,101.4 79.3,100.10000000000001 85.8,88.4" fill="#fde68a"/>
</svg>`,
};

const CHARACTERS: Character[] = [
  {
    id: 'nova',
    name: 'Nova',
    label: 'The Scholar',
    description: 'AI Scholar',
    color: '#818cf8',
    bg: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  },
  {
    id: 'aria',
    name: 'Aria',
    label: 'Logic Queen',
    description: 'Logic Queen',
    color: '#f472b6',
    bg: 'linear-gradient(135deg,#ec4899 0%,#be185d 100%)',
  },
  {
    id: 'rex',
    name: 'Rex',
    label: 'Code Wizard',
    description: 'Code Wizard',
    color: '#34d399',
    bg: 'linear-gradient(135deg,#10b981 0%,#065f46 100%)',
  },
  {
    id: 'luna',
    name: 'Luna',
    label: 'Night Thinker',
    description: 'Night Thinker',
    color: '#a78bfa',
    bg: 'linear-gradient(135deg,#6366f1 0%,#312e81 100%)',
  },
  {
    id: 'bolt',
    name: 'Bolt',
    label: 'Speed Runner',
    description: 'Speed Runner',
    color: '#fbbf24',
    bg: 'linear-gradient(135deg,#f59e0b 0%,#b45309 100%)',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-accuracy-stats',
  templateUrl: './accuracy-stats.page.html',
  styleUrls: ['./accuracy-stats.page.scss'],
  standalone: false,
})
export class AccuracyStatsPage implements OnInit, AfterViewInit {
  @ViewChild('accuracyChart', { static: false }) chartCanvas!: ElementRef;

  isScrolled = false;
  showCharPicker = false;

  overallAccuracy = 0;
  selectedPeriod = '7days';

  totalAttempted = 0;
  totalCorrect = 0;
  totalWrong = 0;
  bestStreak = 0;
  accuracyTrend = 0; // +/- vs last week

  currentStreak = 0;
  longestStreak = 0;
  weekDays: WeekDay[] = [];

  characters: Character[] = CHARACTERS;
  selectedCharacter: Character = CHARACTERS[0];
  /** Pre-sanitized SVG HTML for each character — keyed by id */
  charSvgMap: Record<string, SafeHtml> = {};

  categoryStats: CategoryStat[] = [];

  periods = [
    { label: '7D', value: '7days' },
    { label: '30D', value: '30days' },
    { label: 'All', value: 'all' },
  ];

  chart: any;

  constructor(
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private categoryProgressService: CategoryProgressService
  ) {
    // Pre-sanitize all character SVGs once
    Object.entries(CHARACTER_SVGS).forEach(([id, svg]) => {
      this.charSvgMap[id] = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadCharacter();
    this.loadStreakData();
    this.buildWeekCalendar();
    this.loadAccuracyData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.createChart(), 150);
  }

  // ─── Character ──────────────────────────────────────────────────────────────

  private loadCharacter(): void {
    try {
      const saved = localStorage.getItem(LS_CHARACTER_KEY);
      if (saved) {
        const found = CHARACTERS.find((c) => c.id === saved);
        if (found) this.selectedCharacter = found;
      }
    } catch {}
  }

  selectCharacter(char: Character): void {
    this.selectedCharacter = char;
    try {
      localStorage.setItem(LS_CHARACTER_KEY, char.id);
    } catch {}
    this.closeCharacterPicker();
    this.cdr.detectChanges();
  }

  openCharacterPicker(): void {
    this.showCharPicker = true;
  }
  closeCharacterPicker(): void {
    this.showCharPicker = false;
  }

  // ─── Streak ─────────────────────────────────────────────────────────────────

  /**
   * Merge play-dates from ALL sources so streaks always reflect real usage:
   *  1. accuracy_daily_streak  — ISO date array
   *  2. memory_game_stats_v1   — has lastPlayed per difficulty
   *  3. bestStreak             — legacy integer (fallback for count only)
   */
  private loadStreakData(): void {
    const days = this.collectAllPlayDays();
    this.currentStreak = this.calcCurrentStreak(days);
    this.longestStreak = this.calcLongestStreak(days);
    this.bestStreak = this.longestStreak;

    // Legacy fallback: if no dates found, try old bestStreak integer
    if (this.longestStreak === 0) {
      try {
        const legacy = parseInt(localStorage.getItem('bestStreak') || '0');
        this.bestStreak = legacy;
      } catch {}
    }
  }

  /** Gather unique ISO date strings from every known storage source */
  private collectAllPlayDays(): string[] {
    const set = new Set<string>();

    // Source 1: explicit daily streak array
    try {
      const raw = localStorage.getItem(LS_STREAK_KEY);
      if (raw) {
        (JSON.parse(raw) as string[]).forEach((d) => set.add(d));
      }
    } catch {}

    // Source 2: memory game lastPlayed dates per difficulty
    try {
      const raw = localStorage.getItem(LS_MEMORY_KEY);
      if (raw) {
        const stats = JSON.parse(raw) as Record<
          string,
          { lastPlayed?: string }
        >;
        Object.values(stats).forEach((s) => {
          if (s?.lastPlayed) {
            const date = s.lastPlayed.split('T')[0];
            if (date) set.add(date);
          }
        });
      }
    } catch {}

    return Array.from(set);
  }

  /** Call this from any game completion to record today as a play day */
  recordPlayToday(): void {
    try {
      const raw = localStorage.getItem(LS_STREAK_KEY);
      const days: string[] = raw ? JSON.parse(raw) : [];
      const today = this.todayISO();
      if (!days.includes(today)) {
        days.push(today);
        localStorage.setItem(LS_STREAK_KEY, JSON.stringify(days));
      }
      this.loadStreakData();
      this.buildWeekCalendar();
      this.cdr.detectChanges();
    } catch {}
  }

  private todayISO(): string {
    return new Date().toISOString().split('T')[0];
  }

  private calcCurrentStreak(days: string[]): number {
    if (!days.length) return 0;
    const sorted = [...new Set(days)].sort().reverse();
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const expected = cursor.toISOString().split('T')[0];
      if (sorted[i] === expected) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else if (i === 0) {
        // Allow missing today — check if played yesterday
        cursor.setDate(cursor.getDate() - 1);
        const yest = cursor.toISOString().split('T')[0];
        if (sorted[i] === yest) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return streak;
  }

  private calcLongestStreak(days: string[]): number {
    if (!days.length) return 0;
    const sorted = [...new Set(days)].sort();
    let best = 1,
      run = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      run = diff === 1 ? run + 1 : 1;
      best = Math.max(best, run);
    }
    return best;
  }

  buildWeekCalendar(): void {
    const days = this.collectAllPlayDays();
    const daySet = new Set(days);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.weekDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      this.weekDays.push({
        label: DAY_LABELS[d.getDay()],
        active: daySet.has(iso),
        isToday: i === 0,
      });
    }
  }

  // ─── Accuracy ───────────────────────────────────────────────────────────────

  loadAccuracyData(): void {
    this.overallAccuracy = this.categoryProgressService.getOverallAccuracy();

    const categories = ['Math', 'Code Cracker', 'Logic', 'Riddle', 'Pattern'];
    const icons = ['🧮', '🔐', '🎯', '💡', '🔷'];

    this.categoryStats = categories.map((cat, i) => {
      const p = this.categoryProgressService.getCategoryProgress(cat);
      return {
        name: cat,
        icon: icons[i],
        type: cat,
        accuracy: p?.accuracy || 0,
        attempted: p?.totalAttempts || 0,
        correct: p?.correctAnswers || 0,
      };
    });

    this.totalAttempted = this.categoryStats.reduce(
      (s, c) => s + c.attempted,
      0
    );
    this.totalCorrect = this.categoryStats.reduce((s, c) => s + c.correct, 0);
    this.totalWrong = this.totalAttempted - this.totalCorrect;
    this.accuracyTrend = this.overallAccuracy - 60; // replace with real delta if stored
  }

  // ─── Chart ──────────────────────────────────────────────────────────────────

  createChart(): void {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const data = this.generateChartData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Accuracy %',
            data: data.values,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102,126,234,0.08)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#a5b4fc',
            borderColor: '#667eea',
            borderWidth: 1,
            displayColors: false,
            callbacks: { label: (c) => `Accuracy: ${c.parsed.y}%` },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (v) => v + '%', font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
        },
      },
    });
  }

  generateChartData() {
    if (this.selectedPeriod === '7days') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: this.getWeeklyData(),
      };
    } else if (this.selectedPeriod === '30days') {
      return {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        values: this.getMonthlyData(),
      };
    }
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [68, 72, 75, 78],
    };
  }

  getWeeklyData(): number[] {
    const s = JSON.parse(localStorage.getItem('weeklyAccuracy') || '[]');
    return s.length === 7
      ? s
      : [65, 72, 68, 75, 80, 78, this.overallAccuracy || 82];
  }

  getMonthlyData(): number[] {
    return Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * 30) + 60
    );
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    if (this.chart) this.chart.destroy();
    this.createChart();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  onScroll(event: any): void {
    const top = event.detail.scrollTop;
    if (top > 180 && !this.isScrolled) this.isScrolled = true;
    else if (top < 150 && this.isScrolled) this.isScrolled = false;
  }

  getAccuracyColor(a: number): string {
    if (a >= 80) return '#10b981';
    if (a >= 70) return '#06d6a0';
    if (a >= 50) return '#f59e0b';
    if (a >= 30) return '#f97316';
    return '#ef4444';
  }

  getCircleOffset(a: number): number {
    const c = 2 * Math.PI * 85;
    return c - (a / 100) * c;
  }

  getAccuracyMessage(a: number): string {
    if (a >= 80) return 'Excellent performance! Keep it up!';
    if (a >= 60) return "Good work! You're improving!";
    if (a >= 40) return 'Keep practicing to get better!';
    return "Don't give up! Practice makes perfect!";
  }

  getAccuracyLevel(a: number): string {
    return a >= 70 ? 'High' : a >= 40 ? 'Medium' : 'Low';
  }

  getAccuracyClass(a: number): string {
    return a >= 70 ? 'badge-high' : a >= 40 ? 'badge-medium' : 'badge-low';
  }

  viewCategoryDetails(cat: CategoryStat): void {
    console.log('Details:', cat.name);
  }
  openSettings(): void {
    console.log('Settings');
  }
  goBack(): void {
    this.navCtrl.back();
  }
}
