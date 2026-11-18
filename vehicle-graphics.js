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

    // Detección automática y precisa de fotos de repuestos (insensible a mayúsculas/minúsculas y guiones)
    const KNOWN_PHOTOS = ["0-445110738.jpg","01M 927 321B.jpg","030905377C.jpg","032121065D.jpg","032121111CL.jpg","04226-0l010.jpg","04226-78024.jpg","044512005-9.jpg","04591959AA.jpg","04799758AD.jpg","04861661AB.jpg","04884549AD.jpg","04884757AE.jpg","04885482AC.jpg","04891735AC.jpg","04891737AB.jpg","05033307AC.jpg","05037479AA.jpg","05038668AC.jpg","05038785AD.jpg","05135651AE.jpg","05139020AA.jpg","05149062AB.jpg","05149097AA.jpg","05156106AD.jpg","059919501A.jpg","065000-1890.jpg","06B905106.jpg","079800-4250.jpg","09500-E1200.jpg","095000-8011.jpg","095420-0281.jpg","0986ad1050.jpg","0H05H8.jpg","1035A422.jpg","10482803.jpg","105118-7373.jpg","105p47.jpg","110652w204.jpg","1110010026.jpg","11140-4M500.jpg","111455821R.jpg","11189-ET774A.jpg","11189-ET774B.jpg","1131 E5.jpg","1137328148.jpg","1137328464.jpg","12102-31010.jpg","122-5053.jpg","12204-31040.jpg","12232201.jpg","12361-87403.jpg","12376520.jpg","12568062.jpg","12569240.jpg","12573460.jpg","12580681.jpg","12581282.jpg","12589867.jpg","12591720.jpg","12594512 - 15293084.jpg","12601822.jpg","12603781.jpg","12605738.jpg","12606358.jpg","12608580.jpg","12608814.jpg","12615873.jpg","12630-52G01.jpg","12631044.JPG","12633784.jpg","12635273.jpg","12635992.jpg","12636175.jpg","12653140.jpg","12671616.jpg","12674704.jpg","12703627.jpg","12832-77E00.jpg","12891-86512.jpg","13050-21041.jpg","13050-22012.jpg","13050-28012.jpg","13050-31030.jpg","130C17529R.jpg","132008600.jpg","13276-2W211.jpg","13329258.jpg","13412631.jpg","13500-53Y00.jpg","13501-31010.jpg","13520-97403.jpg","1355A124.jpg","13575940.jpg","13586335.jpg","13650-50G01.jpg","13750-75020.jpg","14310-RBC-003.jpg","14411-9s000 (cartucho).jpg","14411-9s000.jpg","1460A062.jpg","1465a-041.jpg","1465a-439.jpg","15131391.jpg","15158254.jpg","1515A295.jpg","15160-64G00.jpg","15301-21062.jpg","15301-31060.jpg","15310-10010.jpg","15310-75F00.jpg","15330-21011.jpg","15330-22030.jpg","15330-28020.jpg","15330-31010.jpg","15330-37010.jpg","15330-37020.jpg","15340-31010.jpg","15650-RNA-A00.jpg","15710-67D00.jpg","15810-RAA-A03.jpg","15865791.jpg","15904068.jpg","160022-P2E-A15.jpg","16022-08A-A01.jpg","16031-31011.jpg","16212460.jpg","16249939.jpg","16321-21020.jpg","16363-10010.jpg","16363-20390.jpg","16363-23010.jpg","16363-28150.jpg","16363-74020.jpg","16502-21010.jpg","16502-21080.jpg","16577-22030.jpg","16604-31010 16603-31050 16603-31050.jpg","17059602.jpg","17113197.jpg","17113622.jpg","17201-11070.jpg","17201-11080.jpg","17630-15090.jpg","18213-65D30.jpg","19020-16130.jpg","19020-16260.jpg","19050-RNB-A01.jpg","19070-B1020.jpg","19161310.JPG","19168126.jpg","191945515B.jpg","19200-03042.jpg","19301-RNA-316.jpg","19332973.jpg","19355502.jpg","195250-0290.jpg","1989748.jpg","1L2Z12B579BA.jpg","1S7G-9J559-BB.jpg","1W6541.jpg","1W7Z-6B288-AB.jpg","20756714.jpg","20945132.jpg","21062-61010.jpg","21340611.jpg","21351717.jpg","22030-21030.jpg","22204-0H010.jpg","22204-0T040.jpg","22204-22010.jpg","22204-30030.jpg","22204-75020.jpg","22204-75030.jpg","22250-75010.jpg","22270-0D010.jpg","22270-11020.jpg","22270-15010.jpg","22270-16090.jpg","22270-62050.jpg","22270-66020.jpg","22270-75040.jpg","22410-23510.jpg","22410-23800.jpg","224336134R.jpg","22448-ED800.jpg","22680-2J200.jpg","22837059.jpg","23209-0P090.jpg","23209-39075.jpg","23209-39145.jpg","23209-39215.jpg","23209-66010.jpg","23209-B9040.jpg","23210-B1031.jpg","23220-0P010.jpg","23250-0D030.jpg","23250-21020.jpg","23250-22040.jpg","23250-39075.jpg","23250-62040.jpg","23250-74080.jpg","23250-97401.jpg","23280-21010.jpg","23280-21020.jpg","23280-22010.jpg","23280-75040.jpg","23280-E0010.jpg","23300-19145.jpg","23300-21030.jpg","23300-23040.jpg","23300-75140.jpg","235-2888.jpg","23670-0e020.jpg","23670-51041.jpg","23731-4M50A.jpg","23731-EN20A.jpg","23810-65D00.jpg","23820-65D00.jpg","24221125.jpg","24230298.jpg","24244544.jpg","24253027.jpg","24253028.jpg","24321-23780.jpg","24350-23800.jpg","24350-3C100.jpg","24350-3E000.jpg","24355-23763.jpg","24405967.jpg","24580974.jpg","25183354.jpg","2529 24.jpg","2529 27.jpg","25318411.jpg","25430-PLR-003.jpg","25527077.jpg","25620-23640.jpg","256G-8A586-B1A.jpg","258005096.jpg","258005660.JPG","27301-23700.jpg","27700-11070.jpg","280142310.jpg","280150664.jpg","280155964.jpg","280218166.jpg","281002576.jpg","281002698.jpg","281002942.jpg","281006425.jpg","28160-75120.jpg","28164-22051.jpg","28164-22060.jpg","28164-23200.jpg","28164-23700.jpg","28164-37200.jpg","28164-38210.jpg","28164-3C100.jpg","28389851.jpg","28600-RPC-004.jpg","294200-0670.jpg","294200-2750.jpg","29536833.jpg","2F1E-9J460-AB.jpg","2L3Z-6E078-AA.jpg","2S65-3A696-EC.jpg","2S65-7A564-AA.jpg","2S65-8591-AA.jpg","2S6A-9F715-BB.jpg","30520-RNA-A01.jpg","30530-P5M-013.jpg","31001-D1002.jpg","31112-07000.jpg","31112-1C000.jpg","31112-2B000.jpg","31170-RNA-A02.jpg","31204-20071.jpg","31230-60150.jpg","31230-60240.1.jpg","31230-60240.jpg","31395-3AX0B.jpg","31397-1XF0C.jpg","31728-1XF02.jpg","31911-2E000.jpg","31936-8E003.jpg","31941-1XF02.jpg","31941-1XJ0A.jpg","33220-50G02.jpg","33220-70E00.jpg","3354943.jpg","33800-42020.jpg","3411-754.jpg","35-8Y000.jpg","35102-02000.jpg","35102-38610.jpg","35150-02600.jpg","35150-22000.jpg","35150-22600.jpg","35150-23700.jpg","35170-22600.jpg","35290-52040.jpg","35301-1C000.jpg","35310-22010.jpg","35310-23600.jpg","36450-P2J-J01.jpg","36460-PAA-L21.jpg","36531-PLD-013.jpg","36531-RNA-A01.jpg","36906051.jpg","37510-PNA-003.jpg","3803637.jpg","39180-22040.jpg","39180-23500.jpg","39180-23910.jpg","39180-37150.jpg","39210 22610.jpg","39210 23710.jpg","39210-22018.jpg","39210-23750.jpg","39210-37543.jpg","39220-23990.jpg","39220-38020.jpg","39250-23500.jpg","39250-37100.jpg","39250-37150.jpg","39250-3E110.jpg","39250-3E120.jpg","39310-02200.jpg","39310-38050.jpg","39310-38060.jpg","39318-39800.jpg","39330-22000.jpg","39350-23500.jpg","39350-37110.jpg","39350-3E110.jpg","39350-3E120.jpg","3944214.jpg","3A015S.jpg","3B7601171XRW.jpg","3F1Z-12A648-A.jpg","3F2E-9G756-AD.jpg","3L3-Z6M280-EA.jpg","3L3Z-12B579-BA.jpg","3M4Z-8575-B.jpg","3R2Z-6A257-D.jpg","40406202.jpg","40439102.jpg","40443002.jpg","42603-0D070.jpg","42607-06011.jpg","42620-39200.jpg","42621-39200.jpg","42700-39055.jpg","432191260.jpg","432191389.jpg","43252-83S00-0PG.jpg","43330-39435.jpg","433352-0085.jpg","43570-60010.jpg","44200-35601.jpg","44250-35042.jpg","44310-0k020.jpg","44320-60260.jpg","445110248.jpg","445110845.jpg","445110918.jpg","445120007.jpg","445120054.jpg","445120120.jpg","445120134.jpg","445120224.jpg","445120231.jpg","445120238.jpg","445120289.jpg","445120304.jpg","445120367.jpg","45956-28010.jpg","4602632AG.jpg","4606824AB.jpg","4608303AB.jpg","46313-22700.jpg","4638128.jpg","46386-22600.jpg","46476438.jpg","46517-39000.jpg","46517-39500.jpg","4670A189.jpg","46818007.jpg","4874430.jpg","4884483AC.jpg","4884695AB.jpg","49135-05000.jpg","49135-05080.jpg","49135-TF035.jpg","4929864.jpg","499000-6141.jpg","4990774.jpg","4994274.jpg","4C2A-9D372-BA.jpg","4C2Z-19A706-AA.jpg","4F27-E.jpg","4P1516.jpg","4p2995.jpg","4S4Z-6582-CA.jpg","4W-7018.jpg","4W7016.jpg","5033310AB.jpg","5033313AA.jpg","5073617AA.jpg","5179153AC.jpg","5183202AB.jpg","5189841AA.jpg","5189954AA.jpg","52125003AB.jpg","5233315.jpg","5269703.jpg","53010574AB.jpg","53021026AH.jpg","53021077.jpg","53022189AG.jpg","53022298AA.jpg","53022338AB.jpg","53022372AA.jpg","53030778.jpg","53032701AA.jpg","53032704AB.jpg","53167100522.jpg","55218148.jpg","55236778.JPG","55353806.jpg","55354071.jpg","5541525.jpg","55557288.jpg","55563957.jpg","55564395.jpg","55565708.jpg","55565709.jpg","55566648.jpg","55566650.jpg","55567048.jpg","55567049.jpg","55567050.jpg","55597008.jpg","56027866AC.jpg","56027868AC.jpg","56027870.jpg","56027873.jpg","56028172AB.jpg","56028666AB.jpg","56029049AA.JPG","56029479AB.jpg","56032521AB.jpg","56041018AD.jpg","56041212.jpg","56041393AA.jpg","56041403AA.jpg","56041584AF.jpg","56044146AB.jpg","58401-65D00.jpg","58402-65D00.jpg","59954L.jpg","5L1Z-6500-A.jpg","6001548723.jpg","612600-080311.jpg","6200287654.jpg","64610-02050.jpg","64610-12310.jpg","6507741AA.jpg","66-8326.jpg","6681513.jpg","67-0004.jpg","68003360AA.jpg","68003582AB.jpg","68004019AD.jpg","68025160AA.jpg","68039999AC.jpg","68080819AC.jpg","68174083AA.jpg","6C3Z-9A299-C.jpg","6F2Z-1130-B.jpg","6L2Z-7G484-AA.jpg","6M8G-6C525-CE.jpg","6N0905865.jpg","6PR00807902.jpg","6Q0945511A.jpg","6W1Z-8B658-AC.jpg","703890-0045.jpg","709836-5004.jpg","75351-12160.jpg","75428-0K031.jpg","75435-60050.jpg","7700101451.jpg","7700101968.jpg","7700101970.jpg","7700102539.jpg","7700103119.jpg","7700107433.jpg","7700107555.jpg","7700424025.jpg","7700435692.jpg","7700732262.jpg","7700845961.jpg","7700875000.jpg","7701042681.jpg","7701048230.jpg","7701471225.jpg","7701472508.jpg","78410-SV4-003.jpg","7C16 6C12.jpg","7R3Z-7664-A.jpg","7S43-19D594-AA.jpg","7S4P-7F293-AA.jpg","8-10456541-0.jpg","8-92066026-1.jpg","8-94433811-0.jpg","8-97118860-0.jpg","8-97181717-0.jpg","8-97181718-0.jpg","8-97236106-2.jpg","8-97258523-0.jpg","8-97287352-0.jpg","8-97314204-0.jpg","8-97328512-0.jpg","8-97365948-0.jpg","8-97943183-0.jpg","8-98014766-0.jpg","8-98049394-0.jpg","8200036411.jpg","8200105165.jpg","8200139460.jpg","8200337880.jpg","8200547283.jpg","8200647556.jpg","8200678386.jpg","8200719629.jpg","82620-60080.jpg","83181-12020.jpg","83181-12040.jpg","83181-24060.jpg","83181-35070.jpg","83520-60060.jpg","83530-60020.jpg","84210-12040.jpg","84210-52050.jpg","84210-60030.jpg","84222-35110.jpg","84306-02200.jpg","84306-52050.jpg","84340-32050.jpg","84450-52010.jpg","84450-60120.jpg","84450-71010.jpg","84540-04020.jpg","84540-32110.jpg","84540-48010.jpg","84540-B1020.jpg","84820-0D100.jpg","84820-AA070.jpg","85020426.jpg","87240-35070.jpg","87268-97401.jpg","89017458.jpg","89413-32010.jpg","89413-97202.jpg","89420-02010.jpg","89420-10080.jpg","89421-20190.jpg","89422-16010.jpg","89422-35010.jpg","89424-87703.jpg","89428-12160.jpg","8943119662.jpg","89438-33010.jpg","89452-20130.jpg","89452-22080.jpg","89452-22090.jpg","89452-33030.jpg","89452-35020.jpg","89458-60010.jpg","89458-71010.jpg","89465-02130.JPG","89465-02150.JPG","89465-02210.jpg","89465-26120.jpg","89465-35680.jpg","89465-39735.jpg","89465-52370.jpg","89465-52380.JPG","89465-69085.jpg","89465-97404.jpg","89465-B4030.jpg","89467-04090.jpg","89467-0C050.jpg","89467-12100.JPG","89467-35110.jpg","89467-35120.jpg","89467-71010.JPG","89467-71020.JPG","89467-72010.jpg","89491-25030.jpg","89516-02220.jpg","89542-02110.jpg","89542-0K020.jpg","89542-33090.jpg","89542-52030.jpg","89542-60050.jpg","89542-97401.jpg","89542-B4010.jpg","89543-02110.jpg","89543-0K020.jpg","89543-33090.jpg","89543-52030.jpg","89543-60050.jpg","89545-0K050.jpg","89546-0K050.jpg","89615-12040.jpg","89615-12090.jpg","89615-20090.jpg","89615-22030.jpg","89615-22040.jpg","89620-10120.jpg","8973267520.jpg","897609789-6.jpg","8AUC-10-271.jpg","8E0959126.jpg","8E5Z-19E624-A.jpg","8n-7005.jpg","90048-52130.jpg","902-031.jpg","90311-38020.jpg","90342949.jpg","90354858.jpg","90512405.jpg","90536064.jpg","90537300.jpg","90916-03046.jpg","90916-03075.jpg","90916-03129.jpg","90917-11022.jpg","90919-02230.jpg","90919-02239.jpg","90919-02240.jpg","90919-02248.jpg","90919-05012.jpg","90919-05016.jpg","90919-05017.jpg","90919-05020.jpg","90919-05024.jpg","90919-05036.jpg","90919-05041.jpg","90919-05045.jpg","90919-05047.jpg","90919-05057.jpg","90919-05059.jpg","90919-05060.jpg","90919-COIL KIT.jpg","90987-03003.jpg","90987-04010.jpg","9115863.jpg","914850-530395.jpg","917-327.jpg","928400666.jpg","93110-2D000.jpg","93186324.jpg","93231759.jpg","93235615.jpg","93328341.jpg","93335438.jpg","93382834.jpg","93480-2E100.jpg","93490-2E000.jpg","9359409.jpg","93741830.jpg","93741992.jpg","93742035.jpg","93742042.jpg","93742043.jpg","93742189.jpg","93742194.jpg","93742966.jpg","93745940.jpg","93810-2E000.jpg","93860-39000.jpg","93860-39012.jpg","94535699.jpg","94580175.jpg","94580712.jpg","94749639.jpg","950005550.jpg","95918426.jpg","96092693.jpg","96144874.jpg","96181814.jpg","96182606.jpg","96208781.jpg","96235867.jpg","96238726.jpg","96252707.jpg","96252709.jpg","96253544.jpg","96253545.jpg","96264738.jpg","96272643.jpg","96279856.jpg","96330547.jpg","9635864980 B.jpg","96368024.jpg","9636876580.jpg","96376263.jpg","96396300.jpg","963999880.jpg","96407677.jpg","9641212480.jpg","96415639.jpg","96418302.jpg","96423298.jpg","96435138.jpg","96437061.JPG","96439960.jpg","96451064.jpg","96452310.jpg","96487553.jpg","96487557.jpg","9649675880.jpg","96535402.jpg","96553827.jpg","96613650.jpg","96626078.jpg","96626080.jpg","96628697.jpg","96739999.jpg","96864850.jpg","9709500652.jpg","97179-1F200.jpg","97MF-BA.jpg","988F-12029-AB.jpg","99443744.jpg","9L2Z-7A010-A.jpg","9S65-3200-AB.jpg","A192001A.jpg","AA290-5P.jpg","AFH45M-46.jpg","AL3Z-6750-A.jpg","AS55-9F472-AA.jpg","AU0192.jpg","AU0195.jpg","AU5Z-9C915-B.jpg","BA5Z-6750-A.jpg","BBM2-37-190.jpg","BL4E-66-350A.jpg","CDH210.jpg","DA8Z-9A299-A.jpg","DG9Z-11572-A.jpg","DS7Z-6600-B.jpg","DY1178.jpg","f002d13640.jpg","F00R000775.jpg","f00rj00414.jpg","F00RJ01280.jpg","F00VC01315.jpg","F2G8-18-845A.jpg","F2GT-1A180-AB.jpg","F2TZ-9C968-A.jpg","F4CZ-9C968-A.jpg","F4SE-9C968-AA.jpg","F75Z-9A299-JA.jpg","F75Z6730BA.jpg","F77Z-6500-AB.jpg","F77Z-9J460-AB.jpg","F7LP-7F293-AA.jpg","FBJCB00.jpg","FN02-21-444.jpg","FP39-13-215.jpg","FSD7-18-221.jpg","FSN5-20-660B.jpg","G628-18-861.jpg","G6T1-13-280.jpg","GB5Z-14A664-F.jpg","GJ6A-66-350.jpg","H3T011.jpg","IM25609.jpg","J5T30671.jpg","J723T.jpg","JF011E RE0F10E F1CJA.jpg","JF011E.jpg","JFY1-12-100.jpg","L362-10-2D5A.jpg","L3G2-18-221F.jpg","l3k9-14-420.jpg","LF01-18-921.jpg","LF02-10-450.jpg","LF63188G1B9U.JPG","LF82-18-740.jpg","LF94-15-17Z.jpg","LFG1-15-980.jpg","LFH1-18-8G1B.JPG","LFH2-18-861A.jpg","LFL7-18-8G1C.jpg","M67580.jpg","MB618981.jpg","MB620532.jpg","MB837106.jpg","MB837108.jpg","MB837110.jpg","MB896028.jpg","MB896029.jpg","MCF-2225.jpg","MD050316.jpg","MD138994.jpg","MD173985.jpg","MD182293.jpg","MD182537.jpg","MD303088.jpg","MD304933.jpg","MD305146.jpg","MD305927.jpg","MD309456.jpg","MD311979.jpg","MD312083.jpg","MD320622.jpg","MD322986.jpg","MD326852.jpg","MD327107.jpg","MD343605.jpg","MD348074.jpg","MD357338.jpg","MD360196.jpg","MD362903.jpg","MD373042.jpg","MD373734.jpg","MD377560.jpg","MD614280.jpg","MD614918.jpg","MD619857.jpg","MD628057.jpg","MD628059.jpg","MD707575.jpg","MD730979.jpg","MD758981.jpg","MD997517.jpg","ME220255.jpg","MN113754.jpg","MN149605.jpg","MN158977.jpg","MR135469.jpg","MR204132.jpg","MR263257.jpg","MR333578.jpg","MR491876.jpg","MR497413.jpg","MR503462.jpg","MR514427.jpg","MR552781.jpg","MR583930.jpg","MR983147.jpg","MR985187.jpg","OK72A-32600B.jpg","S1117-61190.jpg","S2360-03222.jpg","SU-6397.jpg","SWT10195ZZSTD.jpg","TH266.jpg","TK-5LRZ-6268-A.jpg","TPS242.jpg","TPS324.jpg","TPS333.jpg","UB93-41-400.jpg","UM49-66-151.jpg","UR56-32-220.jpg","VR-162.jpg","WR6128.jpg","WV56MC765.jpg","XIM-830.jpg","XL3Z-12A699-AA.jpg","XS4Z-7G383-AA.jpg","XS4Z-7G484-AA.jpg","XS4Z-7H148-AA.jpg","XS6E-6750-A1D.jpg","XS6E-6C501-AC.jpg","XS6F-12A648-BA.jpg","YL8Z-9F775-AA.jpg","YL8Z-9F775-BA.jpg","YS6A-12K073-AB.jpg","YS6A-6C315-AB.jpg","YU3Z-8A586-AA.jpg","ZB56TC82.jpg","ZJ01-14-420.jpg","ZJ01-18-221.jpg","ZJ01-18-230.jpg","ZJ01-18-921.jpg","ZL01-18-221.jpg","ZM01-20-660.jpg","ZY08-13-ZE0.jpg"];

    const cleanPn = String(part.partNumber || '').trim().replace(/[/\\?%*:|"<>]/g, '-');
    const normPn = String(part.partNumber || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let matchedPhoto = null;
    if (normPn) {
      for (const photoFile of KNOWN_PHOTOS) {
        const normFile = photoFile.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normFile === normPn) {
          matchedPhoto = `assets/repuestos/${photoFile}`;
          break;
        }
      }
    }

    const autoPartPhotoUrl = matchedPhoto || (cleanPn ? `assets/repuestos/${cleanPn}.jpg` : null);

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
      partPhotoUrl: autoPartPhotoUrl,
      customImageUrl: part.imageUrl || autoPartPhotoUrl
    };
  }

  window.VehicleGraphics = {
    resolveVehicle,
    BRAND_LOGOS,
    VEHICLE_SILHOUETTES,
    BRAND_COLORS
  };
})();
