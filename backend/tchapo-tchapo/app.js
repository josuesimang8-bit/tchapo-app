const DEVICE_OPTIONS = [
    'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17',
    'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16',
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12',
    'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
    'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
    'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus'
];

const COLOR_OPTIONS = [
    'Preto', 'Branco', 'Azul', 'Rosa', 'Vermelho', 'Verde', 'Amarelo', 'Roxo', 'Cinzento', 'Castanho'
];

function getDeviceSelectionType(product) {
    if (!product || !product.features) return 'none';
    const flag = product.features.find(f => f.startsWith('_device_selection:'));
    if (flag) return flag.split(':')[1];
    
    // Fallback support for the silicone case product (ID 13) if the flag isn't set yet
    if (product.id === 13 || (product.name && product.name.includes("Capas de Silicone"))) {
        return 'iphone';
    }
    return 'none';
}

function getColorSelectionType(product) {
    if (!product || !product.features) return 'show';
    const flag = product.features.find(f => f.startsWith('_color_selection:'));
    if (flag) return flag.split(':')[1];
    return 'show';
}

function togglePmCustomDeviceInput(val, devSelType) {
    const container = document.getElementById('pm-custom-device-container');
    if (container) {
        if (devSelType === 'iphone_outro' && val === 'outro') {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }
}

function toggleQoCustomDeviceInput(val, devSelType) {
    const container = document.getElementById('qo-custom-device-container');
    if (container) {
        if (devSelType === 'iphone_outro' && val === 'outro') {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }
}

// ─── PRODUCTS DATA ──────────────────────────────────────────────────
let products = [
    // 📱 Smartphones
    {
        id: 1, category: 'Smartphones',
        name: 'iPhone 15 Pro',
        price: 85000,
        image: 'assets/iphone_15_pro_1777767716606.png',
        desc: 'Design em titânio aeroespacial com o poderoso chip A17 Pro. A câmera mais avançada da Apple.',
        features: ['🔋 Bateria dura o dia inteiro', '📸 Câmera de 48 MP', '⚡ USB-C (Carregamento Rápido)', '🛡️ Titânio Aeroespacial']
    },
    {
        id: 2, category: 'Smartphones',
        name: 'iPhone 14',
        price: 58000,
        image: 'assets/iphone_14_1777767731416.png',
        desc: 'Câmeras incríveis para fotos à luz do dia ou no escuro. Bateria para o dia todo.',
        features: ['🔋 Até 20h de reprodução de vídeo', '📸 Sistema câmera dupla 12MP', '🛡️ Ceramic Shield', '💧 Resistente à água']
    },
    {
        id: 6, category: 'Smartphones',
        name: 'Celular Android',
        price: 7500,
        image: 'assets/android_phone_1777769782866.png',
        desc: 'O smartphone perfeito e acessível para o dia-a-dia, WhatsApp e redes sociais.',
        features: ['🔋 Bateria de Longa Duração', '📱 Ecrã HD+ Grande', '📸 Câmera Traseira e Frontal', '💾 2 Cartões SIM']
    },

    // 🎧 Áudio
    {
        id: 3, category: 'Áudio',
        name: 'AirPods Pro (2ª Geração)',
        price: 18500,
        image: 'assets/airpods_pro_1777767746082.png',
        desc: 'Cancelamento Activo de Ruído até 2x mais eficiente e modo Ambiente Adaptável.',
        features: ['🎧 Áudio Espacial Personalizado', '🔋 Até 6h com uma carga', '🔇 Cancelamento de Ruído', '📱 Controle por Toque']
    },
    {
        id: 4, category: 'Áudio',
        name: 'AirPods (3ª Geração)',
        price: 13500,
        image: 'assets/airpods_3_1777767759427.png',
        desc: 'Áudio Espacial com rastreamento dinâmico de cabeça para um som imersivo.',
        features: ['🎧 Equalização Adaptativa', '🔋 Até 6h de áudio', '💧 Resistente a suor e água', '⚡ Estojo de recarga']
    },
    {
        id: 8, category: 'Áudio',
        name: 'Coluna Bluetooth',
        price: 4500,
        image: 'assets/bluetooth_speaker_1777774326728.png',
        desc: 'Som 360° potente e bass profundo. À prova de água com autonomia de 12 horas.',
        features: ['🔊 Som 360° Envolvente', '💧 Resistente à Água IPX5', '🔋 12h de Autonomia', '📶 Bluetooth 5.0']
    },

    // ⌚ Wearables
    {
        id: 9, category: 'Wearables',
        name: 'Smartwatch Fitness',
        price: 6500,
        image: 'assets/smartwatch_1777774341144.png',
        desc: 'Monitor de saúde completo: frequência cardíaca, sono, SpO2 e GPS integrado.',
        features: ['❤️ Monitor Cardíaco 24/7', '😴 Análise do Sono', '🩸 Oximetria (SpO2)', '📍 GPS Integrado']
    },

    // 💡 Acessórios
    {
        id: 5, category: 'Acessórios',
        name: 'Fita LED RGB 5M',
        price: 1500,
        image: 'assets/led_lights_1777769768426.png',
        desc: 'Transforma o teu quarto com iluminação vibrante e controlável por comando remoto.',
        features: ['💡 Milhões de Cores RGB', '📏 5 Metros', '🎮 Comando Remoto', '⚡ Fácil Instalação']
    },
    {
        id: 7, category: 'Acessórios',
        name: 'Rato Gaming RGB',
        price: 3200,
        image: 'assets/gaming_mouse_1777774311690.png',
        desc: 'Rato gaming sem fio com iluminação RGB, 7 botões programáveis e sensor de alta precisão.',
        features: ['🎮 7 Botões Programáveis', '💡 RGB Personalizável', '📶 Sem Fio 2.4GHz', '🔋 Bateria 50h']
    },
    {
        id: 10, category: 'Acessórios',
        name: 'Powerbank 20000mAh',
        price: 2800,
        image: 'assets/power_bank_1777774355353.png',
        desc: 'Carrega o teu telemóvel até 5 vezes. Entrada USB-C e saída dupla USB.',
        features: ['⚡ 20000mAh de Capacidade', '🔌 Carregamento Rápido 22.5W', '📱 Carrega 5x o telemóvel', '🔋 Dupla Saída USB']
    },
    {
        id: 13, category: 'Acessórios',
        name: 'Capas de Silicone iPhone',
        price: 800,
        image: 'assets/iphone_silicone_case.png',
        desc: 'Proteção premium em silicone para o teu iPhone. Interior em microfibra macia e exterior suave ao toque.',
        features: ['🛡️ Proteção Contra Quedas', '🎨 Toque Suave de Silicone', '📱 Encaixe Perfeito', '🧼 Fácil de Limpar']
    }
];

let CATEGORIES = ['Todos', ...new Set(products.map(p => p.category))];

let cart = [];
let activeCategory = 'Todos';
let quickOrderProduct = null;
let appliedCoupon = null;

// ─── DOM REFS ────────────────────────────────────────────────────────
const productsGrid          = document.getElementById('products-grid');
const categoryTabs          = document.getElementById('category-tabs');
const cartToggle            = document.getElementById('cart-toggle');
const closeCartBtn          = document.getElementById('close-cart');
const cartSidebar           = document.getElementById('cart-sidebar');
const cartOverlay           = document.getElementById('cart-overlay');
const cartCount             = document.getElementById('cart-count');
const cartItemsContainer    = document.getElementById('cart-items');
const emptyCartMsg          = document.getElementById('empty-cart-msg');
const totalAmountEl         = document.getElementById('total-amount');
const checkoutForm          = document.getElementById('checkout-form');
const toast                 = document.getElementById('toast');

const productModal          = document.getElementById('product-modal');
const productModalOverlay   = document.getElementById('product-modal-overlay');
const closeProductModal     = document.getElementById('close-product-modal');
const productModalContent   = document.getElementById('product-modal-content');

const quickOrderModal       = document.getElementById('quick-order-modal');
const quickOrderOverlay     = document.getElementById('quick-order-overlay');
const closeQuickOrder       = document.getElementById('close-quick-order');
const quickOrderContent     = document.getElementById('quick-order-content');

const trackingOverlay       = document.getElementById('tracking-overlay');
const btnSimulateNext       = document.getElementById('btn-simulate-next');
const btnCloseTracking      = document.getElementById('btn-close-tracking');
const timerDisplay          = document.getElementById('timer-display');
const driverProfile         = document.getElementById('driver-profile');
const driverImg             = document.getElementById('driver-img');

// Auth elements
const authOverlay           = document.getElementById('auth-overlay');
const authModal             = document.getElementById('auth-modal');
const btnOpenAuth           = document.getElementById('btn-open-auth');
const closeAuth             = document.getElementById('close-auth');
const tabLogin              = document.getElementById('tab-login');
const tabRegister           = document.getElementById('tab-register');
const formLogin             = document.getElementById('form-login');
const formRegister          = document.getElementById('form-register');
const authUserInfo          = document.getElementById('auth-user-info');
const authUserName          = document.getElementById('auth-user-name');
const btnLogout             = document.getElementById('btn-logout');

let currentUser = null;

// ─── INIT ────────────────────────────────────────────────────────────
async function init() {
    initAuth();
    await fetchActiveProducts();
    setupEventListeners();
    loadCart();
    initPromoPopup();
}

async function fetchActiveProducts() {
    try {
        const res = await fetch('/api/products');
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                products = data;
            }
        }
    } catch (err) {
        console.warn('Erro ao carregar produtos da API, usando fallback estático:', err);
    }
    
    // Atualizar categorias e renderizar as tabs e produtos
    CATEGORIES = ['Todos', ...new Set(products.map(p => p.category))];
    renderCategoryTabs();
    renderProducts();
}

// ─── CATEGORY TABS ───────────────────────────────────────────────────
function renderCategoryTabs() {
    categoryTabs.innerHTML = CATEGORIES.map(cat => `
        <button class="cat-tab ${cat === activeCategory ? 'active' : ''}" onclick="filterCategory('${cat}')">
            ${getCategoryIcon(cat)} ${cat}
        </button>
    `).join('');
}

function getCategoryIcon(cat) {
    const icons = {
        'Todos':       '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        'Smartphones': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
        'Áudio':       '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
        'Wearables':   '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>',
        'Acessórios':  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    };
    return icons[cat] || '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>';
}

function filterCategory(cat) {
    activeCategory = cat;
    renderCategoryTabs();
    renderProducts();
}

// ─── PRODUCTS RENDER ─────────────────────────────────────────────────
function renderProducts() {
    const filtered = activeCategory === 'Todos' ? products : products.filter(p => p.category === activeCategory);
    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image-container" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-category-tag">${getCategoryIcon(product.category)} ${product.category}</div>
            <h3 class="product-title" onclick="openProductModal(${product.id})">${product.name}</h3>
            <p class="product-desc">${product.desc || ''}</p>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-actions">
                <button class="btn-add-to-cart" onclick="${(getDeviceSelectionType(product) !== 'none' || getColorSelectionType(product) !== 'none') ? `openProductModal(${product.id})` : `addToCart(${product.id}); showToast()`}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Carrinho
                </button>
                <button class="btn-buy-now" onclick="openQuickOrder(${product.id})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Pedir Agora
                </button>
            </div>
        </div>
    `).join('');
}

// ─── PRODUCT DETAIL MODAL ────────────────────────────────────────────
function addCaseToCartFromModal(id) {
    const product = products.find(p => p.id === id);
    const devSelType = getDeviceSelectionType(product);
    const colorSelType = getColorSelectionType(product);
    
    let device = null;
    let color = null;
    
    if (devSelType !== 'none') {
        const deviceEl = document.getElementById('pm-device');
        if (devSelType === 'outro') {
            const customInput = document.getElementById('pm-custom-device');
            const customVal = customInput ? customInput.value.trim() : '';
            if (!customVal) {
                showStatusToast('⚠️ Por favor, escreva o modelo do seu dispositivo.');
                return;
            }
            device = customVal;
        } else if (devSelType === 'iphone_outro') {
            const selectVal = deviceEl ? deviceEl.value : '';
            if (selectVal === 'outro') {
                const customInput = document.getElementById('pm-custom-device');
                const customVal = customInput ? customInput.value.trim() : '';
                if (!customVal) {
                    showStatusToast('⚠️ Por favor, escreva o modelo do seu dispositivo.');
                    return;
                }
                device = customVal;
            } else {
                device = selectVal;
            }
        } else {
            device = deviceEl ? deviceEl.value : '';
        }
    }
    
    if (colorSelType !== 'none') {
        const colorEl = document.getElementById('pm-color');
        if (colorEl) color = colorEl.value;
    }
    
    addToCart(id, device, color);
    closeModals();
    showToast();
}

function trackProductClick(productId) {
    fetch(`/api/products/${productId}/click`, { method: 'POST' })
        .catch(err => console.error('Error tracking click:', err));
}

function openProductModal(id) {
    trackProductClick(id);
    const product = products.find(p => p.id === id);
    const devSelType = getDeviceSelectionType(product);
    
    let optionsHtml = '';
    const colorSelType = getColorSelectionType(product);
    if (devSelType !== 'none' || colorSelType !== 'none') {
        let deviceSelectHtml = '';
        if (devSelType !== 'none') {
            if (devSelType === 'iphone' || devSelType === 'iphone_outro') {
                deviceSelectHtml = `
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <label style="font-weight: 600; font-size: 0.9rem; color: #374151; text-align: left;">Selecione o Dispositivo:</label>
                        <select id="pm-device" onchange="togglePmCustomDeviceInput(this.value, '${devSelType}')" style="width: 100%; padding: 0.75rem; border: 1.5px solid var(--gray-light); border-radius: 10px; font-family: inherit; font-size: 0.95rem; outline: none; background-color: #fff;">
                            ${DEVICE_OPTIONS.map(d => `<option value="${d}">${d}</option>`).join('')}
                            ${devSelType === 'iphone_outro' ? `<option value="outro">Outro (Digitar...)</option>` : ''}
                        </select>
                    </div>
                `;
            }
        }
        
        let customDeviceInputHtml = '';
        if (devSelType !== 'none') {
            customDeviceInputHtml = `
                <div id="pm-custom-device-container" style="display: ${devSelType === 'outro' ? 'flex' : 'none'}; flex-direction: column; gap: 0.35rem;">
                    <label style="font-weight: 600; font-size: 0.9rem; color: #374151; text-align: left;">Escreva o Dispositivo:</label>
                    <input id="pm-custom-device" type="text" placeholder="Ex: Xiaomi Poco X3, Galaxy S24, etc." style="width: 100%; padding: 0.75rem; border: 1.5px solid var(--gray-light); border-radius: 10px; font-family: inherit; font-size: 0.95rem; outline: none; background-color: #fff; box-sizing: border-box;">
                </div>
            `;
        }

        let colorSelectHtml = '';
        if (colorSelType !== 'none') {
            colorSelectHtml = `
                <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                    <label style="font-weight: 600; font-size: 0.9rem; color: #374151; text-align: left;">Cor:</label>
                    <select id="pm-color" style="width: 100%; padding: 0.75rem; border: 1.5px solid var(--gray-light); border-radius: 10px; font-family: inherit; font-size: 0.95rem; outline: none; background-color: #fff;">
                        ${COLOR_OPTIONS.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        optionsHtml = `
            <div class="product-options" style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
                ${deviceSelectHtml}
                ${customDeviceInputHtml}
                ${colorSelectHtml}
            </div>
        `;
    }

    productModalContent.innerHTML = `
        <div class="pm-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="pm-info">
            <div class="product-category-tag" style="margin-bottom:1rem">${getCategoryIcon(product.category)} ${product.category}</div>
            <h2 class="pm-title">${product.name}</h2>
            <div class="pm-price">${formatCurrency(product.price)}</div>
            <p class="pm-desc">${product.desc}</p>
            <ul class="pm-features">
                ${(product.features || []).filter(f => !f.startsWith('_')).map(f => `<li>${f}</li>`).join('')}
            </ul>
            ${optionsHtml}
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:1.5rem;">
                <button class="btn-add-cart" style="flex:1" onclick="${(devSelType !== 'none' || colorSelType !== 'none') ? `addCaseToCartFromModal(${product.id})` : `addToCart(${product.id}); closeModals(); showToast()`}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Adicionar ao Carrinho
                </button>
                <button class="btn-buy-now-modal" style="flex:1" onclick="${(devSelType !== 'none' || colorSelType !== 'none') ? `closeModals(); openQuickOrder(${product.id}, true)` : `closeModals(); openQuickOrder(${product.id})`}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Pedir Agora
                </button>
            </div>
        </div>
    `;
    productModal.classList.add('active');
    productModalOverlay.classList.add('active');
    updateScrollLock();
}

// ─── QUICK ORDER MODAL ───────────────────────────────────────────────
function openQuickOrder(id, fromModal = false) {
    if (!fromModal) {
        trackProductClick(id);
    }
    if (!currentUser) {
        openAuthModal();
        showStatusToast('Por favor, faça login ou crie conta para encomendar.');
        return;
    }

    quickOrderProduct = products.find(p => p.id === id);
    const devSelType = getDeviceSelectionType(quickOrderProduct);
    
    // Get values from product modal if transfer is requested
    let selectedDevVal = 'iPhone 15 Pro Max';
    let selectedColVal = 'Preto';
    let customDevVal = '';
    if (fromModal) {
        const devEl = document.getElementById('pm-device');
        const colEl = document.getElementById('pm-color');
        const customEl = document.getElementById('pm-custom-device');
        if (devEl) selectedDevVal = devEl.value;
        if (colEl) selectedColVal = colEl.value;
        if (customEl) customDevVal = customEl.value;
    }

    let optionsHtml = '';
    const colorSelType = getColorSelectionType(quickOrderProduct);
    if (devSelType !== 'none' || colorSelType !== 'none') {
        let deviceSelectHtml = '';
        if (devSelType !== 'none') {
            if (devSelType === 'iphone' || devSelType === 'iphone_outro') {
                deviceSelectHtml = `
                    <div style="display: flex; flex-direction: column; gap: 0.2rem; width: 100%;">
                        <label style="font-weight: 600; font-size: 0.8rem; color: #4b5563; text-align: left;">Dispositivo:</label>
                        <select id="qo-device" onchange="toggleQoCustomDeviceInput(this.value, '${devSelType}')" style="width: 100%; padding: 0.5rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.85rem; outline: none; background-color: #fff;">
                            ${DEVICE_OPTIONS.map(d => `<option value="${d}" ${d === selectedDevVal ? 'selected' : ''}>${d}</option>`).join('')}
                            ${devSelType === 'iphone_outro' ? `<option value="outro" ${selectedDevVal === 'outro' ? 'selected' : ''}>Outro (Digitar...)</option>` : ''}
                        </select>
                    </div>
                `;
            }
        }
        
        const showCustom = devSelType === 'outro' || (devSelType === 'iphone_outro' && selectedDevVal === 'outro');
        
        let customDeviceInputHtml = '';
        if (devSelType !== 'none') {
            customDeviceInputHtml = `
                <div id="qo-custom-device-container" style="display: ${showCustom ? 'flex' : 'none'}; flex-direction: column; gap: 0.2rem; width: 100%;">
                    <label style="font-weight: 600; font-size: 0.8rem; color: #4b5563; text-align: left;">Escreva o Dispositivo:</label>
                    <input id="qo-custom-device" type="text" placeholder="Ex: Xiaomi Poco X3, Galaxy S24, etc." value="${customDevVal}" style="width: 100%; padding: 0.5rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.85rem; outline: none; background-color: #fff; box-sizing: border-box;">
                </div>
            `;
        }
        
        let colorSelectHtml = '';
        if (colorSelType !== 'none') {
            colorSelectHtml = `
                <div style="display: flex; flex-direction: column; gap: 0.2rem; width: 100%;">
                    <label style="font-weight: 600; font-size: 0.8rem; color: #4b5563; text-align: left;">Cor:</label>
                    <select id="qo-color" style="width: 100%; padding: 0.5rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.85rem; outline: none; background-color: #fff;">
                        ${COLOR_OPTIONS.map(c => `<option value="${c}" ${c === selectedColVal ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </div>
            `;
        }
        
        optionsHtml = `
            <div class="product-options" style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                ${deviceSelectHtml}
                ${customDeviceInputHtml}
                ${colorSelectHtml}
            </div>
        `;
    }

    quickOrderContent.innerHTML = `
        <div class="qo-left">
            <img src="${quickOrderProduct.image}" alt="${quickOrderProduct.name}" class="qo-img">
            <h3>${quickOrderProduct.name}</h3>
            ${optionsHtml}
            <div class="qo-price" id="qo-display-price">${formatCurrency(quickOrderProduct.price)}</div>
            <div class="qo-qty-row">
                <span>Quantidade:</span>
                <div class="qo-qty">
                    <button onclick="qoAdjust(-1)">−</button>
                    <span id="qo-qty-val">1</span>
                    <button onclick="qoAdjust(1)">+</button>
                </div>
            </div>
        </div>
        <div class="qo-right">
            <h3>📋 Detalhes de Entrega</h3>
            <form id="quick-order-form">
                <input type="text" id="qo-name" placeholder="Seu Nome Completo" required>
                <input type="tel" id="qo-phone" placeholder="Número de Telefone (ex: 84 123 4567)" required pattern="[0-9\\s+\\-()]{8,15}">
                <select id="qo-bairro" required>
                    <option value="" disabled selected>Selecione o Bairro...</option>
                    <option>Macuti</option><option>Ponta Gêa</option><option>Maquinino</option>
                    <option>Pioneiros</option><option>Chota</option><option>Estoril</option>
                    <option>Palmeiras</option><option>Munhava</option><option>Manga</option>
                    <option>Inhamizua</option><option>Matacuane</option><option>Macurungo</option>
                </select>
                <input type="text" id="qo-address" placeholder="Morada e Ponto de Referência" required>
                <select id="qo-time" required>
                    <option value="" disabled selected>Horário de Entrega...</option>
                    <option value="Imediato (Até 2h) (+200 MT)">⚡ Imediato (Até 2h) (+200 MT)</option>
                    <option value="Das 08:00 às 12:00">Das 08:00 às 12:00</option>
                    <option value="Das 12:00 às 16:00">Das 12:00 às 16:00</option>
                    <option value="Das 16:00 às 20:00">Das 16:00 às 20:00</option>
                </select>
                <select id="qo-payment" required>
                    <option value="" disabled selected>Método de Pagamento...</option>
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="eMola">eMola</option>
                    <option value="Cartão (POS)">Cartão (Máquina POS)</option>
                    <option value="Dinheiro Físico">Dinheiro Físico</option>
                </select>

                <div class="coupon-section" style="margin-top: 0.75rem; margin-bottom: 0.75rem; width: 100%;">
                    <label style="font-size: 0.8rem; font-weight: 600; color: #4b5563; margin-bottom: 0.25rem; display: block; text-align: left;">Código de Indicação (10% Desconto):</label>
                    <div style="display: flex; gap: 0.5rem; width: 100%;">
                        <input type="text" id="qo-coupon" placeholder="CÓDIGO" value="${appliedCoupon ? appliedCoupon.code : ''}" style="margin-bottom: 0; flex: 1; text-transform: uppercase; padding: 0.5rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.85rem; outline: none; background-color: #fff; box-sizing: border-box;">
                        <button type="button" id="btn-apply-qo-coupon" style="background: var(--dark); color: var(--white); border: none; padding: 0.5rem 0.75rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Aplicar</button>
                    </div>
                    <div id="qo-coupon-message" style="font-size: 0.75rem; margin-top: 0.2rem; display: ${appliedCoupon ? 'block' : 'none'}; color: #10b981; text-align: left;">
                        ${appliedCoupon ? '✅ Código de indicação aplicado! 10% de desconto.' : ''}
                    </div>
                </div>

                <button type="submit" class="btn-checkout" style="margin-top:0.5rem">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Confirmar Pedido
                </button>
            </form>
        </div>
    `;
    document.getElementById('quick-order-form').addEventListener('submit', handleQuickOrder);
    const applyQoCouponBtn = document.getElementById('btn-apply-qo-coupon');
    if (applyQoCouponBtn) applyQoCouponBtn.addEventListener('click', applyQuickOrderCoupon);
    const timeSelect = document.getElementById('qo-time');
    if (timeSelect) {
        timeSelect.addEventListener('change', updateQuickOrderPrice);
    }
    quickOrderModal.classList.add('active');
    quickOrderOverlay.classList.add('active');
    updateScrollLock();
}

let qoQty = 1;
function updateQuickOrderPrice() {
    if (!quickOrderProduct) return;
    let subtotal = quickOrderProduct.price * qoQty;
    let discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
    let total = subtotal - discount;
    const timeSelect = document.getElementById('qo-time');
    const isImediato = timeSelect && timeSelect.value.startsWith('Imediato');
    
    const priceEl = document.getElementById('qo-display-price');
    if (priceEl) {
        let displayHtml = '';
        if (appliedCoupon) {
            displayHtml += `<span style="font-size:0.85rem;color:#6b7280;text-decoration:line-through;font-weight:normal;">Subtotal: ${formatCurrency(subtotal)}</span><br>`;
            displayHtml += `<span style="font-size:0.85rem;color:#10b981;font-weight:normal;">Desconto (10%): -${formatCurrency(discount)}</span><br>`;
        }
        
        if (isImediato) {
            total += 200;
            displayHtml += `<strong>Total: ${formatCurrency(total)}</strong> <br><span style="font-size:0.75rem;color:#10b981;font-weight:normal;">(inclui +200 MT taxa urgente)</span>`;
        } else {
            displayHtml += `<strong>Total: ${formatCurrency(total)}</strong>`;
        }
        priceEl.innerHTML = displayHtml;
    }
}

function qoAdjust(delta) {
    qoQty = Math.max(1, qoQty + delta);
    document.getElementById('qo-qty-val').textContent = qoQty;
    updateQuickOrderPrice();
}

function handleQuickOrder(e) {
    e.preventDefault();
    const name    = document.getElementById('qo-name').value;
    const phone   = document.getElementById('qo-phone').value;
    const bairro  = document.getElementById('qo-bairro').value;
    const address = document.getElementById('qo-address').value;
    const time    = document.getElementById('qo-time').value;
    const payment = document.getElementById('qo-payment').value;

    const devSelType = getDeviceSelectionType(quickOrderProduct);
    const colorSelType = getColorSelectionType(quickOrderProduct);
    const productItem = { ...quickOrderProduct };

    if (devSelType !== 'none' || colorSelType !== 'none') {
        let dev = '';
        const hasColorSel = colorSelType !== 'none';
        const colEl = document.getElementById('qo-color');
        const col = (hasColorSel && colEl) ? colEl.value : null;
        
        if (devSelType !== 'none') {
            if (devSelType === 'outro') {
                const customInput = document.getElementById('qo-custom-device');
                const customVal = customInput ? customInput.value.trim() : '';
                if (!customVal) {
                    showStatusToast('⚠️ Por favor, escreva o modelo do seu dispositivo.');
                    return;
                }
                dev = customVal;
            } else if (devSelType === 'iphone_outro') {
                const selectVal = document.getElementById('qo-device').value;
                if (selectVal === 'outro') {
                    const customInput = document.getElementById('qo-custom-device');
                    const customVal = customInput ? customInput.value.trim() : '';
                    if (!customVal) {
                        showStatusToast('⚠️ Por favor, escreva o modelo do seu dispositivo.');
                        return;
                    }
                    dev = customVal;
                } else {
                    dev = selectVal;
                }
            } else {
                dev = document.getElementById('qo-device').value;
            }
        }
        
        if (devSelType !== 'none') {
            productItem.name = hasColorSel ? `${quickOrderProduct.name} (${dev} - ${col})` : `${quickOrderProduct.name} (${dev})`;
        } else {
            productItem.name = hasColorSel ? `${quickOrderProduct.name} (${col})` : quickOrderProduct.name;
        }
    }

    let subtotal = quickOrderProduct.price * qoQty;
    let discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
    let total = subtotal - discount;
    if (time.startsWith('Imediato')) {
        total += 200;
    }

    const orderData = {
        customer_name: name, 
        phone, 
        bairro, 
        address, 
        time, 
        payment, 
        total, 
        status: 'Pendente', 
        user_id: currentUser ? currentUser.id : null,
        items: [{ ...productItem, quantity: qoQty }],
        referral_code: appliedCoupon ? appliedCoupon.code : null,
        referral_discount: discount
    };

    const submitBtn = document.querySelector('#quick-order-form .btn-checkout');
    submitBtn.textContent = '⏳ A enviar pedido...';
    submitBtn.disabled = true;

    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(res => res.ok ? res.json() : null)
    .then(order => {
        if (order) saveOrderToHistory(order, name, orderData.items);
        closeQuickOrderModal();
        appliedCoupon = null; // Clear applied coupon
        startTracking(order ? order.id : null, name, order ? order.created_at : null);
    })
    .catch(() => {
        closeQuickOrderModal();
        startTracking(null, name, new Date().toISOString());
    });
}

function closeModals() {
    productModal.classList.remove('active');
    productModalOverlay.classList.remove('active');
    updateScrollLock();
}

function closeQuickOrderModal() {
    quickOrderModal.classList.remove('active');
    quickOrderOverlay.classList.remove('active');
    qoQty = 1;
    updateScrollLock();
}

// ─── CART ────────────────────────────────────────────────────────────
function setupEventListeners() {
    cartToggle.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    closeProductModal.addEventListener('click', closeModals);
    productModalOverlay.addEventListener('click', closeModals);
    closeQuickOrder.addEventListener('click', closeQuickOrderModal);
    quickOrderOverlay.addEventListener('click', closeQuickOrderModal);
    checkoutForm.addEventListener('submit', handleCheckout);
    btnSimulateNext.addEventListener('click', simulateNextStep);
    document.getElementById('btn-meus-pedidos').addEventListener('click', openMeusPedidos);
    document.getElementById('close-meus-pedidos').addEventListener('click', closeMeusPedidos);
    document.getElementById('meus-pedidos-overlay').addEventListener('click', closeMeusPedidos);
    document.getElementById('customer-time').addEventListener('change', updateCartUI);

    // Referrals modal event listeners
    const btnReferrals = document.getElementById('btn-referrals');
    if (btnReferrals) btnReferrals.addEventListener('click', openReferrals);
    const closeReferralsBtn = document.getElementById('close-referrals');
    if (closeReferralsBtn) closeReferralsBtn.addEventListener('click', closeReferrals);
    const referralsOverlay = document.getElementById('referrals-overlay');
    if (referralsOverlay) referralsOverlay.addEventListener('click', closeReferrals);

    const applyCouponBtn = document.getElementById('btn-apply-coupon');
    if (applyCouponBtn) applyCouponBtn.addEventListener('click', applyCoupon);
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    updateScrollLock();
}

function addToCart(productId, device = null, color = null) {
    if (!device && !color) {
        trackProductClick(productId);
    }
    const product = products.find(p => p.id === productId);
    const devSelType = getDeviceSelectionType(product);
    const hasDeviceSel = devSelType !== 'none';
    const colorSelType = getColorSelectionType(product);
    const hasColorSel = colorSelType !== 'none';
    
    const finalDevice = hasDeviceSel ? device : null;
    const finalColor = hasColorSel ? color : null;
    
    const cartItemId = hasDeviceSel 
        ? (hasColorSel ? `${productId}-${finalDevice}-${finalColor}` : `${productId}-${finalDevice}`)
        : (hasColorSel ? `${productId}-${finalColor}` : productId);
    const cartItemName = hasDeviceSel 
        ? (hasColorSel ? `${product.name} (${finalDevice} - ${finalColor})` : `${product.name} (${finalDevice})`)
        : (hasColorSel ? `${product.name} (${finalColor})` : product.name);
    
    const existing = cart.find(item => item.id === cartItemId);
    if (existing) { 
        existing.quantity += 1; 
    } else { 
        cart.push({ ...product, id: cartItemId, name: cartItemName, quantity: 1 }); 
    }
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId);
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartDiscountRow = document.getElementById('cart-discount-row');
    const cartDiscountEl = document.getElementById('cart-discount');

    if (cart.length === 0) {
        emptyCartMsg.style.display = 'block';
        checkoutForm.style.display = 'none';
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(emptyCartMsg);
        totalAmountEl.textContent = '0 MT';
        if (cartSubtotalEl) cartSubtotalEl.textContent = '0 MT';
        if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    } else {
        emptyCartMsg.style.display = 'none';
        checkoutForm.style.display = 'flex';
        cartItemsContainer.innerHTML = cart.map(item => {
            const baseId = typeof item.id === 'string' && item.id.includes('-') ? Number(item.id.split('-')[0]) : item.id;
            const liveItem = products.find(p => p.id === baseId);
            const image = liveItem ? liveItem.image : item.image;
            const price = liveItem ? liveItem.price : item.price;
            return `
                <div class="cart-item">
                    <img src="${image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatCurrency(price)}</div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remover</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        let subtotal = cart.reduce((sum, item) => {
            const baseId = typeof item.id === 'string' && item.id.includes('-') ? Number(item.id.split('-')[0]) : item.id;
            const liveItem = products.find(p => p.id === baseId);
            const price = liveItem ? liveItem.price : item.price;
            return sum + (price * item.quantity);
        }, 0);

        let discount = 0;
        if (appliedCoupon) {
            discount = Math.round(subtotal * appliedCoupon.discountPercent);
            if (cartDiscountRow) {
                cartDiscountRow.style.display = 'flex';
                cartDiscountEl.textContent = `-${formatCurrency(discount)}`;
            }
        } else {
            if (cartDiscountRow) cartDiscountRow.style.display = 'none';
        }

        let total = subtotal - discount;
        const timeSelect = document.getElementById('customer-time');
        const isImediato = timeSelect && timeSelect.value.startsWith('Imediato');
        
        if (cartSubtotalEl) {
            cartSubtotalEl.textContent = formatCurrency(subtotal);
        }

        if (isImediato) {
            total += 200;
            totalAmountEl.innerHTML = `${formatCurrency(total)} <br><span style="font-size:0.8rem;color:#10b981;font-weight:normal;">(inclui +200 MT taxa urgente)</span>`;
        } else {
            totalAmountEl.textContent = formatCurrency(total);
        }
    }
}

// ─── CHECKOUT (via cart) ──────────────────────────────────────────────
function handleCheckout(e) {
    e.preventDefault();

    if (!currentUser) {
        openAuthModal();
        showStatusToast('Por favor, faça login ou crie conta para finalizar a encomenda.');
        return;
    }

    const name    = document.getElementById('customer-name').value;
    const phone   = document.getElementById('customer-phone').value;
    const bairro  = document.getElementById('customer-bairro').value;
    const address = document.getElementById('customer-address').value;
    const time    = document.getElementById('customer-time').value;
    const payment = document.getElementById('customer-payment').value;
    
    let subtotal = cart.reduce((sum, item) => {
        const baseId = typeof item.id === 'string' && item.id.includes('-') ? Number(item.id.split('-')[0]) : item.id;
        const liveItem = products.find(p => p.id === baseId);
        const price = liveItem ? liveItem.price : item.price;
        return sum + (price * item.quantity);
    }, 0);
    let discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discountPercent) : 0;
    let total = subtotal - discount;
    if (time.startsWith('Imediato')) {
        total += 200;
    }

    const orderData = { 
        customer_name: name, 
        phone, 
        bairro, 
        address, 
        time, 
        payment, 
        total, 
        user_id: currentUser ? currentUser.id : null, 
        items: cart, 
        status: 'Pendente',
        referral_code: appliedCoupon ? appliedCoupon.code : null,
        referral_discount: discount
    };

    const submitBtn = document.getElementById('btn-checkout');
    submitBtn.textContent = '⏳ A enviar pedido...';
    submitBtn.disabled = true;

    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(res => res.ok ? res.json() : null)
    .then(order => {
        if (order) saveOrderToHistory(order, name, cart);
        toggleCart();
        cart = [];
        appliedCoupon = null; // Clear coupon on success
        const couponInput = document.getElementById('customer-coupon');
        if (couponInput) couponInput.value = '';
        const couponMsg = document.getElementById('coupon-message');
        if (couponMsg) couponMsg.style.display = 'none';
        saveCart();
        updateCartUI();
        submitBtn.textContent = 'Finalizar Pedido';
        submitBtn.disabled = false;
        startTracking(order ? order.id : null, name, order ? order.created_at : null);
    })
    .catch(() => {
        toggleCart();
        cart = [];
        saveCart();
        updateCartUI();
        startTracking(null, name, new Date().toISOString());
    });
}

// ─── REAL-TIME TRACKING ───────────────────────────────────────────────
let countdownInterval;
let statusPollInterval;
let totalSeconds = 7200;
let currentOrderId = null;
let currentStep = 1;

const STATUS_STEPS = {
    'Pendente':      1,
    'Processando':   1,
    'Preparando':    2,
    'Com Motorista': 3,
    'Entregue':      4,
    'Cancelado':     5,
};

const STATUS_LABELS = {
    'Pendente':      '📋 Pendente',
    'Processando':   '📋 Processando',
    'Preparando':    '📦 A Preparar',
    'Com Motorista': '🛵 Com Motorista',
    'Entregue':      '✅ Entregue',
    'Cancelado':     '❌ Cancelado',
};

const STATUS_COLORS = {
    'Pendente':      '#fef3c7',
    'Processando':   '#dbeafe',
    'Preparando':    '#ede9fe',
    'Com Motorista': '#d1fae5',
    'Entregue':      '#dcfce7',
    'Cancelado':     '#fee2e2',
};

function startTracking(orderId, customerName, createdAt) {
    currentOrderId = orderId;
    currentStep = 1;

    // ── REAL TIMER: subtract elapsed time since order was placed ──
    const ORDER_DURATION = 4 * 3600; // 4 hours in seconds
    if (createdAt) {
        const elapsedSeconds = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
        totalSeconds = Math.max(0, ORDER_DURATION - elapsedSeconds);
    } else {
        totalSeconds = ORDER_DURATION; // fallback for offline orders
    }

    // Reset UI
    trackingOverlay.classList.add('active');
    updateScrollLock();
    timerDisplay.style.color = 'var(--primary)';
    timerDisplay.textContent = ''; // clear any old ENTREGUE/CANCELADO text
    driverProfile.style.display = 'none';
    btnSimulateNext.style.display = 'none';
    btnCloseTracking.style.display = 'none';

    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById('step-' + i);
        el.classList.remove('active', 'completed');
    }
    document.getElementById('step-1').classList.add('active');

    // Show order ID if available
    const orderIdEl = document.getElementById('tracking-order-id');
    if (orderId) {
        orderIdEl.textContent = `Pedido #${orderId} • ${customerName}`;
    } else {
        orderIdEl.textContent = `Pedido de ${customerName} • A processar...`;
    }

    // Start countdown timer (never resets after this point)
    clearInterval(countdownInterval);
    updateTimerDisplay();
    countdownInterval = setInterval(() => {
        if (totalSeconds > 0) totalSeconds--;
        updateTimerDisplay();
    }, 1000);

    // Start real-time status polling (every 5 seconds)
    clearInterval(statusPollInterval);
    if (orderId) {
        pollOrderStatus(orderId);
        statusPollInterval = setInterval(() => pollOrderStatus(orderId), 5000);
    }
}

function closeTracking() {
    clearInterval(countdownInterval);
    clearInterval(statusPollInterval);
    trackingOverlay.classList.remove('active');
    currentOrderId = null;
    updateScrollLock();
}

let currentDriverPhone = '258840000000';

async function pollOrderStatus(orderId) {
    try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) return;
        const order = await res.json();
        applyRealStatus(order.status, order.drivers);
    } catch (e) {
        // backend down — keep timer going silently
    }
}

function applyRealStatus(status, driver) {
    const step = STATUS_STEPS[status] || 1;
    
    // Update step indicators
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById('step-' + i);
        el.classList.remove('active', 'completed');
        if (i < step) { el.classList.add('completed', 'active'); }
        else if (i === step) { el.classList.add('active'); }
    }

    // Step 3: Com Motorista — show driver profile
    if (step === 3 || (driver && status !== 'Entregue' && status !== 'Cancelado')) {
        if (driver) {
            driverImg.src = driver.photo_url || 'assets/driver_avatar_1777767776730.png';
            const driverInfoEl = driverProfile.querySelector('.driver-info');
            if (driverInfoEl) {
                driverInfoEl.innerHTML = `
                    <h4>${driver.name}</h4>
                    <p class="driver-rating">⭐ Motorista Associado</p>
                    <p class="driver-vehicle">Telefone: ${driver.phone}</p>
                `;
            }
            currentDriverPhone = driver.phone;
        } else {
            driverImg.src = 'assets/driver_avatar_1777767776730.png';
            const driverInfoEl = driverProfile.querySelector('.driver-info');
            if (driverInfoEl) {
                driverInfoEl.innerHTML = `
                    <h4>Motorista João</h4>
                    <p class="driver-rating">⭐ 4.9 (124 entregas)</p>
                    <p class="driver-vehicle">Yamaha DT - Matrícula AHD 452 MC</p>
                `;
            }
            currentDriverPhone = '258840000000';
        }
        driverProfile.style.display = 'flex';
        if (step === 3 && currentStep !== 3) {
            showStatusToast('O teu motorista está a caminho!');
        }
    } else {
        driverProfile.style.display = 'none';
    }
    
    currentStep = step;

    // Step 4: Entregue
    if (step === 4) {
        clearInterval(countdownInterval);
        clearInterval(statusPollInterval);
        timerDisplay.textContent = '✅ ENTREGUE!';
        timerDisplay.style.color = 'var(--success)';
        driverProfile.style.display = 'none';
        btnCloseTracking.style.display = 'inline-block';
        showStatusToast('🎉 O teu pedido foi entregue! Obrigado!');
    }

    // Step 5: Cancelado
    if (status === 'Cancelado') {
        clearInterval(countdownInterval);
        clearInterval(statusPollInterval);
        timerDisplay.textContent = '❌ CANCELADO';
        timerDisplay.style.color = '#ef4444';
        driverProfile.style.display = 'none';
        btnCloseTracking.style.display = 'inline-block';
        showStatusToast('❌ O teu pedido foi cancelado. Contacta-nos se precisares de ajuda.');
    }
}

function showStatusToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.textContent = 'Produto adicionado ao carrinho!';
    }, 5000);
}

function updateTimerDisplay() {
    if (timerDisplay.textContent.includes('✅') || timerDisplay.textContent.includes('❌')) return;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    timerDisplay.textContent =
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0');
}

// Kept for reference only — no longer called from UI
function simulateNextStep() {}

function contactDriver() {
    let cleanedPhone = currentDriverPhone.replace(/\s+/g, '').replace('+', '');
    if (!cleanedPhone.startsWith('258') && cleanedPhone.length === 9) {
        cleanedPhone = '258' + cleanedPhone;
    }
    window.open(`https://wa.me/${cleanedPhone}?text=Olá,%20gostaria%20de%20saber%20o%20ponto%20de%20situação%20da%20minha%20entrega.`, '_blank');
}

// ─── HELPERS ─────────────────────────────────────────────────────────
function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatCurrency(value) {
    return value.toLocaleString('pt-MZ') + ' MT';
}

function saveCart() {
    localStorage.setItem('tchapoTchapoCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('tchapoTchapoCart');
    if (saved) { cart = JSON.parse(saved); updateCartUI(); }
}

// ─── ORDER HISTORY ───────────────────────────────────────────────────
function saveOrderToHistory(order, customerName, items) {
    const history = JSON.parse(localStorage.getItem('tchapoOrderHistory') || '[]');
    history.unshift({
        id: order.id,
        customer_name: customerName,
        total: order.total,
        payment: order.payment,
        bairro: order.bairro,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        created_at: order.created_at || new Date().toISOString(),
        status: order.status || 'Pendente'
    });
    // Keep last 20 orders
    localStorage.setItem('tchapoOrderHistory', JSON.stringify(history.slice(0, 20)));
}

// ─── MEUS PEDIDOS MODAL ──────────────────────────────────────────────
const meusPedidosOverlay  = document.getElementById('meus-pedidos-overlay');
const meusPedidosModal    = document.getElementById('meus-pedidos-modal');
const meusPedidosContent  = document.getElementById('meus-pedidos-content');

function openMeusPedidos() {
    meusPedidosOverlay.classList.add('active');
    meusPedidosModal.classList.add('active');
    updateScrollLock();
    renderMeusPedidos();
}

function closeMeusPedidos() {
    meusPedidosOverlay.classList.remove('active');
    meusPedidosModal.classList.remove('active');
    updateScrollLock();
}

async function renderMeusPedidos() {
    let history = [];
    
    if (currentUser) {
        try {
            const res = await fetch(`/api/orders/user/${currentUser.id}`);
            if (res.ok) {
                const dbOrders = await res.json();
                history = dbOrders.map(o => ({
                    id: o.id,
                    customer_name: o.customer_name,
                    total: o.total,
                    payment: o.payment,
                    bairro: o.bairro,
                    items: o.order_items ? o.order_items.map(i => ({ name: i.product_name, quantity: i.quantity, price: i.price })) : [],
                    created_at: o.created_at,
                    status: o.status
                }));
            }
        } catch (err) {
            console.error('Failed to fetch user orders', err);
        }
    }

    // Fallback to localStorage if no history found (e.g. not logged in)
    if (history.length === 0) {
        history = JSON.parse(localStorage.getItem('tchapoOrderHistory') || '[]');
    }

    if (history.length === 0) {
        meusPedidosContent.innerHTML = `
            <div style="text-align:center;padding:3rem;color:#9ca3af;">
                <div style="font-size:3rem;margin-bottom:1rem;">📦</div>
                <p style="font-size:1.1rem;font-weight:600;">Ainda não tens pedidos.</p>
                <p style="font-size:0.9rem;margin-top:0.5rem;">Faz o teu primeiro pedido e acompanha aqui!</p>
            </div>`;
        return;
    }

    // Show skeleton while fetching live status
    meusPedidosContent.innerHTML = history.map(o => `
        <div class="mp-card" id="mp-card-${o.id}">
            <div class="mp-card-header">
                <div>
                    <span class="mp-order-id">#${o.id}</span>
                    <span class="mp-customer">${o.customer_name} • ${o.bairro}</span>
                </div>
                <div class="mp-status-badge" id="mp-status-${o.id}" style="background:#f3f4f6">
                    <span class="mp-dot"></span> A verificar...
                </div>
            </div>
            <div class="mp-items">
                ${o.items && o.items.length > 0 ? o.items.map(i => `<span class="mp-item-tag">${i.quantity}× ${i.name}</span>`).join('') : '<span class="mp-item-tag">Itens indisponíveis</span>'}
            </div>
            <div class="mp-card-footer">
                <span class="mp-total">${Number(o.total).toLocaleString('pt-MZ')} MT</span>
                <span class="mp-payment">💳 ${o.payment}</span>
                <span class="mp-date">${new Date(o.created_at).toLocaleDateString('pt', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                <button class="mp-track-btn" onclick="closeMeusPedidos(); startTracking(${o.id}, '${o.customer_name}', '${o.created_at}')">
                    Acompanhar
                </button>
            </div>
        </div>
    `).join('');

    // Fetch live status for each order
    for (const o of history) {
        try {
            const res = await fetch(`/api/orders/${o.id}`);
            if (!res.ok) continue;
            const order = await res.json();
            const statusEl = document.getElementById(`mp-status-${o.id}`);
            if (statusEl) {
                const label = STATUS_LABELS[order.status] || order.status;
                const bg    = STATUS_COLORS[order.status] || '#f3f4f6';
                statusEl.style.background = bg;
                statusEl.innerHTML = label;
            }
        } catch (e) { /* ignore */ }
    }
}

// ─── AUTHENTICATION (SUPABASE) ───────────────────────────────────────
const SUPABASE_URL = 'https://rkempjcqoefhdthvwewm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZW1wamNxb2VmaGR0aHZ3ZXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NTEwNjIsImV4cCI6MjA5MzMyNzA2Mn0.NC38AzJUtZa7ZQ-T5AjFe_hyZGoPrasXPLJjsQ1rltI';
let supabaseClient = null;

function initAuth() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Listen for auth state changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            currentUser = session?.user || null;
            updateAuthUI();
        });

        // Set up auth event listeners
        if (btnOpenAuth) btnOpenAuth.addEventListener('click', openAuthModal);
        if (closeAuth) closeAuth.addEventListener('click', closeAuthModal);
        if (authOverlay) authOverlay.addEventListener('click', closeAuthModal);
        
        if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
        if (tabRegister) tabRegister.addEventListener('click', () => switchAuthTab('register'));
        
        if (formLogin) formLogin.addEventListener('submit', handleLogin);
        if (formRegister) formRegister.addEventListener('submit', handleRegister);
        if (btnLogout) btnLogout.addEventListener('click', handleLogout);
    }
}

function openAuthModal() {
    authModal.classList.add('active');
    authOverlay.classList.add('active');
    updateScrollLock();
}

function closeAuthModal() {
    authModal.classList.remove('active');
    authOverlay.classList.remove('active');
    updateScrollLock();
}

function switchAuthTab(tab) {
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.add('active');
        formRegister.classList.remove('active');
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formRegister.classList.add('active');
        formLogin.classList.remove('active');
    }
}

function updateAuthUI() {
    const btnReferrals = document.getElementById('btn-referrals');
    if (currentUser) {
        if (btnOpenAuth) btnOpenAuth.style.display = 'none';
        if (authUserInfo) authUserInfo.style.display = 'flex';
        if (btnReferrals) btnReferrals.style.display = 'inline-flex';
        const name = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
        const phone = currentUser.user_metadata?.phone || '';
        if (authUserName) authUserName.innerHTML = `<span class="welcome-text">Olá, </span>${name.split(' ')[0]}`;
        fillUserForms(name, phone);
    } else {
        if (btnOpenAuth) btnOpenAuth.style.display = 'block';
        if (authUserInfo) authUserInfo.style.display = 'none';
        if (btnReferrals) btnReferrals.style.display = 'none';
        appliedCoupon = null; // Clear coupon on logout
    }
}

function fillUserForms(name, phone) {
    // Quick Order Form
    const qoName = document.getElementById('qo-name');
    const qoPhone = document.getElementById('qo-phone');
    if (qoName && !qoName.value) qoName.value = name || '';
    if (qoPhone && !qoPhone.value) qoPhone.value = phone || '';

    // Cart Form
    const cartName = document.getElementById('customer-name');
    const cartPhone = document.getElementById('customer-phone');
    if (cartName && !cartName.value) cartName.value = name || '';
    if (cartPhone && !cartPhone.value) cartPhone.value = phone || '';
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('btn-submit-login');
    
    errorEl.style.display = 'none';
    btn.textContent = 'A entrar...';
    btn.disabled = true;

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    
    if (error) {
        let msg = error.message;
        if (msg.includes("Email not confirmed")) {
            msg = "A sua conta não foi confirmada. Se o problema persistir, desative a 'Confirmação de Email' no painel Supabase.";
        }
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
        btn.textContent = 'Entrar na Loja';
        btn.disabled = false;
    } else {
        closeAuthModal();
        showStatusToast('Sessão iniciada com sucesso!');
        btn.textContent = 'Entrar na Loja';
        btn.disabled = false;
        document.getElementById('login-password').value = '';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorEl = document.getElementById('reg-error');
    const btn = document.getElementById('btn-submit-register');
    
    errorEl.style.display = 'none';
    btn.textContent = 'A criar...';
    btn.disabled = true;

    const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name, phone: phone }
        }
    });
    
    if (error) {
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
        btn.textContent = 'Criar Conta';
        btn.disabled = false;
    } else {
        closeAuthModal();
        showStatusToast('Conta criada com sucesso!');
        btn.textContent = 'Criar Conta';
        btn.disabled = false;
        formRegister.reset();
    }
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    showStatusToast('Sessão terminada.');
    
    // Clear forms
    const qoName = document.getElementById('qo-name');
    const qoPhone = document.getElementById('qo-phone');
    if (qoName) qoName.value = '';
    if (qoPhone) qoPhone.value = '';
    
    const cartName = document.getElementById('customer-name');
    const cartPhone = document.getElementById('customer-phone');
    if (cartName) cartName.value = '';
    if (cartPhone) cartPhone.value = '';
}

// ─── REFERRAL SYSTEM ──────────────────────────────────────────────────
async function applyCoupon() {
    const couponInput = document.getElementById('customer-coupon');
    const couponMsg = document.getElementById('coupon-message');
    if (!couponInput || !couponMsg) return;

    const code = couponInput.value.trim().toUpperCase();
    if (!code) {
        couponMsg.textContent = '⚠️ Por favor, insira um código.';
        couponMsg.style.color = '#ef4444';
        couponMsg.style.display = 'block';
        return;
    }

    if (!currentUser) {
        couponMsg.textContent = '⚠️ Por favor, inicie sessão primeiro.';
        couponMsg.style.color = '#ef4444';
        couponMsg.style.display = 'block';
        return;
    }

    try {
        couponMsg.textContent = '⏳ A validar código...';
        couponMsg.style.color = 'var(--dark)';
        couponMsg.style.display = 'block';

        const res = await fetch(`/api/referrals/validate?code=${encodeURIComponent(code)}&user_id=${currentUser.id}`);
        const data = await res.json();

        if (res.ok && data.valid) {
            appliedCoupon = { code: code, discountPercent: 0.10 };
            couponMsg.textContent = '✅ Código de indicação aplicado! 10% de desconto.';
            couponMsg.style.color = '#10b981';
            updateCartUI();
        } else {
            appliedCoupon = null;
            couponMsg.textContent = `❌ ${data.message || data.error || 'Código inválido.'}`;
            couponMsg.style.color = '#ef4444';
            updateCartUI();
        }
    } catch (err) {
        appliedCoupon = null;
        couponMsg.textContent = '❌ Erro ao validar código.';
        couponMsg.style.color = '#ef4444';
        updateCartUI();
    }
}

async function applyQuickOrderCoupon() {
    const couponInput = document.getElementById('qo-coupon');
    const couponMsg = document.getElementById('qo-coupon-message');
    if (!couponInput || !couponMsg) return;

    const code = couponInput.value.trim().toUpperCase();
    if (!code) {
        couponMsg.textContent = '⚠️ Por favor, insira um código.';
        couponMsg.style.color = '#ef4444';
        couponMsg.style.display = 'block';
        return;
    }

    if (!currentUser) {
        couponMsg.textContent = '⚠️ Por favor, inicie sessão primeiro.';
        couponMsg.style.color = '#ef4444';
        couponMsg.style.display = 'block';
        return;
    }

    try {
        couponMsg.textContent = '⏳ A validar código...';
        couponMsg.style.color = '#4b5563';
        couponMsg.style.display = 'block';

        const res = await fetch(`/api/referrals/validate?code=${encodeURIComponent(code)}&user_id=${currentUser.id}`);
        const data = await res.json();

        if (res.ok && data.valid) {
            appliedCoupon = { code: code, discountPercent: 0.10 };
            couponMsg.textContent = '✅ Código de indicação aplicado! 10% de desconto.';
            couponMsg.style.color = '#10b981';
            updateQuickOrderPrice();
        } else {
            appliedCoupon = null;
            couponMsg.textContent = `❌ ${data.message || data.error || 'Código inválido.'}`;
            couponMsg.style.color = '#ef4444';
            updateQuickOrderPrice();
        }
    } catch (err) {
        appliedCoupon = null;
        couponMsg.textContent = '❌ Erro ao validar código.';
        couponMsg.style.color = '#ef4444';
        updateQuickOrderPrice();
    }
}

function openReferrals() {
    const referralsOverlay = document.getElementById('referrals-overlay');
    const referralsModal = document.getElementById('referrals-modal');
    if (referralsOverlay && referralsModal) {
        referralsOverlay.classList.add('active');
        referralsModal.classList.add('active');
        updateScrollLock();
        loadReferralsData();
    }
}

function closeReferrals() {
    const referralsOverlay = document.getElementById('referrals-overlay');
    const referralsModal = document.getElementById('referrals-modal');
    if (referralsOverlay && referralsModal) {
        referralsOverlay.classList.remove('active');
        referralsModal.classList.remove('active');
        updateScrollLock();
    }
}

async function loadReferralsData() {
    const referralsContent = document.getElementById('referrals-content');
    if (!referralsContent) return;

    if (!currentUser) {
        referralsContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444;">
                ⚠️ Por favor, inicie sessão para ver o seu código de indicação.
            </div>
        `;
        return;
    }

    try {
        referralsContent.innerHTML = '<div style="text-align: center; padding: 2rem; color: #9ca3af;">A carregar dados do programa...</div>';

        // 1. Get or generate user's referral code and balance
        const name = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
        const resCode = await fetch('/api/referrals/my-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                email: currentUser.email,
                name: name
            })
        });

        if (!resCode.ok) {
            throw new Error('Falha ao obter código de indicação.');
        }

        const refData = await resCode.json();

        // 2. Get history of transactions
        const resTx = await fetch(`/api/referrals/transactions?user_id=${currentUser.id}`);
        const txs = resTx.ok ? await resTx.json() : [];

        // 3. Get history of withdrawals
        const resWd = await fetch(`/api/referrals/withdrawals?user_id=${currentUser.id}`);
        const wds = resWd.ok ? await resWd.json() : [];

        renderReferralsUI(refData, txs, wds);

    } catch (err) {
        console.error(err);
        referralsContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444;">
                ❌ Ocorreu um erro ao carregar as informações. Por favor, tente novamente mais tarde.
            </div>
        `;
    }
}

function renderReferralsUI(refData, txs, wds) {
    const referralsContent = document.getElementById('referrals-content');
    if (!referralsContent) return;

    const code = refData.code;
    const balance = Number(refData.balance);
    const totalEarned = Number(refData.total_earned);
    const totalWithdrawn = Number(refData.total_withdrawn);

    let txsListHtml = '';
    if (txs.length === 0) {
        txsListHtml = '<p style="color: #9ca3af; font-size: 0.85rem; text-align: center; padding: 0.5rem 0;">Ainda não tens indicações concluídas.</p>';
    } else {
        txsListHtml = txs.map(tx => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.85rem;">
                <div>
                    <span style="font-weight: 600; color: var(--dark);">${tx.buyer_name || 'Amigo'}</span>
                    <span style="color: #6b7280; font-size: 0.75rem; display: block;">Encomenda #${tx.order_id}</span>
                </div>
                <span style="color: #10b981; font-weight: 600;">+${formatCurrency(Number(tx.amount))}</span>
            </div>
        `).join('');
    }

    let wdsListHtml = '';
    if (wds.length === 0) {
        wdsListHtml = '<p style="color: #9ca3af; font-size: 0.85rem; text-align: center; padding: 0.5rem 0;">Nenhum saque solicitado.</p>';
    } else {
        wdsListHtml = wds.map(wd => {
            let statusColor = '#9ca3af';
            let statusBg = '#f3f4f6';
            if (wd.status === 'Pago') { statusColor = '#10b981'; statusBg = '#dcfce7'; }
            else if (wd.status === 'Pendente') { statusColor = '#d97706'; statusBg = '#fef3c7'; }
            else if (wd.status === 'Cancelado') { statusColor = '#ef4444'; statusBg = '#fee2e2'; }
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.85rem;">
                    <div>
                        <span style="font-weight: 600; color: var(--dark);">${formatCurrency(Number(wd.amount))}</span>
                        <span style="color: #6b7280; font-size: 0.75rem; display: block;">${wd.payment_method || 'M-Pesa'} (${wd.payment_phone})</span>
                    </div>
                    <span style="color: ${statusColor}; background: ${statusBg}; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 12px; font-weight: 600;">${wd.status}</span>
                </div>
            `;
        }).join('');
    }

    referralsContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- Code Sharing Card -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); border: 1.5px solid #fde68a; border-radius: 14px; padding: 1.25rem; text-align: center; box-sizing: border-box;">
                <p style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: #b45309; font-weight: 500;">O teu Código de Indicação:</p>
                <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center; max-width: 320px; margin: 0 auto; width: 100%; box-sizing: border-box;">
                    <span id="ref-code-text" style="font-size: 1.5rem; font-weight: 700; color: #78350f; letter-spacing: 1.5px; background: #fff; padding: 0.4rem 1.25rem; border-radius: 8px; border: 1px solid #fde68a; flex: 1;">${code}</span>
                    <button onclick="copyReferralCode('${code}')" style="background: #78350f; color: #fff; border: none; padding: 0.75rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copiar
                    </button>
                </div>
                <p style="margin: 0.75rem 0 0 0; font-size: 0.75rem; color: #b45309; line-height: 1.4;">
                    Dá 10% de desconto aos teus amigos. Ganhas até 1000 meticais por indicação
                </p>
            </div>

            <!-- Stats Row -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; width: 100%; box-sizing: border-box;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem; text-align: center;">
                    <span style="font-size: 0.75rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Saldo Disponível</span>
                    <span style="font-size: 1.15rem; font-weight: 700; color: var(--dark);">${formatCurrency(balance)}</span>
                </div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem; text-align: center;">
                    <span style="font-size: 0.75rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Total Ganho</span>
                    <span style="font-size: 1.15rem; font-weight: 700; color: #10b981;">${formatCurrency(totalEarned)}</span>
                </div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem; text-align: center;">
                    <span style="font-size: 0.75rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Total Sacado</span>
                    <span style="font-size: 1.15rem; font-weight: 700; color: #3b82f6;">${formatCurrency(totalWithdrawn)}</span>
                </div>
            </div>

            <!-- Withdrawal Form -->
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-sizing: border-box;">
                <h4 style="margin: 0 0 0.75rem 0; font-size: 0.9rem; color: var(--dark); font-weight: 600;">Solicitar Saque</h4>
                <form id="ref-withdraw-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; width: 100%;">
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size: 0.75rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Método de Pagamento:</label>
                            <select id="ref-withdraw-method" onchange="updateWithdrawPlaceholder(this.value)" style="width: 100%; padding: 0.6rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.85rem; outline: none; background-color: #fff; box-sizing: border-box; height: 39px;">
                                <option value="M-Pesa">M-Pesa</option>
                                <option value="eMola">eMola</option>
                            </select>
                        </div>
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size: 0.75rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Montante (MT):</label>
                            <input type="number" id="ref-withdraw-amount" placeholder="Min 50 MT" required min="50" style="width: 100%; padding: 0.6rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.85rem; outline: none; margin-bottom: 0; box-sizing: border-box; height: 39px;">
                        </div>
                    </div>
                    <div style="width: 100%;">
                        <label id="ref-withdraw-phone-label" style="font-size: 0.75rem; color: #64748b; display: block; margin-bottom: 0.25rem;">Número M-Pesa:</label>
                        <input type="tel" id="ref-withdraw-phone" placeholder="84XXXXXXX" required pattern="[0-9]{9}" style="width: 100%; padding: 0.6rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.85rem; outline: none; margin-bottom: 0; box-sizing: border-box;">
                    </div>
                    <button type="submit" id="btn-submit-withdraw" style="background: var(--dark); color: #fff; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; width: 100%; box-sizing: border-box;">
                        Solicitar Saque (M-Pesa)
                    </button>
                    <div id="ref-withdraw-message" style="font-size: 0.8rem; text-align: center; display: none;"></div>
                </form>
            </div>

            <!-- Tabs/Lists -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; box-sizing: border-box; margin-top: 0.5rem;">
                
                <!-- Earnings History -->
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: var(--dark); font-weight: 600; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.35rem;">Histórico de Ganhos</h4>
                    <div style="max-height: 180px; overflow-y: auto; padding-right: 0.25rem;">
                        ${txsListHtml}
                    </div>
                </div>

                <!-- Withdrawals History -->
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: var(--dark); font-weight: 600; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.35rem;">Pedidos de Saque</h4>
                    <div style="max-height: 180px; overflow-y: auto; padding-right: 0.25rem;">
                        ${wdsListHtml}
                    </div>
                </div>
            </div>

        </div>
    `;

    // Add submit handler for withdrawal form
    const wdForm = document.getElementById('ref-withdraw-form');
    if (wdForm) {
        wdForm.addEventListener('submit', handleWithdrawSubmit);
    }
}

async function handleWithdrawSubmit(e) {
    e.preventDefault();
    const phoneInput = document.getElementById('ref-withdraw-phone');
    const amountInput = document.getElementById('ref-withdraw-amount');
    const methodInput = document.getElementById('ref-withdraw-method');
    const msgEl = document.getElementById('ref-withdraw-message');
    
    if (!phoneInput || !amountInput || !msgEl) return;
    
    const phone = phoneInput.value.trim();
    const amount = Number(amountInput.value);
    const payment_method = methodInput ? methodInput.value : 'M-Pesa';
    
    msgEl.style.display = 'block';
    msgEl.style.color = 'var(--dark)';
    msgEl.textContent = '⏳ A processar pedido de saque...';
    
    try {
        const res = await fetch('/api/referrals/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                phone: phone,
                amount: amount,
                payment_method: payment_method
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            msgEl.textContent = '✅ Pedido de saque efetuado! Aguarde processamento.';
            msgEl.style.color = '#10b981';
            phoneInput.value = '';
            amountInput.value = '';
            
            // Reload referral data to update balance and withdrawal history
            setTimeout(loadReferralsData, 1500);
        } else {
            msgEl.textContent = `❌ ${data.error || 'Erro ao efetuar saque.'}`;
            msgEl.style.color = '#ef4444';
        }
    } catch (err) {
        msgEl.textContent = '❌ Erro de rede ao efetuar saque.';
        msgEl.style.color = '#ef4444';
    }
}

window.copyReferralCode = function(code) {
    navigator.clipboard.writeText(code).then(() => {
        showStatusToast('📋 Código copiado com sucesso!');
    }).catch(() => {
        showStatusToast('⚠️ Não foi possível copiar. Selecione e copie manualmente: ' + code);
    });
};

window.updateWithdrawPlaceholder = function(val) {
    const label = document.getElementById('ref-withdraw-phone-label');
    const input = document.getElementById('ref-withdraw-phone');
    const btn = document.getElementById('btn-submit-withdraw');
    if (label) label.textContent = `Número ${val}:`;
    if (input) {
        if (val === 'M-Pesa') {
            input.placeholder = '84XXXXXXX';
        } else {
            input.placeholder = '86XXXXXXX ou 87XXXXXXX';
        }
    }
    if (btn) btn.textContent = `Solicitar Saque (${val})`;
};

function updateScrollLock() {
    const activeModals = document.querySelectorAll(
        '.product-modal.active, .modal.active, .cart-sidebar.active, .tracking-overlay.active, .modal-overlay.active, .cart-overlay.active'
    );
    let anyOpen = false;
    for (const el of activeModals) {
        if (el.classList.contains('active') && el.style.display !== 'none') {
            anyOpen = true;
            break;
        }
    }
    if (!anyOpen) {
        if (document.body.style.position === 'fixed') {
            const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0', 10);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.removeAttribute('data-scroll-y');
            window.scrollTo(0, scrollY);
        }
    } else {
        if (document.body.style.position !== 'fixed') {
            const scrollY = window.scrollY;
            document.body.setAttribute('data-scroll-y', scrollY.toString());
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
    }
}

function initPromoPopup() {
    const deliveryPaymentOverlay = document.getElementById('delivery-payment-promo-overlay');
    const deliveryPaymentModal = document.getElementById('delivery-payment-promo-modal');
    const closeDeliveryPayment = document.getElementById('close-delivery-payment-promo');

    const deliveryOverlay = document.getElementById('delivery-promo-overlay');
    const deliveryModal = document.getElementById('delivery-promo-modal');
    const closeDelivery = document.getElementById('close-delivery-promo');

    const referralOverlay = document.getElementById('referral-promo-overlay');
    const referralModal = document.getElementById('referral-promo-modal');
    const closeReferral = document.getElementById('close-referral-promo');

    if (!deliveryPaymentOverlay || !deliveryPaymentModal || !deliveryOverlay || !deliveryModal || !referralOverlay || !referralModal) return;

    // Show Delivery Payment promo first
    deliveryPaymentOverlay.classList.add('active');
    deliveryPaymentModal.classList.add('active');
    updateScrollLock();

    const transitionToDelivery = () => {
        deliveryPaymentOverlay.classList.remove('active');
        deliveryPaymentModal.classList.remove('active');
        
        // Show Delivery promo second
        deliveryOverlay.classList.add('active');
        deliveryModal.classList.add('active');
        updateScrollLock();
    };

    const transitionToReferral = () => {
        deliveryOverlay.classList.remove('active');
        deliveryModal.classList.remove('active');
        
        // Show Referral promo third
        referralOverlay.classList.add('active');
        referralModal.classList.add('active');
        updateScrollLock();
    };

    const closeAllPromos = () => {
        referralOverlay.classList.remove('active');
        referralModal.classList.remove('active');
        updateScrollLock();
    };

    if (closeDeliveryPayment) closeDeliveryPayment.addEventListener('click', transitionToDelivery);
    if (deliveryPaymentOverlay) deliveryPaymentOverlay.addEventListener('click', transitionToDelivery);

    if (closeDelivery) closeDelivery.addEventListener('click', transitionToReferral);
    if (deliveryOverlay) deliveryOverlay.addEventListener('click', transitionToReferral);

    if (closeReferral) closeReferral.addEventListener('click', closeAllPromos);
    if (referralOverlay) referralOverlay.addEventListener('click', closeAllPromos);
}

// ─── INIT CALL ───────────────────────────────────────────────────────
init();
