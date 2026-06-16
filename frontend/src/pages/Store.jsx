import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rkempjcqoefhdthvwewm.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const fallbackProducts = [
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
    {
        id: 9, category: 'Wearables',
        name: 'Smartwatch Fitness',
        price: 6500,
        image: 'assets/smartwatch_1777774341144.png',
        desc: 'Monitor de saúde completo: frequência cardíaca, sono, SpO2 e GPS integrado.',
        features: ['❤️ Monitor Cardíaco 24/7', '😴 Análise do Sono', '🩸 Oximetria (SpO2)', '📍 GPS Integrado']
    },
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

const getDeviceSelectionType = (product) => {
    if (!product || !product.features) return 'none';
    const flag = product.features.find(f => f.startsWith('_device_selection:'));
    if (flag) return flag.split(':')[1];
    
    // Fallback support for the silicone case product (ID 13) if the flag isn't set yet
    if (product.id === 13 || product.name?.includes("Capas de Silicone")) {
        return 'iphone'; // default to iphone selection
    }
    return 'none';
};

const getColorSelectionType = (product) => {
    if (!product || !product.features) return 'show';
    const flag = product.features.find(f => f.startsWith('_color_selection:'));
    if (flag) return flag.split(':')[1];
    return 'show';
};

const STATUS_STEPS = {
    'Pendente':      1,
    'Processando':   1,
    'Preparando':    2,
    'Com Motorista': 3,
    'Entregue':      4,
    'Cancelado':     5,
};

function getCategoryIcon(cat) {
    if (cat === 'Todos') return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    );
    if (cat === 'Smartphones') return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    );
    if (cat === 'Áudio') return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    );
    if (cat === 'Wearables') return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>
    );
    if (cat === 'Acessórios') return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    );
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
    );
}

export default function Store() {
    const [products, setProducts] = useState(fallbackProducts);
    const [categories, setCategories] = useState(['Todos', 'Smartphones', 'Áudio', 'Wearables', 'Acessórios']);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [selectedDevice, setSelectedDevice] = useState('iPhone 15 Pro Max');
    const [selectedColor, setSelectedColor] = useState('Preto');
    const [customDevice, setCustomDevice] = useState('');
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('tchapoTchapoCart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Dialog overlays
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quickOrderProduct, setQuickOrderProduct] = useState(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState('login');
    const [isMeusPedidosOpen, setIsMeusPedidosOpen] = useState(false);

    // Toast
    const [toastMessage, setToastMessage] = useState(null);

    // Form inputs
    const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', bairro: '', address: '', time: '', payment: '' });
    const [quickOrderQty, setQuickOrderQty] = useState(1);
    const [quickOrderForm, setQuickOrderForm] = useState({ name: '', phone: '', bairro: '', address: '', time: '', payment: '' });
    
    // Auth inputs
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regError, setRegError] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    // Order History / Tracking
    const [myOrders, setMyOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [trackingTimeLeft, setTrackingTimeLeft] = useState(4 * 3600);
    const [trackingStatus, setTrackingStatus] = useState('Pendente');
    const [trackingDriver, setTrackingDriver] = useState(null);

    // Lock body scroll when modals are open
    useEffect(() => {
        const isModalOpen = (activePromo !== null) || isCartOpen || isAuthOpen || isMeusPedidosOpen || isReferralOpen || selectedProduct !== null || quickOrderProduct !== null || trackingOrder !== null;
        if (isModalOpen) {
            if (document.body.style.position !== 'fixed') {
                const scrollY = window.scrollY;
                document.body.setAttribute('data-scroll-y', scrollY.toString());
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            }
        } else {
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
        }
        return () => {
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
        };
    }, [activePromo, isCartOpen, isAuthOpen, isMeusPedidosOpen, isReferralOpen, selectedProduct, quickOrderProduct, trackingOrder]);

    // Referral states
    const [activePromo, setActivePromo] = useState('delivery_payment'); // 'delivery_payment', 'delivery', 'referral', or null
    const [referralInput, setReferralInput] = useState('');
    const [appliedReferralCode, setAppliedReferralCode] = useState('');
    const [referralError, setReferralError] = useState('');
    const [validatingReferral, setValidatingReferral] = useState(false);

    const trackProductClick = async (productId) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}/click`, {
                method: 'POST'
            });
        } catch (err) {
            console.error('Error tracking click:', err);
        }
    };

    const [isReferralOpen, setIsReferralOpen] = useState(false);
    const [referralData, setReferralData] = useState(null);
    const [referralTxs, setReferralTxs] = useState([]);
    const [referralWithdrawalsList, setReferralWithdrawalsList] = useState([]);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawPhone, setWithdrawPhone] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('M-Pesa');
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawError, setWithdrawError] = useState('');
    const [withdrawSuccess, setWithdrawSuccess] = useState('');

    const fetchReferralData = async () => {
        if (!currentUser) return;
        try {
            const codeRes = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/my-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.user_metadata?.full_name
                })
            });
            if (codeRes.ok) {
                const data = await codeRes.json();
                setReferralData(data);
                if (!withdrawPhone) {
                    setWithdrawPhone(currentUser.user_metadata?.phone || '');
                }
            }

            const txsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/transactions?user_id=${currentUser.id}`);
            if (txsRes.ok) {
                const txs = await txsRes.json();
                setReferralTxs(txs);
            }

            const wRes = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/withdrawals?user_id=${currentUser.id}`);
            if (wRes.ok) {
                const list = await wRes.json();
                setReferralWithdrawalsList(list);
            }
        } catch (err) {
            console.error('Failed to load referral data', err);
        }
    };

    const handleOpenReferrals = () => {
        setIsReferralOpen(true);
        fetchReferralData();
    };

    const handleValidateReferral = async () => {
        if (!referralInput.trim()) return;
        setReferralError('');
        setValidatingReferral(true);
        try {
            const queryParams = new URLSearchParams({
                code: referralInput.trim(),
                user_id: currentUser ? currentUser.id : ''
            });
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/validate?${queryParams.toString()}`);
            const data = await res.json();
            if (data.valid) {
                setAppliedReferralCode(referralInput.trim().toUpperCase());
                setReferralError('');
                showToastMessage(`Código aplicado! Desconto de 10% garantido por ${data.referrer_name}`);
            } else {
                setReferralError(data.message || 'Código inválido.');
            }
        } catch (err) {
            console.error('Error validating referral code', err);
            setReferralError('Erro ao validar código.');
        } finally {
            setValidatingReferral(false);
        }
    };

    const handleRemoveReferral = () => {
        setAppliedReferralCode('');
        setReferralInput('');
        setReferralError('');
    };

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        setWithdrawError('');
        setWithdrawSuccess('');
        
        const amountNum = Number(withdrawAmount);
        if (isNaN(amountNum) || amountNum < 50) {
            setWithdrawError('O saque mínimo é de 50 MT.');
            return;
        }
        
        if (!referralData || Number(referralData.balance) < amountNum) {
            setWithdrawError('Saldo insuficiente.');
            return;
        }
        
        setWithdrawLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/withdraw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    amount: amountNum,
                    phone: withdrawPhone,
                    payment_method: withdrawMethod
                })
            });
            
            const resData = await res.json();
            if (res.ok) {
                setWithdrawSuccess(resData.message || 'Saque solicitado com sucesso!');
                setWithdrawAmount('');
                await fetchReferralData();
            } else {
                setWithdrawError(resData.error || 'Erro ao processar saque.');
            }
        } catch (err) {
            console.error('Failed to submit withdrawal request', err);
            setWithdrawError('Erro ao conectar ao servidor.');
        } finally {
            setWithdrawLoading(false);
        }
    };

    // Load dynamic products (with real-time polling updates every 3 seconds)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setProducts(data);
                        setCategories(['Todos', ...new Set(data.map(p => p.category))]);
                    }
                }
            } catch (err) {
                console.warn('Erro ao carregar produtos da API, usando fallback estático:', err);
            }
        };
        fetchProducts();

        const interval = setInterval(fetchProducts, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setSelectedDevice('iPhone 15 Pro Max');
            setSelectedColor('Preto');
            setCustomDevice('');
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (quickOrderProduct) {
            setSelectedDevice('iPhone 15 Pro Max');
            setSelectedColor('Preto');
            setCustomDevice('');
        }
    }, [quickOrderProduct]);

    // Sync cart to local storage
    useEffect(() => {
        localStorage.setItem('tchapoTchapoCart', JSON.stringify(cart));
    }, [cart]);

    // Handle Supabase Auth status
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCurrentUser(session?.user || null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setCurrentUser(session?.user || null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Autofill user details
    useEffect(() => {
        if (currentUser) {
            const name = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
            const phone = currentUser.user_metadata?.phone || '';
            setCheckoutForm(prev => ({ ...prev, name: prev.name || name, phone: prev.phone || phone }));
            setQuickOrderForm(prev => ({ ...prev, name: prev.name || name, phone: prev.phone || phone }));
        }
    }, [currentUser]);

    // Real-time tracking timer countdown
    useEffect(() => {
        if (!trackingOrder) return;
        const timer = setInterval(() => {
            setTrackingTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [trackingOrder]);

    // Real-time tracking order status poll
    useEffect(() => {
        if (!trackingOrder) return;
        if (trackingStatus === 'Entregue' || trackingStatus === 'Cancelado') return;

        const poll = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${trackingOrder.id}`);
                if (res.ok) {
                    const order = await res.json();
                    setTrackingStatus(order.status);
                    setTrackingDriver(order.drivers || null);
                    
                    const elapsed = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 1000);
                    setTrackingTimeLeft(Math.max(0, 4 * 3600 - elapsed));
                    
                    if (order.status === 'Com Motorista') {
                        showToastMessage('O teu motorista está a caminho!');
                    } else if (order.status === 'Entregue') {
                        showToastMessage('🎉 O teu pedido foi entregue! Obrigado!');
                    } else if (order.status === 'Cancelado') {
                        showToastMessage('❌ O teu pedido foi cancelado.');
                    }
                }
            } catch (e) {}
        };

        poll();
        const interval = setInterval(poll, 5000);
        return () => clearInterval(interval);
    }, [trackingOrder, trackingStatus]);

    const showToastMessage = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const addToCart = (product, device, color) => {
        const devSelType = getDeviceSelectionType(product);
        const hasDeviceSel = devSelType !== 'none';
        const colorSelType = getColorSelectionType(product);
        const hasColorSel = colorSelType !== 'none';
        
        let finalDevice = null;
        if (hasDeviceSel) {
            const rawDevice = device || selectedDevice;
            if (devSelType === 'outro' || (devSelType === 'iphone_outro' && rawDevice === 'outro')) {
                const deviceName = customDevice.trim();
                if (!deviceName) {
                    showToastMessage('⚠️ Por favor, introduza o modelo do dispositivo.');
                    return false;
                }
                finalDevice = deviceName;
            } else {
                finalDevice = rawDevice;
            }
        }
        
        const finalColor = hasColorSel ? (color || selectedColor) : null;
        
        const cartItemId = hasDeviceSel 
            ? (hasColorSel ? `${product.id}-${finalDevice}-${finalColor}` : `${product.id}-${finalDevice}`)
            : (hasColorSel ? `${product.id}-${finalColor}` : product.id);
        const cartItemName = hasDeviceSel 
            ? (hasColorSel ? `${product.name} (${finalDevice} - ${finalColor})` : `${product.name} (${finalDevice})`)
            : (hasColorSel ? `${product.name} (${finalColor})` : product.name);
        
        const existing = cart.find(item => item.id === cartItemId);
        if (existing) {
            setCart(cart.map(item => item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { 
                ...product, 
                id: cartItemId, 
                name: cartItemName, 
                quantity: 1 
            }]);
        }
        showToastMessage('Produto adicionado ao carrinho!');
        return true;
    };

    const updateQuantity = (productId, delta) => {
        const item = cart.find(i => i.id === productId);
        if (item) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) {
                setCart(cart.filter(i => i.id !== productId));
            } else {
                setCart(cart.map(i => i.id === productId ? { ...i, quantity: nextQty } : i));
            }
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(i => i.id !== productId));
    };

    const saveOrderToHistory = (order, customerName, items) => {
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
        localStorage.setItem('tchapoOrderHistory', JSON.stringify(history.slice(0, 20)));
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setIsCartOpen(false);
            setIsAuthOpen(true);
            showToastMessage('Por favor, faça login ou crie conta para finalizar.');
            return;
        }

        const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const referralDiscount = appliedReferralCode ? (itemsTotal * 0.1) : 0;
        const shippingFee = checkoutForm.time.startsWith('Imediato') ? 200 : 0;
        const total = itemsTotal - referralDiscount + shippingFee;

        const orderData = {
            customer_name: checkoutForm.name,
            phone: checkoutForm.phone,
            bairro: checkoutForm.bairro,
            address: checkoutForm.address,
            time: checkoutForm.time,
            payment: checkoutForm.payment,
            total: total,
            user_id: currentUser.id,
            items: cart,
            status: 'Pendente',
            referral_code: appliedReferralCode || null,
            referral_discount: referralDiscount
        };

        const submitBtn = document.getElementById('btn-checkout');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            if (res.ok) {
                const order = await res.json();
                saveOrderToHistory(order, checkoutForm.name, cart);
                setCart([]);
                setAppliedReferralCode('');
                setReferralInput('');
                setIsCartOpen(false);
                setTrackingStatus('Pendente');
                setTrackingDriver(null);
                setTrackingTimeLeft(4 * 3600);
                setTrackingOrder(order);
            }
        } catch (error) {
            console.error('Failed to submit order', error);
            // offline fallback tracking
            setCart([]);
            setIsCartOpen(false);
            setTrackingOrder({ id: 'Offline', created_at: new Date().toISOString() });
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    };

    const handleQuickOrderSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setQuickOrderProduct(null);
            setIsAuthOpen(true);
            showToastMessage('Por favor, faça login ou crie conta para encomendar.');
            return;
        }

        const itemsTotal = quickOrderProduct.price * quickOrderQty;
        const referralDiscount = appliedReferralCode ? (itemsTotal * 0.1) : 0;
        const shippingFee = quickOrderForm.time.startsWith('Imediato') ? 200 : 0;
        const total = itemsTotal - referralDiscount + shippingFee;

        const devSelType = getDeviceSelectionType(quickOrderProduct);
        const hasDeviceSel = devSelType !== 'none';
        const colorSelType = getColorSelectionType(quickOrderProduct);
        const hasColorSel = colorSelType !== 'none';
        
        let finalDevice = '';
        if (hasDeviceSel) {
            if (devSelType === 'outro' || (devSelType === 'iphone_outro' && selectedDevice === 'outro')) {
                finalDevice = customDevice.trim() || 'Outro';
            } else {
                finalDevice = selectedDevice;
            }
        }
        
        const finalName = hasDeviceSel 
            ? (hasColorSel ? `${quickOrderProduct.name} (${finalDevice} - ${selectedColor})` : `${quickOrderProduct.name} (${finalDevice})`)
            : (hasColorSel ? `${quickOrderProduct.name} (${selectedColor})` : quickOrderProduct.name);

        const orderData = {
            customer_name: quickOrderForm.name,
            phone: quickOrderForm.phone,
            bairro: quickOrderForm.bairro,
            address: quickOrderForm.address,
            time: quickOrderForm.time,
            payment: quickOrderForm.payment,
            total: total,
            user_id: currentUser.id,
            items: [{ 
                ...quickOrderProduct, 
                name: finalName, 
                quantity: quickOrderQty 
            }],
            status: 'Pendente',
            referral_code: appliedReferralCode || null,
            referral_discount: referralDiscount
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            if (res.ok) {
                const order = await res.json();
                saveOrderToHistory(order, quickOrderForm.name, [{ ...quickOrderProduct, quantity: quickOrderQty }]);
                setQuickOrderProduct(null);
                setAppliedReferralCode('');
                setReferralInput('');
                setQuickOrderQty(1);
                setTrackingStatus('Pendente');
                setTrackingDriver(null);
                setTrackingTimeLeft(4 * 3600);
                setTrackingOrder(order);
            }
        } catch (error) {
            console.error('Failed to submit quick order', error);
            setQuickOrderProduct(null);
            setQuickOrderQty(1);
            setTrackingOrder({ id: 'Offline', created_at: new Date().toISOString() });
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
        if (error) {
            let msg = error.message;
            if (msg.includes("Email not confirmed")) {
                msg = "A sua conta não foi confirmada. Verifique se o Supabase exige confirmação.";
            }
            setLoginError(msg);
        } else {
            setIsAuthOpen(false);
            setLoginPassword('');
            showToastMessage('Sessão iniciada com sucesso!');
        }
        setLoginLoading(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegError('');
        setRegLoading(true);
        const { error } = await supabase.auth.signUp({
            email: regEmail,
            password: regPassword,
            options: {
                data: { full_name: regName, phone: regPhone }
            }
        });
        if (error) {
            setRegError(error.message);
        } else {
            setIsAuthOpen(false);
            setRegName('');
            setRegPhone('');
            setRegEmail('');
            setRegPassword('');
            showToastMessage('Conta criada com sucesso!');
        }
        setRegLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        showToastMessage('Sessão terminada.');
        setCheckoutForm(prev => ({ ...prev, name: '', phone: '' }));
        setQuickOrderForm(prev => ({ ...prev, name: '', phone: '' }));
    };

    const fetchMyOrders = async () => {
        setLoadingOrders(true);
        setIsMeusPedidosOpen(true);
        let history = [];
        if (currentUser) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/user/${currentUser.id}`);
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
        if (history.length === 0) {
            const localHistory = localStorage.getItem('tchapoOrderHistory');
            history = localHistory ? JSON.parse(localHistory) : [];
        }
        setMyOrders(history);
        setLoadingOrders(false);

        // Fetch live statuses
        for (const order of history) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${order.id}`);
                if (res.ok) {
                    const liveOrder = await res.json();
                    setMyOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: liveOrder.status } : o));
                }
            } catch (e) {}
        }
    };

    const formatCurrency = (val) => {
        return Number(val).toLocaleString('pt-MZ') + ' MT';
    };

    const formatTimeLeft = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const openQuickOrder = (prod) => {
        setQuickOrderProduct(prod);
        setQuickOrderQty(1);
    };

    const contactDriver = () => {
        if (!trackingDriver) return;
        let cleanedPhone = trackingDriver.phone.replace(/\s+/g, '').replace('+', '');
        if (!cleanedPhone.startsWith('258') && cleanedPhone.length === 9) {
            cleanedPhone = '258' + cleanedPhone;
        }
        window.open(`https://wa.me/${cleanedPhone}?text=Olá,%20gostaria%20de%20saber%20o%20ponto%20de%20situação%20da%20minha%20entrega.`, '_blank');
    };

    const activeSelectedProduct = selectedProduct
        ? products.find(p => p.id === selectedProduct.id) || selectedProduct
        : null;

    const activeQuickOrderProduct = quickOrderProduct
        ? products.find(p => p.id === quickOrderProduct.id) || quickOrderProduct
        : null;

    const filteredProducts = activeCategory === 'Todos'
        ? products
        : products.filter(p => p.category === activeCategory);

    const totalItemsInCart = cart.reduce((a, b) => a + b.quantity, 0);
    const cartItemsTotal = cart.reduce((sum, item) => {
        const baseId = typeof item.id === 'string' && item.id.includes('-') ? Number(item.id.split('-')[0]) : item.id;
        const liveItem = products.find(p => p.id === baseId);
        const price = liveItem ? liveItem.price : item.price;
        return sum + (price * item.quantity);
    }, 0);
    const cartShippingFee = checkoutForm.time.startsWith('Imediato') ? 200 : 0;
    const cartReferralDiscount = appliedReferralCode ? (cartItemsTotal * 0.1) : 0;
    const cartTotal = cartItemsTotal - cartReferralDiscount + cartShippingFee;

    const quickOrderItemsTotal = (activeQuickOrderProduct ? activeQuickOrderProduct.price : 0) * quickOrderQty;
    const quickOrderShippingFee = quickOrderForm.time.startsWith('Imediato') ? 200 : 0;
    const quickOrderReferralDiscount = appliedReferralCode ? (quickOrderItemsTotal * 0.1) : 0;
    const quickOrderTotal = quickOrderItemsTotal - quickOrderReferralDiscount + quickOrderShippingFee;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <header className="navbar">
                <div className="nav-container">
                    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="logo-icon">⚡</span>
                        <span>Tchapo Tchapo</span>
                        <span className="delivery-badge" style={{ marginLeft: '0.5rem' }}>4 Horas Beira</span>
                    </div>
                    <div className="nav-right">
                        <div className="auth-menu">
                            {!currentUser ? (
                                <button className="btn-auth" onClick={() => { setAuthTab('login'); setIsAuthOpen(true); }}>👤 Entrar</button>
                            ) : (
                                <div className="auth-user-dropdown" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span id="auth-user-name"><span className="welcome-text">Olá, </span>{currentUser.user_metadata?.full_name?.split(' ')[0] || currentUser.email.split('@')[0]}</span>
                                    <button className="btn-logout" onClick={handleLogout} title="Sair da conta">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        {currentUser && (
                            <button className="btn-referrals" onClick={handleOpenReferrals} style={{ backgroundColor: '#f97316', color: '#fff', marginRight: '0.5rem' }}>
                                🎁 <span className="nav-btn-text">Indique e Ganha</span>
                            </button>
                        )}
                        <button className="btn-meus-pedidos" onClick={fetchMyOrders}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                            <span className="nav-btn-text">Os Meus Pedidos</span>
                        </button>
                        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            <span className="cart-count">{totalItemsInCart}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                {/* Hero Banner */}
                <section className="hero" style={{ margin: '1.5rem auto', maxWidth: '1200px', width: 'calc(100% - 3rem)' }}>
                    <div className="hero-content">
                        <h1>Tudo o que precisas, entregue em 4 horas.</h1>
                        <p>Tecnologia, gadgets e acessórios com pagamento na entrega. Rápido, seguro e exclusivo para a cidade da Beira, Sofala.</p>
                        <a href="#catalog" className="btn-primary">Ver Produtos</a>
                    </div>
                </section>

                {/* Catalog Container */}
                <section id="catalog" className="products">
                    {/* Category tabs */}
                    <div className="category-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`cat-tab ${cat === activeCategory ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {getCategoryIcon(cat)} {cat}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {filteredProducts.map(prod => (
                            <div key={prod.id} className="product-card">
                                <div className="product-image-container" onClick={() => { setSelectedProduct(prod); trackProductClick(prod.id); }}>
                                    <img src={prod.image} alt={prod.name} className="product-img" />
                                </div>
                                <div className="product-category-tag">{getCategoryIcon(prod.category)} {prod.category}</div>
                                <h3 className="product-title" onClick={() => { setSelectedProduct(prod); trackProductClick(prod.id); }}>{prod.name}</h3>
                                <p className="product-desc">{prod.desc || ''}</p>
                                <div className="product-price">{formatCurrency(prod.price)}</div>
                                <div className="product-actions">
                                    <button className="btn-add-to-cart" onClick={() => { (getDeviceSelectionType(prod) !== 'none' || getColorSelectionType(prod) !== 'none') ? setSelectedProduct(prod) : addToCart(prod); trackProductClick(prod.id); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                        Carrinho
                                    </button>
                                    <button className="btn-buy-now" onClick={() => { openQuickOrder(prod); trackProductClick(prod.id); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                        Pedir Agora
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="faq-section" style={{ padding: '4rem 1.5rem', background: '#fff' }}>
                    <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Perguntas Frequentes (FAQ)</h2>
                        <div className="faq-item" style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
                            <details style={{ cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 600, fontSize: '1.1rem' }}>Como funciona o pagamento?</summary>
                                <p style={{ color: '#6b7280', marginTop: '0.5rem', paddingLeft: '1rem' }}>O pagamento é feito exclusivamente no momento da entrega! Podes pagar em Dinheiro, M-Pesa, eMola ou Cartão (POS).</p>
                            </details>
                        </div>
                        <div className="faq-item" style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
                            <details style={{ cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 600, fontSize: '1.1rem' }}>Quanto tempo demora a entrega?</summary>
                                <p style={{ color: '#6b7280', marginTop: '0.5rem', paddingLeft: '1rem' }}>Garantimos a entrega num prazo máximo de 4 horas dentro da cidade da Beira, ou em até 2 horas se escolheres o envio Imediato urgente.</p>
                            </details>
                        </div>
                        <div className="faq-item" style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
                            <details style={{ cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 600, fontSize: '1.1rem' }}>Posso cancelar ou devolver o pedido?</summary>
                                <p style={{ color: '#6b7280', marginTop: '0.5rem', paddingLeft: '1rem' }}>Podes cancelar antes de o pedido sair para entrega. Se houver algum defeito de fábrica, cobrimos a garantia num prazo estipulado por produto.</p>
                            </details>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="main-footer" style={{ textAlign: 'center', padding: '2rem', background: '#111827', color: '#fff' }}>
                <p>&copy; 2026 Tchapo Tchapo. Todos os direitos reservados.</p>
            </footer>

            {/* Product Detail Modal */}
            {activeSelectedProduct && (
                <>
                    <div className="modal-overlay active" onClick={() => setSelectedProduct(null)}></div>
                    <div className="product-modal active">
                        <button className="close-modal" onClick={() => setSelectedProduct(null)}>&times;</button>
                        <div className="product-modal-content">
                            <div className="pm-image">
                                <img src={activeSelectedProduct.image} alt={activeSelectedProduct.name} />
                            </div>
                            <div className="pm-info">
                                <div className="product-category-tag" style={{ marginBottom: '1rem' }}>
                                    {getCategoryIcon(activeSelectedProduct.category)} {activeSelectedProduct.category}
                                </div>
                                <h2 className="pm-title">{activeSelectedProduct.name}</h2>
                                <div className="pm-price">{formatCurrency(activeSelectedProduct.price)}</div>
                                <p className="pm-desc">{activeSelectedProduct.desc}</p>
                                <ul className="pm-features" style={{ paddingLeft: '1rem', listStyleType: 'disc' }}>
                                    {activeSelectedProduct.features && activeSelectedProduct.features
                                        .filter(feat => !feat.startsWith('_'))
                                        .map((feat, index) => (
                                            <li key={index} style={{ marginBottom: '0.5rem', color: '#374151' }}>{feat}</li>
                                        ))
                                    }
                                </ul>

                                {(() => {
                                    const devSelType = getDeviceSelectionType(activeSelectedProduct);
                                    const colorSelType = getColorSelectionType(activeSelectedProduct);
                                    if (devSelType === 'none' && colorSelType === 'none') return null;
                                    return (
                                        <div className="product-options" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                            {devSelType !== 'none' && (
                                                <>
                                                    {(devSelType === 'iphone' || devSelType === 'iphone_outro') && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
                                                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4b5563' }}>Selecione o Dispositivo:</label>
                                                            <select 
                                                                value={selectedDevice}
                                                                onChange={(e) => setSelectedDevice(e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.75rem',
                                                                    border: '1.5px solid var(--gray-light)',
                                                                    borderRadius: '10px',
                                                                    fontFamily: 'inherit',
                                                                    fontSize: '0.95rem',
                                                                    outline: 'none',
                                                                    backgroundColor: '#fff'
                                                                }}
                                                            >
                                                                {DEVICE_OPTIONS.map(dev => (
                                                                    <option key={dev} value={dev}>{dev}</option>
                                                                ))}
                                                                {devSelType === 'iphone_outro' && (
                                                                    <option value="outro">Outro (Digitar...)</option>
                                                                )}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {(devSelType === 'outro' || (devSelType === 'iphone_outro' && selectedDevice === 'outro')) && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
                                                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4b5563' }}>Escreva o Dispositivo:</label>
                                                            <input 
                                                                type="text"
                                                                value={customDevice}
                                                                onChange={(e) => setCustomDevice(e.target.value)}
                                                                placeholder="Ex: Xiaomi Poco X3, Galaxy S24, etc."
                                                                required
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.75rem',
                                                                    border: '1.5px solid var(--gray-light)',
                                                                    borderRadius: '10px',
                                                                    fontFamily: 'inherit',
                                                                    fontSize: '0.95rem',
                                                                    outline: 'none',
                                                                    backgroundColor: '#fff',
                                                                    boxSizing: 'border-box'
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {colorSelType !== 'none' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
                                                    <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4b5563' }}>Cor:</label>
                                                    <select 
                                                        value={selectedColor}
                                                        onChange={(e) => setSelectedColor(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.75rem',
                                                            border: '1.5px solid var(--gray-light)',
                                                            borderRadius: '10px',
                                                            fontFamily: 'inherit',
                                                            fontSize: '0.95rem',
                                                            outline: 'none',
                                                            backgroundColor: '#fff'
                                                        }}
                                                    >
                                                        {COLOR_OPTIONS.map(col => (
                                                            <option key={col} value={col}>{col}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                    <button className="btn-add-cart" style={{ flex: 1 }} onClick={() => { if (addToCart(activeSelectedProduct)) setSelectedProduct(null); }}>
                                        Adicionar ao Carrinho
                                    </button>
                                    <button className="btn-buy-now-modal" style={{ flex: 1 }} onClick={() => { openQuickOrder(activeSelectedProduct); setSelectedProduct(null); }}>
                                        Pedir Agora
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Cart Sidebar */}
            <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}></div>
            <div className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
                <div className="cart-header">
                    <h2>Seu Carrinho</h2>
                    <button className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</button>
                </div>
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart-msg">Seu carrinho está vazio.</div>
                    ) : (
                        cart.map(item => {
                            const baseId = typeof item.id === 'string' && item.id.includes('-') ? Number(item.id.split('-')[0]) : item.id;
                            const liveItem = products.find(p => p.id === baseId);
                            const price = liveItem ? liveItem.price : item.price;
                            const image = liveItem ? liveItem.image : item.image;
                            const name = item.name;
                            return (
                                <div key={item.id} className="cart-item">
                                    <img src={image} alt={name} />
                                    <div className="cart-item-info">
                                        <div className="cart-item-title">{name}</div>
                                        <div className="cart-item-price">{formatCurrency(price)}</div>
                                        <div className="qty-controls">
                                            <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remover</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total" style={{ flexDirection: 'column', gap: '0.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span>Subtotal:</span>
                                <span>{formatCurrency(cartItemsTotal)}</span>
                            </div>
                            {appliedReferralCode && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: '#10b981', fontWeight: 'bold' }}>
                                    <span>Desconto Indicação (10%):</span>
                                    <span>-{formatCurrency(cartReferralDiscount)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid #374151', paddingTop: '0.25rem', marginTop: '0.25rem', fontWeight: 'bold' }}>
                                <span>Total:</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            {checkoutForm.time.startsWith('Imediato') && (
                                <span style={{ fontSize: '0.8rem', color: '#10b981', alignSelf: 'flex-end', fontWeight: 'normal' }}>(inclui +200 MT taxa urgente)</span>
                            )}
                        </div>

                        <form className="checkout-form" onSubmit={handleCheckoutSubmit} style={{ display: 'flex' }}>
                            <h3>Detalhes de Entrega (Beira)</h3>
                            <input
                                type="text"
                                placeholder="Seu Nome Completo"
                                value={checkoutForm.name}
                                required
                                onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Número de Telefone"
                                value={checkoutForm.phone}
                                required
                                pattern="[0-9\s+\-()]{8,15}"
                                onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                            />
                            <select
                                value={checkoutForm.bairro}
                                required
                                onChange={e => setCheckoutForm({ ...checkoutForm, bairro: e.target.value })}
                            >
                                <option value="" disabled>Selecione o Bairro...</option>
                                {['Macuti', 'Ponta Gêa', 'Maquinino', 'Pioneiros', 'Chota', 'Estoril', 'Palmeiras', 'Munhava', 'Manga', 'Inhamizua', 'Matacuane', 'Macurungo'].map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Morada e Referência detalhado"
                                value={checkoutForm.address}
                                required
                                onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                            />
                            <select
                                value={checkoutForm.time}
                                required
                                onChange={e => setCheckoutForm({ ...checkoutForm, time: e.target.value })}
                            >
                                <option value="" disabled>Horário de Entrega...</option>
                                <option value="Imediato (Até 2h) (+200 MT)">⚡ Imediato (Até 2h) (+200 MT)</option>
                                <option value="Das 08:00 às 12:00">Das 08:00 às 12:00</option>
                                <option value="Das 12:00 às 16:00">Das 12:00 às 16:00</option>
                                <option value="Das 16:00 às 20:00">Das 16:00 às 20:00</option>
                            </select>
                            <select
                                value={checkoutForm.payment}
                                required
                                onChange={e => setCheckoutForm({ ...checkoutForm, payment: e.target.value })}
                            >
                                <option value="" disabled>Método de Pagamento...</option>
                                <option value="M-Pesa">M-Pesa</option>
                                <option value="eMola">eMola</option>
                                <option value="Cartão (POS)">Cartão (Máquina POS)</option>
                                <option value="Dinheiro Físico">Dinheiro Físico</option>
                            </select>

                            <div className="referral-input-container" style={{ display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Código de Indicação"
                                    value={referralInput}
                                    onChange={e => setReferralInput(e.target.value)}
                                    disabled={!!appliedReferralCode}
                                    style={{ flex: 1, textTransform: 'uppercase', padding: '0.5rem', background: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff' }}
                                />
                                {appliedReferralCode ? (
                                    <button
                                        type="button"
                                        onClick={handleRemoveReferral}
                                        style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                                    >
                                        Remover
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleValidateReferral}
                                        disabled={validatingReferral || !referralInput.trim()}
                                        style={{ backgroundColor: '#eab308', color: '#000', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        {validatingReferral ? '...' : 'Aplicar'}
                                    </button>
                                )}
                            </div>
                            {referralError && (
                                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.25rem', marginBottom: '0.5rem', display: 'block', width: '100%' }}>{referralError}</span>
                            )}
                            {appliedReferralCode && (
                                <span style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '-0.25rem', marginBottom: '0.5rem', display: 'block', fontWeight: 'bold', width: '100%' }}>
                                    ✓ Código '{appliedReferralCode}' aplicado!
                                </span>
                            )}

                            <button type="submit" className="btn-checkout" id="btn-checkout">
                                Finalizar Pedido
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Quick Order Modal */}
            {activeQuickOrderProduct && (
                <>
                    <div className="modal-overlay active" onClick={() => setQuickOrderProduct(null)}></div>
                    <div className="product-modal active">
                        <button className="close-modal" onClick={() => setQuickOrderProduct(null)}>&times;</button>
                        <div className="product-modal-content">
                            <div className="pm-image" style={{ flex: '1 1 250px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                <img src={activeQuickOrderProduct.image} alt={activeQuickOrderProduct.name} style={{ maxHeight: '180px' }} />
                                <h3>{activeQuickOrderProduct.name}</h3>
                                {(activeQuickOrderProduct.id === 13 || activeQuickOrderProduct.name?.includes("Capas de Silicone")) && (
                                    <button type="button" onClick={() => {}} style={{ display: 'none' }}></button>
                                )}
                                {(() => {
                                    const devSelType = getDeviceSelectionType(activeQuickOrderProduct);
                                    const colorSelType = getColorSelectionType(activeQuickOrderProduct);
                                    if (devSelType === 'none' && colorSelType === 'none') return null;
                                    return (
                                        <div className="product-options" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {(devSelType === 'iphone' || devSelType === 'iphone_outro') && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
                                                    <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#4b5563', textAlign: 'left' }}>Dispositivo:</label>
                                                    <select 
                                                        value={selectedDevice}
                                                        onChange={(e) => setSelectedDevice(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            border: '1.5px solid var(--gray-light)',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            outline: 'none',
                                                            backgroundColor: '#fff'
                                                        }}
                                                    >
                                                        {DEVICE_OPTIONS.map(dev => (
                                                            <option key={dev} value={dev}>{dev}</option>
                                                        ))}
                                                        {devSelType === 'iphone_outro' && (
                                                            <option value="outro">Outro (Digitar...)</option>
                                                        )}
                                                    </select>
                                                </div>
                                            )}

                                            {(devSelType === 'outro' || (devSelType === 'iphone_outro' && selectedDevice === 'outro')) && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
                                                    <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#4b5563', textAlign: 'left' }}>Escreva o Dispositivo:</label>
                                                    <input 
                                                        type="text"
                                                        value={customDevice}
                                                        onChange={(e) => setCustomDevice(e.target.value)}
                                                        placeholder="Ex: Xiaomi Poco X3, Galaxy S24, etc."
                                                        required
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            border: '1.5px solid var(--gray-light)',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            outline: 'none',
                                                            backgroundColor: '#fff',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {getColorSelectionType(activeQuickOrderProduct) !== 'none' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
                                                    <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#4b5563', textAlign: 'left' }}>Cor:</label>
                                                    <select 
                                                        value={selectedColor}
                                                        onChange={(e) => setSelectedColor(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            border: '1.5px solid var(--gray-light)',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            outline: 'none',
                                                            backgroundColor: '#fff'
                                                        }}
                                                    >
                                                        {COLOR_OPTIONS.map(col => (
                                                            <option key={col} value={col}>{col}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {appliedReferralCode && (
                                        <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold' }}>
                                            Desconto: -{formatCurrency(quickOrderReferralDiscount)}
                                        </span>
                                    )}
                                    <span>{formatCurrency(quickOrderTotal)}</span>
                                    {quickOrderForm.time.startsWith('Imediato') && (
                                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'normal' }}>(inclui +200 MT taxa urgente)</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                    <span>Quantidade:</span>
                                    <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
                                        <button type="button" onClick={() => setQuickOrderQty(prev => Math.max(1, prev - 1))} style={{ padding: '0.3rem 0.6rem', border: 'none', background: '#e5e7eb', cursor: 'pointer' }}>-</button>
                                        <span style={{ padding: '0.3rem 0.8rem', fontWeight: 600 }}>{quickOrderQty}</span>
                                        <button type="button" onClick={() => setQuickOrderQty(prev => prev + 1)} style={{ padding: '0.3rem 0.6rem', border: 'none', background: '#e5e7eb', cursor: 'pointer' }}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="pm-info" style={{ flex: '1 1 300px', padding: '1.5rem 2.5rem' }}>
                                <h3>📋 Detalhes de Entrega</h3>
                                <form onSubmit={handleQuickOrderSubmit} className="checkout-form" style={{ display: 'flex', marginTop: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Seu Nome Completo"
                                        value={quickOrderForm.name}
                                        required
                                        onChange={e => setQuickOrderForm({ ...quickOrderForm, name: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Número de Telefone"
                                        value={quickOrderForm.phone}
                                        required
                                        pattern="[0-9\s+\-()]{8,15}"
                                        onChange={e => setQuickOrderForm({ ...quickOrderForm, phone: e.target.value })}
                                    />
                                    <select
                                        value={quickOrderForm.bairro}
                                        required
                                        onChange={e => setQuickOrderForm({ ...quickOrderForm, bairro: e.target.value })}
                                    >
                                        <option value="" disabled>Selecione o Bairro...</option>
                                        {['Macuti', 'Ponta Gêa', 'Maquinino', 'Pioneiros', 'Chota', 'Estoril', 'Palmeiras', 'Munhava', 'Manga', 'Inhamizua', 'Matacuane', 'Macurungo'].map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Morada e Referência"
                                        value={quickOrderForm.address}
                                        required
                                        onChange={e => setQuickOrderForm({ ...quickOrderForm, address: e.target.value })}
                                    />
                                    <select
                                        value={quickOrderForm.time}
                                        required
                                        onChange={e => setQuickOrderForm({ ...quickOrderForm, time: e.target.value })}
                                    >
                                        <option value="" disabled>Horário de Entrega...</option>
                                        <option value="Imediato (Até 2h) (+200 MT)">⚡ Imediato (Até 2h) (+200 MT)</option>
                                        <option value="Das 08:00 às 12:00">Das 08:00 às 12:00</option>
                                        <option value="Das 12:00 às 16:00">Das 12:00 às 16:00</option>
                                        <option value="Das 16:00 às 20:00">Das 16:00 às 20:00</option>
                                    </select>
                                    <select
                                        value={quickOrderForm.payment}
                                        required
                                        onChange={e => setQuickOrderForm({ ...quickOrderForm, payment: e.target.value })}
                                    >
                                        <option value="" disabled>Método de Pagamento...</option>
                                        <option value="M-Pesa">M-Pesa</option>
                                        <option value="eMola">eMola</option>
                                        <option value="Cartão (POS)">Cartão (Máquina POS)</option>
                                        <option value="Dinheiro Físico">Dinheiro Físico</option>
                                    </select>

                                    <div className="referral-input-container" style={{ display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Código de Indicação"
                                            value={referralInput}
                                            onChange={e => setReferralInput(e.target.value)}
                                            disabled={!!appliedReferralCode}
                                            style={{ flex: 1, textTransform: 'uppercase', padding: '0.5rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', color: '#000' }}
                                        />
                                        {appliedReferralCode ? (
                                            <button
                                                type="button"
                                                onClick={handleRemoveReferral}
                                                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                                            >
                                                Remover
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleValidateReferral}
                                                disabled={validatingReferral || !referralInput.trim()}
                                                style={{ backgroundColor: '#eab308', color: '#000', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                {validatingReferral ? '...' : 'Aplicar'}
                                            </button>
                                        )}
                                    </div>
                                    {referralError && (
                                        <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.25rem', marginBottom: '0.5rem', display: 'block', width: '100%' }}>{referralError}</span>
                                    )}
                                    {appliedReferralCode && (
                                        <span style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '-0.25rem', marginBottom: '0.5rem', display: 'block', fontWeight: 'bold', width: '100%' }}>
                                            ✓ Código '{appliedReferralCode}' aplicado!
                                        </span>
                                    )}

                                    <button type="submit" className="btn-checkout">
                                        Confirmar Pedido
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Meus Pedidos Modal */}
            {isMeusPedidosOpen && (
                <>
                    <div className="modal-overlay active" onClick={() => setIsMeusPedidosOpen(false)}></div>
                    <div className="product-modal active" style={{ maxWidth: '700px' }}>
                        <button className="close-modal" onClick={() => setIsMeusPedidosOpen(false)}>&times;</button>
                        <div style={{ padding: '2rem' }}>
                            <h2 style={{ marginBottom: '0.25rem' }}>📦 Os Meus Pedidos</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>O estado é actualizado automaticamente a partir do servidor.</p>
                            
                            <div className="meus-pedidos-content">
                                {loadingOrders ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>A carregar...</div>
                                ) : myOrders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Ainda não tens pedidos.</p>
                                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Faz o teu primeiro pedido e acompanha aqui!</p>
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {myOrders.map(o => (
                                            <div key={o.id} className="mp-card">
                                                <div className="mp-card-header">
                                                    <div>
                                                        <span className="mp-order-id">#{o.id}</span>
                                                        <span className="mp-customer">{o.customer_name} • {o.bairro}</span>
                                                    </div>
                                                    <span className="mp-status-badge" style={{ background: '#f3f4f6', fontWeight: 700 }}>
                                                        {o.status}
                                                    </span>
                                                </div>
                                                <div className="mp-items">
                                                    {o.items && o.items.map((i, index) => (
                                                        <span key={index} className="mp-item-tag">{i.quantity}× {i.name}</span>
                                                    ))}
                                                </div>
                                                <div className="mp-card-footer">
                                                    <span className="mp-total">{formatCurrency(o.total)}</span>
                                                    <span className="mp-payment">💳 {o.payment}</span>
                                                    <span className="mp-date">{new Date(o.created_at).toLocaleDateString('pt', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                    <button className="mp-track-btn" onClick={() => { setIsMeusPedidosOpen(false); setTrackingStatus(o.status); setTrackingDriver(null); setTrackingTimeLeft(4 * 3600); setTrackingOrder(o); }}>
                                                        Acompanhar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Indique e Ganha Modal */}
            {isReferralOpen && (
                <>
                    <div className="modal-overlay active" onClick={() => setIsReferralOpen(false)}></div>
                    <div className="product-modal active" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', color: '#111827' }}>
                        <button className="close-modal" onClick={() => setIsReferralOpen(false)}>&times;</button>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '3rem' }}>🎁</span>
                                <h2 style={{ marginTop: '0.5rem', color: '#111827' }}>Indique e Ganha</h2>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Compartilhe o seu código e ganhe saldo por cada encomenda dos seus amigos!</p>
                            </div>

                            {referralData ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Código de Indicação Section */}
                                    <div style={{ backgroundColor: '#fff7ed', border: '1px dashed #f97316', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#ea580c', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>O SEU CÓDIGO DE INDICAÇÃO:</span>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ea580c', letterSpacing: '2px' }}>{referralData.code}</span>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(referralData.code);
                                                    showToastMessage('Código copiado!');
                                                }}
                                                style={{ backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                                            >
                                                Copiar
                                            </button>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Dá 10% de desconto aos teus amigos. Ganhas até 1000 meticais por indicação</p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                                        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Saldo Disponível</span>
                                            <strong style={{ fontSize: '1.2rem', color: '#111827' }}>{formatCurrency(referralData.balance)}</strong>
                                        </div>
                                        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Total Ganho</span>
                                            <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>{formatCurrency(referralData.total_earned)}</strong>
                                        </div>
                                        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '0.75rem', border: '1px solid #e5e7eb' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Total Sacado</span>
                                            <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>{formatCurrency(referralData.total_withdrawn)}</strong>
                                        </div>
                                    </div>

                                    {/* Payout Form */}
                                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>💸 Reivindicar Dinheiro (Saque)</h3>
                                        <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <select
                                                        value={withdrawMethod}
                                                        onChange={e => setWithdrawMethod(e.target.value)}
                                                        style={{ flex: 1, padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', color: '#000' }}
                                                    >
                                                        <option value="M-Pesa">M-Pesa</option>
                                                        <option value="eMola">eMola</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        placeholder="Valor (mín. 50 MT)"
                                                        value={withdrawAmount}
                                                        onChange={e => setWithdrawAmount(e.target.value)}
                                                        min="50"
                                                        step="any"
                                                        required
                                                        style={{ flex: 1, padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', color: '#000' }}
                                                    />
                                                </div>
                                                <input
                                                    type="tel"
                                                    placeholder={`Nº de Telefone ${withdrawMethod} para Saque`}
                                                    value={withdrawPhone}
                                                    onChange={e => setWithdrawPhone(e.target.value)}
                                                    required
                                                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', color: '#000', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            {withdrawError && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{withdrawError}</div>}
                                            {withdrawSuccess && <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>{withdrawSuccess}</div>}
                                            <button 
                                                type="submit" 
                                                disabled={withdrawLoading || Number(referralData.balance) < 50}
                                                style={{ backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                {withdrawLoading ? 'A processar...' : `Solicitar Saque (${withdrawMethod})`}
                                            </button>
                                            {Number(referralData.balance) < 50 && (
                                                <span style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>O saque mínimo é de 50 MT. Saldo atual: {formatCurrency(referralData.balance)}</span>
                                            )}
                                        </form>
                                    </div>

                                    {/* History Tabs (Txs and Withdrawals) */}
                                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                                            <h4 style={{ fontSize: '0.9rem', color: '#111827', margin: 0 }}>Histórico de Indicações ({referralTxs.length})</h4>
                                        </div>

                                        {referralTxs.length === 0 ? (
                                            <p style={{ color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>Nenhuma indicação registada ainda. Comece a partilhar!</p>
                                        ) : (
                                            <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {referralTxs.map(tx => (
                                                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}>
                                                        <div>
                                                            <strong style={{ display: 'block', color: '#374151' }}>Amigo: {tx.buyer_name || 'Comprador'}</strong>
                                                            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Encomenda #{tx.order_id} • {new Date(tx.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <span style={{ color: '#10b981', fontWeight: 'bold', alignSelf: 'center' }}>+{formatCurrency(tx.amount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <h4 style={{ fontSize: '0.9rem', color: '#111827', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Histórico de Saques</h4>
                                        {referralWithdrawalsList.length === 0 ? (
                                            <p style={{ color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>Nenhum saque solicitado ainda.</p>
                                        ) : (
                                            <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {referralWithdrawalsList.map(w => (
                                                    <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}>
                                                        <div>
                                                            <strong style={{ display: 'block', color: '#374151' }}>Saque via {w.payment_method || 'M-Pesa'} ({w.payment_phone})</strong>
                                                            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{new Date(w.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                                                            <strong style={{ display: 'block', color: '#ef4444' }}>-{formatCurrency(w.amount)}</strong>
                                                            <span style={{ 
                                                                fontSize: '0.7rem', 
                                                                color: w.status === 'Pago' ? '#10b981' : (w.status === 'Cancelado' ? '#ef4444' : '#f59e0b'), 
                                                                fontWeight: 'bold' 
                                                            }}>
                                                                {w.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Carregando dados de indicação...</div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Tracking Overlay */}
            {trackingOrder && (
                <div className="tracking-overlay active">
                    <div className="tracking-modal">
                        <div className="tracking-header">
                            <button className="btn-back-tracking" onClick={() => setTrackingOrder(null)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                Voltar à Loja
                            </button>
                            <div>
                                <h2>Acompanhar Pedido</h2>
                                <p id="tracking-order-id">Pedido #{trackingOrder.id}</p>
                            </div>
                        </div>

                        <div className="tracking-timer">
                            <p>Tempo estimado para entrega:</p>
                            <div className="timer-display" style={{ color: trackingStatus === 'Cancelado' ? '#ef4444' : trackingStatus === 'Entregue' ? '#10b981' : 'var(--primary)' }}>
                                {trackingStatus === 'Cancelado' ? '❌ CANCELADO' : trackingStatus === 'Entregue' ? '✅ ENTREGUE!' : formatTimeLeft(trackingTimeLeft)}
                            </div>
                        </div>

                        <div className="tracking-progress" style={{ display: trackingStatus === 'Cancelado' ? 'none' : 'flex' }}>
                            <div className="progress-line"></div>
                            {['Processando', 'Preparando', 'Com Motorista', 'Entregue'].map((step, idx) => {
                                const stepNum = idx + 1;
                                const currentStepNum = STATUS_STEPS[trackingStatus] || 1;
                                const isActive = stepNum === currentStepNum;
                                const isCompleted = stepNum < currentStepNum || trackingStatus === 'Entregue';
                                return (
                                    <div key={step} className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                        <div className="step-icon">
                                            {stepNum === 1 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>}
                                            {stepNum === 2 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>}
                                            {stepNum === 3 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6H9" /><path d="M9 17.5H1V12l8-8h10l2 5v9h-2" /></svg>}
                                            {stepNum === 4 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                        </div>
                                        <p>{step}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {trackingDriver && trackingStatus !== 'Entregue' && trackingStatus !== 'Cancelado' && (
                            <div className="driver-profile" style={{ display: 'flex' }}>
                                <img src={trackingDriver.photo_url || 'assets/driver_avatar_1777767776730.png'} alt="Motorista" className="driver-img" />
                                <div className="driver-info" style={{ textAlign: 'left' }}>
                                    <h4>{trackingDriver.name}</h4>
                                    <p className="driver-rating">⭐ Motorista Associado</p>
                                    <p className="driver-vehicle">Telefone: {trackingDriver.phone}</p>
                                </div>
                                <button className="btn-whatsapp-driver" onClick={contactDriver}>WhatsApp</button>
                            </div>
                        )}

                        <div className="tracking-actions">
                            <div className="live-indicator">
                                <span className="live-dot"></span> A actualizar em tempo real...
                            </div>
                            <button className="btn-secondary" onClick={() => setTrackingOrder(null)}>Fechar e Voltar à Loja</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            {isAuthOpen && (
                <>
                    <div className="modal-overlay active" onClick={() => setIsAuthOpen(false)}></div>
                    <div className="modal auth-modal active">
                        <button className="close-modal" onClick={() => setIsAuthOpen(false)}>×</button>
                        
                        <div className="auth-tabs">
                            <button className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => setAuthTab('login')}>Entrar</button>
                            <button className={`auth-tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => setAuthTab('register')}>Criar Conta</button>
                        </div>

                        {authTab === 'login' ? (
                            <form className="auth-form active" onSubmit={handleLoginSubmit}>
                                <h3>Bem-vindo de volta!</h3>
                                <p>Faça login para encomendas rápidas.</p>
                                <input type="email" placeholder="Email" value={loginEmail} required onChange={e => setLoginEmail(e.target.value)} />
                                <input type="password" placeholder="Palavra-passe" value={loginPassword} required onChange={e => setLoginPassword(e.target.value)} />
                                {loginError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{loginError}</div>}
                                <button type="submit" className="btn-primary" disabled={loginLoading}>
                                    {loginLoading ? 'A entrar...' : 'Entrar na Loja'}
                                </button>
                            </form>
                        ) : (
                            <form className="auth-form active" onSubmit={handleRegisterSubmit}>
                                <h3>Nova Conta</h3>
                                <p>Guarde os seus dados para futuras compras.</p>
                                <input type="text" placeholder="Nome Completo" value={regName} required onChange={e => setRegName(e.target.value)} />
                                <input type="tel" placeholder="Telefone" value={regPhone} required pattern="[0-9\s+\-()]{8,15}" onChange={e => setRegPhone(e.target.value)} />
                                <input type="email" placeholder="Email" value={regEmail} required onChange={e => setRegEmail(e.target.value)} />
                                <input type="password" placeholder="Palavra-passe (mín. 6 caracteres)" minLength={6} value={regPassword} required onChange={e => setRegPassword(e.target.value)} />
                                {regError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{regError}</div>}
                                <button type="submit" className="btn-primary" disabled={regLoading}>
                                    {regLoading ? 'A criar...' : 'Criar Conta'}
                                </button>
                            </form>
                        )}
                    </div>
                </>
            )}

            {/* Promo Modals */}
            {activePromo === 'delivery_payment' && (
                <>
                    <div className="modal-overlay active" onClick={() => setActivePromo('delivery')}></div>
                    <div className="promo-modal active">
                        <button className="promo-close-btn" onClick={() => setActivePromo('delivery')}>×</button>
                        <img src="/assets/delivery_payment_promo.jpg" alt="Pague ao receber na sua casa" />
                    </div>
                </>
            )}

            {activePromo === 'delivery' && (
                <>
                    <div className="modal-overlay active" onClick={() => setActivePromo('referral')}></div>
                    <div className="promo-modal active">
                        <button className="promo-close-btn" onClick={() => setActivePromo('referral')}>×</button>
                        <img src="/assets/delivery_promo.jpg" alt="Entrega Rápida" />
                    </div>
                </>
            )}

            {activePromo === 'referral' && (
                <>
                    <div className="modal-overlay active" onClick={() => setActivePromo(null)}></div>
                    <div className="promo-modal active">
                        <button className="promo-close-btn" onClick={() => setActivePromo(null)}>×</button>
                        <img src="/assets/referral_promo.jpg" alt="Promoção Indica e Ganha" />
                    </div>
                </>
            )}

            {/* Floating WhatsApp Support Button */}
            <a href="https://wa.me/258855737578" className="whatsapp-float" target="_blank" rel="noopener noreferrer" title="Suporte no WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '35px', height: '35px' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            {/* Toast notification */}
            {toastMessage && (
                <div className="toast show">{toastMessage}</div>
            )}
        </div>
    );
}
