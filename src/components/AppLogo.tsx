import React from 'react';

interface AppLogoProps {
  size?: number | string;
  variant?: 'mark' | 'card';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 36,
  variant = 'mark',
  className = '',
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  if (variant === 'card') {
    return (
      <img
        src="/icon.png"
        alt="JEE Core Logo"
        style={{ width: pixelSize, height: pixelSize }}
        className={`rounded-xl object-contain shrink-0 shadow-sm ${className}`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 512 512"
      style={{ width: pixelSize, height: pixelSize }}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="JEE Core Emblem"
    >
      <defs>
        <linearGradient id="logoMarkDeepTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2BB5BC" />
          <stop offset="100%" stopColor="#1C556A" />
        </linearGradient>
        <linearGradient id="logoMarkCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3CD5DB" />
          <stop offset="100%" stopColor="#229FA6" />
        </linearGradient>
      </defs>

      {/* Orbital Ring with 3 nodes */}
      <circle cx="256" cy="270" r="148" fill="none" stroke="#225D73" strokeWidth="18" />
      <circle cx="135" cy="185" r="20" fill="#26647D" />
      <circle cx="377" cy="185" r="20" fill="#26647D" />
      <circle cx="256" cy="418" r="20" fill="#26647D" />

      {/* Main Bold 'A' Letterform */}
      <path
        d="M 256 90 L 358 385 L 288 385 L 270 326 L 218 326 L 196 385 L 128 385 Z"
        fill="#1C556A"
      />

      {/* Inner Cutout */}
      <polygon points="256,155 228,272 284,272" fill="#020617" />

      {/* Circuit traces on left leg */}
      <path
        d="M 148 385 L 188 285 L 210 285"
        stroke="#2EB7BE"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 170 385 L 202 308 L 225 308"
        stroke="#229FA6"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Network across crossbar & right leg */}
      <path
        d="M 210 250 L 250 305 L 295 275 L 320 185"
        stroke="#36C2C9"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 295 275 L 325 315"
        stroke="#2BB3BA"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glowing Network Nodes */}
      <circle cx="210" cy="250" r="18" fill="#3CD5DB" />
      <circle cx="210" cy="250" r="9" fill="#0B2B38" />

      <circle cx="250" cy="305" r="17" fill="#3CD5DB" />
      <circle cx="250" cy="305" r="8.5" fill="#0B2B38" />

      <circle cx="295" cy="275" r="18" fill="#3CD5DB" />
      <circle cx="295" cy="275" r="9" fill="#0B2B38" />

      <circle cx="280" cy="190" r="17" fill="#3CD5DB" />
      <circle cx="280" cy="190" r="8.5" fill="#0B2B38" />

      <circle cx="325" cy="315" r="16" fill="#36C2C9" />
      <circle cx="325" cy="315" r="8" fill="#0B2B38" />

      {/* Bottom ring segment */}
      <path
        d="M 225 413 C 242 418, 268 418, 287 413"
        stroke="#225D73"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>
  );
};
