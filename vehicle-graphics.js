/**
 * Catálogo visual de marcas automotrices, modelos y fotos vehiculares.
 * - Logotipos oficiales vectoriales de alta precisión para cada fabricante.
 * - Soporte para fotos reales locales (assets/vehicles/{slug}.jpg) y URLs personalizadas.
 * - Fallback inteligente a siluetas vehiculares realistas sin mostrar imágenes rotas.
 */
(() => {
  const BRAND_COLORS = {
    toyota: '#D32F2F',
    chevrolet: '#D97706',
    ford: '#0369A1',
    jeep: '#15803D',
    mopar: '#1D4ED8',
    hyundai: '#0284C7',
    kia: '#BE123C',
    mitsubishi: '#DC2626',
    mazda: '#475569',
    nissan: '#64748B',
    volkswagen: '#1E40AF',
    renault: '#CA8A04',
    peugeot: '#1E3A8A',
    honda: '#B91C1C',
    suzuki: '#EA580C',
    fiat: '#991B1B',
    dodge: '#DC2626',
    iveco: '#1D4ED8',
    isuzu: '#DC2626',
    caterpillar: '#EAB308',
    cummins: '#DC2626',
    mercedes: '#475569',
    hino: '#DC2626',
    volvo: '#0369A1',
    bosch: '#DC2626',
    chery: '#B91C1C',
    generic: '#64748B'
  };

  const BRAND_LOGOS = {
    toyota: `
      <svg viewBox="0 0 100 70" width="46" height="32" aria-label="Toyota">
        <ellipse cx="50" cy="35" rx="46" ry="32" fill="#D32F2F"/>
        <ellipse cx="50" cy="35" rx="42" ry="28" fill="#FFFFFF"/>
        <ellipse cx="50" cy="35" rx="38" ry="24" fill="none" stroke="#D32F2F" stroke-width="5"/>
        <ellipse cx="50" cy="27" rx="24" ry="12" fill="none" stroke="#D32F2F" stroke-width="4.5"/>
        <ellipse cx="50" cy="35" rx="11" ry="23" fill="none" stroke="#D32F2F" stroke-width="4.5"/>
      </svg>
    `,
    chevrolet: `
      <svg viewBox="0 0 100 50" width="50" height="25" aria-label="Chevrolet">
        <defs>
          <linearGradient id="gmGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="50%" stop-color="#EAB308"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <path d="M10 29h28V11h24v18h28l-6 11H62v18H38V40H16z" fill="#78350F"/>
        <path d="M12 28h26V12h24v16h26l-5 9H62v17H38V37H17z" fill="url(#gmGold)" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    `,
    ford: `
      <svg viewBox="0 0 100 56" width="50" height="28" aria-label="Ford">
        <defs>
          <linearGradient id="fordBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284C7"/>
            <stop offset="100%" stop-color="#0C4A6E"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="28" rx="48" ry="26" fill="url(#fordBlue)" stroke="#BAE6FD" stroke-width="3"/>
        <ellipse cx="50" cy="28" rx="44" ry="22" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.6"/>
        <text x="50" y="37" font-family="'Brush Script MT', 'Lucida Calligraphy', cursive, sans-serif" font-size="30" font-style="italic" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Ford</text>
      </svg>
    `,
    jeep: `
      <svg viewBox="0 0 100 48" width="50" height="24" aria-label="Jeep">
        <rect x="2" y="4" width="96" height="40" rx="7" fill="#14532D" stroke="#166534" stroke-width="2"/>
        <text x="50" y="33" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">Jeep</text>
      </svg>
    `,
    mopar: `
      <svg viewBox="0 0 90 70" width="42" height="33" aria-label="Mopar">
        <path d="M12 56V18l33 22 33-22v38H63V36L45 47 27 36v20z" fill="#2563EB"/>
        <circle cx="45" cy="18" r="9" fill="#2563EB"/>
      </svg>
    `,
    mitsubishi: `
      <svg viewBox="0 0 100 86" width="40" height="34" aria-label="Mitsubishi">
        <polygon points="50,6 66,34 50,62 34,34" fill="#DC2626"/>
        <polygon points="50,62 66,34 98,34 82,62" fill="#DC2626"/>
        <polygon points="50,62 34,34 2,34 18,62" fill="#DC2626"/>
      </svg>
    `,
    nissan: `
      <svg viewBox="0 0 100 70" width="46" height="32" aria-label="Nissan">
        <circle cx="50" cy="35" r="31" fill="none" stroke="#475569" stroke-width="6"/>
        <circle cx="50" cy="35" r="28" fill="none" stroke="#94A3B8" stroke-width="2"/>
        <rect x="4" y="26" width="92" height="18" rx="3" fill="#1E293B"/>
        <text x="50" y="39" font-family="'Arial Black', sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">NISSAN</text>
      </svg>
    `,
    hyundai: `
      <svg viewBox="0 0 100 60" width="48" height="29" aria-label="Hyundai">
        <ellipse cx="50" cy="30" rx="46" ry="26" fill="none" stroke="#0284C7" stroke-width="6"/>
        <path d="M36 43l11-26h8l-3 12 12-12h8l-11 26h-8l3-12-12 12z" fill="#0284C7"/>
      </svg>
    `,
    mazda: `
      <svg viewBox="0 0 100 66" width="46" height="30" aria-label="Mazda">
        <ellipse cx="50" cy="33" rx="46" ry="30" fill="none" stroke="#475569" stroke-width="6"/>
        <path d="M22 36c12-15 20-17 28-5 8-12 16-10 28 5-10-7-18-6-28 7-10-13-18-14-28-7z" fill="#475569"/>
      </svg>
    `,
    volkswagen: `
      <svg viewBox="0 0 100 100" width="36" height="36" aria-label="Volkswagen">
        <circle cx="50" cy="50" r="46" fill="#1E40AF" stroke="#3B82F6" stroke-width="4"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#FFFFFF" stroke-width="3.5"/>
        <path d="M30 24l12 30 8-20 8 20 12-30M33 55l17 26 17-26" fill="none" stroke="#FFFFFF" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    renault: `
      <svg viewBox="0 0 70 90" width="30" height="38" aria-label="Renault">
        <polygon points="35,4 66,45 35,86 4,45" fill="none" stroke="#EAB308" stroke-width="8.5" stroke-linejoin="round"/>
        <polygon points="35,22 51,45 35,68 19,45" fill="#0F172A"/>
      </svg>
    `,
    peugeot: `
      <svg viewBox="0 0 80 90" width="32" height="36" aria-label="Peugeot">
        <path d="M40 4L72 16v38c0 22-18 30-32 32C26 84 8 76 8 54V16z" fill="#1E3A8A" stroke="#3B82F6" stroke-width="3"/>
        <path d="M38 23c6 0 10 4 10 9-4 0-6 4-6 8 4 0 6 3 6 8-4 4-9 6-13 6 0-7 2-12 5-16-5 0-9-5-9-10 4 0 6-5 7-5z" fill="#FFFFFF"/>
      </svg>
    `,
    honda: `
      <svg viewBox="0 0 90 80" width="38" height="34" aria-label="Honda">
        <path d="M10 6h70c4 0 6 3 6 8v54c0 4-2 6-6 6H10c-4 0-6-2-6-6V14c0-5 2-8 6-8z" fill="none" stroke="#DC2626" stroke-width="5.5"/>
        <path d="M26 18h11v18h16V18h11v44H53V44H37v18H26z" fill="#DC2626"/>
      </svg>
    `,
    suzuki: `
      <svg viewBox="0 0 90 90" width="34" height="34" aria-label="Suzuki">
        <path d="M22 10h46l-26 26h26L30 80H16l26-26H16z" fill="#EA580c"/>
      </svg>
    `,
    fiat: `
      <svg viewBox="0 0 100 60" width="46" height="28" aria-label="Fiat">
        <rect x="4" y="6" width="92" height="48" rx="24" fill="#991B1B" stroke="#DC2626" stroke-width="2.5"/>
        <text x="50" y="40" font-family="'Arial Black', sans-serif" font-size="24" font-weight="900" font-style="italic" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">FIAT</text>
      </svg>
    `,
    dodge: `
      <svg viewBox="0 0 100 48" width="48" height="23" aria-label="Dodge">
        <rect x="4" y="6" width="92" height="36" rx="4" fill="#0F172A"/>
        <text x="42" y="31" font-family="'Impact', sans-serif" font-size="21" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">DODGE</text>
        <polygon points="76,10 82,10 74,38 68,38" fill="#DC2626"/>
        <polygon points="84,10 90,10 82,38 76,38" fill="#DC2626"/>
      </svg>
    `,
    iveco: `
      <svg viewBox="0 0 100 50" width="48" height="24" aria-label="Iveco">
        <rect x="4" y="6" width="92" height="38" rx="5" fill="#1D4ED8" stroke="#3B82F6" stroke-width="2"/>
        <text x="50" y="33" font-family="'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">IVECO</text>
      </svg>
    `,
    isuzu: `
      <svg viewBox="0 0 100 50" width="48" height="24" aria-label="Isuzu">
        <rect x="4" y="6" width="92" height="38" rx="4" fill="#DC2626"/>
        <text x="50" y="33" font-family="'Arial Black', sans-serif" font-size="19" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">ISUZU</text>
      </svg>
    `,
    caterpillar: `
      <svg viewBox="0 0 100 60" width="48" height="29" aria-label="Caterpillar">
        <rect x="4" y="6" width="92" height="48" rx="6" fill="#0F172A"/>
        <polygon points="36,15 64,15 50,42" fill="#EAB308"/>
        <text x="50" y="44" font-family="'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">CAT</text>
      </svg>
    `,
    cummins: `
      <svg viewBox="0 0 80 80" width="36" height="36" aria-label="Cummins">
        <rect x="6" y="6" width="68" height="68" rx="10" fill="#DC2626"/>
        <path d="M52 24H32c-6 0-10 4-10 10v12c0 6 4 10 10 10h20V44H34v-8h18z" fill="#FFFFFF"/>
      </svg>
    `,
    mercedes: `
      <svg viewBox="0 0 90 90" width="36" height="36" aria-label="Mercedes-Benz">
        <circle cx="45" cy="45" r="40" fill="none" stroke="#64748B" stroke-width="4.5"/>
        <path d="M45 7L53 43l34 14-35-5-7 32-7-32-35 5 34-14z" fill="#64748B"/>
      </svg>
    `,
    hino: `
      <svg viewBox="0 0 100 60" width="48" height="29" aria-label="Hino">
        <ellipse cx="50" cy="30" rx="45" ry="24" fill="none" stroke="#DC2626" stroke-width="4.5"/>
        <path d="M30 18v24h8V33h24v9h8V18h-8v7H38v-7z" fill="#DC2626"/>
      </svg>
    `,
    generic: `
      <svg viewBox="0 0 80 70" width="38" height="33" aria-label="Multimarca">
        <path d="M40 6L72 18v26c0 18-14 24-32 26C22 68 8 62 8 44V18z" fill="#334155" stroke="#64748B" stroke-width="2"/>
        <path d="M30 35l8 8 16-16" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
    `
  };

  const VEHICLE_SILHOUETTES = {
    pickup: `
      <svg viewBox="0 0 240 100" class="vehicle-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 62h18m38 0h94m38 0h22v-16l-18-6-16-16h-44l-14 16H88l-18-12H44l-20 18v16z" stroke="currentColor" fill="rgba(234, 88, 12, 0.08)"/>
        <path d="M72 40h54l10 14H60z" fill="rgba(234, 88, 12, 0.22)" stroke="currentColor" stroke-width="2"/>
        <path d="M142 40h24l10 14h-34z" fill="rgba(234, 88, 12, 0.22)" stroke="currentColor" stroke-width="2"/>
        <circle cx="48" cy="64" r="15" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="48" cy="64" r="6" fill="#94A3B8"/>
        <circle cx="184" cy="64" r="15" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="184" cy="64" r="6" fill="#94A3B8"/>
        <line x1="168" y1="46" x2="168" y2="60" stroke="currentColor" stroke-width="2"/>
      </svg>
    `,
    suv: `
      <svg viewBox="0 0 240 100" class="vehicle-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 63h20m38 0h92m38 0h20v-18l-14-6-16-18H74L48 38 22 47v16z" stroke="currentColor" fill="rgba(30, 58, 138, 0.08)"/>
        <path d="M54 39h40v14H42z" fill="rgba(30, 58, 138, 0.22)" stroke="currentColor" stroke-width="2"/>
        <path d="M100 39h44v14h-44z" fill="rgba(30, 58, 138, 0.22)" stroke="currentColor" stroke-width="2"/>
        <path d="M150 39h32l10 14h-42z" fill="rgba(30, 58, 138, 0.22)" stroke="currentColor" stroke-width="2"/>
        <circle cx="52" cy="64" r="15" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="52" cy="64" r="6" fill="#94A3B8"/>
        <circle cx="182" cy="64" r="15" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="182" cy="64" r="6" fill="#94A3B8"/>
        <line x1="76" y1="18" x2="174" y2="18" stroke="currentColor" stroke-width="3"/>
      </svg>
    `,
    sedan: `
      <svg viewBox="0 0 240 100" class="vehicle-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 64h22m36 0h92m36 0h22v-16l-24-6-26-20H88L52 38 22 46v18z" stroke="currentColor" fill="rgba(14, 165, 233, 0.08)"/>
        <path d="M58 40h42v14H46z" fill="rgba(14, 165, 233, 0.22)" stroke="currentColor" stroke-width="2"/>
        <path d="M106 40h44v14h-44z" fill="rgba(14, 165, 233, 0.22)" stroke="currentColor" stroke-width="2"/>
        <circle cx="54" cy="65" r="14" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="54" cy="65" r="5" fill="#94A3B8"/>
        <circle cx="182" cy="65" r="14" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="182" cy="65" r="5" fill="#94A3B8"/>
      </svg>
    `,
    hatchback: `
      <svg viewBox="0 0 240 100" class="vehicle-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 64h22m36 0h84m36 0h24v-18l-8-12-28-14H92L60 36 24 44v20z" stroke="currentColor" fill="rgba(16, 185, 129, 0.08)"/>
        <path d="M66 38h40v14H54z" fill="rgba(16, 185, 129, 0.22)" stroke="currentColor" stroke-width="2"/>
        <path d="M112 38h46l10 14h-56z" fill="rgba(16, 185, 129, 0.22)" stroke="currentColor" stroke-width="2"/>
        <circle cx="56" cy="65" r="14" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="56" cy="65" r="5" fill="#94A3B8"/>
        <circle cx="176" cy="65" r="14" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="176" cy="65" r="5" fill="#94A3B8"/>
      </svg>
    `,
    truck: `
      <svg viewBox="0 0 240 100" class="vehicle-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 66h20m36 0h100m36 0h20v-40h-44l-14-12H24v52z" stroke="currentColor" fill="rgba(220, 38, 38, 0.08)"/>
        <rect x="28" y="20" width="124" height="34" fill="rgba(220, 38, 38, 0.16)" stroke="currentColor" stroke-width="2"/>
        <path d="M168 20h22l12 14v12h-34z" fill="rgba(220, 38, 38, 0.25)" stroke="currentColor" stroke-width="2"/>
        <circle cx="50" cy="67" r="15" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="50" cy="67" r="6" fill="#94A3B8"/>
        <circle cx="186" cy="67" r="15" fill="#1E293B" stroke="currentColor" stroke-width="3"/>
        <circle cx="186" cy="67" r="6" fill="#94A3B8"/>
      </svg>
    `,
    industrial: `
      <svg viewBox="0 0 240 100" class="vehicle-svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="36" y="22" width="110" height="42" rx="4" stroke="currentColor" fill="rgba(234, 179, 8, 0.12)"/>
        <path d="M146 32l38-14v46l-38-10z" stroke="currentColor" fill="rgba(234, 179, 8, 0.25)"/>
        <line x1="60" y1="12" x2="60" y2="22" stroke="currentColor" stroke-width="4"/>
        <rect x="22" y="64" width="180" height="14" rx="7" fill="#1E293B" stroke="currentColor" stroke-width="2.5"/>
        <circle cx="45" cy="71" r="5" fill="#EAB308"/>
        <circle cx="75" cy="71" r="5" fill="#EAB308"/>
        <circle cx="105" cy="71" r="5" fill="#EAB308"/>
        <circle cx="135" cy="71" r="5" fill="#EAB308"/>
        <circle cx="165" cy="71" r="5" fill="#EAB308"/>
      </svg>
    `
  };

  const MODEL_RULES = [
    // Toyota
    { pattern: /\b(4runner|hilux|fortuner|kavak|tacoma|machito|autana|burbuja|hembrita|land cruiser|fj)\b/i, model: 'Hilux / 4Runner / Fortuner', slug: 'hilux', type: 'pickup', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(corolla|baby camry|sapito|pantallita|araya|sky|avila)\b/i, model: 'Corolla', slug: 'corolla', type: 'sedan', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(yaris|belta)\b/i, model: 'Yaris', slug: 'yaris', type: 'hatchback', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(terios|bego)\b/i, model: 'Terios / Bego', slug: 'terios', type: 'suv', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(camry)\b/i, model: 'Camry', slug: 'camry', type: 'sedan', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(prado|meru)\b/i, model: 'Prado / Meru', slug: 'prado', type: 'suv', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(hiace|previa)\b/i, model: 'Hiace / Previa', slug: 'hiace', type: 'truck', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(tundra|sequoia|roraima)\b/i, model: 'Tundra / Sequoia', slug: 'tundra', type: 'pickup', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(starlet)\b/i, model: 'Starlet', slug: 'starlet', type: 'hatchback', brand: 'Toyota', brandKey: 'toyota' },
    { pattern: /\b(dyna|coaster)\b/i, model: 'Dyna / Coaster', slug: 'hiace', type: 'truck', brand: 'Toyota', brandKey: 'toyota' },

    // GM / Chevrolet
    { pattern: /\b(cruze)\b/i, model: 'Cruze', slug: 'cruze', type: 'sedan', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(aveo)\b/i, model: 'Aveo', slug: 'aveo', type: 'sedan', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(optra)\b/i, model: 'Optra', slug: 'optra', type: 'sedan', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(corsa)\b/i, model: 'Corsa', slug: 'corsa', type: 'hatchback', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(spark|matiz)\b/i, model: 'Spark', slug: 'spark', type: 'hatchback', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(silverado|cheyenne|rey camion)\b/i, model: 'Silverado / Cheyenne', slug: 'silverado', type: 'pickup', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(tahoe|avalanche|suburban)\b/i, model: 'Tahoe / Avalanche', slug: 'tahoe', type: 'suv', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(blazer|grand blazer)\b/i, model: 'Blazer', slug: 'blazer', type: 'suv', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(orlando)\b/i, model: 'Orlando', slug: 'orlando', type: 'suv', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(captiva)\b/i, model: 'Captiva', slug: 'orlando', type: 'suv', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(epica)\b/i, model: 'Epica', slug: 'epica', type: 'sedan', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(cavalier)\b/i, model: 'Cavalier', slug: 'cavalier', type: 'sedan', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(kodiak)\b/i, model: 'Kodiak', slug: 'kodiak', type: 'truck', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(luv dmax|luv d-max|dmax|d-max)\b/i, model: 'Luv D-Max', slug: 'dmax', type: 'pickup', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(montana|meriva)\b/i, model: 'Montana / Meriva', slug: 'montana', type: 'pickup', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(trailblazer|trail blazer)\b/i, model: 'TrailBlazer', slug: 'blazer', type: 'suv', brand: 'Chevrolet', brandKey: 'chevrolet' },
    { pattern: /\b(cielo|lanos|racer|nubira)\b/i, model: 'Cielo / Lanos', slug: 'aveo', type: 'sedan', brand: 'Chevrolet', brandKey: 'chevrolet' },

    // Jeep / Mopar / Dodge
    { pattern: /\b(grand cherokee)\b/i, model: 'Grand Cherokee', slug: 'grand-cherokee', type: 'suv', brand: 'Jeep', brandKey: 'jeep' },
    { pattern: /\b(cherokee|liberty|wagonier|wrangler)\b/i, model: 'Cherokee / Liberty', slug: 'cherokee', type: 'suv', brand: 'Jeep', brandKey: 'jeep' },
    { pattern: /\b(compass)\b/i, model: 'Compass', slug: 'compass', type: 'suv', brand: 'Jeep', brandKey: 'jeep' },
    { pattern: /\b(caliber)\b/i, model: 'Caliber', slug: 'caliber', type: 'hatchback', brand: 'Dodge', brandKey: 'dodge' },
    { pattern: /\b(neon)\b/i, model: 'Neon', slug: 'neon', type: 'sedan', brand: 'Dodge', brandKey: 'dodge' },
    { pattern: /\b(ram)\b/i, model: 'RAM 1500 / 2500', slug: 'ram', type: 'pickup', brand: 'Dodge', brandKey: 'dodge' },
    { pattern: /\b(dakota)\b/i, model: 'Dakota', slug: 'ram', type: 'pickup', brand: 'Dodge', brandKey: 'dodge' },

    // Ford
    { pattern: /\b(explorer)\b/i, model: 'Explorer', slug: 'explorer', type: 'suv', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(fiesta)\b/i, model: 'Fiesta Power / Max / Move', slug: 'fiesta', type: 'hatchback', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(focus)\b/i, model: 'Focus', slug: 'focus', type: 'sedan', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(ecosport)\b/i, model: 'EcoSport', slug: 'ecosport', type: 'suv', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(triton|fortaleza|f150|f-150|f250|f-250|f350|f-350|super duty|fx4)\b/i, model: 'F-150 / Tritón / Super Duty', slug: 'triton', type: 'pickup', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(ranger)\b/i, model: 'Ranger', slug: 'ranger', type: 'pickup', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(bronco)\b/i, model: 'Bronco', slug: 'explorer', type: 'suv', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(fusion)\b/i, model: 'Fusion', slug: 'focus', type: 'sedan', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(ka)\b/i, model: 'Ka', slug: 'fiesta', type: 'hatchback', brand: 'Ford', brandKey: 'ford' },
    { pattern: /\b(cargo)\b/i, model: 'Ford Cargo', slug: 'cargo', type: 'truck', brand: 'Ford', brandKey: 'ford' },

    // Hyundai & Kia
    { pattern: /\b(tucson)\b/i, model: 'Tucson', slug: 'tucson', type: 'suv', brand: 'Hyundai', brandKey: 'hyundai' },
    { pattern: /\b(elantra)\b/i, model: 'Elantra', slug: 'elantra', type: 'sedan', brand: 'Hyundai', brandKey: 'hyundai' },
    { pattern: /\b(santa fe)\b/i, model: 'Santa Fe', slug: 'santa-fe', type: 'suv', brand: 'Hyundai', brandKey: 'hyundai' },
    { pattern: /\b(accent)\b/i, model: 'Accent', slug: 'accent', type: 'sedan', brand: 'Hyundai', brandKey: 'hyundai' },
    { pattern: /\b(getz)\b/i, model: 'Getz', slug: 'accent', type: 'hatchback', brand: 'Hyundai', brandKey: 'hyundai' },
    { pattern: /\b(atos)\b/i, model: 'Atos', slug: 'accent', type: 'hatchback', brand: 'Hyundai', brandKey: 'hyundai' },
    { pattern: /\b(h1|h100|hd78|hd72|hd65)\b/i, model: 'H1 / H100 / HD78', slug: 'h1', type: 'truck', brand: 'Hyundai', brandKey: 'hyundai' },
    { pattern: /\b(sportage)\b/i, model: 'Sportage', slug: 'tucson', type: 'suv', brand: 'Kia', brandKey: 'kia' },
    { pattern: /\b(picanto)\b/i, model: 'Picanto', slug: 'picanto', type: 'hatchback', brand: 'Kia', brandKey: 'kia' },
    { pattern: /\b(rio)\b/i, model: 'Rio', slug: 'rio', type: 'sedan', brand: 'Kia', brandKey: 'kia' },
    { pattern: /\b(sorento)\b/i, model: 'Sorento', slug: 'santa-fe', type: 'suv', brand: 'Kia', brandKey: 'kia' },
    { pattern: /\b(pregio)\b/i, model: 'Pregio', slug: 'h1', type: 'truck', brand: 'Kia', brandKey: 'kia' },

    // Mitsubishi
    { pattern: /\b(lancer|touring|signo)\b/i, model: 'Lancer / Touring / Signo', slug: 'lancer', type: 'sedan', brand: 'Mitsubishi', brandKey: 'mitsubishi' },
    { pattern: /\b(montero|dakar|pajero)\b/i, model: 'Montero / Dakar', slug: 'montero', type: 'suv', brand: 'Mitsubishi', brandKey: 'mitsubishi' },
    { pattern: /\b(l300|panel l300)\b/i, model: 'L300 Panel', slug: 'l300', type: 'truck', brand: 'Mitsubishi', brandKey: 'mitsubishi' },
    { pattern: /\b(l200|sportero)\b/i, model: 'L200 Sportero', slug: 'l200', type: 'pickup', brand: 'Mitsubishi', brandKey: 'mitsubishi' },
    { pattern: /\b(galant)\b/i, model: 'Galant', slug: 'lancer', type: 'sedan', brand: 'Mitsubishi', brandKey: 'mitsubishi' },
    { pattern: /\b(canter|fuso)\b/i, model: 'Canter / Fuso', slug: 'l300', type: 'truck', brand: 'Mitsubishi', brandKey: 'mitsubishi' },

    // Mazda
    { pattern: /\b(mazda 3)\b/i, model: 'Mazda 3', slug: 'mazda-3', type: 'sedan', brand: 'Mazda', brandKey: 'mazda' },
    { pattern: /\b(mazda 6)\b/i, model: 'Mazda 6', slug: 'mazda-6', type: 'sedan', brand: 'Mazda', brandKey: 'mazda' },
    { pattern: /\b(mazda 5)\b/i, model: 'Mazda 5', slug: 'mazda-3', type: 'suv', brand: 'Mazda', brandKey: 'mazda' },
    { pattern: /\b(bt50|bt-50|b2600|b2200)\b/i, model: 'BT-50 / B2600', slug: 'bt50', type: 'pickup', brand: 'Mazda', brandKey: 'mazda' },
    { pattern: /\b(allegro|laser|ford laser|demio|626|323)\b/i, model: 'Allegro / Láser', slug: 'allegro', type: 'sedan', brand: 'Mazda', brandKey: 'mazda' },

    // Volkswagen
    { pattern: /\b(gol|parati|saveiro)\b/i, model: 'Gol / Saveiro / Parati', slug: 'gol', type: 'hatchback', brand: 'Volkswagen', brandKey: 'volkswagen' },
    { pattern: /\b(fox|spacefox|crossfox)\b/i, model: 'Fox / CrossFox', slug: 'fox', type: 'hatchback', brand: 'Volkswagen', brandKey: 'volkswagen' },
    { pattern: /\b(bora|jetta|passat|polo|golf)\b/i, model: 'Bora / Jetta / Golf', slug: 'bora', type: 'sedan', brand: 'Volkswagen', brandKey: 'volkswagen' },

    // Renault
    { pattern: /\b(clio|symbol|logan|twingo|megane|scenic|kangoo)\b/i, model: 'Clio / Symbol / Logan', slug: 'clio', type: 'hatchback', brand: 'Renault', brandKey: 'renault' },

    // Nissan
    { pattern: /\b(sentra|tiida|b13|b14|b15|b16|almera)\b/i, model: 'Sentra / Tiida / B15', slug: 'sentra', type: 'sedan', brand: 'Nissan', brandKey: 'nissan' },
    { pattern: /\b(frontier|d21|d22)\b/i, model: 'Frontier / D22', slug: 'frontier', type: 'pickup', brand: 'Nissan', brandKey: 'nissan' },
    { pattern: /\b(patrol|pathfinder|murano)\b/i, model: 'Patrol / Pathfinder', slug: 'frontier', type: 'suv', brand: 'Nissan', brandKey: 'nissan' },

    // Suzuki
    { pattern: /\b(grand vitara|vitara|xl5|xl7|j3)\b/i, model: 'Grand Vitara XL5 / XL7', slug: 'grand-vitara', type: 'suv', brand: 'Suzuki', brandKey: 'suzuki' },
    { pattern: /\b(swift|steem|wagon r)\b/i, model: 'Swift / Esteem / Wagon R', slug: 'swift', type: 'hatchback', brand: 'Suzuki', brandKey: 'suzuki' },

    // Honda
    { pattern: /\b(civic)\b/i, model: 'Civic', slug: 'civic', type: 'sedan', brand: 'Honda', brandKey: 'honda' },
    { pattern: /\b(accord)\b/i, model: 'Accord', slug: 'accord', type: 'sedan', brand: 'Honda', brandKey: 'honda' },
    { pattern: /\b(crv|cr-v|pilot|odyssey|fit)\b/i, model: 'CR-V / Pilot / Fit', slug: 'crv', type: 'suv', brand: 'Honda', brandKey: 'honda' },

    // Peugeot / Citroen
    { pattern: /\b(206|207|307|407|408|partner|c3|c4)\b/i, model: '206 / 207 / 307', slug: 'peugeot-206', type: 'hatchback', brand: 'Peugeot', brandKey: 'peugeot' },

    // Fiat
    { pattern: /\b(palio|siena|uno fire|fire|idea)\b/i, model: 'Palio / Siena / Uno Fire', slug: 'palio', type: 'hatchback', brand: 'Fiat', brandKey: 'fiat' },

    // Iveco
    { pattern: /\b(daily|5012|6012|5912|70c16)\b/i, model: 'Daily 5012 / 6012 / 70C16', slug: 'iveco-daily', type: 'truck', brand: 'Iveco', brandKey: 'iveco' },
    { pattern: /\b(tector|vertis|eurocargo|stralis)\b/i, model: 'Tector / Vertis / Stralis', slug: 'iveco-tector', type: 'truck', brand: 'Iveco', brandKey: 'iveco' },

    // Heavy duty / Industrial
    { pattern: /\b(caterpillar|cat 3116|3304|3306|c-9|3406|3408|3208)\b/i, model: 'Cat 3116 / 3306 / C-9', slug: 'cat-3116', type: 'industrial', brand: 'Caterpillar', brandKey: 'caterpillar' },
    { pattern: /\b(cummins|celect|qsb|isb|6ct|isc|isf|4bt|6bt)\b/i, model: 'Cummins ISB / QSB / 6CT', slug: 'cummins-isb', type: 'industrial', brand: 'Cummins', brandKey: 'cummins' },
    { pattern: /\b(npr|nkr|fvr|4hk1|6hk1|4hg1)\b/i, model: 'Isuzu NPR / NKR / FVR', slug: 'isuzu-npr', type: 'truck', brand: 'Isuzu', brandKey: 'isuzu' },
    { pattern: /\b(sprinter|om611|om457)\b/i, model: 'Sprinter CDI / OM611', slug: 'sprinter', type: 'truck', brand: 'Mercedes-Benz', brandKey: 'mercedes' },
    { pattern: /\b(hino 300|hino 500)\b/i, model: 'Hino 300 / 500', slug: 'hino', type: 'truck', brand: 'Hino', brandKey: 'hino' },
    { pattern: /\b(yutong)\b/i, model: 'Autobús Yutong', slug: 'yutong', type: 'truck', brand: 'Yutong', brandKey: 'truck' },
    { pattern: /\b(mack|mp7|mp8)\b/i, model: 'Mack MP7 / MP8', slug: 'mack', type: 'truck', brand: 'Mack', brandKey: 'truck' },
    { pattern: /\b(volvo|d11|d13)\b/i, model: 'Volvo D11 / D13', slug: 'volvo', type: 'truck', brand: 'Volvo', brandKey: 'volvo' },
    { pattern: /\b(komatsu|pc200)\b/i, model: 'Komatsu PC200 / PC220', slug: 'komatsu', type: 'industrial', brand: 'Komatsu', brandKey: 'industrial' },
    { pattern: /\b(bobcat|kubota)\b/i, model: 'Bobcat / Kubota', slug: 'bobcat', type: 'industrial', brand: 'Bobcat', brandKey: 'industrial' }
  ];

  function detectBrandKey(rawBrand) {
    const s = String(rawBrand || '').toLowerCase();
    if (s.includes('toyota')) return 'toyota';
    if (s.includes('chevrolet') || s.includes('gm') || s.includes('chevy')) return 'chevrolet';
    if (s.includes('ford') || s.includes('motorcraft')) return 'ford';
    if (s.includes('jeep')) return 'jeep';
    if (s.includes('mopar')) return 'mopar';
    if (s.includes('dodge')) return 'dodge';
    if (s.includes('hyundai')) return 'hyundai';
    if (s.includes('kia')) return 'kia';
    if (s.includes('mitsubishi')) return 'mitsubishi';
    if (s.includes('mazda')) return 'mazda';
    if (s.includes('nissan')) return 'nissan';
    if (s.includes('volkswagen') || s.includes('vw')) return 'volkswagen';
    if (s.includes('renault')) return 'renault';
    if (s.includes('peugeot') || s.includes('citroen')) return 'peugeot';
    if (s.includes('honda')) return 'honda';
    if (s.includes('suzuki')) return 'suzuki';
    if (s.includes('fiat')) return 'fiat';
    if (s.includes('iveco')) return 'iveco';
    if (s.includes('isuzu')) return 'isuzu';
    if (s.includes('caterpillar') || s.includes('cat')) return 'caterpillar';
    if (s.includes('cummins')) return 'cummins';
    if (s.includes('mercedes')) return 'mercedes';
    if (s.includes('hino') || s.includes('hijo')) return 'hino';
    if (s.includes('volvo')) return 'volvo';
    if (s.includes('chery')) return 'chery';
    if (s.includes('bosch')) return 'bosch';
    return 'generic';
  }

  function resolveVehicle(part) {
    const name = part.name || '';
    const brandRaw = part.brand || part.brandRaw || '';
    const detectedKey = detectBrandKey(brandRaw);

    const matchedRule = MODEL_RULES.find((r) => r.pattern.test(name));

    let finalBrand = part.brand;
    let brandKey = detectedKey;
    let modelName = 'Línea Multimodelo';
    let vehicleType = 'sedan';
    let slug = 'default';

    if (matchedRule) {
      modelName = matchedRule.model;
      vehicleType = matchedRule.type;
      slug = matchedRule.slug || 'default';
      if (detectedKey === 'generic' || detectedKey === 'mopar' || detectedKey === 'bosch') {
        brandKey = matchedRule.brandKey || detectedKey;
      }
    } else {
      if (brandKey === 'toyota') { modelName = 'Hilux / Corolla / Yaris'; slug = 'hilux'; vehicleType = 'suv'; }
      else if (brandKey === 'chevrolet') { modelName = 'Cruze / Aveo / Silverado'; slug = 'cruze'; vehicleType = 'pickup'; }
      else if (brandKey === 'ford') { modelName = 'Explorer / F-150 / Fiesta'; slug = 'explorer'; vehicleType = 'pickup'; }
      else if (brandKey === 'jeep' || brandKey === 'mopar') { modelName = 'Cherokee / Grand Cherokee'; slug = 'grand-cherokee'; vehicleType = 'suv'; }
      else if (brandKey === 'hyundai') { modelName = 'Tucson / Elantra / Accent'; slug = 'tucson'; vehicleType = 'suv'; }
      else if (brandKey === 'mitsubishi') { modelName = 'Lancer / Montero / L300'; slug = 'lancer'; vehicleType = 'sedan'; }
      else if (brandKey === 'mazda') { modelName = 'Mazda 3 / BT-50 / Allegro'; slug = 'mazda-3'; vehicleType = 'sedan'; }
      else if (brandKey === 'nissan') { modelName = 'Sentra / Frontier / Tiida'; slug = 'sentra'; vehicleType = 'sedan'; }
      else if (brandKey === 'volkswagen') { modelName = 'Gol / Fox / Bora'; slug = 'gol'; vehicleType = 'hatchback'; }
      else if (brandKey === 'renault') { modelName = 'Clio / Symbol / Megane'; slug = 'clio'; vehicleType = 'hatchback'; }
      else if (brandKey === 'iveco') { modelName = 'Daily / Tector / Eurocargo'; slug = 'iveco-daily'; vehicleType = 'truck'; }
      else if (brandKey === 'isuzu') { modelName = 'NPR / NKR / Luv D-Max'; slug = 'isuzu-npr'; vehicleType = 'truck'; }
      else if (brandKey === 'caterpillar') { modelName = 'Cat 3116 / 3306 Industrial'; slug = 'cat-3116'; vehicleType = 'industrial'; }
      else if (brandKey === 'cummins') { modelName = 'Cummins ISB / QSB Diésel'; slug = 'cummins-isb'; vehicleType = 'industrial'; }
      else { modelName = 'Universal / Multimarca'; slug = 'default'; vehicleType = 'sedan'; }
    }

    const brandLogoSvg = BRAND_LOGOS[brandKey] || BRAND_LOGOS.generic;
    const vehicleSilhouetteSvg = VEHICLE_SILHOUETTES[vehicleType] || VEHICLE_SILHOUETTES.sedan;
    const brandColor = BRAND_COLORS[brandKey] || BRAND_COLORS.generic;
    const localPhotoUrl = `assets/vehicles/${slug}.jpg`;

    return {
      brand: finalBrand,
      brandKey,
      modelName,
      slug,
      vehicleType,
      brandColor,
      brandLogoSvg,
      vehicleSilhouetteSvg,
      localPhotoUrl,
      customImageUrl: part.imageUrl || null
    };
  }

  window.VehicleGraphics = {
    resolveVehicle,
    BRAND_LOGOS,
    VEHICLE_SILHOUETTES,
    BRAND_COLORS
  };
})();
