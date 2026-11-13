(() => {
  const DEFAULT_DATA = window.REPUESTOS_DATA;
  const WHATSAPP_NUMBER = '584167456111';
  const STORAGE_KEYS = {
    catalog: 'autopartes_catalog_override_v1',
    cart: 'autopartes_cart_v2',
    theme: 'autopartes_theme',
    adminPass: 'autopartes_admin_pass',
    adminSession: 'autopartes_admin_session',
    bcvRate: 'autopartes_bcv_rate_v1',
    pagoMovil: 'autopartes_pago_movil_v1'
  };

  const DEFAULT_BCV_RATE = 911.62;
  const DEFAULT_PAGO_MOVIL = {
    bank: 'Banco Mercantil (0105)',
    idNumber: '16658322',
    phone: '04121051940',
    holder: 'Maykell Sarmiento'
  };

  function loadBcvConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.bcvRate);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Number(parsed.rate) > 0) return parsed;
      }
    } catch {}
    return { rate: DEFAULT_BCV_RATE, date: 'Oficial' };
  }

  function loadPagoMovilConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.pagoMovil);
      if (saved) return { ...DEFAULT_PAGO_MOVIL, ...JSON.parse(saved) };
    } catch {}
    return { ...DEFAULT_PAGO_MOVIL };
  }

  function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function loadCatalogState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.catalog);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items) && Array.isArray(parsed.categories)) {
          return parsed;
        }
      }
    } catch {
      // Usar catálogo base si hay datos corruptos
    }
    return {
      categories: cloneData(DEFAULT_DATA.CATEGORIES),
      items: cloneData(DEFAULT_DATA.PARTS_CATALOG)
    };
  }

  let catalogData = loadCatalogState();
  let pendingExcelImport = null;

  function getMaxCatalogPrice() {
    return Math.max(...catalogData.items.map((p) => p.priceUsd || 0), 100);
  }

  const QUICK_KEYWORDS = [
    'Todos',
    'Corolla',
    'Hilux',
    '4runner',
    'Fortuner',
    'Terios',
    'Yaris',
    'Aveo',
    'Optra',
    'Cruze',
    'Silverado',
    'Grand Cherokee',
    'Cherokee',
    'Explorer',
    'Fiesta',
    'Tucson',
    'Elantra',
    'Lancer',
    'Mazda 3',
    'Iveco',
    'Cummins',
    'Caterpillar'
  ];

  const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
  const validInitialCart = savedCart.filter((entry) => {
    const part = catalogData.items.find((p) => p.id === entry.id);
    return part && part.inStock && part.priceUsd > 0;
  });

  const bcvConfig = loadBcvConfig();
  const state = {
    search: '',
    quickChip: 'Todos',
    category: 'all',
    stock: 'all',
    brand: 'all',
    maxPrice: getMaxCatalogPrice(),
    onlyPriced: false,
    sort: 'catalog',
    view: 'grid',
    pageSize: 48,
    currentPage: 1,
    cart: validInitialCart,
    theme: localStorage.getItem(STORAGE_KEYS.theme) || 'light',
    isAdmin: sessionStorage.getItem(STORAGE_KEYS.adminSession) === 'true',
    bcvRate: bcvConfig.rate,
    bcvDate: bcvConfig.date,
    pagoMovil: loadPagoMovilConfig()
  };

  const els = {
    sidebar: document.getElementById('sidebar'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    menuToggleBtn: document.getElementById('menuToggleBtn'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    categoryList: document.getElementById('categoryList'),
    stockFilter: document.getElementById('stockFilter'),
    brandFilter: document.getElementById('brandFilter'),
    maxPriceRange: document.getElementById('maxPriceRange'),
    maxPriceLabel: document.getElementById('maxPriceLabel'),
    onlyPricedCheckbox: document.getElementById('onlyPricedCheckbox'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    quickChips: document.getElementById('quickChips'),
    pageSizeSelect: document.getElementById('pageSizeSelect'),
    sortSelect: document.getElementById('sortSelect'),
    gridViewBtn: document.getElementById('gridViewBtn'),
    tableViewBtn: document.getElementById('tableViewBtn'),
    catalogContainer: document.getElementById('catalogContainer'),
    paginationBar: document.getElementById('paginationBar'),
    resultsInfo: document.getElementById('resultsInfo'),
    kpiVisibleCount: document.getElementById('kpiVisibleCount'),
    kpiTotalSub: document.getElementById('kpiTotalSub'),
    kpiInStockCount: document.getElementById('kpiInStockCount'),
    kpiOutOfStockCount: document.getElementById('kpiOutOfStockCount'),
    kpiAvgPrice: document.getElementById('kpiAvgPrice'),
    detailOverlay: document.getElementById('detailOverlay'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    modalBrandSku: document.getElementById('modalBrandSku'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    openCartBtn: document.getElementById('openCartBtn'),
    closeCartBtn: document.getElementById('closeCartBtn'),
    cartOverlay: document.getElementById('cartOverlay'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTax: document.getElementById('cartTax'),
    cartTotal: document.getElementById('cartTotal'),
    whatsappQuoteLink: document.getElementById('whatsappQuoteLink'),
    copyQuoteBtn: document.getElementById('copyQuoteBtn'),
    clearCartBtn: document.getElementById('clearCartBtn'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    toast: document.getElementById('toast'),
    // Admin DOM
    adminBtn: document.getElementById('adminBtn'),
    adminBtnText: document.getElementById('adminBtnText'),
    adminLogoutBtn: document.getElementById('adminLogoutBtn'),
    adminBanner: document.getElementById('adminBanner'),
    openNewProductBtn: document.getElementById('openNewProductBtn'),
    openImportModalBtn: document.getElementById('openImportModalBtn'),
    openAdminPanelBtn: document.getElementById('openAdminPanelBtn'),
    adminLoginOverlay: document.getElementById('adminLoginOverlay'),
    closeLoginBtn: document.getElementById('closeLoginBtn'),
    adminLoginForm: document.getElementById('adminLoginForm'),
    loginUserInput: document.getElementById('loginUserInput'),
    loginPassInput: document.getElementById('loginPassInput'),
    loginErrorMsg: document.getElementById('loginErrorMsg'),
    adminPanelOverlay: document.getElementById('adminPanelOverlay'),
    closeAdminPanelBtn: document.getElementById('closeAdminPanelBtn'),
    adminTabs: document.querySelectorAll('[data-admin-tab]'),
    adminTabImport: document.getElementById('adminTabImport'),
    adminTabProduct: document.getElementById('adminTabProduct'),
    adminTabBcv: document.getElementById('adminTabBcv'),
    adminTabSettings: document.getElementById('adminTabSettings'),
    excelFileInput: document.getElementById('excelFileInput'),
    importModeSelect: document.getElementById('importModeSelect'),
    excelPreviewBox: document.getElementById('excelPreviewBox'),
    applyExcelImportBtn: document.getElementById('applyExcelImportBtn'),
    productEditorForm: document.getElementById('productEditorForm'),
    editProductId: document.getElementById('editProductId'),
    editBrand: document.getElementById('editBrand'),
    editPartNumber: document.getElementById('editPartNumber'),
    editName: document.getElementById('editName'),
    editCategory: document.getElementById('editCategory'),
    editPriceUsd: document.getElementById('editPriceUsd'),
    editInStock: document.getElementById('editInStock'),
    editImageUrl: document.getElementById('editImageUrl'),
    saveProductBtn: document.getElementById('saveProductBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),
    downloadDataJsBtn: document.getElementById('downloadDataJsBtn'),
    resetCatalogDefaultBtn: document.getElementById('resetCatalogDefaultBtn'),
    changePasswordForm: document.getElementById('changePasswordForm'),
    newAdminPass: document.getElementById('newAdminPass'),
    confirmAdminPass: document.getElementById('confirmAdminPass'),
    // Lightbox DOM
    imageLightboxOverlay: document.getElementById('imageLightboxOverlay'),
    lightboxContainer: document.getElementById('lightboxContainer'),
    closeLightboxBtn: document.getElementById('closeLightboxBtn'),
    lightboxZoomToggleBtn: document.getElementById('lightboxZoomToggleBtn'),
    lightboxZoomIcon: document.getElementById('lightboxZoomIcon'),
    lightboxZoomText: document.getElementById('lightboxZoomText'),
    lightboxStageScroll: document.getElementById('lightboxStageScroll'),
    lightboxStage: document.getElementById('lightboxStage'),
    lightboxImg: document.getElementById('lightboxImg'),
    lightboxFallback: document.getElementById('lightboxFallback'),
    lightboxZoomHint: document.getElementById('lightboxZoomHint'),
    lightboxSkuBrand: document.getElementById('lightboxSkuBrand'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxSubtitle: document.getElementById('lightboxSubtitle'),
    lightboxPrice: document.getElementById('lightboxPrice'),
    lightboxPriceTax: document.getElementById('lightboxPriceTax'),
    lightboxStockBadge: document.getElementById('lightboxStockBadge'),
    lightboxAddToCartBtn: document.getElementById('lightboxAddToCartBtn'),
    lightboxWhatsappBtn: document.getElementById('lightboxWhatsappBtn'),
    // Tasa BCV y Pago Móvil
    bcvTickerBar: document.getElementById('bcvTickerBar'),
    bcvRateDisplay: document.getElementById('bcvRateDisplay'),
    bcvUpdatedText: document.getElementById('bcvUpdatedText'),
    bcvRatePill: document.getElementById('bcvRatePill'),
    openPagoMovilBtn: document.getElementById('openPagoMovilBtn'),
    refreshBcvBtn: document.getElementById('refreshBcvBtn'),
    pagoMovilOverlay: document.getElementById('pagoMovilOverlay'),
    closePagoMovilBtn: document.getElementById('closePagoMovilBtn'),
    calcBcvRateValue: document.getElementById('calcBcvRateValue'),
    calcBcvDate: document.getElementById('calcBcvDate'),
    calcSyncBcvBtn: document.getElementById('calcSyncBcvBtn'),
    calcUsdInput: document.getElementById('calcUsdInput'),
    calcBsInput: document.getElementById('calcBsInput'),
    pmBankDisplay: document.getElementById('pmBankDisplay'),
    pmPhoneDisplay: document.getElementById('pmPhoneDisplay'),
    pmIdDisplay: document.getElementById('pmIdDisplay'),
    pmHolderDisplay: document.getElementById('pmHolderDisplay'),
    copyAllPagoMovilBtn: document.getElementById('copyAllPagoMovilBtn'),
    cartTotalBs: document.getElementById('cartTotalBs'),
    cartBcvRateLabel: document.getElementById('cartBcvRateLabel'),
    cartOpenPagoMovilBtn: document.getElementById('cartOpenPagoMovilBtn'),
    // Admin BCV y Pago Móvil
    pagoMovilConfigForm: document.getElementById('pagoMovilConfigForm'),
    adminBcvRateInput: document.getElementById('adminBcvRateInput'),
    adminSyncBcvLiveBtn: document.getElementById('adminSyncBcvLiveBtn'),
    adminPmBankInput: document.getElementById('adminPmBankInput'),
    adminPmIdInput: document.getElementById('adminPmIdInput'),
    adminPmPhoneInput: document.getElementById('adminPmPhoneInput'),
    adminPmHolderInput: document.getElementById('adminPmHolderInput'),
    // PWA Instalación
    pwaInstallBtn: document.getElementById('pwaInstallBtn')
  };

  let isLightboxZoomed = false;
  let activeLightboxPart = null;

  let toastTimer = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(amount) {
    return `$${Number(amount).toFixed(2)}`;
  }

  function formatBs(amount) {
    const num = Number(amount) || 0;
    return `Bs. ${num.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2500);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }

  function saveCatalogToStorage() {
    localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(catalogData));
  }

  function getAdminPassword() {
    return localStorage.getItem(STORAGE_KEYS.adminPass) || 'admin2026';
  }

  function updateAdminUI() {
    els.adminBanner.style.display = state.isAdmin ? 'flex' : 'none';
    els.adminLogoutBtn.style.display = state.isAdmin ? 'inline-flex' : 'none';
    els.adminBtn.classList.toggle('logged-in', state.isAdmin);
    els.adminBtnText.textContent = state.isAdmin ? 'Panel Admin' : 'Admin';
  }

  function getStatusMeta(part) {
    if (!part.inStock) {
      return {
        label: 'Agotado',
        cls: 'badge-stock-out',
        canBuy: false,
        btnText: 'Agotado'
      };
    }
    if (part.priceUsd <= 0) {
      return {
        label: 'Consultar',
        cls: 'badge-stock-low',
        canBuy: false,
        btnText: 'Consultar'
      };
    }
    return {
      label: 'Disponible',
      cls: 'badge-stock-ok',
      canBuy: true,
      btnText: '+ Cotizar'
    };
  }

  function refreshFilterControls() {
    const prevBrand = state.brand;
    els.brandFilter.innerHTML = '<option value="all">Todas las marcas</option>';

    const brandCounts = new Map();
    catalogData.items.forEach((p) => {
      brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
    });

    [...brandCounts.keys()]
      .sort((a, b) => a.localeCompare(b, 'es'))
      .forEach((brand) => {
        const opt = document.createElement('option');
        opt.value = brand;
        opt.textContent = `${brand} (${brandCounts.get(brand)})`;
        els.brandFilter.appendChild(opt);
      });

    if (brandCounts.has(prevBrand)) {
      els.brandFilter.value = prevBrand;
    } else {
      state.brand = 'all';
      els.brandFilter.value = 'all';
    }

    const maxPrice = getMaxCatalogPrice();
    els.maxPriceRange.max = String(maxPrice);
    if (state.maxPrice > maxPrice || state.maxPrice === 0) {
      state.maxPrice = maxPrice;
    }
    els.maxPriceRange.value = String(state.maxPrice);
    els.maxPriceLabel.textContent = `$${state.maxPrice}`;

    // Select de categorías en formulario de edición Admin
    els.editCategory.innerHTML = '';
    catalogData.categories
      .filter((c) => c.id !== 'all')
      .forEach((cat) => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        els.editCategory.appendChild(opt);
      });
  }

  function renderQuickChips() {
    els.quickChips.innerHTML = '';
    QUICK_KEYWORDS.forEach((kw) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `chip-btn ${state.quickChip === kw ? 'active' : ''}`;
      btn.textContent = kw;
      btn.addEventListener('click', () => {
        state.quickChip = kw;
        state.currentPage = 1;
        renderQuickChips();
        renderCatalog();
      });
      els.quickChips.appendChild(btn);
    });
  }

  function renderCategories() {
    els.categoryList.innerHTML = '';
    catalogData.categories.forEach((cat) => {
      const count =
        cat.id === 'all'
          ? catalogData.items.length
          : catalogData.items.filter((p) => p.category === cat.id).length;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cat-btn ${state.category === cat.id ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="cat-btn-left">${escapeHtml(cat.name)}</span>
        <span class="cat-count">${count}</span>
      `;
      btn.addEventListener('click', () => {
        state.category = cat.id;
        state.currentPage = 1;
        renderCategories();
        renderCatalog();
        if (window.innerWidth <= 860) {
          els.sidebar.classList.remove('open');
          if (els.sidebarBackdrop) els.sidebarBackdrop.classList.remove('open');
        }
      });
      els.categoryList.appendChild(btn);
    });
  }

  function getFilteredParts() {
    const query = state.search.trim().toLowerCase();
    const chipQuery = state.quickChip !== 'Todos' ? state.quickChip.toLowerCase() : '';

    const filtered = catalogData.items.filter((part) => {
      if (state.category !== 'all' && part.category !== state.category) return false;
      if (state.stock === 'available' && !part.inStock) return false;
      if (state.stock === 'out' && part.inStock) return false;
      if (state.brand !== 'all' && part.brand !== state.brand) return false;
      if (state.onlyPriced && part.priceUsd <= 0) return false;
      if (part.priceUsd > state.maxPrice) return false;

      const searchable = `${part.name} ${part.partNumber} ${part.brand} ${part.brandRaw} ${part.categoryName}`.toLowerCase();

      if (chipQuery && !searchable.includes(chipQuery)) return false;
      if (query && !searchable.includes(query)) return false;

      return true;
    });

    if (state.sort === 'available-first') {
      filtered.sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.id - b.id);
    } else if (state.sort === 'price-asc') {
      filtered.sort((a, b) => a.priceUsd - b.priceUsd);
    } else if (state.sort === 'price-desc') {
      filtered.sort((a, b) => b.priceUsd - a.priceUsd);
    } else if (state.sort === 'brand-asc') {
      filtered.sort((a, b) => a.brand.localeCompare(b.brand, 'es'));
    } else if (state.sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }

    return filtered;
  }

  function updateKPIs(parts) {
    const inStockCount = parts.filter((p) => p.inStock).length;
    const outOfStockCount = parts.length - inStockCount;

    els.kpiVisibleCount.textContent = String(parts.length);
    els.kpiTotalSub.textContent = `De ${catalogData.items.length} en inventario`;
    els.kpiInStockCount.textContent = String(inStockCount);
    els.kpiOutOfStockCount.textContent = String(outOfStockCount);

    const priced = parts.filter((p) => p.priceUsd > 0);
    const avg = priced.length
      ? priced.reduce((sum, p) => sum + p.priceUsd, 0) / priced.length
      : 0;
    els.kpiAvgPrice.textContent = formatMoney(avg);
  }

  function renderGridView(parts) {
    const grid = document.createElement('div');
    grid.className = 'parts-grid';

    parts.forEach((part) => {
      const hasPrice = part.priceUsd > 0;
      const status = getStatusMeta(part);
      const icons = DEFAULT_DATA.PART_ICONS;
      const veh = window.VehicleGraphics.resolveVehicle(part);

      const adminControls = state.isAdmin
        ? `<div class="admin-card-actions">
             <button class="btn-admin-inline" type="button" data-admin-edit="${part.id}">Editar</button>
             <button class="btn-admin-inline" type="button" data-admin-toggle="${part.id}">${part.inStock ? 'Marcar Agotado' : 'Marcar Disp.'}</button>
             <button class="btn-admin-inline danger" type="button" data-admin-del="${part.id}">Eliminar</button>
           </div>`
        : '';

      const card = document.createElement('article');
      card.className = `part-card ${part.inStock ? '' : 'out-of-stock'}`;
      card.innerHTML = `
        <div class="part-visual" data-open-id="${part.id}">
          <div class="part-badges">
            <span class="part-cat-tag" title="${escapeHtml(part.categoryName)}">${escapeHtml(part.categoryName)}</span>
            <span class="badge ${status.cls}">${escapeHtml(status.label)}</span>
          </div>

          <div class="brand-badge-pill" title="Marca: ${escapeHtml(veh.brand)}">
            <span class="brand-logo-slot">${veh.brandLogoSvg}</span>
            <strong style="font-size: 0.73rem;">${escapeHtml(veh.brand)}</strong>
          </div>

          <div class="part-visual-stage" data-zoom-id="${part.id}" title="Clic para ampliar imagen del repuesto">
            <img src="${escapeHtml(veh.customImageUrl || veh.localPhotoUrl)}"
                 alt="${escapeHtml(part.name)}"
                 class="vehicle-real-photo"
                 onerror="if(!this.dataset.caseRetry && /\.jpg$/i.test(this.src)) { this.dataset.caseRetry='1'; this.src = this.src.endsWith('.jpg') ? this.src.replace(/\.jpg$/, '.JPG') : this.src.replace(/\.JPG$/, '.jpg'); } else if(this.dataset.fallback !== 'veh') { this.dataset.fallback = 'veh'; this.src = '${escapeHtml(veh.localPhotoUrl)}'; } else { this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex'; }" />
            <div class="vehicle-silhouette-box" title="Vehículo: ${escapeHtml(veh.modelName)}" style="display: none;">${veh.vehicleSilhouetteSvg}</div>
            <button class="card-zoom-btn" type="button" data-zoom-id="${part.id}" title="Ampliar imagen del repuesto">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
          </div>

          <div class="vehicle-model-pill" title="Modelo compatible: ${escapeHtml(veh.modelName)}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
            <span>${escapeHtml(veh.modelName)}</span>
          </div>

          <div class="part-type-corner-icon" title="Componente: ${escapeHtml(part.categoryName)}">
            ${icons[part.icon] || icons.varios}
          </div>
        </div>

        <div class="part-body">
          <div class="part-meta">
            <span class="part-brand">${escapeHtml(part.brand)}</span>
            <span class="part-sku">N° ${escapeHtml(part.partNumber)}</span>
          </div>
          <h3 class="part-title" data-open-id="${part.id}">${escapeHtml(part.name)}</h3>
          <div class="part-footer">
            <div class="price-block">
              ${
                hasPrice
                  ? `<span class="price-current">${formatMoney(part.priceUsd)}</span>
                     <span class="price-sub">C/+16%: ${formatMoney(part.priceTotal)}</span>
                     <span class="price-bcv" title="Aprox. a Tasa BCV Oficial">≈ ${formatBs(part.priceTotal * state.bcvRate)}</span>`
                  : `<span class="price-current" style="font-size: 0.95rem; color: var(--warning);">Consultar</span>`
              }
            </div>
            <div class="part-actions">
              <button class="btn-detail" type="button" data-open-id="${part.id}">Ver</button>
              <button class="btn-add" type="button" data-add-id="${part.id}" ${!status.canBuy ? 'disabled' : ''}>
                ${escapeHtml(status.btnText)}
              </button>
            </div>
          </div>
          ${adminControls}
        </div>
      `;
      grid.appendChild(card);
    });

    els.catalogContainer.appendChild(grid);
  }

  function renderTableView(parts) {
    const wrap = document.createElement('div');
    wrap.className = 'parts-table-wrap';

    const rowsHtml = parts
      .map((part) => {
        const hasPrice = part.priceUsd > 0;
        const status = getStatusMeta(part);
        const veh = window.VehicleGraphics.resolveVehicle(part);
        const adminRowBtns = state.isAdmin
          ? `<button class="btn-detail" type="button" data-admin-edit="${part.id}">Editar</button>
             <button class="btn-detail" type="button" data-admin-toggle="${part.id}">${part.inStock ? 'Agotar' : 'Activar'}</button>
             <button class="btn-detail" style="color: var(--danger);" type="button" data-admin-del="${part.id}">Eliminar</button>`
          : '';

        return `
          <tr class="${part.inStock ? '' : 'out-of-stock'}">
            <td>
              <div class="table-brand-cell">
                <span class="table-brand-emblem">${veh.brandLogoSvg}</span>
                <strong>${escapeHtml(part.brand)}</strong>
              </div>
            </td>
            <td class="part-sku">${escapeHtml(part.partNumber)}</td>
            <td>
              <div style="font-weight: 600; cursor: pointer;" data-open-id="${part.id}">${escapeHtml(part.name)}</div>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 3px;">
                <span class="badge" style="background: var(--bg-hover); color: var(--text-secondary); font-size: 0.69rem; font-weight: 700;">
                  🚗 ${escapeHtml(veh.modelName)}
                </span>
                <span style="font-size: 0.74rem; color: var(--text-muted);">${escapeHtml(part.categoryName)}</span>
              </div>
            </td>
            <td><span class="badge ${status.cls}">${escapeHtml(status.label)}</span></td>
            <td style="font-family: var(--font-mono); font-weight: 800;">
              ${hasPrice ? formatMoney(part.priceUsd) : '<span style="color: var(--warning);">Consultar</span>'}
            </td>
            <td style="font-family: var(--font-mono); color: var(--text-secondary);">
              ${hasPrice ? formatMoney(part.priceTotal) : '—'}
            </td>
            <td style="text-align: right; white-space: nowrap;">
              <button class="btn-detail" type="button" data-open-id="${part.id}">Ficha</button>
              <button class="btn-add" type="button" data-add-id="${part.id}" ${!status.canBuy ? 'disabled' : ''}>
                ${escapeHtml(status.btnText)}
              </button>
              ${adminRowBtns}
            </td>
          </tr>
        `;
      })
      .join('');

    wrap.innerHTML = `
      <table class="parts-table">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Núm. Pieza</th>
            <th>Producto y Modelo</th>
            <th>Estado</th>
            <th>Venta ($)</th>
            <th>C/IVA (+16%)</th>
            <th style="text-align: right;">Acciones</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;

    els.catalogContainer.appendChild(wrap);
  }

  function renderPagination(totalItems) {
    els.paginationBar.innerHTML = '';
    if (state.pageSize === 'all' || totalItems === 0) return;

    const pageSize = Number(state.pageSize);
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return;

    const addBtn = (label, page, disabled = false, active = false) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `page-btn ${active ? 'active' : ''}`;
      btn.textContent = label;
      btn.disabled = disabled;
      if (!disabled && !active) {
        btn.addEventListener('click', () => {
          state.currentPage = page;
          renderCatalog();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
      els.paginationBar.appendChild(btn);
    };

    addBtn('← Anterior', state.currentPage - 1, state.currentPage === 1);

    const startPage = Math.max(1, state.currentPage - 2);
    const endPage = Math.min(totalPages, state.currentPage + 2);

    if (startPage > 1) {
      addBtn('1', 1, false, state.currentPage === 1);
      if (startPage > 2) {
        const span = document.createElement('span');
        span.textContent = '…';
        span.style.padding = '0 4px';
        els.paginationBar.appendChild(span);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      addBtn(String(p), p, false, p === state.currentPage);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const span = document.createElement('span');
        span.textContent = '…';
        span.style.padding = '0 4px';
        els.paginationBar.appendChild(span);
      }
      addBtn(String(totalPages), totalPages, false, state.currentPage === totalPages);
    }

    addBtn('Siguiente →', state.currentPage + 1, state.currentPage === totalPages);
  }

  function renderCatalog() {
    const filtered = getFilteredParts();
    updateKPIs(filtered);

    let paged = filtered;
    let rangeLabel = '';

    if (state.pageSize !== 'all' && filtered.length > 0) {
      const size = Number(state.pageSize);
      const totalPages = Math.ceil(filtered.length / size);
      if (state.currentPage > totalPages) state.currentPage = totalPages;
      const start = (state.currentPage - 1) * size;
      const end = Math.min(start + size, filtered.length);
      paged = filtered.slice(start, end);
      rangeLabel = ` (mostrando ${start + 1}–${end})`;
    }

    els.resultsInfo.innerHTML = `<strong>${filtered.length}</strong> repuestos encontrados${rangeLabel}`;
    els.catalogContainer.innerHTML = '';

    if (filtered.length === 0) {
      const searchedTerm = (state.search || '').trim();
      const currentCategory = state.category !== 'all' ? state.category : '';
      const currentBrand = state.brand !== 'all' ? state.brand : '';

      let subjectDesc = searchedTerm;
      if (!subjectDesc && currentBrand) subjectDesc = `marca ${currentBrand}`;
      if (!subjectDesc && currentCategory) subjectDesc = `categoría seleccionada`;
      if (!subjectDesc) subjectDesc = 'el repuesto solicitado';

      const waRescueText = `Hola, estuve buscando en el catálogo web: "${subjectDesc}" y no me apareció en los resultados. ¿Tienen disponibilidad o me lo pueden cotizar?`;

      els.catalogContainer.innerHTML = `
        <div class="empty-state-rescue">
          <div class="rescue-badge-icon">🔍💬</div>
          <h3 class="rescue-title">¿No encuentras el repuesto que buscas?</h3>
          <p class="rescue-desc">
            ${
              searchedTerm
                ? `No encontramos resultados exactos para <strong>"${escapeHtml(searchedTerm)}"</strong> en el catálogo online.`
                : `No encontramos repuestos con los filtros seleccionados actualmente.`
            }
            <br />
            ¡En tienda <strong>manejamos más de 3.000 repuestos eléctricos</strong> y piezas bajo pedido que no están publicadas aún!
          </p>

          <div class="rescue-card-action">
            <p class="rescue-callout">
              Escríbenos directamente a WhatsApp y un repuestero de nuestro equipo te confirma disponibilidad y precio en minutos:
            </p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waRescueText)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-rescue-whatsapp">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.11.55 4.17 1.6 5.98L0 24l6.24-1.64a11.9 11.9 0 0 0 5.82 1.49h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.5-8.42zM12.06 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.86 9.86 0 0 1-1.52-5.25c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.46-4.44 9.85-9.9 9.85zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>
              <span>Consultar por WhatsApp (+584167456111)</span>
            </a>
          </div>

          <button id="emptyResetBtn" class="btn-rescue-reset" type="button">
            🔄 Ver todos los 896 repuestos disponibles
          </button>
        </div>
      `;
      document.getElementById('emptyResetBtn').addEventListener('click', resetAllFilters);
      els.paginationBar.innerHTML = '';
      return;
    }

    if (state.view === 'grid') {
      renderGridView(paged);
    } else {
      renderTableView(paged);
    }

    renderPagination(filtered.length);
  }

  /* ==========================================================================
     VISOR DE IMÁGENES / LIGHTBOX HD
     ========================================================================== */
  function openImageLightbox(part, fallbackImageUrl) {
    if (!part) return;
    activeLightboxPart = part;
    isLightboxZoomed = false;

    const veh = window.VehicleGraphics.resolveVehicle(part);
    const targetSrc = fallbackImageUrl || part.imageUrl || veh.customImageUrl || veh.partPhotoUrl || veh.localPhotoUrl;
    const hasPrice = part.priceUsd > 0;
    const status = getStatusMeta(part);

    // Cabecera del visor con datos del repuesto
    els.lightboxSkuBrand.innerHTML = `
      <span class="table-brand-emblem" style="width:24px; height:18px;">${veh.brandLogoSvg}</span>
      <strong>${escapeHtml(part.brand.toUpperCase())}</strong> · N° DE PIEZA: <code>${escapeHtml(part.partNumber)}</code>
    `;
    els.lightboxTitle.textContent = part.name;
    els.lightboxSubtitle.innerHTML = `🚗 Vehículo compatible: <strong>${escapeHtml(veh.modelName)}</strong> · Categoría: <span>${escapeHtml(part.categoryName)}</span>`;

    // Reset de estado de zoom
    els.lightboxImg.classList.remove('zoomed');
    els.lightboxStageScroll.classList.remove('is-zoomed');
    els.lightboxZoomText.textContent = 'Zoom detalle';
    const hintSpan = els.lightboxZoomHint.querySelector('span');
    if (hintSpan) hintSpan.textContent = 'Haz clic en la imagen para ampliar o alejar';

    // Precios y disponibilidad
    els.lightboxPrice.textContent = hasPrice ? formatMoney(part.priceUsd) : 'Por consultar';
    els.lightboxPriceTax.textContent = hasPrice ? `Total con IVA (16%): ${formatMoney(part.priceTotal)}` : '';
    els.lightboxStockBadge.className = `badge ${status.cls}`;
    els.lightboxStockBadge.textContent = status.label;

    // Enlace de WhatsApp directo con el repuesto seleccionado
    const phone = '584167456111';
    const waText = `Hola, estoy interesado en el repuesto: ${part.name} (Pieza N° ${part.partNumber}, Marca: ${part.brand}). Precio: ${hasPrice ? formatMoney(part.priceUsd) : 'Por consultar'}. ¿Tienen disponibilidad inmediata?`;
    els.lightboxWhatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

    // Botón de agregar a cotización
    els.lightboxAddToCartBtn.disabled = !status.canBuy;
    els.lightboxAddToCartBtn.textContent = !part.inStock
      ? 'Producto Agotado'
      : hasPrice
        ? 'Agregar a mi cotización'
        : 'Consultar disponibilidad';

    // Carga de la imagen o fallback
    els.lightboxImg.style.display = 'block';
    els.lightboxFallback.style.display = 'none';
    els.lightboxZoomHint.style.display = 'inline-flex';
    els.lightboxImg.alt = part.name;

    els.lightboxImg.onerror = function () {
      if (!this.dataset.caseRetry && /\.jpg$/i.test(this.src)) {
        this.dataset.caseRetry = '1';
        this.src = this.src.endsWith('.jpg') ? this.src.replace(/\.jpg$/, '.JPG') : this.src.replace(/\.JPG$/, '.jpg');
        return;
      }
      if (this.dataset.fallback !== 'veh' && veh.localPhotoUrl && targetSrc !== veh.localPhotoUrl) {
        this.dataset.fallback = 'veh';
        this.src = veh.localPhotoUrl;
        return;
      }
      els.lightboxImg.style.display = 'none';
      els.lightboxFallback.innerHTML = `
        <div style="text-align: center; padding: 24px;">
          <div style="width: 140px; height: 90px; margin: 0 auto 10px;">${veh.vehicleSilhouetteSvg}</div>
          <p style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin: 0;">Foto del producto aún no vinculada</p>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Vehículo compatible: ${escapeHtml(veh.modelName)}</p>
        </div>
      `;
      els.lightboxFallback.style.display = 'flex';
      els.lightboxZoomHint.style.display = 'none';
    };

    delete els.lightboxImg.dataset.caseRetry;
    delete els.lightboxImg.dataset.fallback;
    els.lightboxImg.src = targetSrc;
    els.imageLightboxOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeImageLightbox() {
    if (!els.imageLightboxOverlay) return;
    els.imageLightboxOverlay.classList.remove('open');
    isLightboxZoomed = false;
    els.lightboxImg.classList.remove('zoomed');
    els.lightboxStageScroll.classList.remove('is-zoomed');
    activeLightboxPart = null;

    if (
      !els.detailOverlay.classList.contains('open') &&
      !els.cartOverlay.classList.contains('open') &&
      !els.adminPanelOverlay.classList.contains('open')
    ) {
      document.body.style.overflow = '';
    }
  }

  function toggleLightboxZoom() {
    if (!els.lightboxImg || els.lightboxImg.style.display === 'none') return;
    isLightboxZoomed = !isLightboxZoomed;
    const hintSpan = els.lightboxZoomHint.querySelector('span');

    if (isLightboxZoomed) {
      els.lightboxImg.classList.add('zoomed');
      els.lightboxStageScroll.classList.add('is-zoomed');
      els.lightboxZoomText.textContent = 'Ajustar pantalla';
      if (hintSpan) hintSpan.textContent = 'Haz clic para reducir imagen';
    } else {
      els.lightboxImg.classList.remove('zoomed');
      els.lightboxStageScroll.classList.remove('is-zoomed');
      els.lightboxZoomText.textContent = 'Zoom detalle';
      if (hintSpan) hintSpan.textContent = 'Haz clic en la imagen para ampliar o alejar';
    }
  }

  function openDetailModal(partId) {
    const part = catalogData.items.find((p) => p.id === partId);
    if (!part) return;

    const hasPrice = part.priceUsd > 0;
    const status = getStatusMeta(part);
    const icons = DEFAULT_DATA.PART_ICONS;
    const veh = window.VehicleGraphics.resolveVehicle(part);

    els.modalBrandSku.textContent = `${part.brand.toUpperCase()} · N° DE PIEZA: ${part.partNumber}`;
    els.modalTitle.textContent = part.name;

    const statusDetail = !part.inStock
      ? 'Agotado (sin existencia actual)'
      : hasPrice
        ? 'Disponible para venta al público'
        : 'Precio por consultar';

    const adminModalBtn = state.isAdmin
      ? `<button id="modalEditAdminBtn" class="btn-secondary-full" style="margin-top: 8px;" type="button">Editar producto (Admin)</button>`
      : '';

    els.modalBody.innerHTML = `
      <div>
        <div class="modal-vehicle-plate">
          <div class="modal-brand-hero">
            <span class="table-brand-emblem">${veh.brandLogoSvg}</span>
            <strong style="font-size: 0.82rem;">${escapeHtml(veh.brand)}</strong>
          </div>

          <div class="modal-vehicle-hero modal-zoomable" id="modalHeroZoomBox" role="button" tabindex="0" title="Haz clic sobre la imagen para abrirla en tamaño completo">
            <img src="${escapeHtml(veh.customImageUrl || veh.localPhotoUrl)}"
                 alt="${escapeHtml(part.name)}"
                 class="vehicle-real-photo"
                 style="max-height:92px;"
                 onerror="if(this.dataset.fallback !== 'veh') { this.dataset.fallback = 'veh'; this.src = '${escapeHtml(veh.localPhotoUrl)}'; } else { this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex'; }" />
            <div style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">${veh.vehicleSilhouetteSvg}</div>
            <div class="zoom-pill-overlay">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              <span>🔍 Clic para ampliar</span>
            </div>
          </div>

          <div class="vehicle-model-pill" style="font-size: 0.78rem; padding: 4px 12px;">
            <span>🚗 Modelo: ${escapeHtml(veh.modelName)}</span>
          </div>

          <div class="part-type-corner-icon" title="Componente: ${escapeHtml(part.categoryName)}">
            ${icons[part.icon] || icons.varios}
          </div>
        </div>

        <button type="button" id="modalOpenFullImageBtn" class="btn-zoom-trigger-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          <span>Abrir imagen del repuesto en tamaño completo</span>
        </button>

        <div style="margin-top: 14px;">
          <div style="font-size: 0.76rem; color: var(--text-muted);">Costo de Venta ($)</div>
          <div style="font-size: 1.65rem; font-weight: 800; font-family: var(--font-mono);">
            ${hasPrice ? formatMoney(part.priceUsd) : 'Por consultar'}
          </div>
          ${
            hasPrice
              ? `<div style="font-size: 0.84rem; color: var(--text-secondary); font-family: var(--font-mono);">
                   Total con 16% (Col. BS/Ref): ${formatMoney(part.priceTotal)}
                 </div>
                 <div class="modal-price-bcv">
                   Equivalente a Tasa BCV: <strong>${formatBs(part.priceTotal * state.bcvRate)}</strong> (Tasa: ${formatBs(state.bcvRate)}/$)
                 </div>`
              : ''
          }
        </div>
        <button id="modalAddCartBtn" class="btn-primary-full" style="margin-top: 14px;" type="button" ${!status.canBuy ? 'disabled' : ''}>
          ${!part.inStock ? 'Producto Agotado' : hasPrice ? 'Agregar a mi cotización' : 'Consultar disponibilidad en tienda'}
        </button>
        ${adminModalBtn}
      </div>
      <div>
        <h4 style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted);">Ficha del Catálogo</h4>
        <table class="spec-table">
          <tbody>
            <tr><td>Estado</td><td><span class="badge ${status.cls}">${escapeHtml(status.label)}</span> (${escapeHtml(statusDetail)})</td></tr>
            <tr><td>Marca / Fabricante</td><td><strong>${escapeHtml(part.brand)}</strong></td></tr>
            <tr><td>Vehículo Compatible</td><td><strong>🚗 ${escapeHtml(veh.modelName)}</strong></td></tr>
            <tr><td>Número de Pieza</td><td class="part-sku">${escapeHtml(part.partNumber)}</td></tr>
            <tr><td>Categoría</td><td>${escapeHtml(part.categoryName)}</td></tr>
            <tr><td>Producto</td><td>${escapeHtml(part.name)}</td></tr>
            <tr><td>Costo de Venta ($)</td><td>${hasPrice ? formatMoney(part.priceUsd) : 'Consultar'}</td></tr>
            <tr><td>Costo de Venta (+16%)</td><td>${hasPrice ? formatMoney(part.priceTotal) : 'Consultar'}</td></tr>
          </tbody>
        </table>
      </div>
    `;

    // Clic en la imagen del modal para ampliar en Lightbox
    const heroZoomBox = document.getElementById('modalHeroZoomBox');
    if (heroZoomBox) {
      heroZoomBox.addEventListener('click', () => {
        openImageLightbox(part, veh.customImageUrl || veh.localPhotoUrl);
      });
      heroZoomBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openImageLightbox(part, veh.customImageUrl || veh.localPhotoUrl);
        }
      });
    }

    const modalFullImgBtn = document.getElementById('modalOpenFullImageBtn');
    if (modalFullImgBtn) {
      modalFullImgBtn.addEventListener('click', () => {
        openImageLightbox(part, veh.customImageUrl || veh.localPhotoUrl);
      });
    }

    const addBtn = document.getElementById('modalAddCartBtn');
    if (addBtn && status.canBuy) {
      addBtn.addEventListener('click', () => {
        addToCart(part.id);
        closeDetailModal();
      });
    }

    const modalEditBtn = document.getElementById('modalEditAdminBtn');
    if (modalEditBtn) {
      modalEditBtn.addEventListener('click', () => {
        closeDetailModal();
        openProductEditor(part.id);
      });
    }

    els.detailOverlay.classList.add('open');
  }

  function closeDetailModal() {
    els.detailOverlay.classList.remove('open');
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  }

  function buildQuoteText() {
    if (state.cart.length === 0) {
      return 'Hola, quisiera consultar disponibilidad y precios de repuestos en Repuestos Electricos Para Vehiculos Multimarcas.';
    }
    const lines = [
      '*Cotización - Repuestos Electricos Para Vehiculos Multimarcas*',
      `_Tasa Oficial BCV: ${formatBs(state.bcvRate)}/$_\n`
    ];
    let subtotal = 0;
    let total = 0;
    state.cart.forEach((entry) => {
      const part = catalogData.items.find((p) => p.id === entry.id);
      if (!part) return;
      const lineUsd = part.priceUsd * entry.qty;
      const lineTot = part.priceTotal * entry.qty;
      const lineBs = lineTot * state.bcvRate;
      subtotal += lineUsd;
      total += lineTot;
      lines.push(`• ${entry.qty}x [${part.partNumber}] ${part.name} (${part.brand}): ${formatMoney(lineTot)} ≈ ${formatBs(lineBs)}`);
    });
    const totalBs = total * state.bcvRate;
    lines.push('\n--------------------------------');
    lines.push(`*Total USD (+16% IVA):* ${formatMoney(total)}`);
    lines.push(`*Total en Bolívares (BCV):* ${formatBs(totalBs)}`);
    lines.push('--------------------------------');
    lines.push(`*Datos Pago Móvil:* ${state.pagoMovil.bank} · Tel: ${state.pagoMovil.phone} · C.I: ${state.pagoMovil.idNumber}`);
    lines.push('¿Tienen disponibilidad para entrega o despacho inmediato?');
    return lines.join('\n');
  }

  function addToCart(partId) {
    const part = catalogData.items.find((p) => p.id === partId);
    if (!part) return;
    if (!part.inStock) {
      showToast('Este repuesto se encuentra agotado');
      return;
    }
    if (part.priceUsd <= 0) return;

    const existing = state.cart.find((item) => item.id === partId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id: partId, qty: 1 });
    }

    saveCart();
    renderCart();
    showToast(`Agregado: ${part.partNumber}`);
  }

  function updateCartQty(partId, delta) {
    const item = state.cart.find((c) => c.id === partId);
    if (!item) return;

    const nextQty = item.qty + delta;
    if (nextQty <= 0) {
      state.cart = state.cart.filter((c) => c.id !== partId);
    } else {
      item.qty = nextQty;
    }

    saveCart();
    renderCart();
  }

  function renderCart() {
    state.cart = state.cart.filter((entry) => {
      const p = catalogData.items.find((item) => item.id === entry.id);
      return p && p.inStock && p.priceUsd > 0;
    });
    saveCart();

    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    els.cartCountBadge.textContent = String(totalCount);

    const waText = encodeURIComponent(buildQuoteText());
    els.whatsappQuoteLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    if (state.cart.length === 0) {
      els.cartItemsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 48px 16px;">
          <p style="font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Tu cotización está vacía</p>
          <p style="font-size: 0.84rem;">Selecciona repuestos disponibles del catálogo o escríbenos directo al WhatsApp +584167456111.</p>
        </div>
      `;
      els.cartSubtotal.textContent = '$0.00';
      els.cartTax.textContent = '$0.00';
      els.cartTotal.textContent = '$0.00';
      if (els.cartTotalBs) els.cartTotalBs.textContent = 'Bs. 0,00';
      if (els.cartBcvRateLabel) els.cartBcvRateLabel.textContent = `Tasa Oficial BCV: ${formatBs(state.bcvRate)}/$`;
      return;
    }

    let subtotal = 0;
    let totalWithTax = 0;
    els.cartItemsContainer.innerHTML = '';

    state.cart.forEach((entry) => {
      const part = catalogData.items.find((p) => p.id === entry.id);
      if (!part) return;
      const lineUsd = part.priceUsd * entry.qty;
      const lineTotal = part.priceTotal * entry.qty;
      subtotal += lineUsd;
      totalWithTax += lineTotal;

      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-top">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700;">${escapeHtml(part.name)}</div>
            <div class="part-sku">${escapeHtml(part.brand)} · N° ${escapeHtml(part.partNumber)}</div>
          </div>
          <button type="button" style="color: var(--text-muted); font-size: 0.85rem;" data-remove-id="${part.id}" aria-label="Eliminar">✕</button>
        </div>
        <div class="cart-item-bottom">
          <div class="qty-control">
            <button type="button" data-qty-id="${part.id}" data-delta="-1">−</button>
            <span>${entry.qty}</span>
            <button type="button" data-qty-id="${part.id}" data-delta="1">+</button>
          </div>
          <div style="text-align: right;">
            <strong style="font-family: var(--font-mono); font-size: 0.92rem;">${formatMoney(lineUsd)}</strong>
            <div class="price-sub">C/+16%: ${formatMoney(lineTotal)}</div>
            <div class="price-bcv" style="font-size: 0.72rem;">≈ ${formatBs(lineTotal * state.bcvRate)}</div>
          </div>
        </div>
      `;
      els.cartItemsContainer.appendChild(el);
    });

    const taxDiff = Math.max(0, totalWithTax - subtotal);
    els.cartSubtotal.textContent = formatMoney(subtotal);
    els.cartTax.textContent = formatMoney(taxDiff);
    els.cartTotal.textContent = formatMoney(totalWithTax);
    if (els.cartTotalBs) {
      els.cartTotalBs.textContent = formatBs(totalWithTax * state.bcvRate);
    }
    if (els.cartBcvRateLabel) {
      els.cartBcvRateLabel.textContent = `Tasa Oficial BCV: ${formatBs(state.bcvRate)}/$`;
    }
  }

  /* ==========================================================================
     SISTEMA DE TASA OFICIAL BCV Y CALCULADORA DE PAGO MÓVIL
     ========================================================================== */
  function updateBcvUI() {
    const formatted = formatBs(state.bcvRate);
    if (els.bcvRateDisplay) els.bcvRateDisplay.textContent = `${formatted}/$`;
    if (els.bcvUpdatedText) els.bcvUpdatedText.textContent = state.bcvDate || 'Oficial';
    if (els.calcBcvRateValue) els.calcBcvRateValue.textContent = `${formatted} Bs/$`;
    if (els.calcBcvDate) els.calcBcvDate.textContent = `Sincronizado: ${state.bcvDate || 'Oficial'}`;
    if (els.cartBcvRateLabel) els.cartBcvRateLabel.textContent = `Tasa Oficial BCV: ${formatted}/$`;

    if (els.pmBankDisplay) els.pmBankDisplay.textContent = state.pagoMovil.bank;
    if (els.pmPhoneDisplay) els.pmPhoneDisplay.textContent = state.pagoMovil.phone;
    if (els.pmIdDisplay) els.pmIdDisplay.textContent = state.pagoMovil.idNumber;
    if (els.pmHolderDisplay) els.pmHolderDisplay.textContent = state.pagoMovil.holder;

    if (els.adminBcvRateInput) els.adminBcvRateInput.value = state.bcvRate;
    if (els.adminPmBankInput) els.adminPmBankInput.value = state.pagoMovil.bank;
    if (els.adminPmPhoneInput) els.adminPmPhoneInput.value = state.pagoMovil.phone;
    if (els.adminPmIdInput) els.adminPmIdInput.value = state.pagoMovil.idNumber;
    if (els.adminPmHolderInput) els.adminPmHolderInput.value = state.pagoMovil.holder;

    if (els.calcUsdInput && els.calcBsInput) {
      const usd = parseFloat(els.calcUsdInput.value) || 0;
      if (usd > 0) {
        els.calcBsInput.value = (usd * state.bcvRate).toFixed(2);
      }
    }
  }

  async function fetchBcvRate(isManual = false) {
    if (els.bcvRateDisplay) els.bcvRateDisplay.textContent = 'Consultando...';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const rate = Number(data.promedio);
        if (rate > 0) {
          state.bcvRate = rate;
          state.bcvDate = data.fechaActualizacion
            ? new Date(data.fechaActualizacion).toLocaleDateString('es-VE')
            : 'Hoy';
          localStorage.setItem(STORAGE_KEYS.bcvRate, JSON.stringify({ rate: state.bcvRate, date: state.bcvDate }));
          updateBcvUI();
          renderCatalog();
          renderCart();
          if (isManual) showToast(`Tasa BCV actualizada: ${formatBs(state.bcvRate)}/$`);
          return;
        }
      }
    } catch (err) {
      console.warn('Consulta a BCV API en diferido:', err);
    }
    updateBcvUI();
    if (isManual) showToast(`Tasa actual: ${formatBs(state.bcvRate)}/$`);
  }

  function openPagoMovilModal() {
    updateBcvUI();
    if (els.pagoMovilOverlay) els.pagoMovilOverlay.classList.add('open');
  }

  function closePagoMovilModal() {
    if (els.pagoMovilOverlay) els.pagoMovilOverlay.classList.remove('open');
  }

  function resetAllFilters() {
    const maxPrice = getMaxCatalogPrice();
    state.search = '';
    state.quickChip = 'Todos';
    state.category = 'all';
    state.stock = 'all';
    state.brand = 'all';
    state.maxPrice = maxPrice;
    state.onlyPriced = false;
    state.sort = 'catalog';
    state.currentPage = 1;

    els.searchInput.value = '';
    els.clearSearchBtn.classList.remove('visible');
    els.stockFilter.value = 'all';
    els.brandFilter.value = 'all';
    els.maxPriceRange.max = String(maxPrice);
    els.maxPriceRange.value = String(maxPrice);
    els.maxPriceLabel.textContent = `$${maxPrice}`;
    els.onlyPricedCheckbox.checked = false;
    els.sortSelect.value = 'catalog';

    renderQuickChips();
    renderCategories();
    renderCatalog();
  }

  // ---- Funciones de Administrador ----

  function switchAdminTab(tabName) {
    els.adminTabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.adminTab === tabName);
    });
    els.adminTabImport.classList.toggle('active', tabName === 'import');
    els.adminTabProduct.classList.toggle('active', tabName === 'product');
    if (els.adminTabBcv) els.adminTabBcv.classList.toggle('active', tabName === 'bcv');
    els.adminTabSettings.classList.toggle('active', tabName === 'settings');
  }

  function openAdminPanel(defaultTab = 'import') {
    if (!state.isAdmin) {
      openLoginModal();
      return;
    }
    switchAdminTab(defaultTab);
    els.adminPanelOverlay.classList.add('open');
  }

  function closeAdminPanel() {
    els.adminPanelOverlay.classList.remove('open');
  }

  function openLoginModal() {
    els.loginErrorMsg.style.display = 'none';
    els.adminLoginForm.reset();
    els.adminLoginOverlay.classList.add('open');
    setTimeout(() => els.loginUserInput.focus(), 50);
  }

  function closeLoginModal() {
    els.adminLoginOverlay.classList.remove('open');
  }

  function resetProductForm() {
    els.editProductId.value = '';
    els.productEditorForm.reset();
    els.editInStock.value = 'true';
    if (els.editImageUrl) els.editImageUrl.value = '';
    els.saveProductBtn.textContent = 'Agregar nuevo producto';
  }

  function openProductEditor(partId = null) {
    resetProductForm();
    if (partId !== null) {
      const part = catalogData.items.find((p) => p.id === partId);
      if (part) {
        els.editProductId.value = String(part.id);
        els.editBrand.value = part.brand;
        els.editPartNumber.value = part.partNumber;
        els.editName.value = part.name;
        els.editCategory.value = part.category;
        els.editPriceUsd.value = String(part.priceUsd);
        els.editInStock.value = part.inStock ? 'true' : 'false';
        if (els.editImageUrl) els.editImageUrl.value = part.imageUrl || '';
        els.saveProductBtn.textContent = 'Guardar cambios';
      }
    }
    openAdminPanel('product');
  }

  function toggleProductStock(partId) {
    const part = catalogData.items.find((p) => p.id === partId);
    if (!part) return;
    part.inStock = !part.inStock;
    saveCatalogToStorage();
    renderCatalog();
    renderCart();
    showToast(`${part.partNumber}: ${part.inStock ? 'Disponible' : 'Agotado'}`);
  }

  function deleteProduct(partId) {
    const part = catalogData.items.find((p) => p.id === partId);
    if (!part) return;
    const confirmed = window.confirm(`¿Eliminar el repuesto "${part.name}" (${part.partNumber})?`);
    if (!confirmed) return;

    catalogData.items = catalogData.items.filter((p) => p.id !== partId);
    saveCatalogToStorage();
    refreshFilterControls();
    renderCategories();
    renderCatalog();
    renderCart();
    showToast(`Producto eliminado: ${part.partNumber}`);
  }

  function syncAllViewsAfterCatalogChange() {
    saveCatalogToStorage();
    state.maxPrice = getMaxCatalogPrice();
    refreshFilterControls();
    renderCategories();
    renderCatalog();
    renderCart();
  }

  function downloadUpdatedDataJs() {
    const content =
      `window.REPUESTOS_DATA = window.REPUESTOS_DATA || {};\n\n` +
      `window.REPUESTOS_DATA.PART_ICONS = ${JSON.stringify(DEFAULT_DATA.PART_ICONS, null, 2)};\n\n` +
      `window.REPUESTOS_DATA.CATEGORIES = ${JSON.stringify(catalogData.categories, null, 2)};\n\n` +
      `window.REPUESTOS_DATA.PARTS_CATALOG = ${JSON.stringify(catalogData.items, null, 2)};\n`;

    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Archivo data.js descargado');
  }

  function bindEvents() {
    els.menuToggleBtn.addEventListener('click', () => {
      const isOpen = els.sidebar.classList.toggle('open');
      if (els.sidebarBackdrop) els.sidebarBackdrop.classList.toggle('open', isOpen);
    });

    if (els.closeSidebarBtn) {
      els.closeSidebarBtn.addEventListener('click', () => {
        els.sidebar.classList.remove('open');
        if (els.sidebarBackdrop) els.sidebarBackdrop.classList.remove('open');
      });
    }

    if (els.sidebarBackdrop) {
      els.sidebarBackdrop.addEventListener('click', () => {
        els.sidebar.classList.remove('open');
        els.sidebarBackdrop.classList.remove('open');
      });
    }

    els.searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      state.currentPage = 1;
      els.clearSearchBtn.classList.toggle('visible', state.search.length > 0);
      renderCatalog();
    });

    els.clearSearchBtn.addEventListener('click', () => {
      state.search = '';
      state.currentPage = 1;
      els.searchInput.value = '';
      els.clearSearchBtn.classList.remove('visible');
      renderCatalog();
      els.searchInput.focus();
    });

    els.stockFilter.addEventListener('change', (e) => {
      state.stock = e.target.value;
      state.currentPage = 1;
      renderCatalog();
    });

    els.brandFilter.addEventListener('change', (e) => {
      state.brand = e.target.value;
      state.currentPage = 1;
      renderCatalog();
    });

    els.maxPriceRange.addEventListener('input', (e) => {
      state.maxPrice = Number(e.target.value);
      state.currentPage = 1;
      els.maxPriceLabel.textContent = `$${state.maxPrice}`;
      renderCatalog();
    });

    els.onlyPricedCheckbox.addEventListener('change', (e) => {
      state.onlyPriced = e.target.checked;
      state.currentPage = 1;
      renderCatalog();
    });

    els.resetAllBtn.addEventListener('click', resetAllFilters);

    els.pageSizeSelect.addEventListener('change', (e) => {
      state.pageSize = e.target.value;
      state.currentPage = 1;
      renderCatalog();
    });

    els.sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      state.currentPage = 1;
      renderCatalog();
    });

    els.gridViewBtn.addEventListener('click', () => {
      state.view = 'grid';
      els.gridViewBtn.classList.add('active');
      els.tableViewBtn.classList.remove('active');
      renderCatalog();
    });

    els.tableViewBtn.addEventListener('click', () => {
      state.view = 'table';
      els.tableViewBtn.classList.add('active');
      els.gridViewBtn.classList.remove('active');
      renderCatalog();
    });

    els.catalogContainer.addEventListener('click', (e) => {
      const editTarget = e.target.closest('[data-admin-edit]');
      if (editTarget && state.isAdmin) {
        openProductEditor(Number(editTarget.dataset.adminEdit));
        return;
      }

      const toggleTarget = e.target.closest('[data-admin-toggle]');
      if (toggleTarget && state.isAdmin) {
        toggleProductStock(Number(toggleTarget.dataset.adminToggle));
        return;
      }

      const delTarget = e.target.closest('[data-admin-del]');
      if (delTarget && state.isAdmin) {
        deleteProduct(Number(delTarget.dataset.adminDel));
        return;
      }

      const zoomTarget = e.target.closest('[data-zoom-id]');
      if (zoomTarget) {
        e.stopPropagation();
        const partId = Number(zoomTarget.dataset.zoomId);
        const part = catalogData.items.find((p) => p.id === partId);
        if (part) {
          const veh = window.VehicleGraphics.resolveVehicle(part);
          openImageLightbox(part, veh.customImageUrl || veh.partPhotoUrl || veh.localPhotoUrl);
          return;
        }
      }

      const addTarget = e.target.closest('[data-add-id]');
      if (addTarget) {
        addToCart(Number(addTarget.dataset.addId));
        return;
      }

      const openTarget = e.target.closest('[data-open-id]');
      if (openTarget) {
        openDetailModal(Number(openTarget.dataset.openId));
      }
    });

    els.closeModalBtn.addEventListener('click', closeDetailModal);
    els.detailOverlay.addEventListener('click', (e) => {
      if (e.target === els.detailOverlay) closeDetailModal();
    });

    // Eventos del Visor de Imágenes (Lightbox)
    els.closeLightboxBtn.addEventListener('click', closeImageLightbox);
    els.imageLightboxOverlay.addEventListener('click', (e) => {
      if (
        e.target === els.imageLightboxOverlay ||
        e.target === els.lightboxStageScroll ||
        e.target === els.lightboxStage
      ) {
        closeImageLightbox();
      }
    });

    els.lightboxZoomToggleBtn.addEventListener('click', toggleLightboxZoom);
    els.lightboxImg.addEventListener('click', toggleLightboxZoom);

    els.lightboxAddToCartBtn.addEventListener('click', () => {
      if (activeLightboxPart) {
        addToCart(activeLightboxPart.id);
        closeImageLightbox();
      }
    });

    els.openCartBtn.addEventListener('click', () => els.cartOverlay.classList.add('open'));
    els.closeCartBtn.addEventListener('click', () => els.cartOverlay.classList.remove('open'));
    els.cartOverlay.addEventListener('click', (e) => {
      if (e.target === els.cartOverlay) els.cartOverlay.classList.remove('open');
    });

    els.cartItemsContainer.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('[data-qty-id]');
      if (qtyBtn) {
        updateCartQty(Number(qtyBtn.dataset.qtyId), Number(qtyBtn.dataset.delta));
        return;
      }
      const removeBtn = e.target.closest('[data-remove-id]');
      if (removeBtn) {
        const id = Number(removeBtn.dataset.removeId);
        state.cart = state.cart.filter((c) => c.id !== id);
        saveCart();
        renderCart();
      }
    });

    els.clearCartBtn.addEventListener('click', () => {
      state.cart = [];
      saveCart();
      renderCart();
    });

    els.copyQuoteBtn.addEventListener('click', async () => {
      if (state.cart.length === 0) {
        showToast('Agrega repuestos antes de copiar la cotización');
        return;
      }

      try {
        await navigator.clipboard.writeText(buildQuoteText());
        showToast('Cotización copiada al portapapeles');
      } catch {
        showToast('No se pudo copiar automáticamente');
      }
    });

    els.themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(state.theme);
    });

    // ---- Eventos Admin ----
    els.adminBtn.addEventListener('click', () => {
      if (state.isAdmin) {
        openAdminPanel('import');
      } else {
        openLoginModal();
      }
    });

    els.adminLogoutBtn.addEventListener('click', () => {
      state.isAdmin = false;
      sessionStorage.removeItem(STORAGE_KEYS.adminSession);
      closeAdminPanel();
      updateAdminUI();
      renderCatalog();
      showToast('Sesión de administrador cerrada');
    });

    els.closeLoginBtn.addEventListener('click', closeLoginModal);
    els.adminLoginOverlay.addEventListener('click', (e) => {
      if (e.target === els.adminLoginOverlay) closeLoginModal();
    });

    els.adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = els.loginUserInput.value.trim().toLowerCase();
      const pass = els.loginPassInput.value;

      if (user === 'admin' && pass === getAdminPassword()) {
        state.isAdmin = true;
        sessionStorage.setItem(STORAGE_KEYS.adminSession, 'true');
        closeLoginModal();
        updateAdminUI();
        renderCatalog();
        openAdminPanel('import');
        showToast('Bienvenido, Administrador');
      } else {
        els.loginErrorMsg.textContent = 'Usuario o contraseña incorrectos.';
        els.loginErrorMsg.style.display = 'block';
      }
    });

    els.openNewProductBtn.addEventListener('click', () => openProductEditor(null));
    els.openImportModalBtn.addEventListener('click', () => openAdminPanel('import'));
    els.openAdminPanelBtn.addEventListener('click', () => openAdminPanel('import'));

    els.closeAdminPanelBtn.addEventListener('click', closeAdminPanel);
    els.adminPanelOverlay.addEventListener('click', (e) => {
      if (e.target === els.adminPanelOverlay) closeAdminPanel();
    });

    els.adminTabs.forEach((btn) => {
      btn.addEventListener('click', () => switchAdminTab(btn.dataset.adminTab));
    });

    // Importar Excel (.xlsx)
    els.excelFileInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      pendingExcelImport = null;
      els.applyExcelImportBtn.disabled = true;

      if (!file) {
        els.excelPreviewBox.style.display = 'none';
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        const parsed = await window.XlsxCatalogImporter.parseXlsxCatalog(buffer);
        pendingExcelImport = parsed;

        const avail = parsed.items.filter((i) => i.inStock).length;
        const out = parsed.items.length - avail;
        els.excelPreviewBox.innerHTML = `
          <strong>Archivo leído correctamente:</strong> ${escapeHtml(file.name)}<br/>
          Categorías detectadas: <strong>${parsed.categories.length - 1}</strong> ·
          Total repuestos: <strong>${parsed.items.length}</strong><br/>
          Disponibles: <strong style="color: var(--success);">${avail}</strong> ·
          Agotados (amarillo): <strong style="color: var(--danger);">${out}</strong>
        `;
        els.excelPreviewBox.style.display = 'block';
        els.applyExcelImportBtn.disabled = parsed.items.length === 0;
      } catch (err) {
        els.excelPreviewBox.innerHTML = `<span style="color: var(--danger);">Error al leer Excel: ${escapeHtml(err.message)}</span>`;
        els.excelPreviewBox.style.display = 'block';
      }
    });

    els.applyExcelImportBtn.addEventListener('click', () => {
      if (!pendingExcelImport) return;
      const mode = els.importModeSelect.value;

      if (mode === 'replace') {
        catalogData = {
          categories: pendingExcelImport.categories,
          items: pendingExcelImport.items
        };
        showToast(`Catálogo actualizado (${catalogData.items.length} productos)`);
      } else {
        // Modo merge por número de pieza
        const existingMap = new Map();
        catalogData.items.forEach((item) => {
          existingMap.set(item.partNumber.trim().toUpperCase(), item);
        });

        let updatedCount = 0;
        let addedCount = 0;
        let nextId = Math.max(0, ...catalogData.items.map((i) => i.id)) + 1;

        pendingExcelImport.categories.forEach((cat) => {
          if (!catalogData.categories.some((c) => c.id === cat.id)) {
            catalogData.categories.push(cat);
          }
        });

        pendingExcelImport.items.forEach((incoming) => {
          const key = incoming.partNumber.trim().toUpperCase();
          const existing = existingMap.get(key);
          if (existing && key !== 'S/N') {
            existing.priceUsd = incoming.priceUsd;
            existing.priceTotal = incoming.priceTotal;
            existing.inStock = incoming.inStock;
            existing.name = incoming.name;
            existing.brand = incoming.brand;
            existing.category = incoming.category;
            existing.categoryName = incoming.categoryName;
            existing.icon = incoming.icon;
            updatedCount++;
          } else {
            catalogData.items.push({ ...incoming, id: nextId++ });
            addedCount++;
          }
        });

        showToast(`Actualizados: ${updatedCount} · Nuevos: ${addedCount}`);
      }

      syncAllViewsAfterCatalogChange();
      pendingExcelImport = null;
      els.excelFileInput.value = '';
      els.excelPreviewBox.style.display = 'none';
      els.applyExcelImportBtn.disabled = true;
      closeAdminPanel();
    });

    // Guardar producto individual (nuevo o editado)
    els.productEditorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idVal = els.editProductId.value ? Number(els.editProductId.value) : null;
      const brand = els.editBrand.value.trim();
      const partNumber = els.editPartNumber.value.trim();
      const name = els.editName.value.trim();
      const catId = els.editCategory.value;
      const catObj = catalogData.categories.find((c) => c.id === catId);
      const priceUsd = Math.round(parseFloat(els.editPriceUsd.value) * 100) / 100;
      const priceTotal = Math.round(priceUsd * 1.16 * 100) / 100;
      const inStock = els.editInStock.value === 'true';
      const imageUrl = (els.editImageUrl && els.editImageUrl.value.trim()) || null;
      const icon = window.XlsxCatalogImporter.ICON_GROUP_BY_CAT[catId] || 'varios';

      if (idVal !== null) {
        const existing = catalogData.items.find((p) => p.id === idVal);
        if (existing) {
          existing.brand = brand;
          existing.brandRaw = brand;
          existing.partNumber = partNumber;
          existing.name = name;
          existing.category = catId;
          existing.categoryName = catObj ? catObj.name : existing.categoryName;
          existing.icon = icon;
          existing.priceUsd = priceUsd;
          existing.priceTotal = priceTotal;
          existing.inStock = inStock;
          existing.imageUrl = imageUrl;
          showToast(`Producto actualizado: ${partNumber}`);
        }
      } else {
        const nextId = Math.max(0, ...catalogData.items.map((i) => i.id)) + 1;
        catalogData.items.unshift({
          id: nextId,
          brand,
          brandRaw: brand,
          partNumber,
          name,
          category: catId,
          categoryName: catObj ? catObj.name : 'Varios',
          icon,
          priceUsd,
          priceTotal,
          inStock,
          imageUrl
        });
        showToast(`Producto agregado: ${partNumber}`);
      }

      syncAllViewsAfterCatalogChange();
      resetProductForm();
      closeAdminPanel();
    });

    els.cancelEditBtn.addEventListener('click', resetProductForm);

    els.downloadDataJsBtn.addEventListener('click', downloadUpdatedDataJs);

    els.resetCatalogDefaultBtn.addEventListener('click', () => {
      const ok = window.confirm('¿Restaurar el catálogo original de fábrica? Se perderán las ediciones locales no descargadas.');
      if (!ok) return;
      localStorage.removeItem(STORAGE_KEYS.catalog);
      catalogData = {
        categories: cloneData(DEFAULT_DATA.CATEGORIES),
        items: cloneData(DEFAULT_DATA.PARTS_CATALOG)
      };
      syncAllViewsAfterCatalogChange();
      closeAdminPanel();
      showToast('Catálogo restaurado al archivo original');
    });

    els.changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const p1 = els.newAdminPass.value;
      const p2 = els.confirmAdminPass.value;
      if (p1 !== p2) {
        showToast('Las contraseñas no coinciden');
        return;
      }
      localStorage.setItem(STORAGE_KEYS.adminPass, p1);
      els.changePasswordForm.reset();
      showToast('Contraseña de administrador actualizada');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (els.imageLightboxOverlay && els.imageLightboxOverlay.classList.contains('open')) {
          closeImageLightbox();
          return;
        }
        closePagoMovilModal();
        closeDetailModal();
        closeLoginModal();
        closeAdminPanel();
        els.cartOverlay.classList.remove('open');
      }
    });

    // Eventos Tasa BCV y Pago Móvil
    if (els.bcvRatePill) els.bcvRatePill.addEventListener('click', openPagoMovilModal);
    if (els.openPagoMovilBtn) els.openPagoMovilBtn.addEventListener('click', openPagoMovilModal);
    if (els.cartOpenPagoMovilBtn) els.cartOpenPagoMovilBtn.addEventListener('click', openPagoMovilModal);
    if (els.closePagoMovilBtn) els.closePagoMovilBtn.addEventListener('click', closePagoMovilModal);
    if (els.pagoMovilOverlay) {
      els.pagoMovilOverlay.addEventListener('click', (e) => {
        if (e.target === els.pagoMovilOverlay) closePagoMovilModal();
      });
    }

    if (els.refreshBcvBtn) {
      els.refreshBcvBtn.addEventListener('click', () => fetchBcvRate(true));
    }
    if (els.calcSyncBcvBtn) {
      els.calcSyncBcvBtn.addEventListener('click', () => fetchBcvRate(true));
    }

    // Calculadora interactiva bidireccional
    if (els.calcUsdInput && els.calcBsInput) {
      function syncFromUsd() {
        const usd = parseFloat(els.calcUsdInput.value) || 0;
        const bs = usd * state.bcvRate;
        els.calcBsInput.value = bs > 0 ? bs.toFixed(2) : '';
      }

      function syncFromBs() {
        const bs = parseFloat(els.calcBsInput.value) || 0;
        const usd = state.bcvRate > 0 ? bs / state.bcvRate : 0;
        els.calcUsdInput.value = usd > 0 ? usd.toFixed(2) : '';
      }

      els.calcUsdInput.addEventListener('input', syncFromUsd);
      els.calcBsInput.addEventListener('input', syncFromBs);

      document.querySelectorAll('.calc-preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.usd;
          els.calcUsdInput.value = val;
          syncFromUsd();
        });
      });
    }

    // Botones de copiado de Pago Móvil
    document.querySelectorAll('[data-copy-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.copyTarget;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const text = targetEl.textContent.trim();
          navigator.clipboard.writeText(text).then(() => {
            showToast(`¡Copiado: ${text}!`);
          }).catch(() => {
            showToast('No se pudo copiar automáticamente');
          });
        }
      });
    });

    if (els.copyAllPagoMovilBtn) {
      els.copyAllPagoMovilBtn.addEventListener('click', () => {
        const text = `DATOS DE PAGO MÓVIL\nBanco: ${state.pagoMovil.bank}\nCédula: ${state.pagoMovil.idNumber}\nTeléfono: ${state.pagoMovil.phone}\nTitular: ${state.pagoMovil.holder}\nTasa BCV: ${formatBs(state.bcvRate)}/$`;
        navigator.clipboard.writeText(text).then(() => {
          showToast('¡Datos de Pago Móvil copiados!');
        }).catch(() => {
          showToast('No se pudo copiar automáticamente');
        });
      });
    }

    // Admin: Guardar configuración de Pago Móvil y Tasa BCV
    if (els.pagoMovilConfigForm) {
      els.pagoMovilConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customRate = parseFloat(els.adminBcvRateInput.value);
        if (customRate > 0) {
          state.bcvRate = customRate;
          state.bcvDate = 'Manual';
          localStorage.setItem(STORAGE_KEYS.bcvRate, JSON.stringify({ rate: state.bcvRate, date: state.bcvDate }));
        }

        state.pagoMovil = {
          bank: els.adminPmBankInput.value.trim() || DEFAULT_PAGO_MOVIL.bank,
          idNumber: els.adminPmIdInput.value.trim() || DEFAULT_PAGO_MOVIL.idNumber,
          phone: els.adminPmPhoneInput.value.trim() || DEFAULT_PAGO_MOVIL.phone,
          holder: els.adminPmHolderInput.value.trim() || DEFAULT_PAGO_MOVIL.holder
        };
        localStorage.setItem(STORAGE_KEYS.pagoMovil, JSON.stringify(state.pagoMovil));

        updateBcvUI();
        renderCatalog();
        renderCart();
        closeAdminPanel();
        showToast('Configuración de Tasa BCV y Pago Móvil guardada');
      });
    }

    if (els.adminSyncBcvLiveBtn) {
      els.adminSyncBcvLiveBtn.addEventListener('click', async () => {
        await fetchBcvRate(true);
        if (els.adminBcvRateInput) els.adminBcvRateInput.value = state.bcvRate;
      });
    }

    // Evento de instalación PWA en el teléfono
    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (els.pwaInstallBtn) {
        els.pwaInstallBtn.classList.add('available');
      }
    });

    if (els.pwaInstallBtn) {
      els.pwaInstallBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
          const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          if (isIos) {
            alert('Para instalar en iPhone o iPad: presiona el botón "Compartir" en Safari (icono con la flecha arriba) y selecciona "Añadir a la pantalla de inicio".');
          } else {
            showToast('Pulsa el menú de 3 puntos ⋮ en tu navegador y selecciona "Instalar aplicación"');
          }
          return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('¡Catálogo instalado con éxito en tu teléfono!');
          if (els.pwaInstallBtn) els.pwaInstallBtn.classList.remove('available');
        }
        deferredPrompt = null;
      });
    }
  }

  // Registro del Service Worker para funcionamiento como App Móvil PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('Registro de Service Worker PWA diferido:', err);
      });
    });
  }

  saveCart();
  applyTheme(state.theme);
  updateAdminUI();
  updateBcvUI();
  fetchBcvRate();
  refreshFilterControls();
  renderQuickChips();
  renderCategories();
  renderCatalog();
  renderCart();
  bindEvents();
})();
