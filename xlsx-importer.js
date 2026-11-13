/**
 * Lector nativo de archivos Excel (.xlsx) en el navegador sin dependencias externas.
 * Lee el Central Directory del ZIP, descomprime con DecompressionStream('deflate-raw')
 * y detecta filas sombreadas en amarillo (theme 7 / RGB amarillo) como agotadas.
 */
(() => {
  const BRAND_MAP = {
    TOYOTA: 'Toyota',
    MOPAR: 'Mopar',
    GM: 'GM / Chevrolet',
    CHEVROLET: 'GM / Chevrolet',
    'ACDELCO GM': 'ACDelco GM',
    FORD: 'Ford',
    HYUNDAI: 'Hyundai',
    HYU4: 'Hyundai',
    MITSUBISHI: 'Mitsubishi',
    MAZDA: 'Mazda',
    BOSCH: 'Bosch',
    SUZUKI: 'Suzuki',
    HONDA: 'Honda',
    RENAULT: 'Renault',
    VW: 'Volkswagen',
    NISSAN: 'Nissan',
    ISUZU: 'Isuzu',
    PEUGEOT: 'Peugeot',
    JEEP: 'Jeep',
    DODGE: 'Dodge',
    FIAT: 'Fiat',
    CHERY: 'Chery',
    CAT: 'Caterpillar',
    CUMMINS: 'Cummins',
    DENSO: 'Denso',
    VOLVO: 'Volvo',
    MERCEDES: 'Mercedes-Benz',
    IVECO: 'Iveco',
    KIA: 'Kia',
    HINO: 'Hino',
    HIJO: 'Hino',
    MOTORCRAFT: 'Motorcraft',
    MATCHERT: 'Matchert',
    ROSTRA: 'Rostra',
    NKR: 'NKR'
  };

  const PRETTY_CATEGORY_NAMES = {
    'sensores-de-oxigeno': 'Sensores de Oxígeno',
    'valvulas-iac-sensor-de-minimo': 'Válvulas IAC / Sensor de Mínimo',
    'sensores-abs': 'Sensores ABS',
    'sensores-de-detonacion-golpeteo': 'Sensores de Detonación / Golpeteo',
    'valvulas-ocv-vvti-y-raches-vvti': 'Válvulas OCV/VVTI y Raches VVTI',
    'sensores-de-leva-y-ciguenal': 'Sensores de Leva y Cigüeñal',
    'pare-neutro-solenoides-de-caja-sensores-de-caja-estoperas-caja-filtro-caja': 'Caja Automática (Pare Neutro, Solenoides y Filtros)',
    'sensores-map-y-maf': 'Sensores MAP y MAF',
    'termostatos-cajas-termostaticas-y-bombas-de-agua': 'Termostatos, Tomas y Bombas de Agua',
    'electro-ventiladores-varios': 'Electroventiladores y Módulos',
    'tapones-de-carter-y-valvulas-pcv': 'Tapones de Cárter y Válvulas PCV',
    gasolina: 'Sistema de Gasolina (Inyectores y Bombas)',
    'sensores-tps-y-velocidad': 'Sensores TPS y Velocidad',
    'valvulas-varias': 'Válvulas Varias (Presión, Temp., Retroceso)',
    'munones-y-cilindros-de-freno': 'Muñones y Cilindros de Freno',
    'encendido-y-valvulas-egr': 'Encendido, Bobinas y Válvulas EGR',
    varios: 'Varios y Carrocería',
    'chupones-de-bobina': 'Chupones de Bobina',
    'empacaduras-y-kits': 'Empacaduras y Kits',
    'varillas-de-aceite': 'Varillas y Nivel de Aceite',
    taquetes: 'Taquetes',
    filtros: 'Filtros',
    'bombas-de-direccion-cajetines': 'Bombas de Dirección y Cajetines',
    'tapa-valvulas-tapas-de-rines': 'Tapa Válvulas y Tapas de Rines',
    'cable-espiral-cuerpo-aceleracion-poleas-tensoras': 'Cable Espiral, Aceleración y Tensores',
    tpms: 'Sensores TPMS (Presión de Cauchos)',
    bombas: 'Bombas y Enfriadores',
    clutch: 'Clutch / Embrague',
    'kit-de-tiempo': 'Kits de Tiempo',
    diesel: 'Diésel e Inyección Pesada'
  };

  const ICON_GROUP_BY_CAT = {
    'sensores-de-oxigeno': 'sensor',
    'valvulas-iac-sensor-de-minimo': 'valvula',
    'sensores-abs': 'sensor',
    'sensores-de-detonacion-golpeteo': 'sensor',
    'valvulas-ocv-vvti-y-raches-vvti': 'motor',
    'sensores-de-leva-y-ciguenal': 'sensor',
    'pare-neutro-solenoides-de-caja-sensores-de-caja-estoperas-caja-filtro-caja': 'transmision',
    'sensores-map-y-maf': 'sensor',
    'termostatos-cajas-termostaticas-y-bombas-de-agua': 'refrigeracion',
    'electro-ventiladores-varios': 'electrico',
    'tapones-de-carter-y-valvulas-pcv': 'motor',
    gasolina: 'combustible',
    'sensores-tps-y-velocidad': 'sensor',
    'valvulas-varias': 'valvula',
    'munones-y-cilindros-de-freno': 'frenos',
    'encendido-y-valvulas-egr': 'electrico',
    varios: 'varios',
    'chupones-de-bobina': 'electrico',
    'empacaduras-y-kits': 'motor',
    'varillas-de-aceite': 'motor',
    taquetes: 'motor',
    filtros: 'filtros',
    'bombas-de-direccion-cajetines': 'suspension',
    'tapa-valvulas-tapas-de-rines': 'varios',
    'cable-espiral-cuerpo-aceleracion-poleas-tensoras': 'motor',
    tpms: 'sensor',
    bombas: 'refrigeracion',
    clutch: 'transmision',
    'kit-de-tiempo': 'motor',
    diesel: 'diesel'
  };

  function slugify(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function normBrand(raw) {
    const s = (raw || '').trim();
    if (!s) return 'Genérico / OEM';
    return BRAND_MAP[s.toUpperCase()] || s;
  }

  async function inflateRaw(compressedBytes) {
    const ds = new DecompressionStream('deflate-raw');
    const stream = new Blob([compressedBytes]).stream().pipeThrough(ds);
    const buffer = await new Response(stream).arrayBuffer();
    return new Uint8Array(buffer);
  }

  function readZipEntries(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    const view = new DataView(arrayBuffer);

    // Buscar End of Central Directory (PK\x05\x06)
    let eocdOffset = -1;
    const minOffset = Math.max(0, bytes.length - 65557);
    for (let i = bytes.length - 22; i >= minOffset; i--) {
      if (view.getUint32(i, true) === 0x06054b50) {
        eocdOffset = i;
        break;
      }
    }
    if (eocdOffset === -1) {
      throw new Error('El archivo no es un ZIP/XLSX válido.');
    }

    const totalEntries = view.getUint16(eocdOffset + 10, true);
    const cdOffset = view.getUint32(eocdOffset + 16, true);
    const decoder = new TextDecoder('utf-8');
    const entries = new Map();

    let pos = cdOffset;
    for (let i = 0; i < totalEntries; i++) {
      if (view.getUint32(pos, true) !== 0x02014b50) break;
      const compression = view.getUint16(pos + 10, true);
      const compSize = view.getUint32(pos + 20, true);
      const nameLen = view.getUint16(pos + 28, true);
      const extraLen = view.getUint16(pos + 30, true);
      const commentLen = view.getUint16(pos + 32, true);
      const localHeaderOffset = view.getUint32(pos + 42, true);
      const name = decoder.decode(bytes.subarray(pos + 46, pos + 46 + nameLen));

      entries.set(name, { compression, compSize, localHeaderOffset });
      pos += 46 + nameLen + extraLen + commentLen;
    }

    return {
      async getText(entryName) {
        const entry = entries.get(entryName);
        if (!entry) return null;
        const lh = entry.localHeaderOffset;
        const lhNameLen = view.getUint16(lh + 26, true);
        const lhExtraLen = view.getUint16(lh + 28, true);
        const dataStart = lh + 30 + lhNameLen + lhExtraLen;
        const rawSlice = bytes.subarray(dataStart, dataStart + entry.compSize);

        let outBytes;
        if (entry.compression === 0) {
          outBytes = rawSlice;
        } else if (entry.compression === 8) {
          outBytes = await inflateRaw(rawSlice);
        } else {
          throw new Error(`Compresión ZIP no soportada (${entry.compression})`);
        }
        return decoder.decode(outBytes);
      },
      listNames() {
        return [...entries.keys()];
      }
    };
  }

  function parseXml(xmlText) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, 'application/xml');
  }

  async function parseXlsxCatalog(arrayBuffer) {
    const zip = await readZipEntries(arrayBuffer);
    const names = zip.listNames();
    const sheetName = names.find((n) => /^xl\/worksheets\/sheet1\.xml$/i.test(n)) ||
      names.find((n) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(n));

    if (!sheetName) {
      throw new Error('No se encontró ninguna hoja de cálculo en el archivo Excel.');
    }

    const sharedStrings = [];
    const ssText = await zip.getText('xl/sharedStrings.xml');
    if (ssText) {
      const ssDoc = parseXml(ssText);
      const sis = ssDoc.getElementsByTagName('si');
      for (let i = 0; i < sis.length; i++) {
        const ts = sis[i].getElementsByTagName('t');
        let joined = '';
        for (let j = 0; j < ts.length; j++) {
          joined += ts[j].textContent || '';
        }
        sharedStrings.push(joined);
      }
    }

    // Detectar fills amarillos desde styles.xml
    const yellowFillIds = new Set();
    const xfs = [];
    const stylesText = await zip.getText('xl/styles.xml');
    if (stylesText) {
      const stylesDoc = parseXml(stylesText);
      const fillsEl = stylesDoc.getElementsByTagName('fills')[0];
      if (fillsEl) {
        const fillNodes = fillsEl.getElementsByTagName('fill');
        for (let i = 0; i < fillNodes.length; i++) {
          const fg = fillNodes[i].getElementsByTagName('fgColor')[0];
          if (!fg) continue;
          const theme = fg.getAttribute('theme');
          const rgb = (fg.getAttribute('rgb') || '').toUpperCase();
          if (theme === '7') {
            yellowFillIds.add(i);
          } else if (rgb.length >= 6) {
            const hex = rgb.slice(-6);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            if (r > 200 && g > 170 && b < 150) {
              yellowFillIds.add(i);
            }
          }
        }
      }

      const cellXfsEl = stylesDoc.getElementsByTagName('cellXfs')[0];
      if (cellXfsEl) {
        const xfNodes = cellXfsEl.getElementsByTagName('xf');
        for (let i = 0; i < xfNodes.length; i++) {
          xfs.push(parseInt(xfNodes[i].getAttribute('fillId') || '0', 10));
        }
      }
    }

    const sheetText = await zip.getText(sheetName);
    const sheetDoc = parseXml(sheetText);
    const rows = sheetDoc.getElementsByTagName('row');

    const categories = [{ id: 'all', name: 'Todos los repuestos', icon: 'varios' }];
    const seenCats = new Set(['all']);
    const items = [];
    let currentCat = null;

    function getCellValue(cell) {
      const t = cell.getAttribute('t') || '';
      if (t === 'inlineStr') {
        const ts = cell.getElementsByTagName('t');
        let txt = '';
        for (let i = 0; i < ts.length; i++) txt += ts[i].textContent || '';
        return txt;
      }
      const v = cell.getElementsByTagName('v')[0];
      if (!v || v.textContent == null) return '';
      if (t === 's') {
        const idx = parseInt(v.textContent, 10);
        return sharedStrings[idx] || '';
      }
      return v.textContent;
    }

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const rNum = parseInt(row.getAttribute('r') || '0', 10);
      if (rNum > 0 && rNum < 5) continue;

      const vals = {};
      const rowFills = {};
      const cells = row.getElementsByTagName('c');
      for (let c = 0; c < cells.length; c++) {
        const cell = cells[c];
        const ref = cell.getAttribute('r') || '';
        const col = ref.replace(/[^A-Z]/gi, '');
        const sIdx = parseInt(cell.getAttribute('s') || '0', 10);
        const fillId = xfs[sIdx] || 0;
        vals[col] = getCellValue(cell).replace(/\u00a0/g, ' ').trim();
        rowFills[col] = fillId;
      }

      const motor = vals.A || '';
      const partNum = vals.B || '';
      const product = (vals.C || '').replace(/\s+/g, ' ').trim();
      const priceUsdRaw = vals.E || '';
      const priceBsRaw = vals.F || '';

      if (!partNum && !product) continue;

      // Encabezado de tabla si hubiera
      if (motor.toUpperCase() === 'MOTOR' && partNum.toUpperCase().includes('PIEZA')) continue;

      // Fila de categoría
      if (!partNum && product && priceUsdRaw === '' && (priceBsRaw === '' || priceBsRaw === '0')) {
        const catId = slugify(product);
        const catName = PRETTY_CATEGORY_NAMES[catId] || product;
        currentCat = { id: catId, name: catName };
        if (!seenCats.has(catId)) {
          seenCats.add(catId);
          categories.push({
            id: catId,
            name: catName,
            icon: ICON_GROUP_BY_CAT[catId] || 'varios'
          });
        }
        continue;
      }

      const parsedUsd = parseFloat(priceUsdRaw);
      const parsedBs = parseFloat(priceBsRaw);
      const priceUsd = Number.isFinite(parsedUsd) ? Math.round(parsedUsd * 100) / 100 : 0;
      const priceTotal = Number.isFinite(parsedBs)
        ? Math.round(parsedBs * 100) / 100
        : Math.round(priceUsd * 1.16 * 100) / 100;

      const isYellow = ['A', 'B', 'C', 'E', 'F'].some((col) => yellowFillIds.has(rowFills[col]));
      const catId = currentCat ? currentCat.id : 'varios';
      const catName = currentCat ? currentCat.name : 'Varios';

      items.push({
        id: items.length + 1,
        brand: normBrand(motor),
        brandRaw: motor || 'OEM',
        partNumber: partNum || 'S/N',
        name: product,
        category: catId,
        categoryName: catName,
        icon: ICON_GROUP_BY_CAT[catId] || 'varios',
        priceUsd,
        priceTotal,
        inStock: !isYellow
      });
    }

    return { categories, items };
  }

  window.XlsxCatalogImporter = {
    parseXlsxCatalog,
    slugify,
    ICON_GROUP_BY_CAT
  };
})();
