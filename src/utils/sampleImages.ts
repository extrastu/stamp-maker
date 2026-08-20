/**
 * Offline Sample Stamp Images
 * Stored as pure local SVG / canvas assets to eliminate any external network requests.
 */

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const OFFLINE_SAMPLES = [
  {
    id: 'coffee',
    title: 'Cafe Kyoto',
    price: '¥120',
    rotation: -4,
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="coffeeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3d2c1f"/>
            <stop offset="50%" stop-color="#604430"/>
            <stop offset="100%" stop-color="#241910"/>
          </linearGradient>
          <linearGradient id="foamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FDFBF7"/>
            <stop offset="100%" stop-color="#E2D4C0"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#coffeeBg)"/>
        <!-- Table wooden texture lines -->
        <line x1="0" y1="280" x2="300" y2="280" stroke="#785942" stroke-width="1.5" opacity="0.4"/>
        <line x1="0" y1="340" x2="300" y2="340" stroke="#4a3424" stroke-width="1.5" opacity="0.3"/>
        <!-- Coffee Cup Top View -->
        <circle cx="150" cy="180" r="85" fill="#FAF6EE" stroke="#E5DAC9" stroke-width="6"/>
        <circle cx="150" cy="180" r="70" fill="#4B2C1B"/>
        <circle cx="150" cy="180" r="58" fill="url(#foamGrad)"/>
        <!-- Latte Art Heart -->
        <path d="M150,195 C135,165 110,165 110,145 C110,130 125,120 140,132 C146,137 150,145 150,145 C150,145 154,137 160,132 C175,120 190,130 190,145 C190,165 165,165 150,195 Z" fill="#845131" opacity="0.9"/>
        <!-- Steam decoration -->
        <path d="M135,80 Q145,60 135,40" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.25" stroke-linecap="round"/>
        <path d="M165,75 Q155,55 165,35" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.25" stroke-linecap="round"/>
        <!-- Text -->
        <text x="150" y="325" font-family="serif" font-size="18" font-weight="bold" fill="#F3EAD8" text-anchor="middle" letter-spacing="2">KYOTO ROASTERY</text>
        <text x="150" y="348" font-family="sans-serif" font-size="10" fill="#A89481" text-anchor="middle" letter-spacing="1">SPECIALTY COFFEE</text>
      </svg>
    `),
  },
  {
    id: 'flower',
    title: 'Botanical',
    price: '80¢',
    rotation: 3,
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="botanicalBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#EBF1E8"/>
            <stop offset="100%" stop-color="#D5DFD1"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#botanicalBg)"/>
        <!-- Botanical Stems & Leaves -->
        <path d="M150,330 Q155,200 135,100" stroke="#3F5338" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Leaves -->
        <path d="M148,260 Q180,240 190,265 C175,275 152,270 148,260" fill="#58744F"/>
        <path d="M145,220 Q110,200 100,225 C115,235 140,230 145,220" fill="#6A8760"/>
        <path d="M143,170 Q180,150 185,175 C170,185 147,180 143,170" fill="#58744F"/>
        <!-- Flower Petals (Tulip/Peony style) -->
        <path d="M135,100 C110,70 115,30 135,45 C145,55 148,80 135,100" fill="#E88C8C" opacity="0.9"/>
        <path d="M135,100 C160,70 155,30 135,45 C125,55 122,80 135,100" fill="#F4A5A5" opacity="0.9"/>
        <circle cx="135" cy="65" r="14" fill="#E67373"/>
        <text x="150" y="360" font-family="serif" font-size="16" font-style="italic" fill="#2E3C29" text-anchor="middle">Wild Camellia</text>
        <text x="150" y="380" font-family="sans-serif" font-size="9" fill="#5E7059" text-anchor="middle" letter-spacing="2">BOTANICAL GARDEN</text>
      </svg>
    `),
  },
  {
    id: 'fuji',
    title: 'Mt. Fuji',
    price: '¥200',
    rotation: -2,
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#34495E"/>
            <stop offset="40%" stop-color="#E89B7B"/>
            <stop offset="70%" stop-color="#F5CEB2"/>
            <stop offset="100%" stop-color="#F2E6D8"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#skyGrad)"/>
        <!-- Big Red Sun -->
        <circle cx="150" cy="150" r="65" fill="#E74C3C" opacity="0.95"/>
        <!-- Mt. Fuji Silhouette -->
        <polygon points="40,320 130,170 170,170 260,320" fill="#2C3E50"/>
        <!-- Snow Cap -->
        <polygon points="130,170 170,170 188,205 170,200 155,215 145,200 130,210 112,205" fill="#FFFFFF"/>
        <!-- Lake Water -->
        <rect x="0" y="320" width="300" height="80" fill="#1A252F"/>
        <!-- Water Reflection Lines -->
        <line x1="120" y1="335" x2="180" y2="335" stroke="#E74C3C" stroke-width="2" opacity="0.6"/>
        <line x1="100" y1="345" x2="200" y2="345" stroke="#E89B7B" stroke-width="1.5" opacity="0.5"/>
        <line x1="130" y1="355" x2="170" y2="355" stroke="#F5CEB2" stroke-width="1" opacity="0.4"/>
        <text x="150" y="382" font-family="serif" font-size="14" font-weight="bold" fill="#F5F1E8" text-anchor="middle" letter-spacing="3">MT. FUJI 富士山</text>
      </svg>
    `),
  },
  {
    id: 'street',
    title: 'City Walk',
    price: '$1.50',
    rotation: 5,
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="citySunset" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1B1F3B"/>
            <stop offset="50%" stop-color="#45364B"/>
            <stop offset="85%" stop-color="#C25953"/>
            <stop offset="100%" stop-color="#E89865"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#citySunset)"/>
        <!-- City Skyline silhouettes -->
        <rect x="25" y="180" width="40" height="180" fill="#12131F"/>
        <rect x="70" y="140" width="55" height="220" fill="#171929"/>
        <!-- Building Antenna -->
        <line x1="97" y1="140" x2="97" y2="110" stroke="#171929" stroke-width="2"/>
        <circle cx="97" cy="110" r="2" fill="#E74C3C"/>
        <rect x="135" y="160" width="45" height="200" fill="#12131F"/>
        <rect x="190" y="120" width="60" height="240" fill="#181B2E"/>
        <rect x="255" y="200" width="35" height="160" fill="#12131F"/>
        <!-- Building glowing windows -->
        <circle cx="85" cy="170" r="1.5" fill="#F4D03F" opacity="0.8"/>
        <circle cx="105" cy="190" r="1.5" fill="#F4D03F" opacity="0.8"/>
        <circle cx="90" cy="220" r="1.5" fill="#F4D03F" opacity="0.8"/>
        <circle cx="210" cy="150" r="1.5" fill="#F4D03F" opacity="0.8"/>
        <circle cx="230" cy="180" r="1.5" fill="#F4D03F" opacity="0.8"/>
        <!-- Moon -->
        <circle cx="60" cy="80" r="20" fill="#FDFEFE" opacity="0.85"/>
        <text x="150" y="380" font-family="serif" font-size="14" font-weight="bold" fill="#FBEFE6" text-anchor="middle" letter-spacing="3">CITY ARCHIVE</text>
      </svg>
    `),
  },
];
