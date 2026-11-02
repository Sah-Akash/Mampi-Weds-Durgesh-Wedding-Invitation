/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Copy,
  ExternalLink,
  Flame,
  Flower2,
  Heart,
  Mail,
  MapPin,
  MessageSquareHeart,
  Music,
  Navigation,
  RotateCw,
  Send,
  Shirt,
  Sparkles,
  Sun,
  ThermometerSnowflake,
  Utensils,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  FileSpreadsheet,
  PlusCircle,
  Link2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout,
  RsvpRecord,
  SheetMetadata,
  extractSpreadsheetId,
  fetchSpreadsheetMetadata,
  createWeddingRsvpSpreadsheet,
  appendRsvpRecordsToSheet,
  fetchRsvpRowsFromSheet,
} from './services/googleSheetsAuth';
import { WEDDING_IMAGES } from './data/weddingData';

/* ============================================================================
 * 1. FALLING MARIGOLD, ROSE & GOLD CONFETTI PETALS CANVAS (Exact Clone of `ee`)
 * ============================================================================ */
const PETAL_COLORS = [
  '#FF8F00',
  '#FFA000',
  '#FFC107',
  '#FFB300',
  '#D81B60',
  '#C2185B',
  '#D4AF37',
];
const petalListeners = new Set<(count?: number) => void>();

export function showerPetals(count = 50) {
  petalListeners.forEach((fn) => fn(count));
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  type: 'marigold' | 'rose' | 'gold_confetti';
}

function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const createParticle = (fromTop = true, isBurst = false): Particle => {
      const rand = Math.random();
      let type: 'marigold' | 'rose' | 'gold_confetti' = 'marigold';
      if (rand < 0.2) type = 'rose';
      else if (rand < 0.35) type = 'gold_confetti';

      const color =
        type === 'gold_confetti'
          ? '#D4AF37'
          : type === 'rose'
            ? Math.random() > 0.5
              ? '#D81B60'
              : '#800020'
            : PETAL_COLORS[Math.floor(Math.random() * 4)];

      return {
        x: isBurst
          ? width * 0.5 + (Math.random() - 0.5) * 300
          : Math.random() * width,
        y: fromTop
          ? -20 - Math.random() * 50
          : isBurst
            ? height * 0.4 + (Math.random() - 0.5) * 100
            : Math.random() * height,
        size:
          type === 'gold_confetti'
            ? 5 + Math.random() * 6
            : 10 + Math.random() * 12,
        color,
        speedX: (Math.random() - 0.5) * (isBurst ? 4.5 : 1.8),
        speedY: isBurst
          ? -2 - Math.random() * 4
          : 1.2 + Math.random() * 1.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.04,
        opacity: 0.75 + Math.random() * 0.25,
        type,
      };
    };

    particlesRef.current = [];
    for (let i = 0; i < 18; i++) {
      particlesRef.current.push(createParticle(false));
    }

    const burstHandler = (count = 50) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(true, true));
      }
    };
    petalListeners.add(burstHandler);

    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.8;
        p.y += p.speedY;
        if (p.speedY < 1.5) p.speedY += 4.9 * dt;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const scaleX = Math.cos(p.wobble);
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'marigold') {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 0.8,
            -p.size * 0.5,
            p.size * 0.9,
            p.size * 0.5,
            0,
            p.size
          );
          ctx.bezierCurveTo(
            -p.size * 0.9,
            p.size * 0.5,
            -p.size * 0.8,
            -p.size * 0.5,
            0,
            -p.size
          );
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.lineTo(0, p.size * 0.6);
          ctx.stroke();
        } else if (p.type === 'rose') {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(
            -p.size * 0.6,
            -p.size * 0.4,
            p.size * 1.2,
            p.size * 0.8
          );
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillRect(
            -p.size * 0.3,
            -p.size * 0.2,
            p.size * 0.6,
            p.size * 0.4
          );
        }

        ctx.restore();

        if (p.y > height + 40 || p.x < -60 || p.x > width + 60) {
          if (list.length > 22) {
            list.splice(i, 1);
          } else {
            list[i] = createParticle(true);
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', handleResize);
      petalListeners.delete(burstHandler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    />
  );
}

/* ============================================================================
 * 2. WEDDING AUDIO SINGLETON (`ne` in reference)
 * ============================================================================ */
const WEDDING_SONG_SRC = '/assets/wedding_song.mp3';

class WeddingAudioController {
  private audioElement: HTMLAudioElement | null = null;
  private isAudioPlaying = false;
  private listeners = new Set<(playing: boolean) => void>();
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  initAudioElement() {
    if (this.isInitialized && this.audioElement) return;
    try {
      const audio = new Audio();
      audio.src = WEDDING_SONG_SRC;
      audio.preload = 'auto';
      audio.loop = true;
      audio.addEventListener('play', () => {
        this.isAudioPlaying = true;
        this.notify();
      });
      audio.addEventListener('pause', () => {
        this.isAudioPlaying = false;
        this.notify();
      });
      audio.addEventListener('ended', () => {
        if (audio.loop) {
          audio.play().catch(() => {});
        } else {
          this.isAudioPlaying = false;
          this.notify();
        }
      });
      this.audioElement = audio;
      this.isInitialized = true;
    } catch (err) {
      console.warn('Audio initialization notice:', err);
    }
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isAudioPlaying);
      } catch (err) {
        console.error(err);
      }
    });
  }

  subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    cb(this.isAudioPlaying);
    return () => {
      this.listeners.delete(cb);
    };
  }

  playMusic() {
    this.initAudioElement();
    if (this.audioElement) {
      this.audioElement.loop = true;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isAudioPlaying = true;
            this.notify();
          })
          .catch((err) => {
            console.warn('Autoplay restriction notice:', err);
          });
      }
    }
  }

  pauseMusic() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isAudioPlaying = false;
    this.notify();
  }

  toggleMusic() {
    if (this.isAudioPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }
}

const weddingAudio = new WeddingAudioController();

/* ============================================================================
 * 3. CUSTOM SVG MOTIFS (`m`, `h`, `g`, `_` in reference)
 * ============================================================================ */
function OrnateDivider({
  className = '',
  variant = 'lotus',
}: {
  className?: string;
  variant?: 'simple' | 'paisley' | 'lotus' | 'ornate';
}) {
  if (variant === 'simple') {
    return (
      <div
        className={`flex items-center justify-center gap-3 my-6 ${className}`}
        aria-hidden="true"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-24 sm:w-36" />
        <div className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#D4AF37]/30" />
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-24 sm:w-36" />
      </div>
    );
  }
  if (variant === 'paisley') {
    return (
      <div
        className={`flex items-center justify-center my-6 opacity-90 ${className}`}
        aria-hidden="true"
      >
        <svg
          width="220"
          height="24"
          viewBox="0 0 220 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 12H80"
            stroke="#D4AF37"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle
            cx="95"
            cy="12"
            r="3"
            fill="#800020"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          <path
            d="M110 4C106 7 106 17 110 20C114 17 114 7 110 4Z"
            fill="#D4AF37"
          />
          <circle cx="110" cy="12" r="2" fill="#FDFBF7" />
          <circle
            cx="125"
            cy="12"
            r="3"
            fill="#800020"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          <path
            d="M140 12H220"
            stroke="#D4AF37"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center my-8 ${className}`}
      aria-hidden="true"
    >
      <svg
        width="280"
        height="32"
        viewBox="0 0 280 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 16H90" stroke="url(#goldGrad)" strokeWidth="1" />
        <path
          d="M70 16C75 11 82 11 85 16C82 21 75 21 70 16Z"
          fill="#D4AF37"
          fillOpacity="0.4"
        />
        <g transform="translate(140, 16)">
          <circle
            cx="0"
            cy="0"
            r="12"
            stroke="#D4AF37"
            strokeWidth="1"
            fill="#FDFBF7"
          />
          <circle
            cx="0"
            cy="0"
            r="8"
            stroke="#800020"
            strokeWidth="0.8"
            fill="none"
          />
          <circle cx="0" cy="0" r="3" fill="#D4AF37" />
          <path
            d="M0 -12 C-3 -7, -3 -3, 0 0 C3 -3, 3 -7, 0 -12 Z"
            fill="#D4AF37"
          />
          <path
            d="M0 12 C-3 7, -3 3, 0 0 C3 3, 3 7, 0 12 Z"
            fill="#D4AF37"
          />
          <path
            d="M-12 0 C-7 -3, -3 -3, 0 0 C-3 3, -7 3, -12 0 Z"
            fill="#D4AF37"
          />
          <path
            d="M12 0 C7 -3, 3 -3, 0 0 C3 3, 7 3, 12 0 Z"
            fill="#D4AF37"
          />
        </g>
        <path
          d="M210 16C205 11 198 11 195 16C198 21 205 21 210 16Z"
          fill="#D4AF37"
          fillOpacity="0.4"
        />
        <path d="M190 16H270" stroke="url(#goldGrad)" strokeWidth="1" />
        <defs>
          <linearGradient
            id="goldGrad"
            x1="0"
            y1="0"
            x2="280"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="0.5" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function SwastikSeal({
  className = '',
  size = 'sm',
}: {
  className?: string;
  size?: 'sm' | 'lg';
}) {
  const isSmall = size === 'sm';
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        className={`${
          isSmall ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-28 h-28 sm:w-36 sm:h-36'
        } animate-[spin_50s_linear_infinite]`}
        viewBox="0 0 140 140"
        fill="none"
      >
        <circle
          cx="70"
          cy="70"
          r="66"
          stroke="#D4AF37"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.8"
        />
        <circle cx="70" cy="70" r="60" stroke="#D4AF37" strokeWidth="1.8" />
        <circle
          cx="70"
          cy="70"
          r="54"
          stroke="#D4AF37"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        {Array.from({ length: 12 }).map((_, idx) => {
          const deg = (idx * 360) / 12;
          return (
            <g key={idx} transform={`rotate(${deg} 70 70)`}>
              <path
                d="M70 12 C67 18 67 22 70 26 C73 22 73 18 70 12 Z"
                fill="#D4AF37"
                opacity="0.9"
              />
              <circle cx="70" cy="8" r="1.5" fill="#800020" />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <svg
          className={`${
            isSmall ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-10 h-10 sm:w-12 sm:h-12'
          } text-[#800020]`}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6V34 M6 20H34 M20 6H31 M34 20V31 M20 34H9 M6 20V9"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27" cy="13" r="1.6" fill="currentColor" />
          <circle cx="27" cy="27" r="1.6" fill="currentColor" />
          <circle cx="13" cy="27" r="1.6" fill="currentColor" />
          <circle cx="13" cy="13" r="1.6" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function BrideCrownIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold Maang Tikka chain & pendant */}
      <path d="M32 6 V22" stroke="#D4AF37" strokeWidth="2" strokeDasharray="2 2" />
      <circle cx="32" cy="27" r="6" fill="#D4AF37" stroke="#FDFBF7" strokeWidth="1" />
      <circle cx="32" cy="27" r="3" fill="#800020" />
      <path d="M20 20 C24 26 26 27 26 27 M44 20 C40 26 38 27 38 27" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Gold Nathiya (Bridal Nose Ring) & Bindi */}
      <circle cx="32" cy="37" r="2.2" fill="#800020" stroke="#D4AF37" strokeWidth="0.8" />
      <circle cx="27" cy="47" r="6.5" stroke="#D4AF37" strokeWidth="1.8" fill="none" />
      <circle cx="21" cy="49" r="1.5" fill="#800020" />
      <circle cx="23" cy="52" r="1.3" fill="#FDFBF7" />
      <path d="M33 47 C39 47 44 43 47 38" stroke="#D4AF37" strokeWidth="1.3" strokeDasharray="2 1.5" />
    </svg>
  );
}

function GroomToporIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Royal Bihari Wedding Pagdi / Safa with Kalgi */}
      <path
        d="M12 42 C12 26 22 18 34 18 C46 18 52 26 52 42 C46 46 18 46 12 42 Z"
        fill="#FDFBF7"
        stroke="#D4AF37"
        strokeWidth="1.8"
      />
      <path
        d="M14 36 C24 28 38 26 50 34"
        stroke="#800020"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 30 C26 23 38 24 48 29"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Kalgi plume & brooch */}
      <path
        d="M32 20 C32 12 37 7 42 8 C39 13 36 17 34 21"
        fill="#D4AF37"
      />
      <circle cx="32" cy="23" r="3.5" fill="#800020" stroke="#D4AF37" strokeWidth="1.2" />
      <rect x="14" y="43" width="36" height="5" rx="2.5" fill="#D4AF37" />
    </svg>
  );
}

/* ============================================================================
 * 4. WAX-SEAL ENVELOPE OVERLAY (`Ae` in reference)
 * ============================================================================ */
function WaxSealEnvelope({
  onOpen,
  isOpen,
}: {
  onOpen: () => void;
  isOpen: boolean;
}) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    weddingAudio.playMusic();
    showerPetals(65);
    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 1200);
  };

  if (isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#230911]/92 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-[#D4AF37]/25 blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#800020]/40 blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {[
          { top: '15%', left: '20%', delay: '0s', size: 'w-1.5 h-1.5' },
          { top: '25%', right: '22%', delay: '1.2s', size: 'w-2 h-2' },
          { top: '65%', left: '18%', delay: '2.5s', size: 'w-1 h-1' },
          { top: '75%', right: '15%', delay: '0.8s', size: 'w-2 h-2' },
          { top: '40%', left: '12%', delay: '3.1s', size: 'w-1.5 h-1.5' },
          { top: '50%', right: '10%', delay: '1.8s', size: 'w-1 h-1' },
        ].map((dot, idx) => (
          <div
            key={idx}
            className={`absolute ${dot.size} rounded-full bg-[#D4AF37] blur-[0.5px] opacity-70 animate-ping`}
            style={{
              top: dot.top,
              left: dot.left,
              right: dot.right,
              animationDuration: '3.5s',
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-[420px] aspect-[4/5] sm:aspect-[4/4.8] flex flex-col items-center justify-center perspective-1000">
        <div
          className={`relative w-full h-full rounded-2xl bg-gradient-to-b from-[#870a25] via-[#70001c] to-[#540015] p-1 shadow-2xl border-2 border-[#D4AF37]/70 flex flex-col items-center justify-between overflow-hidden transition-all duration-1000 ${
            isOpening ? 'scale-105 opacity-90' : 'scale-100'
          }`}
        >
          {/* Corner Brackets */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-30" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-30" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-30" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-30" />

          {/* Envelope Flap */}
          <div
            className={`absolute top-0 left-0 right-0 h-[46%] origin-top transition-transform duration-1000 z-10 pointer-events-none ${
              isOpening ? '-rotate-x-180 opacity-0' : 'rotate-x-0 opacity-100'
            }`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: 'linear-gradient(180deg, #9a0029 0%, #680018 100%)',
              borderBottom: '2px solid rgba(212, 175, 55, 0.5)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#D4AF37]/90 text-xs tracking-[0.25em] uppercase font-serif flex items-center gap-2 whitespace-nowrap">
              <span>✦</span>
              <span>Shubh Vivah • शुभ विवाह</span>
              <span>✦</span>
            </div>
          </div>

          {/* Center Seal & Couple Title */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full my-auto py-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#F3E5AB] uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Auspicious Wedding Invitation</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>

            <div className="relative z-30 my-2.5">
              <div className="absolute -inset-2 rounded-full bg-[#D4AF37]/25 blur-sm animate-pulse" />
              <div
                onClick={handleOpen}
                className="relative p-2 sm:p-2.5 bg-[#FDFBF7] rounded-full shadow-2xl border border-[#D4AF37] ring-2 ring-[#800020]/70 cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300"
                title="Click the auspicious Swastik seal to open the invitation"
              >
                <SwastikSeal size="sm" />
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium mt-1">
              Sah &amp; Keshri Families • साह एवं केसरी परिवार
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide mt-1 mb-0.5 drop-shadow-md">
              Mampi{' '}
              <span className="font-cormorant italic font-normal text-[#D4AF37]">
                WEDS
              </span>{' '}
              Durgesh
            </h1>
            <p className="font-devanagari text-xs text-[#F3E5AB]/90">
              आयुष्मती मम्पी संग चिरंजीव दुर्गेश • २४.११.२०२६
            </p>
          </div>

          {/* Open Button */}
          <div className="relative z-30 mb-5 flex flex-col items-center">
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className={`group relative flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#800020] font-semibold text-sm tracking-wider uppercase shadow-xl hover:shadow-[#D4AF37]/50 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden ${
                isOpening ? 'opacity-80 animate-pulse' : 'animate-bounce'
              }`}
              style={{ animationDuration: '2.5s' }}
              aria-label="Tap to open wedding invitation envelope"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="w-6 h-6 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center shadow-inner text-xs font-serif font-bold">
                ❦
              </span>
              <span>
                {isOpening ? 'Opening Envelope...' : 'Tap to Open Envelope'}
              </span>
              <Heart className="w-4 h-4 fill-[#800020] text-[#800020] group-hover:scale-125 transition-transform" />
            </button>
            <span className="text-[11px] text-[#F3E5AB]/85 tracking-wider mt-2 font-light">
              Tap the seal or button to open • खोलने के लिए टैप करें
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 5. STICKY HEADER (`je` in reference)
 * ============================================================================ */
function StickyHeader({
  onReopenEnvelope,
}: {
  onReopenEnvelope: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return weddingAudio.subscribe((playing) => setIsPlaying(playing));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <a
          href="#"
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#800020] whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          Mampi WEDS Durgesh
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2D2424]/80">
          <a href="#couple" className="hover:text-[#800020] transition-colors">
            Couple
          </a>
          <a href="#rituals" className="hover:text-[#800020] transition-colors">
            Rituals
          </a>
          <a href="#gallery" className="hover:text-[#800020] transition-colors">
            Gallery
          </a>
          <a href="#venues" className="hover:text-[#800020] transition-colors">
            Venues &amp; Map
          </a>
          <a href="#rsvp" className="hover:text-[#800020] transition-colors">
            RSVP
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              if (!isPlaying) showerPetals(40);
              weddingAudio.toggleMusic();
            }}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-[#800020] text-[#F3E5AB] border border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                : 'bg-white border border-[#D4AF37]/60 text-slate-600 hover:text-[#800020] hover:bg-[#FAF5EB]'
            }`}
            title={isPlaying ? 'Mute wedding music' : 'Unmute wedding music'}
            aria-label={isPlaying ? 'Mute wedding music' : 'Play wedding music'}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span className="hidden sm:inline">Music Playing</span>
                <span
                  className="flex items-end gap-0.5 h-3 ml-0.5"
                  aria-hidden="true"
                >
                  <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse" />
                  <span className="w-0.5 h-3 bg-[#D4AF37] animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-[#D4AF37] animate-pulse delay-150" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#800020]" />
                <span className="hidden sm:inline">Music Muted</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReopenEnvelope}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#800020] text-white text-xs font-semibold hover:bg-[#68001a] transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
            title="View Wedding Envelope Cover"
            aria-label="Open wax seal envelope cover"
          >
            <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Envelope</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================================
 * 6. MEET THE BRIDE & GROOM SECTION (`Me` in reference)
 * ============================================================================ */
function CoupleSection() {
  return (
    <section id="couple" className="relative pt-2 pb-14 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>The Blessed Union • पावन परिणय</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#800020]">
          Meet the Bride &amp; Groom
        </h2>
        <p className="text-base text-[#2D2424]/75 font-cormorant italic mt-1 max-w-lg mx-auto">
          &ldquo;Two families, two hearts, and a lifetime of shared laughter.&rdquo;
          <span className="block font-devanagari not-italic text-xs text-[#800020] mt-1">
            दो परिवारों का मिलन, दो दिलों का बंधन और जीवन भर का साथ
          </span>
        </p>
        <OrnateDivider variant="lotus" className="my-4" />
      </div>

      {/* Ornate Framed Couple Portrait Centerpiece */}
      <div className="relative mb-14 max-w-sm sm:max-w-md mx-auto">
        <div className="absolute -inset-2.5 bg-gradient-to-b from-[#D4AF37]/30 via-[#800020]/20 to-[#D4AF37]/30 rounded-[2.5rem] blur-xl opacity-75 pointer-events-none" />
        <div className="relative p-3 sm:p-4 rounded-[2rem] bg-gradient-to-b from-[#E5C158] via-[#FFF6DD] to-[#AA7C11] shadow-2xl border-2 border-[#D4AF37]">
          <div className="relative p-1.5 sm:p-2 rounded-[1.6rem] bg-gradient-to-b from-[#6e0018] via-[#48000f] to-[#6e0018] shadow-inner">
            <div className="relative rounded-[1.2rem] overflow-hidden aspect-[1042/1509] bg-[#E8ABA2] shadow-md group">
              <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md" />
              <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md" />
              <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md" />
              <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-[#D4AF37] z-20 pointer-events-none drop-shadow-md" />

              <img
                src={WEDDING_IMAGES.couplePortrait}
                alt="Mampi and Durgesh in Traditional Bihari Wedding Attire"
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 select-none"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#230911]/92 via-[#230911]/60 to-transparent pt-12 pb-4 px-4 text-center text-white z-10">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#F3E5AB] font-semibold flex items-center justify-center gap-1.5">
                  <span>✦</span>
                  <span>An Auspicious Journey Begins</span>
                  <span>✦</span>
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Mampi WEDS Durgesh
                </h3>
                <p className="font-cormorant italic text-xs sm:text-sm text-[#FDFBF7]/90 mt-0.5">
                  Two souls united under the blessings of our elders • मम्पी संग दुर्गेश
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Bride & Groom Lineage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* The Bride: Mampi */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border-2 border-[#D4AF37]/50 shadow-xl flex flex-col justify-between group hover:border-[#D4AF37] transition-all">
          <div className="absolute top-4 right-4 text-[#D4AF37]">
            <Flower2 className="w-5 h-5 opacity-70" />
          </div>

          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#800020] to-[#540015] p-2 flex items-center justify-center shadow-lg border border-[#D4AF37]/60 group-hover:rotate-3 transition-transform">
                <BrideCrownIcon className="w-12 h-12" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                  The Bride • आयुष्मती वधू
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#800020]">
                  Mampi
                </h3>
                <span className="font-devanagari text-xs text-[#997A15] font-semibold">
                  आयुष्मती मम्पी
                </span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent my-4" />

            <div className="space-y-3 text-sm text-[#2D2424]/85">
              <div className="flex items-start gap-2.5">
                <span className="text-xs text-[#800020] font-bold mt-0.5 shrink-0">
                  Parents:
                </span>
                <span className="font-medium">
                  Daughter of{' '}
                  <strong className="text-[#800020] font-semibold">
                    Poonam Saw
                  </strong>{' '}
                  &amp;{' '}
                  <strong className="text-[#800020] font-semibold">
                    Lt. Saroj Kumar Sah
                  </strong>
                  <span className="block font-devanagari text-xs text-[#800020]/85 mt-1">
                    सुपुत्री: श्रीमती पूनम साव एवं स्व. सरोज कुमार साह
                  </span>
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xs text-[#800020] font-bold mt-0.5 shrink-0">
                  Hometown:
                </span>
                <span className="font-medium">
                  <strong className="text-[#800020] font-semibold">
                    Rampurhat, Birbhum
                  </strong>{' '}
                  (रामपुरहाट, बीरभूम)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#800020]">
            <span className="font-cormorant italic text-sm">
              &ldquo;Graceful, radiant &amp; blessed&rdquo;
            </span>
            <Heart className="w-4 h-4 fill-[#800020] text-[#800020]" />
          </div>
        </div>

        {/* The Groom: Durgesh */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border-2 border-[#D4AF37]/50 shadow-xl flex flex-col justify-between group hover:border-[#D4AF37] transition-all">
          <div className="absolute top-4 right-4 text-[#D4AF37]">
            <Flower2 className="w-5 h-5 opacity-70" />
          </div>

          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#800020] to-[#540015] p-2 flex items-center justify-center shadow-lg border border-[#D4AF37]/60 group-hover:-rotate-3 transition-transform">
                <GroomToporIcon className="w-12 h-12" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                  The Groom • चिरंजीव वर
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#800020]">
                  Durgesh
                </h3>
                <span className="font-devanagari text-xs text-[#997A15] font-semibold">
                  चिरंजीव दुर्गेश
                </span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent my-4" />

            <div className="space-y-3 text-sm text-[#2D2424]/85">
              <div className="flex items-start gap-2.5">
                <span className="text-xs text-[#800020] font-bold mt-0.5 shrink-0">
                  Parents:
                </span>
                <span className="font-medium">
                  Son of{' '}
                  <strong className="text-[#800020] font-semibold">
                    Lt. Shobha Devi
                  </strong>{' '}
                  &amp;{' '}
                  <strong className="text-[#800020] font-semibold">
                    Lt. Vishwanath Keshri
                  </strong>
                  <span className="block font-devanagari text-xs text-[#800020]/85 mt-1">
                    सुपुत्र: स्व. शोभा देवी एवं स्व. विश्वनाथ केसरी
                  </span>
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xs text-[#800020] font-bold mt-0.5 shrink-0">
                  Heart:
                </span>
                <span className="font-medium text-[#2D2424]/75">
                  Ready to welcome Mampi into the Keshri family forever
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#800020]">
            <span className="font-cormorant italic text-sm">
              &ldquo;Steadfast, joyful &amp; loving&rdquo;
            </span>
            <Heart className="w-4 h-4 fill-[#800020] text-[#800020]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * 7. COUNTDOWN TIMER SECTION (`Ne` in reference)
 * ============================================================================ */
function CountdownSection() {
  const targetTime = new Date('2026-11-24T19:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        isComplete: false,
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const items = [
    { label: 'DAYS • दिन', value: timeLeft.days },
    { label: 'HOURS • घंटे', value: timeLeft.hours },
    { label: 'MINUTES • मिनट', value: timeLeft.minutes },
    { label: 'SECONDS • सेकंड', value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-12 px-4 max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Counting Every Moment • शुभ मुहूर्त</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#800020] mb-2">
        Until We Say &ldquo;I Do&rdquo;
      </h2>
      <p className="text-sm text-[#2D2424]/75 font-cormorant italic text-base mb-8">
        Counting down the joyous hours until the sacred Varmala &amp; Shubh Vivah on 24.11.2026.
      </p>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg mx-auto">
        {items.map((item) => (
          <div
            key={item.label}
            className="relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F2E6D4] border border-[#D4AF37]/50 shadow-lg group hover:border-[#D4AF37] transition-all"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="font-display text-2xl sm:text-4xl font-bold text-[#800020] tabular-nums tracking-tight group-hover:scale-105 transition-transform">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#997A15] uppercase mt-1">
              {item.label}
            </span>
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-[#D4AF37]/20 pointer-events-none" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#800020]">
        <Heart className="w-3.5 h-3.5 fill-[#800020] text-[#800020] animate-pulse" />
        <span>24.11.2026 • 7pm Onwards • Jay Maa Tara Anusthan Bhawan</span>
      </div>
    </section>
  );
}

/* ============================================================================
 * 8. RITUALS & FUNCTIONS TIMELINE (`Fe` in reference)
 * ============================================================================ */
const RITUALS_TIMELINE = [
  {
    id: 'mehendi',
    number: '01',
    title: 'Mehendi Ceremony',
    hindiTitle: 'मेहंदी रस्म • शुभ मेहंदी (Shubh Mehendi)',
    dateTime: '22.11.2026 | Afternoon & Evening',
    venueName: 'Own House (निज निवास)',
    venueAddress: 'Rampurhat, Birbhum, West Bengal',
    mapsUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    dressCode: 'Green of All Shades 🌿 (मेहंदी हरा परिधान)',
    dressColorStyle: 'bg-emerald-800/10 text-emerald-900 border-emerald-300',
    note: 'Get dressed up, adorn your hands with auspicious henna, and sing joyful traditional Vivah Geet with the family! (पारंपरिक मंगल गीतों और शगुन की मेहंदी का पावन उत्सव)',
    foodTeaser: 'Festive evening refreshments, sweets & warm hospitality at our family residence!',
    icon: Music,
  },
  {
    id: 'puja-matkor-haldi',
    number: '02',
    title: 'SatyaNarayan Pujan, Matkor, Ghee Dhari, Haldi',
    hindiTitle: 'सत्यनारायण पूजन, मटकोर, घी ढारी एवं हल्दी उत्सव',
    dateTime: '23.11.2026 | Morning to Evening',
    venueName: 'Own House (निज निवास)',
    venueAddress: 'Rampurhat, Birbhum, West Bengal',
    mapsUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    dressCode: 'Yellow in All Shades 🌻 (पीला एवं केसरिया परिधान)',
    dressColorStyle: 'bg-amber-500/15 text-amber-950 border-amber-400',
    note: 'A sacred day of Vedic blessings starting with Sri SatyaNarayan Pujan and ancestral Ghee Dhari, followed by fragrant marigold petals, turmeric Haldi, and traditional Matkor rituals!',
    foodTeaser: 'Sacred SatyaNarayan Prasad & traditional festive feast for all family and guests!',
    icon: Sun,
  },
  {
    id: 'wedding',
    number: '03',
    title: 'Wedding (Shubh Vivah & Priti Bhoj)',
    hindiTitle: 'शुभ विवाह, जयमाला एवं प्रीतिभोज',
    dateTime: '24.11.2026 | 7pm Onwards (संध्या ७ बजे से)',
    venueName: 'Jay Maa Tara Anusthan Bhawan (जय माँ तारा अनुष्ठान भवन)',
    venueAddress: 'Sanghata para, Rampurhat, Birbhum',
    mapsUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    dressCode: 'Royal Traditional & Ethnic Attire ✨ (शाही पारंपरिक परिधान)',
    dressColorStyle: 'bg-[#D4AF37]/15 text-[#800020] border-[#D4AF37]',
    note: 'We welcome you whole-heartedly to bless Mampi & Durgesh as they exchange sacred garlands (Varmala) and take the seven vows under the wedding mandap ❣️',
    borjatriWarning:
      'Baraat Swagat, Auspicious Jaimala, Grand Wedding Feast & Shubh Lagna Saptapadi at Jay Maa Tara Anusthan Bhawan!',
    icon: Flame,
  },
];

function RitualsSection() {
  const [expandedId, setExpandedId] = useState<string | null>('wedding');

  return (
    <section id="rituals" className="relative py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Sacred Ceremonies • मांगलिक कार्यक्रम</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#800020]">
          Rituals &amp; Functions Timeline
        </h2>
        <p className="text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto">
          Three auspicious days of tradition, devotion, feast, and celebration (22.11.2026 – 24.11.2026).
        </p>
        <OrnateDivider variant="lotus" className="my-6" />
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:left-6 md:before:left-1/2 md:before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#800020]/40 before:to-[#D4AF37]">
        {RITUALS_TIMELINE.map((item, idx) => {
          const IconComp = item.icon;
          const isExpanded = expandedId === item.id;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={item.id}
              className={`relative flex flex-col md:flex-row items-start ${
                isEven ? 'md:flex-row-reverse' : ''
              } gap-6 md:gap-10 pl-14 md:pl-0`}
            >
              {/* Number Badge */}
              <div className="absolute left-2.5 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#800020] to-[#540015] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center text-[#F3E5AB] z-10">
                <span className="text-[10px] font-bold tracking-tight">
                  {item.number}
                </span>
              </div>

              {/* Card */}
              <div
                className={`w-full md:w-[calc(50%-2rem)] p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isExpanded ? 'ring-1 ring-[#D4AF37]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-devanagari text-[#800020] block">
                        {item.hindiTitle}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#800020]">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.id)
                    }
                    className="text-xs text-[#800020] hover:text-[#540015] p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
                    aria-label={
                      isExpanded
                        ? 'Collapse ritual details'
                        : 'Expand ritual details'
                    }
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Date Badge */}
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#800020] bg-white/70 px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 w-fit">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{item.dateTime}</span>
                </div>

                {/* Venue Info */}
                <div className="mt-2.5 flex items-start gap-2 text-xs text-[#2D2424]/80 bg-white/70 p-2.5 rounded-2xl border border-[#D4AF37]/25">
                  <MapPin className="w-3.5 h-3.5 text-[#800020] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#800020] block">
                      {item.venueName}
                    </span>
                    <span className="text-[11px] block text-[#2D2424]/65">
                      {item.venueAddress}
                    </span>
                  </div>
                </div>

                {/* Dress Code */}
                {item.dressCode && (
                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${item.dressColorStyle}`}
                    >
                      <Shirt className="w-3.5 h-3.5" />
                      <span>Dress Code: {item.dressCode}</span>
                    </span>
                  </div>
                )}

                {/* Quote Note */}
                <div className="mt-3 text-xs sm:text-sm text-[#2D2424]/85 bg-white/50 p-3 rounded-xl border border-[#D4AF37]/30 italic font-cormorant">
                  &ldquo;{item.note}&rdquo;
                </div>

                {item.foodTeaser && (
                  <div className="mt-2.5 text-xs text-[#800020] bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2 font-medium">
                    <Utensils className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{item.foodTeaser}</span>
                  </div>
                )}

                {item.borjatriWarning && (
                  <div className="mt-2.5 text-xs text-[#800020] bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 flex items-start gap-2 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{item.borjatriWarning}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================================
 * 9. MOMENTS WE CHERISH GALLERY (`Le` in reference)
 * ============================================================================ */
interface GalleryItem {
  id: string;
  title: string;
  tag: string;
  caption: string;
  quote: string;
  imageSrc: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'photo-1',
    title: 'Mampi & Durgesh',
    tag: 'The Royal Union',
    caption:
      'Two hearts bound by sacred traditions, unconditional love, and shared laughter.',
    quote: 'Two souls, one heart, walking a sacred journey hand in hand.',
    imageSrc: WEDDING_IMAGES.couplePortrait,
  },
  {
    id: 'photo-2',
    title: 'Shubh Mehendi & Shagun',
    tag: '22.11.2026 • Own House',
    caption:
      'Intricate bridal henna adorned with blessings, folk melodies, and the warmth of our home in Rampurhat.',
    quote: 'Every auspicious pattern carries the prayers of our loved ones.',
    imageSrc: WEDDING_IMAGES.mehendiRitual,
  },
  {
    id: 'photo-3',
    title: 'SatyaNarayan Pujan, Matkor & Haldi',
    tag: '23.11.2026 • Sacred Rituals',
    caption:
      'Golden turmeric, marigold petals, Ghee Dhari, and sacred SatyaNarayan Puja blessings with both families.',
    quote: 'Bathed in golden turmeric and the sacred blessings of our elders.',
    imageSrc: WEDDING_IMAGES.haldiRitual,
  },
  {
    id: 'photo-4',
    title: 'Shubh Vivah & Sacred Mandap',
    tag: '24.11.2026 • 7pm Onwards',
    caption:
      'Under the glowing floral mandap at Jay Maa Tara Anusthan Bhawan, two families unite in joy.',
    quote: 'When two families unite with open hearts, a home of endless blessings is born.',
    imageSrc: WEDDING_IMAGES.heroMandap,
  },
  {
    id: 'photo-5',
    title: 'Jay Maa Tara Anusthan Bhawan',
    tag: 'Sanghata Para, Rampurhat',
    caption:
      'Illuminated arches and warm floral torans ready to welcome you in Sanghata Para, Rampurhat, Birbhum.',
    quote: 'Your presence and blessings are the greatest gift to our new beginning.',
    imageSrc: WEDDING_IMAGES.venueHall,
  },
];

function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="relative py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Our Journey In Frames • मधुर स्मृतियाँ</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#800020]">
          Moments We Cherish
        </h2>
        <p className="text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto">
          &ldquo;Every glance, every prayer, every flower petal carries the promise of tomorrow.&rdquo;
        </p>
        <OrnateDivider variant="lotus" className="my-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-3xl p-3 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#FAF5EB] border border-[#D4AF37]/30 shadow-inner">
              <img
                src={item.imageSrc}
                alt={item.title}
                className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#230911]/80 backdrop-blur-sm border border-[#D4AF37]/60 text-[10px] font-semibold tracking-wider text-[#F3E5AB] uppercase shadow-md">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>{item.tag}</span>
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="w-8 h-8 rounded-full bg-[#230911]/75 backdrop-blur-sm border border-[#D4AF37]/50 flex items-center justify-center text-[#F3E5AB] shadow-md">
                  <ZoomIn className="w-4 h-4 text-[#D4AF37]" />
                </span>
              </div>
              <div className="absolute inset-2 rounded-xl border border-white/20 pointer-events-none z-10" />
            </div>

            <div className="pt-3.5 px-2 pb-1.5 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-display text-base font-bold text-[#800020]">
                    {item.title}
                  </h4>
                  <Heart className="w-4 h-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:fill-[#800020] transition-colors shrink-0" />
                </div>
                {item.quote && (
                  <p className="font-cormorant italic text-xs sm:text-[13px] text-[#800020] font-semibold leading-snug line-clamp-2 mb-1.5">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                )}
                <p className="text-xs text-[#2D2424]/75 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/25 flex items-center justify-between text-[10px] text-[#997A15] font-semibold tracking-wider uppercase">
                <span>{item.tag}</span>
                <span className="text-[#800020] flex items-center gap-1 font-serif">
                  <span>View</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#230911]/92 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-xl w-full rounded-3xl p-3 bg-gradient-to-b from-[#D4AF37] via-[#FAF5EB] to-[#D4AF37] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#FDFBF7]">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-[#800020]/85 text-[#F3E5AB] flex items-center justify-center hover:bg-[#800020] transition-colors shadow-lg cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#230911]/85 border border-[#D4AF37]/60 text-xs font-semibold tracking-wider text-[#F3E5AB] uppercase shadow-md">
                  {selectedPhoto.tag}
                </span>
              </div>
              <div className="aspect-[3/4] w-full max-h-[65vh] overflow-hidden bg-[#FAF5EB] flex items-center justify-center">
                <img
                  src={selectedPhoto.imageSrc}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 text-center bg-[#FDFBF7] border-t border-[#D4AF37]/30">
                <h3 className="font-display text-2xl font-bold text-[#800020]">
                  {selectedPhoto.title}
                </h3>
                {selectedPhoto.quote && (
                  <p className="font-cormorant italic text-base sm:text-lg text-[#800020] font-semibold mt-1">
                    &ldquo;{selectedPhoto.quote}&rdquo;
                  </p>
                )}
                <p className="text-xs sm:text-sm text-[#2D2424]/80 mt-2 max-w-md mx-auto leading-relaxed">
                  {selectedPhoto.caption}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-[#997A15] font-semibold uppercase tracking-widest">
                  <Heart className="w-3.5 h-3.5 fill-[#800020] text-[#800020]" />
                  <span>Mampi WEDS Durgesh • 24.11.2026</span>
                  <Heart className="w-3.5 h-3.5 fill-[#800020] text-[#800020]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================================
 * 10. VENUES & LOCATIONS + INTERACTIVE GOOGLE MAP (`ze` in reference)
 * ============================================================================ */
const VENUE_COORDS = { lat: 24.1672621, lng: 87.7861147 };

const VENUES_LIST = [
  {
    id: 'jay-maa-tara',
    name: 'Jay Maa Tara Anusthan Bhawan',
    hindiName: 'जय माँ तारा अनुष्ठान भवन',
    ceremonies: 'Wedding Celebration (24.11.2026 • 7pm Onwards)',
    address: 'Sanghata para, Rampurhat, Birbhum, West Bengal 731224',
    plusCode: 'Rampurhat, Birbhum',
    mapsUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    landmark: 'Sanghata Para, Near Rampurhat Junction Railway Station (~1.5 km)',
  },
  {
    id: 'own-house',
    name: 'Own House (Family Residence • निज निवास)',
    hindiName: 'निज निवास, रामपुरहाट',
    ceremonies:
      'Mehendi (22.11.2026) & SatyaNarayan Pujan, Matkor, Ghee Dhari, Haldi (23.11.2026)',
    address: 'Rampurhat, Birbhum, West Bengal 731224',
    plusCode: 'Own House • Rampurhat',
    mapsUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
    landmark: 'Sah Family Residence, Rampurhat, Birbhum',
  },
];

function VenueMapPinMarker() {
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={VENUE_COORDS}
        onClick={() => setInfoOpen(true)}
        title="Jay Maa Tara Anusthan Bhawan, Sanghata Para, Rampurhat"
      >
        <Pin
          background="#800020"
          borderColor="#D4AF37"
          glyphColor="#FDFBF7"
          scale={1.2}
        />
      </AdvancedMarker>
      {infoOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={250}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1 text-left text-[#2D2424]">
            <p className="font-display text-sm font-bold text-[#800020]">
              Jay Maa Tara Anusthan Bhawan
            </p>
            <p className="text-xs text-[#2D2424]/80 mt-0.5">
              Sanghata para, Rampurhat, Birbhum
            </p>
            <p className="text-[11px] font-semibold text-[#997A15] mt-1">
              24.11.2026 • 7pm Onwards
            </p>
            <a
              href="https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#800020] underline"
            >
              Directions ↗
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function VenuesSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const apiKey =
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';
  const [mapTab, setMapTab] = useState<'embed' | 'sdk'>(
    apiKey ? 'sdk' : 'embed'
  );

  const handleCopy = (venue: (typeof VENUES_LIST)[0]) => {
    navigator.clipboard.writeText(
      `${venue.name}, ${venue.address} (${venue.mapsUrl})`
    );
    setCopiedId(venue.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="venues" className="relative py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Getting There • विवाह स्थल एवं मानचित्र</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#800020]">
          Venues &amp; Locations
        </h2>
        <p className="text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto">
          Clear paths and open arms waiting to welcome you in Rampurhat, Birbhum.
        </p>
        <OrnateDivider variant="lotus" className="my-6" />
      </div>

      {/* Venue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {VENUES_LIST.map((venue, idx) => (
          <div
            key={venue.id}
            className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-xl flex flex-col justify-between hover:border-[#D4AF37] transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[11px] font-bold tracking-widest text-[#997A15] uppercase bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  Venue {idx + 1}
                </span>
                <span className="text-xs text-[#800020] font-mono font-medium">
                  {venue.plusCode}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#800020] mb-0.5">
                {venue.name}
              </h3>
              <p className="font-devanagari text-xs text-[#997A15] font-semibold mb-2">
                {venue.hindiName}
              </p>

              <p className="text-xs text-[#800020] font-medium mb-3">
                Hosted: <span className="font-semibold">{venue.ceremonies}</span>
              </p>

              <div className="flex items-start gap-2 text-xs text-[#2D2424]/80 bg-white/70 p-3 rounded-2xl border border-[#D4AF37]/20 mb-4">
                <MapPin className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-[#2D2424]">
                    {venue.address}
                  </span>
                  <span className="text-[11px] text-[#2D2424]/60 block mt-0.5">
                    {venue.landmark}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D4AF37]/30 flex items-center gap-2.5">
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#68001a] transition-all shadow-md active:scale-95 text-center"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <button
                type="button"
                onClick={() => handleCopy(venue)}
                className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-[#D4AF37] text-[#800020] hover:bg-[#FAF5EB] transition-colors cursor-pointer"
                title="Copy address"
                aria-label={`Copy address for ${venue.name}`}
              >
                {copiedId === venue.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Interactive Google Map Embed Card */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border-2 border-[#D4AF37]/60 shadow-xl mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#997A15] uppercase">
              Interactive Venue Map • जय माँ तारा अनुष्ठान भवन
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#800020]">
              Jay Maa Tara Anusthan Bhawan — Sanghata Para, Rampurhat
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-full border border-[#D4AF37]/40">
            <button
              type="button"
              onClick={() => setMapTab('embed')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mapTab === 'embed'
                  ? 'bg-[#800020] text-white'
                  : 'text-[#800020] hover:bg-[#FAF5EB]'
              }`}
            >
              Google Map View
            </button>
            <button
              type="button"
              onClick={() => setMapTab('sdk')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mapTab === 'sdk'
                  ? 'bg-[#800020] text-white'
                  : 'text-[#800020] hover:bg-[#FAF5EB]'
              }`}
            >
              Interactive Pin
            </button>
          </div>
        </div>

        <div
          className="w-full rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-inner bg-[#FAF5EB]"
          style={{ height: '340px' }}
        >
          {mapTab === 'sdk' && apiKey ? (
            <APIProvider apiKey={apiKey} libraries={['marker']}>
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={VENUE_COORDS}
                defaultZoom={16}
                gestureHandling="cooperative"
                style={{ width: '100%', height: '100%' }}
              >
                <VenueMapPinMarker />
              </Map>
            </APIProvider>
          ) : (
            <iframe
              title="Jay Maa Tara Anusthan Bhawan, Sanghata Para, Rampurhat, Birbhum"
              src="https://maps.google.com/maps?q=24.1672621,87.7861147+(Jay+Maa+Tara+Anusthan+Bhawan+Rampurhat)&z=16&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#2D2424]/75">
          <span>
            📍 Sanghata para, Rampurhat, Birbhum • 24.1673° N, 87.7861° E
          </span>
          <a
            href="https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#800020] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Open https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Weather Note Card */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EB] to-[#FFFDF9] border-2 border-[#D4AF37]/60 shadow-lg flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0 border border-[#D4AF37]/40">
          <ThermometerSnowflake className="w-6 h-6 text-[#800020]" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-base sm:text-lg font-bold text-[#800020]">
              Late November Weather Note &amp; Attire Tip
            </h4>
            <span className="text-xs bg-[#800020]/10 text-[#800020] px-2.5 py-0.5 rounded-full font-medium">
              ~17°C Pleasant Evenings
            </span>
          </div>
          <p className="text-sm text-[#2D2424]/85 font-cormorant italic text-base mt-1 leading-relaxed">
            &ldquo;Late November evenings in Rampurhat get pleasantly crisp (~17°C). Light silk shawls and festive ethnic layers are recommended for late-night rituals!&rdquo;
          </p>
          <span className="text-xs text-[#2D2424]/65 block mt-2">
            Hot masala chai, coffee &amp; sumptuous wedding delicacies await you at Jay Maa Tara Anusthan Bhawan.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * 11. BLESSINGS & RSVP WITH LIVE GOOGLE SHEETS SYNC (`We` in reference)
 * ============================================================================ */
interface BlessingItem {
  id: string;
  name: string;
  relation: string;
  message: string;
  ceremony: string;
  date: string;
  isFamily?: boolean;
}

const FAMILY_SEED_BLESSINGS: BlessingItem[] = [
  {
    id: 'bless-family-1',
    name: 'Poonam Saw & Lt. Saroj Kumar Sah (Blessings)',
    relation: "Bride's Parents (वधू के माता-पिता)",
    message:
      'May Maa Tara & Lord Ganesha bless Mampi & Durgesh with endless peace, good health, and lifelong togetherness. Shubh Vivah! (माँ तारा की कृपा सदैव बनी रहे।)',
    ceremony: 'Wedding (24.11.2026)',
    date: 'Family Host Blessing',
    isFamily: true,
  },
  {
    id: 'bless-family-2',
    name: 'Lt. Shobha Devi & Lt. Vishwanath Keshri (Heavenly Blessings)',
    relation: "Groom's Parents (वर के माता-पिता)",
    message:
      'With heavenly blessings and open hearts, the Keshri family welcomes Mampi as our beloved daughter. May your home always echo with laughter!',
    ceremony: 'All Ceremonies (22.11 – 24.11.2026)',
    date: 'Heavenly Blessings',
    isFamily: true,
  },
];

const LOCAL_BLESSINGS_KEY = 'mampi_durgesh_blessings_wall_v2';
const LOCAL_SHEET_META_KEY = 'mampi_durgesh_connected_sheet_v1';

function RsvpAndBlessingsSection() {
  const [guestBlessings, setGuestBlessings] = useState<BlessingItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_BLESSINGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [fullName, setFullName] = useState('');
  const [relation, setRelation] = useState('');
  const [guestsCount, setGuestsCount] = useState('2');
  const [ceremony, setCeremony] = useState(
    'All Ceremonies (22.11 - 24.11.2026)'
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('');

  // Google Sheets OAuth Live Sync State
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [sheetMeta, setSheetMeta] = useState<SheetMetadata | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SHEET_META_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showSheetConfig, setShowSheetConfig] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [sheetNotice, setSheetNotice] = useState<string | null>(null);
  const [pendingConfirmSync, setPendingConfirmSync] = useState<{
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    return initAuth(
      (authedUser) => {
        setUser(authedUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_BLESSINGS_KEY, JSON.stringify(guestBlessings));
    } catch {
      // ignore
    }
  }, [guestBlessings]);

  useEffect(() => {
    try {
      if (sheetMeta) {
        localStorage.setItem(LOCAL_SHEET_META_KEY, JSON.stringify(sheetMeta));
      }
    } catch {
      // ignore
    }
  }, [sheetMeta]);

  const syncFromConnectedSheet = useCallback(
    async (manual = false) => {
      if (manual) setIsSyncing(true);
      try {
        const token = await getAccessToken();
        if (token && sheetMeta) {
          const rows = await fetchRsvpRowsFromSheet(
            sheetMeta.spreadsheetId,
            sheetMeta.firstSheetTitle,
            token
          );
          if (rows.length > 0) {
            const mapped: BlessingItem[] = rows.map((r) => ({
              id: r.id,
              name: r.guestName,
              relation: r.arrivalInfo || "Family & Well-wisher",
              message: r.message,
              ceremony: r.events.join(', '),
              date: r.submittedAt,
              isFamily: false,
            }));
            setGuestBlessings(mapped);
          }
          setLastSyncedAt(
            new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );
        } else if (manual) {
          setLastSyncedAt(
            new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );
        }
      } catch (err) {
        console.debug('Google Sheets sync check:', err);
      } finally {
        if (manual) setTimeout(() => setIsSyncing(false), 500);
      }
    },
    [sheetMeta]
  );

  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setNeedsAuth(false);
        setShowSheetConfig(true);
        setSheetNotice(
          'Signed in with Google! Click "Create Live RSVP Sheet" or paste an existing Sheet URL.'
        );
      }
    } catch (err: any) {
      setSheetNotice(err?.message || 'Google sign-in was cancelled.');
    }
  };

  const handleCreateLiveSheet = async () => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsSyncing(true);
    setSheetNotice(null);
    try {
      const created = await createWeddingRsvpSpreadsheet(token);
      setSheetMeta(created);
      if (guestBlessings.length > 0) {
        const recordsToPush: RsvpRecord[] = guestBlessings.map((b) => ({
          id: b.id,
          submittedAt: b.date,
          guestName: b.name,
          phone: '',
          attendance: 'joyfully_attending',
          guestCount: 2,
          side: 'both',
          events: [b.ceremony],
          arrivalInfo: b.relation,
          message: b.message,
          syncedToSheet: true,
        }));
        await appendRsvpRecordsToSheet(
          created.spreadsheetId,
          created.firstSheetTitle,
          recordsToPush,
          token
        );
      }
      setLastSyncedAt(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setSheetNotice(`Created live Google Sheet "${created.title}"!`);
    } catch (err: any) {
      setSheetNotice(err?.message || 'Could not create Google Sheet.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnectExistingSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractSpreadsheetId(sheetUrlInput);
    if (!id) return;
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsSyncing(true);
    setSheetNotice(null);
    try {
      const meta = await fetchSpreadsheetMetadata(id, token);
      setSheetMeta(meta);
      setSheetUrlInput('');
      setSheetNotice(`Connected to "${meta.title}" (${meta.firstSheetTitle})!`);
      await syncFromConnectedSheet(true);
    } catch (err: any) {
      setSheetNotice(err?.message || 'Failed to connect Google Sheet.');
    } finally {
      setIsSyncing(false);
    }
  };

  const isCannotAttend = guestsCount === 'Regretfully Cannot Attend';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !message.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const selectedCeremony = isCannotAttend
      ? 'Sending Love from Afar'
      : ceremony;
    const nowFormatted = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newBlessing: BlessingItem = {
      id: `bless-${Date.now()}`,
      name: fullName.trim(),
      relation: relation.trim() || 'Well-wisher & Friend',
      message: message.trim(),
      ceremony: selectedCeremony,
      date: 'Just now',
      isFamily: false,
    };

    setGuestBlessings((prev) => [newBlessing, ...prev]);

    try {
      const token = await getAccessToken();
      if (token && sheetMeta) {
        const record: RsvpRecord = {
          id: newBlessing.id,
          submittedAt: nowFormatted,
          guestName: newBlessing.name,
          phone: '',
          attendance: isCannotAttend
            ? 'regretfully_unable'
            : 'joyfully_attending',
          guestCount: isCannotAttend
            ? 0
            : Number.parseInt(guestsCount, 10) || 2,
          side: 'both',
          events: [selectedCeremony],
          arrivalInfo: newBlessing.relation,
          message: newBlessing.message,
          syncedToSheet: true,
        };
        await appendRsvpRecordsToSheet(
          sheetMeta.spreadsheetId,
          sheetMeta.firstSheetTitle,
          [record],
          token
        );
        setLastSyncedAt(
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
      }
    } catch (err) {
      console.warn('Google Sheet append notice:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showerPetals(50);
      setFullName('');
      setRelation('');
      setMessage('');
    }
  };

  const allBlessings = [...guestBlessings, ...FAMILY_SEED_BLESSINGS];

  return (
    <section id="rsvp" className="relative py-16 px-4 max-w-4xl mx-auto">
      {/* Mandatory Confirmation Dialog for Bulk Sheet Mutation */}
      {pendingConfirmSync && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-[#800020]">
              {pendingConfirmSync.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#2D2424]/80 mt-2 leading-relaxed">
              {pendingConfirmSync.description}
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingConfirmSync(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D4AF37] text-[#800020] bg-white hover:bg-[#FAF5EB]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const fn = pendingConfirmSync.onConfirm;
                  setPendingConfirmSync(null);
                  await fn();
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#800020] text-white hover:bg-[#68001a]"
              >
                Confirm Sync
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#800020] uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Shower Your Blessings • आशीर्वाद एवं RSVP</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#800020]">
          Blessings &amp; RSVP
        </h2>
        <p className="text-base text-[#2D2424]/75 font-cormorant italic mt-1.5 max-w-lg mx-auto">
          Leave a heartfelt wish for Mampi &amp; Durgesh or let the Sah &amp; Keshri families know you will be joining the celebrations.
        </p>
        <OrnateDivider variant="lotus" className="my-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Send a Blessing / RSVP Form */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] border border-[#D4AF37]/50 shadow-xl">
          <h3 className="font-display text-xl font-bold text-[#800020] mb-1 flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-[#D4AF37]" />
            <span>Send a Blessing / RSVP</span>
          </h3>
          <p className="text-xs text-[#2D2424]/70 mb-5">
            Your warm words mean the world to Mampi &amp; Durgesh. (आपके आशीर्वाद हमारे लिए अनमोल हैं)
          </p>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center animate-fadeIn space-y-3">
              <CircleCheck className="w-10 h-10 text-emerald-600 mb-1" />
              <h4 className="font-display text-lg font-bold text-emerald-900">
                Dhanyavaad! • धन्यवाद! (Thank You!)
              </h4>
              <p className="text-xs text-emerald-700 leading-relaxed max-w-sm">
                Your blessings and RSVP have been recorded in the family Google Sheet and added to the Wall of Blessings. We cannot wait to celebrate together in Rampurhat!
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>Write Another Blessing</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#800020] mb-1">
                  Your Full Name • आपका शुभ नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar Sah & Family"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#800020] mb-1">
                    Relation / Side • संबंध / पक्ष
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bride's Uncle, Groom's Friend"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#800020] mb-1">
                    Number of Guests • अतिथि संख्या
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                  >
                    <option value="1">1 Guest (१ अतिथि)</option>
                    <option value="2">2 Guests (२ अतिथि)</option>
                    <option value="3">3 Guests (३ अतिथि)</option>
                    <option value="4+">4+ Family Members (सपरिवार)</option>
                    <option value="Regretfully Cannot Attend">
                      Sending Love from Afar (केवल शुभकामनाएँ)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold mb-1 transition-colors ${
                    isCannotAttend ? 'text-slate-400' : 'text-[#800020]'
                  }`}
                >
                  Which Functions Will You Attend? • कार्यक्रम
                  {isCannotAttend && (
                    <span className="text-[11px] font-normal text-amber-800 italic ml-1">
                      (Disabled — Sending love from afar)
                    </span>
                  )}
                </label>
                <select
                  disabled={isCannotAttend}
                  value={isCannotAttend ? 'Sending Love from Afar' : ceremony}
                  onChange={(e) => setCeremony(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition-colors"
                >
                  {isCannotAttend ? (
                    <option value="Sending Love from Afar">
                      Sending Love from Afar (Not Attending in Person)
                    </option>
                  ) : (
                    <>
                      <option value="All Ceremonies (22.11 - 24.11.2026)">
                        All Ceremonies (22.11 – 24.11.2026)
                      </option>
                      <option value="Wedding (24.11.2026 - Jay Maa Tara Anusthan Bhawan)">
                        Wedding (24.11.2026 • Jay Maa Tara Anusthan Bhawan)
                      </option>
                      <option value="SatyaNarayan Pujan, Matkor, Ghee Dhari, Haldi (23.11.2026)">
                        SatyaNarayan Pujan, Matkor, Ghee Dhari &amp; Haldi (23.11.2026)
                      </option>
                      <option value="Mehendi (22.11.2026 - Own House)">
                        Mehendi (22.11.2026 • Own House)
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#800020] mb-1">
                  Your Blessing / Message • शुभ संदेश *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share a sweet memory or Shubh Vivah blessing for Mampi & Durgesh..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#800020] hover:bg-[#68001a] disabled:bg-[#800020]/70 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                    <span>Recording in Google Sheet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Send Blessing &amp; Confirm RSVP</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Wall of Blessings + Live Google Sheet Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-[#800020]">
                Wall of Blessings ({allBlessings.length})
              </h3>
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => syncFromConnectedSheet(true)}
                disabled={isSyncing}
                title="Click to sync latest updates with Google Sheet"
                className="flex items-center gap-1.5 text-[11px] text-[#800020] hover:text-[#997A15] bg-white/80 hover:bg-white border border-[#D4AF37]/40 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCw
                  className={`w-3 h-3 ${
                    isSyncing ? 'animate-spin text-[#D4AF37]' : ''
                  }`}
                />
                <span>{isSyncing ? 'Syncing...' : 'Sync Sheet'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSheetConfig((v) => !v)}
                className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full transition-all cursor-pointer"
                title="Configure Google Sheets Live Connection"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>{sheetMeta ? 'Sheet Linked' : 'Link Sheet'}</span>
              </button>
            </div>
          </div>

          {lastSyncedAt && (
            <div className="text-[10px] text-[#2D2424]/50 text-right pr-1">
              Synced with Google Sheet at {lastSyncedAt}
            </div>
          )}

          {/* Collapsible Google Sheets OAuth Connection Box */}
          {showSheetConfig && (
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/60 shadow-md space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#800020] flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Google Sheets Live Sync Setup</span>
                </span>
                {user && (
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-[11px] text-slate-500 hover:text-[#800020] underline"
                  >
                    Sign Out ({user.email?.split('@')[0]})
                  </button>
                )}
              </div>

              {sheetNotice && (
                <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                  {sheetNotice}
                </div>
              )}

              {needsAuth ? (
                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="gsi-material-button"
                  >
                    <div className="gsi-material-button-state" />
                    <div className="gsi-material-button-content-wrapper">
                      <div className="gsi-material-button-icon">
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          style={{ display: 'block' }}
                        >
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          />
                          <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          />
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents">
                        Sign in with Google
                      </span>
                    </div>
                  </button>
                  <p className="text-[11px] text-[#2D2424]/65">
                    Sign in to automatically create or link a Google Spreadsheet in your Google Drive.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sheetMeta && (
                    <div className="p-2.5 rounded-xl bg-white border border-[#D4AF37]/40 flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#800020] truncate">
                        {sheetMeta.title}
                      </span>
                      <a
                        href={sheetMeta.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline shrink-0 inline-flex items-center gap-1"
                      >
                        <span>Open Sheet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCreateLiveSheet}
                      disabled={isSyncing}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create New RSVP Sheet</span>
                    </button>

                    {sheetMeta && guestBlessings.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setPendingConfirmSync({
                            title: `Push ${guestBlessings.length} RSVP(s) to Google Sheet?`,
                            description: `This will append ${guestBlessings.length} guest blessing/RSVP row(s) into "${sheetMeta.title}".`,
                            onConfirm: async () => {
                              const token = await getAccessToken();
                              if (!token) return;
                              const records: RsvpRecord[] = guestBlessings.map(
                                (b) => ({
                                  id: b.id,
                                  submittedAt: b.date,
                                  guestName: b.name,
                                  phone: '',
                                  attendance: 'joyfully_attending',
                                  guestCount: 2,
                                  side: 'both',
                                  events: [b.ceremony],
                                  arrivalInfo: b.relation,
                                  message: b.message,
                                  syncedToSheet: true,
                                })
                              );
                              await appendRsvpRecordsToSheet(
                                sheetMeta.spreadsheetId,
                                sheetMeta.firstSheetTitle,
                                records,
                                token
                              );
                              setSheetNotice(
                                `Synced ${records.length} row(s) to Google Sheet!`
                              );
                            },
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-semibold cursor-pointer"
                      >
                        Push All to Sheet
                      </button>
                    )}
                  </div>

                  <form
                    onSubmit={handleConnectExistingSheet}
                    className="flex items-center gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={sheetUrlInput}
                      onChange={(e) => setSheetUrlInput(e.target.value)}
                      placeholder="Or paste existing Google Sheet URL..."
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#D4AF37]/50 rounded-lg"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold bg-[#D4AF37] text-[#800020] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Link</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Blessings List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {allBlessings.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl bg-white border ${
                  b.isFamily
                    ? 'border-[#D4AF37]/40 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20'
                    : 'border-[#D4AF37]/30'
                } shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display text-sm font-bold text-[#800020]">
                          {b.name}
                        </h4>
                        {b.isFamily && (
                          <span className="text-[9px] bg-amber-100 text-[#800020] px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase">
                            Family
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#2D2424]/60 font-medium">
                        {b.relation} • {b.ceremony}
                      </span>
                    </div>
                    <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/30 shrink-0" />
                  </div>
                  <p className="font-cormorant italic text-xs sm:text-sm text-[#2D2424]/85 mt-2">
                    &ldquo;{b.message}&rdquo;
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end text-[10px] text-slate-400">
                  <span>{b.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Sign-Off inside RSVP section (Exact match of reference) */}
      <div className="mt-16 pt-10 border-t border-[#D4AF37]/40 text-center">
        <OrnateDivider variant="paisley" className="mb-6" />
        <p className="font-display text-xl sm:text-2xl font-semibold text-[#800020] italic">
          &ldquo;Two souls, one heart, one beautiful love story.&rdquo;
        </p>
        <p className="font-cormorant text-lg sm:text-xl text-[#997A15] font-semibold mt-3">
          With lots of love, Poonam Saw &amp; The Sah and Keshri Families.
        </p>
        <p className="font-devanagari text-xs sm:text-sm text-[#800020] mt-1">
          विनीत: श्रीमती पूनम साव एवं समस्त साह तथा केसरी परिवार
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#2D2424]/60">
          <span>Sanghata para, Rampurhat, Birbhum</span>
          <span>•</span>
          <span>22.11.2026 – 24.11.2026</span>
          <span>•</span>
          <span>#MampiKiDurgeshYatra</span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * 12. FLOATING BOTTOM BAR (`Ge` in reference)
 * ============================================================================ */
function FloatingBottomBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return weddingAudio.subscribe((playing) => setIsPlaying(playing));
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-auto">
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#800020]/95 backdrop-blur-md border border-[#D4AF37] shadow-2xl text-white">
        <button
          type="button"
          onClick={() => {
            if (!isPlaying) showerPetals(50);
            weddingAudio.toggleMusic();
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#800020] shadow-md'
              : 'bg-white/10 hover:bg-white/20 text-[#FDFBF7]'
          }`}
          title={isPlaying ? 'Mute Music' : 'Unmute Music'}
          aria-label={isPlaying ? 'Mute wedding music' : 'Play wedding music'}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-[#800020] animate-pulse" />
              <span className="truncate font-bold">Music: On</span>
              <span
                className="flex items-end gap-0.5 h-3 ml-0.5"
                aria-hidden="true"
              >
                <span className="w-0.5 h-2 bg-[#800020] animate-pulse" />
                <span className="w-0.5 h-3 bg-[#800020] animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-[#800020] animate-pulse delay-150" />
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#F3E5AB]" />
              <span className="truncate">Music: Muted</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => showerPetals(50)}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#D4AF37] text-[#800020] text-xs font-semibold hover:bg-[#c49f2e] active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
          title="Shower Marigold Petals"
          aria-label="Drop marigold flower petals"
        >
          <Flower2 className="w-4 h-4" />
          <span className="hidden sm:inline">Petals</span>
        </button>

        <a
          href="#rsvp"
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-medium transition-colors shrink-0"
          aria-label="Jump to RSVP section"
        >
          <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
          <span>RSVP</span>
        </a>
      </div>
    </div>
  );
}

/* ============================================================================
 * 13. MAIN APPLICATION (`qe` in reference)
 * ============================================================================ */
const GANESHA_GOLD_SRC = '/assets/lord_ganesha_gold.jpg';

export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('wedding_envelope_opened') === 'true') {
      setIsEnvelopeOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2424] relative selection:bg-[#D4AF37]/30 selection:text-[#800020] pb-24">
      <PetalCanvas />

      {!isEnvelopeOpen && (
        <WaxSealEnvelope
          onOpen={() => {
            setIsEnvelopeOpen(true);
            sessionStorage.setItem('wedding_envelope_opened', 'true');
          }}
          isOpen={isEnvelopeOpen}
        />
      )}

      <StickyHeader onReopenEnvelope={() => setIsEnvelopeOpen(false)} />

      <main className="relative">
        {/* Hero Invitation Section */}
        <section className="relative pt-12 pb-3 px-4 text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto relative z-10">
            {/* Rotating Lord Ganesha Gold Medallion */}
            <div className="flex justify-center items-center mb-4">
              <div className="relative group mx-auto">
                <div className="absolute -inset-3 sm:-inset-4 rounded-full border border-dashed border-[#D4AF37]/40 animate-[spin_40s_linear_infinite] pointer-events-none" />
                <div className="absolute -inset-1.5 sm:-inset-2 rounded-full border border-[#D4AF37]/50 animate-pulse pointer-events-none" />
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-[#D4AF37] via-[#FFFDF9] to-[#AA7C11] shadow-2xl shadow-[#D4AF37]/35 relative transition-transform duration-500 group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#800020]/30 bg-[#FAF5EB]">
                    <img
                      src={GANESHA_GOLD_SRC}
                      alt="Lord Ganesha - The Divine Vighnaharta"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred Shloka */}
            <div className="text-center mb-5">
              <h2 className="font-devanagari text-xl sm:text-2xl md:text-3xl font-bold tracking-normal text-[#800020] drop-shadow-sm select-none">
                ॥ ॐ श्री श्री गणेशाय नमः ॥
              </h2>
              <div className="font-cormorant italic text-xs sm:text-sm text-[#997A15] tracking-wider mt-1.5 max-w-xl mx-auto px-4 font-medium">
                &ldquo;Vakratunda Mahakaya Suryakoti Samaprabha • Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada&rdquo;
              </div>
            </div>

            {/* Ornate Main Invitation Card */}
            <div className="w-full max-w-2xl mx-auto mb-4 relative">
              <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#FFFDF9]/98 via-[#FAF5EC]/95 to-[#F5ECE0]/98 border-2 border-[#D4AF37]/65 shadow-2xl shadow-[#800020]/10 backdrop-blur-sm overflow-hidden">
                {/* 4 Gold Corner Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />
                <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/30 rounded-2xl pointer-events-none" />

                <div className="space-y-4 text-center relative z-10">
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#800020]/5 border border-[#D4AF37]/50 text-[#997A15] text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Auspicious Wedding Invitation • शुभ विवाह निमंत्रण</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>

                  <p className="font-cormorant italic text-sm sm:text-base text-[#2D2424]/80 max-w-lg mx-auto">
                    With the heavenly blessings of{' '}
                    <strong className="text-[#800020]">
                      Lt. Saroj Kumar Sah
                    </strong>
                    ,{' '}
                    <strong className="text-[#800020]">
                      Lt. Vishwanath Keshri
                    </strong>{' '}
                    &amp;{' '}
                    <strong className="text-[#800020]">Lt. Shobha Devi</strong>,{' '}
                    <strong className="text-[#800020]">Poonam Saw</strong>{' '}
                    cordially invites you to celebrate
                  </p>

                  <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#800020] tracking-tight leading-tight my-1">
                    Mampi{' '}
                    <span className="font-cormorant italic font-normal text-[#D4AF37]">
                      WEDS
                    </span>{' '}
                    Durgesh
                  </h1>

                  <p className="font-devanagari text-lg sm:text-xl text-[#800020] font-bold">
                    आयुष्मती मम्पी संग चिरंजीव दुर्गेश
                  </p>

                  <p className="font-cormorant italic text-xl sm:text-2xl text-[#800020] font-semibold max-w-xl mx-auto leading-relaxed">
                    Together with their families, invite you to celebrate their wedding
                  </p>

                  <div className="py-3 px-4 sm:px-6 border-y border-[#D4AF37]/30 bg-white/40 rounded-xl my-3 space-y-2">
                    <p className="font-cormorant italic text-base sm:text-lg text-[#2D2424]/90 leading-relaxed max-w-xl mx-auto">
                      &ldquo;As two souls unite under the sacred fire of Shubh Vivah and the sweet melodies of the Shehnai, we embark on life&apos;s most beautiful journey of love, friendship, and togetherness.&rdquo;
                    </p>
                    <p className="font-devanagari text-xs sm:text-sm text-[#800020]/90 leading-relaxed max-w-xl mx-auto">
                      स्व. सरोज कुमार साह, स्व. विश्वनाथ केसरी एवं स्व. शोभा देवी के दिव्य आशीर्वाद से, श्रीमती पूनम साव अपनी सुपुत्री मम्पी एवं चिरंजीव दुर्गेश के शुभ विवाह के मांगलिक अवसर पर आपको सपरिवार सादर आमंत्रित करती हैं।
                    </p>
                    <p className="font-cormorant text-xs sm:text-sm text-[#800020] font-medium mt-1">
                      Your warm presence, prayers, and blessings will make our special day truly blessed.
                    </p>
                  </div>

                  {/* Crimson Pill: Date & City */}
                  <div className="pt-2 flex justify-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#800020] via-[#940026] to-[#800020] text-white shadow-md border border-[#D4AF37]/50 max-w-fit mx-auto">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wide">
                        <Calendar className="w-3.5 h-3.5 text-[#F3E5AB] shrink-0" />
                        <span className="text-[#FFFDF9] whitespace-nowrap">
                          24.11.2026 (7pm Onwards)
                        </span>
                      </div>
                      <span className="text-[#D4AF37] text-xs font-bold">
                        •
                      </span>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wide">
                        <MapPin className="w-3.5 h-3.5 text-[#F3E5AB] shrink-0" />
                        <span className="text-[#FFFDF9] whitespace-nowrap">
                          Rampurhat, Birbhum
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1.5 text-[11px] sm:text-xs text-[#997A15] font-serif tracking-wider">
                    ✦ Venue: Jay Maa Tara Anusthan Bhawan • Sanghata para, Rampurhat, Birbhum ✦
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="#venues"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F3E5AB]/40 text-[#800020] border border-[#D4AF37]/60 text-xs font-semibold tracking-wide shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#800020]" />
                      <span>Venue &amp; Maps</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => showerPetals(50)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:brightness-105 text-[#800020] font-bold text-xs tracking-wide shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                      <span>Shower Petals &amp; Blessings</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[#D4AF37]/30 text-xs sm:text-sm font-cormorant text-[#800020] font-semibold italic">
                    &ldquo;Two hearts • One path • An eternal bond of love • A cordial invitation from the Sah and Keshri families • #MampiKiDurgeshYatra&rdquo;
                  </div>
                </div>
              </div>
            </div>

            <OrnateDivider variant="ornate" className="my-2" />
          </div>
        </section>

        <CoupleSection />
        <CountdownSection />
        <RitualsSection />
        <GallerySection />
        <VenuesSection />
        <RsvpAndBlessingsSection />
      </main>

      <FloatingBottomBar />
    </div>
  );
}
