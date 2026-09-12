import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Standalone Mark (Transparent background, ideal for dark UI, headers, in-app badges)
const standaloneSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="markDeepTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#26647D" />
      <stop offset="100%" stop-color="#1A4758" />
    </linearGradient>
    <linearGradient id="markCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3CD5DB" />
      <stop offset="100%" stop-color="#229FA6" />
    </linearGradient>
  </defs>

  <!-- Orbital Ring -->
  <circle cx="256" cy="270" r="148" fill="none" stroke="#225D73" stroke-width="17" />

  <!-- 3 Orbital Nodes -->
  <circle cx="135" cy="185" r="19" fill="#225D73" />
  <circle cx="377" cy="185" r="19" fill="#225D73" />
  <circle cx="256" cy="418" r="19" fill="#225D73" />

  <!-- Main 'A' Body -->
  <!-- Left Leg & Apex & Right Leg -->
  <path d="
    M 256 90 
    L 358 385 
    L 288 385 
    L 270 326 
    L 218 326 
    L 196 385 
    L 128 385
    Z
  " fill="url(#markDeepTeal)" />

  <!-- Inner Triangular Counter -->
  <polygon points="256,155 228,272 284,272" fill="#020617" />

  <!-- Circuit traces on left leg -->
  <path d="M 148 385 L 188 285 L 210 285" fill="none" stroke="#2EB7BE" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 170 385 L 202 308 L 225 308" fill="none" stroke="#229FA6" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Circuit Network across crossbar & right leg -->
  <path d="M 210 250 L 250 305 L 295 275 L 320 185" fill="none" stroke="#36C2C9" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 295 275 L 325 315" fill="none" stroke="#2BB3BA" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Network Circular Nodes -->
  <!-- Node 1: Left Flank -->
  <circle cx="210" cy="250" r="18" fill="#3CD5DB" />
  <circle cx="210" cy="250" r="9" fill="#1C4B5D" />

  <!-- Node 2: Crossbar junction -->
  <circle cx="250" cy="305" r="17" fill="#3CD5DB" />
  <circle cx="250" cy="305" r="8.5" fill="#1C4B5D" />

  <!-- Node 3: Center-Right Hub -->
  <circle cx="295" cy="275" r="18" fill="#3CD5DB" />
  <circle cx="295" cy="275" r="9" fill="#1C4B5D" />

  <!-- Node 4: Upper Right Stem -->
  <circle cx="280" cy="190" r="17" fill="#3CD5DB" />
  <circle cx="280" cy="190" r="8.5" fill="#1C4B5D" />

  <!-- Node 5: Lower Right Branch -->
  <circle cx="325" cy="315" r="16" fill="#36C2C9" />
  <circle cx="325" cy="315" r="8" fill="#1C4B5D" />

  <!-- Lower Orbital segment passing in front of bottom-center -->
  <path d="M 225 413 C 242 418, 268 418, 287 413" fill="none" stroke="#225D73" stroke-width="17" stroke-linecap="round" />
</svg>`;

// 2. Full App Icon with Rounded Squircle (Exact match to uploaded user icon)
const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F4F8" />
    </linearGradient>
    <linearGradient id="deepTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#24647C" />
      <stop offset="100%" stop-color="#1A4A5C" />
    </linearGradient>
    <linearGradient id="brightCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3CD5DB" />
      <stop offset="100%" stop-color="#20A4AA" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0F172A" flood-opacity="0.14" />
    </filter>
  </defs>

  <!-- Clean Rounded Card Tile -->
  <rect x="36" y="36" width="440" height="440" rx="98" fill="url(#cardGrad)" filter="url(#cardShadow)" />

  <g id="logo-emblem">
    <!-- Orbital Ring behind the A -->
    <circle cx="256" cy="270" r="146" fill="none" stroke="#225D73" stroke-width="17" />
    
    <!-- 3 Orbital Spherical Nodes -->
    <circle cx="136" cy="186" r="19" fill="#26647D" />
    <circle cx="376" cy="186" r="19" fill="#26647D" />
    <circle cx="256" cy="416" r="19" fill="#26647D" />

    <!-- Main Bold 'A' Body -->
    <path d="
      M 256 94 
      L 358 382 
      L 290 382 
      L 272 325 
      L 218 325 
      L 196 382 
      L 130 382
      Z
    " fill="url(#deepTeal)" />

    <!-- Inner Triangle Cutout of 'A' -->
    <polygon points="256,155 228,272 284,272" fill="#FFFFFF" />

    <!-- Circuit tracks along left leg -->
    <path d="M 152 382 L 188 285 L 210 285" fill="none" stroke="#2EB7BE" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 172 382 L 202 308 L 225 308" fill="none" stroke="#229FA6" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Circuit Network across crossbar & right leg -->
    <path d="M 210 250 L 250 305 L 295 275 L 320 185" fill="none" stroke="#36C2C9" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 295 275 L 325 315" fill="none" stroke="#2BB3BA" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Network Circular Nodes with inner depth -->
    <!-- Node 1: Left Flank -->
    <circle cx="210" cy="250" r="18" fill="#3CD5DB" />
    <circle cx="210" cy="250" r="9" fill="#1C4B5D" />

    <!-- Node 2: Crossbar junction -->
    <circle cx="250" cy="305" r="17" fill="#3CD5DB" />
    <circle cx="250" cy="305" r="8.5" fill="#1C4B5D" />

    <!-- Node 3: Center-Right Hub -->
    <circle cx="295" cy="275" r="18" fill="#3CD5DB" />
    <circle cx="295" cy="275" r="9" fill="#1C4B5D" />

    <!-- Node 4: Upper Right Stem -->
    <circle cx="280" cy="190" r="17" fill="#3CD5DB" />
    <circle cx="280" cy="190" r="8.5" fill="#1C4B5D" />

    <!-- Node 5: Lower Right Branch -->
    <circle cx="325" cy="315" r="16" fill="#36C2C9" />
    <circle cx="325" cy="315" r="8" fill="#1C4B5D" />

    <!-- Lower orbital segment passing in front of bottom-center -->
    <path d="M 225 411 C 242 416, 268 416, 287 411" fill="none" stroke="#225D73" stroke-width="17" stroke-linecap="round" />
  </g>
</svg>`;

// Round App Icon (for circular launcher icons)
const roundAppIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="roundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F4F8" />
    </linearGradient>
    <linearGradient id="deepTealR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#24647C" />
      <stop offset="100%" stop-color="#1A4A5C" />
    </linearGradient>
  </defs>

  <!-- Circular Base -->
  <circle cx="256" cy="256" r="248" fill="url(#roundGrad)" />

  <g transform="translate(0, 0)">
    <!-- Orbital Ring -->
    <circle cx="256" cy="265" r="140" fill="none" stroke="#225D73" stroke-width="16" />
    <circle cx="140" cy="182" r="18" fill="#26647D" />
    <circle cx="372" cy="182" r="18" fill="#26647D" />
    <circle cx="256" cy="405" r="18" fill="#26647D" />

    <!-- Main 'A' -->
    <path d="M 256 98 L 352 376 L 288 376 L 270 320 L 220 320 L 198 376 L 136 376 Z" fill="url(#deepTealR)" />
    <polygon points="256,155 228,268 284,268" fill="#FFFFFF" />

    <!-- Circuit tracks -->
    <path d="M 158 376 L 190 285 L 210 285" fill="none" stroke="#2EB7BE" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 210 250 L 250 305 L 295 275 L 320 185" fill="none" stroke="#36C2C9" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 295 275 L 322 315" fill="none" stroke="#2BB3BA" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Nodes -->
    <circle cx="210" cy="250" r="17" fill="#3CD5DB" />
    <circle cx="210" cy="250" r="8.5" fill="#1C4B5D" />
    <circle cx="250" cy="305" r="16" fill="#3CD5DB" />
    <circle cx="250" cy="305" r="8" fill="#1C4B5D" />
    <circle cx="295" cy="275" r="17" fill="#3CD5DB" />
    <circle cx="295" cy="275" r="8.5" fill="#1C4B5D" />
    <circle cx="280" cy="190" r="16" fill="#3CD5DB" />
    <circle cx="280" cy="190" r="8" fill="#1C4B5D" />
    <circle cx="322" cy="315" r="15" fill="#36C2C9" />
    <circle cx="322" cy="315" r="7.5" fill="#1C4B5D" />
  </g>
</svg>`;

async function buildIcons() {
  fs.writeFileSync(path.join(process.cwd(), 'public', 'logo.svg'), appIconSvg);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'logo-mark.svg'), standaloneSvg);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), standaloneSvg);

  const iconBuffer = Buffer.from(appIconSvg);
  const roundBuffer = Buffer.from(roundAppIconSvg);
  const markBuffer = Buffer.from(standaloneSvg);

  // 1. Web icons
  await sharp(iconBuffer).resize(512, 512).png().toFile(path.join(process.cwd(), 'public', 'icon.png'));
  await sharp(iconBuffer).resize(192, 192).png().toFile(path.join(process.cwd(), 'public', 'icon-192.png'));
  await sharp(markBuffer).resize(128, 128).png().toFile(path.join(process.cwd(), 'public', 'logo.png'));

  // 2. Android mipmaps
  const mipmapSizes = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  const resDir = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'res');

  for (const { dir, size } of mipmapSizes) {
    const targetDir = path.join(resDir, dir);
    if (fs.existsSync(targetDir)) {
      await sharp(iconBuffer).resize(size, size).png().toFile(path.join(targetDir, 'ic_launcher.png'));
      await sharp(roundBuffer).resize(size, size).png().toFile(path.join(targetDir, 'ic_launcher_round.png'));
      await sharp(markBuffer).resize(size, size).png().toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
      console.log(`Generated ${dir} (${size}x${size})`);
    }
  }

  console.log('All icons generated successfully!');
}

buildIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
