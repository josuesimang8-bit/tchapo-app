import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MZ_PROVINCES, ALL_PROVINCES, DEFAULT_PROVINCE, getBairrosByProvince } from '../data/mozambiqueLocations';

// Modern SVG Icons (No Emojis)
const Icons = {
    Car: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
        </svg>
    ),
    Truck: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
        </svg>
    ),
    UploadCloud: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
            <path d="M12 12v9"/>
            <path d="m16 16-4-4-4 4"/>
        </svg>
    ),
    Lock: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    ),
    IdCard: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <circle cx="8" cy="12" r="2"/>
            <path d="M14 10h4"/>
            <path d="M14 14h4"/>
        </svg>
    ),
    ChevronRight: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
        </svg>
    ),
    ChevronLeft: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
        </svg>
    ),
    Trash: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
    ),

    LogoBadge: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
    ),
    Bike: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="15" cy="5" r="1"/>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
        </svg>
    ),
    ShirtReward: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
        </svg>
    ),
    Helmet: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 14a8 8 0 0 1 16 0v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z"/>
            <path d="M4 14h16"/>
            <path d="M12 6v4"/>
        </svg>
    ),
    Plaque: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <path d="M8 7h8"/>
            <path d="M8 11h8"/>
            <path d="M10 15h4"/>
            <circle cx="12" cy="12" r="1"/>
        </svg>
    ),
    BadgeCheck: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/>
            <path d="m9 12 2 2 4-4"/>
        </svg>
    ),
    Gift: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="4" rx="1"/>
            <path d="M12 8v13"/>
            <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
            <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
        </svg>
    ),
    Navigation: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
    ),
    Trophy: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/>
            <path d="M6 2h12v7a6 6 0 0 1-12 0V2z"/>
        </svg>
    ),
    Wallet: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
        </svg>
    ),
    Package: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55L16.5 14.6a1.78 1.78 0 0 0 0-3.1z"/>
            <path d="m21 16-4-2.3v-3.4l4-2.3z"/>
            <path d="M3.27 6.96 12 12.01l8.73-5.05"/>
            <path d="M12 22.08V12"/>
        </svg>
    ),
    TrendingUp: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
        </svg>
    ),
    AlertTriangle: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
    CheckCircle: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    ),
    Clock: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    ),
    User: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    WhatsApp: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.777.979-.953 1.18-.175.2-.35.225-.651.075-.3-.15-1.267-.467-2.414-1.49-.893-.797-1.496-1.781-1.672-2.082-.175-.3-.019-.462.132-.612.135-.135.301-.35.451-.526.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525s-.676-1.63-.927-2.234c-.244-.588-.493-.508-.676-.518l-.576-.01c-.2 0-.526.075-.801.375-.276.3-1.053 1.03-1.053 2.51 0 1.48 1.078 2.91 1.229 3.11.15.2 2.122 3.24 5.14 4.542.718.31 1.28.495 1.718.634.723.23 1.38.197 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.703.25-1.306.175-1.43-.075-.125-.276-.2-.576-.35zM12.04 2C6.544 2 2.08 6.463 2.08 11.96c0 1.758.459 3.473 1.332 4.987L2 22l5.2-1.364c1.458.795 3.1 1.214 4.84 1.214 5.496 0 9.96-4.463 9.96-9.96S17.536 2 12.04 2zm0 18.232c-1.547 0-3.064-.416-4.388-1.203l-.315-.187-3.257.854.87-3.175-.205-.327a8.212 8.212 0 0 1-1.26-4.304c0-4.548 3.702-8.25 8.25-8.25 4.548 0 8.25 3.702 8.25 8.25 0 4.548-3.702 8.25-8.25 8.25z"/>
        </svg>
    ),
    LogOut: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
    ),
    Plus: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
    LogIn: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
    ),
    ShieldCheck: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
        </svg>
    ),
    MapPin: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>
    ),
    Copy: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
    ),
    Close: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
    Eye: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    ),
    EyeOff: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
            <line x1="2" y1="2" x2="22" y2="22"/>
        </svg>
    )
};

const formatMZCurrency = (value) => {
    try {
        const num = Number(value) || 0;
        return num.toLocaleString('pt-MZ') + ' MT';
    } catch (_) {
        return (value || '0') + ' MT';
    }
};

// Format remaining seconds into HH:MM:SS
const formatTimer = (secs) => {
    if (secs <= 0) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function DriverPortal() {
    const API_URL = import.meta.env.VITE_API_URL || '';

    const resolveImageUrl = (img) => {
        if (!img || typeof img !== 'string') return null;
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img;
        const clean = img.startsWith('/') ? img : '/' + img;
        return API_URL ? `${API_URL}${clean}` : clean;
    };

    const extractOrderLocation = (order) => {
        if (!order) return { province: 'Maputo', bairro: 'Centro' };
        let prov = order.province || '';
        let bai = order.bairro || '';
        
        if (bai && bai.includes('(') && bai.includes(')')) {
            const match = bai.match(/^(.*?)\s*\((.*?)\)$/);
            if (match) {
                bai = match[1].trim();
                if (!prov) prov = match[2].trim();
            }
        }
        
        return {
            province: prov || 'Maputo',
            bairro: bai || 'Centro'
        };
    };

    // Auth & Driver State
    const [authDriver, setAuthDriver] = useState(() => {
        try {
            const saved = localStorage.getItem('tchapo_driver_session');
            return saved ? JSON.parse(saved) : null;
        } catch (_) {
            return null;
        }
    });

    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'rewards' | 'warnings' | 'profile'
    const [ordersSubTab, setOrdersSubTab] = useState('available'); // 'available' | 'active' | 'history'
    const [dashboardData, setDashboardData] = useState(null);
    const [toast, setToast] = useState(null);
    const [acceptingId, setAcceptingId] = useState(null);

    // Modal Controls
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [docPreviewModal, setDocPreviewModal] = useState(null);
    const [confirmingOrder, setConfirmingOrder] = useState(null); // Strict Acceptance Modal

    // Debt Payment State (e-Mola White Screen)
    const [debtPaymentRef, setDebtPaymentRef] = useState('');
    const [debtReceiptFile, setDebtReceiptFile] = useState(null);
    const [debtReceiptPreview, setDebtReceiptPreview] = useState(null);
    const [submittingDebt, setSubmittingDebt] = useState(false);
    const [debtSecondsLeft, setDebtSecondsLeft] = useState(7200);
    const [copiedId, setCopiedId] = useState(false);

    // Login Form State
    const [loginPhone, setLoginPhone] = useState('');
    const [loginPin, setLoginPin] = useState('');
    const [showLoginPin, setShowLoginPin] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Register Form State
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regProvince, setRegProvince] = useState(DEFAULT_PROVINCE);
    const [regBairro, setRegBairro] = useState('Macuti (Beira)');
    const [regDocType, setRegDocType] = useState('BI');
    const [regDocNumber, setRegDocNumber] = useState('');
    const [regPin, setRegPin] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [docPhotoFile, setDocPhotoFile] = useState(null);
    const [docPhotoPreview, setDocPhotoPreview] = useState(null);
    const [regLoading, setRegLoading] = useState(false);
    const [regStep, setRegStep] = useState(1); // 1: Perfil & Contacto | 2: Veículo & Documentos

    // Availability State
    const [isOnline, setIsOnline] = useState(false);
    const [togglingOnline, setTogglingOnline] = useState(false);

    const heartbeatRef = useRef(null);
    const pollIntervalRef = useRef(null);
    const isLoggedOutRef = useRef(false);

    const showToast = (msg, type = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Save session
    const saveSession = (driver) => {
        isLoggedOutRef.current = false;
        setAuthDriver(driver);
        try {
            localStorage.setItem('tchapo_driver_session', JSON.stringify(driver));
        } catch (_) {}
    };

    const handleLogout = () => {
        isLoggedOutRef.current = true;

        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }

        if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
            heartbeatRef.current = null;
        }

        const currentId = authDriver?.id;
        if (currentId) {
            fetch(`${API_URL}/api/drivers/${currentId}/availability`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_online: false })
            }).catch(() => {});
        }

        try {
            localStorage.removeItem('tchapo_driver_session');
            localStorage.removeItem('tchapo_driver_user');
            sessionStorage.removeItem('tchapo_driver_session');
        } catch (_) {}

        setAuthDriver(null);
        setDashboardData(null);
        setIsOnline(false);
        setActiveTab('dashboard');
        showToast('Sessão terminada com sucesso.', 'info');
    };

    // Fetch Dashboard Data
    const fetchDashboard = useCallback(async (driverId) => {
        const targetId = driverId || authDriver?.id;
        if (!targetId || isLoggedOutRef.current) return;
        try {
            const res = await fetch(`${API_URL}/api/drivers/${targetId}/dashboard`);
            if (res.ok && !isLoggedOutRef.current) {
                const data = await res.json();
                if (isLoggedOutRef.current) return;

                setDashboardData(data);
                if (data.driver) {
                    setIsOnline(Boolean(data.driver.is_online));
                    setAuthDriver(prev => {
                        if (isLoggedOutRef.current || !prev) return null;
                        const updated = { ...prev, ...data.driver };
                        try {
                            localStorage.setItem('tchapo_driver_session', JSON.stringify(updated));
                        } catch (_) {}
                        return updated;
                    });
                }
            }
        } catch (err) {
            console.error('Erro ao buscar dados do dashboard:', err);
        }
    }, [API_URL, authDriver?.id]);

    // Initial Load & Polling
    useEffect(() => {
        if (authDriver?.id && !isLoggedOutRef.current) {
            fetchDashboard(authDriver.id);
            pollIntervalRef.current = setInterval(() => {
                if (!isLoggedOutRef.current) {
                    fetchDashboard(authDriver.id);
                }
            }, 8000);
            return () => {
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            };
        }
    }, [authDriver?.id, fetchDashboard]);

    // Heartbeat to keep online status active (Only if account is approved and NOT blocked by debt)
    useEffect(() => {
        const hasUnpaidDebt = dashboardData?.pending_debt && dashboardData.pending_debt.status !== 'Pago';
        if (authDriver?.id && isOnline && authDriver.approval_status === 'Aprovado' && !hasUnpaidDebt && !isLoggedOutRef.current) {
            heartbeatRef.current = setInterval(async () => {
                if (isLoggedOutRef.current) return;
                try {
                    await fetch(`${API_URL}/api/drivers/${authDriver.id}/availability`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ is_online: true })
                    });
                } catch (_) {}
            }, 25000);
            return () => {
                if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            };
        }
    }, [authDriver?.id, isOnline, authDriver?.approval_status, dashboardData?.pending_debt, API_URL]);

    // 2-Hour Countdown Timer Effect for Pending Debt
    useEffect(() => {
        const debt = dashboardData?.pending_debt;
        if (!debt || debt.status === 'Pago') return;

        const calculateRemaining = () => {
            const dueMs = new Date(debt.due_at).getTime();
            const nowMs = Date.now();
            const left = Math.max(0, Math.floor((dueMs - nowMs) / 1000));
            setDebtSecondsLeft(left);
        };

        calculateRemaining();
        const timer = setInterval(calculateRemaining, 1000);
        return () => clearInterval(timer);
    }, [dashboardData?.pending_debt]);

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginPhone.trim()) {
            showToast('Por favor introduza o seu número de telefone.', 'error');
            return;
        }
        setLoginLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/drivers/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: loginPhone.trim(), pin: loginPin.trim() || '1234' })
            });
            const data = await res.json();
            if (!res.ok) {
                showToast(data.error || 'Erro ao iniciar sessão.', 'error');
                return;
            }
            saveSession(data);
            setIsOnline(data.approval_status === 'Aprovado' ? Boolean(data.is_online) : false);
            setIsLoginModalOpen(false);

            if (data.approval_status === 'Pendente') {
                showToast(`Olá ${data.name}! A sua conta ainda está em análise pela equipa da Tchapo Tchapo.`, 'info');
            } else if (data.approval_status === 'Recusado') {
                showToast(`A sua candidatura de entregador não foi aprovada pelo Administrador.`, 'error');
            } else if (data.approval_status === 'Suspenso') {
                showToast(`A sua conta de entregador encontra-se suspensa temporariamente.`, 'error');
            } else {
                showToast(`Bem-vindo de volta, ${data.name}!`, 'success');
            }
            fetchDashboard(data.id);
        } catch (err) {
            showToast('Falha na comunicação com o servidor.', 'error');
        } finally {
            setLoginLoading(false);
        }
    };

    // Handle Register
    const handleRegister = async (e) => {
        e.preventDefault();

        // Strict verification of all fields
        if (!photoFile) {
            showToast('A fotografia de perfil (rosto) é obrigatória para identificação.', 'error');
            setRegStep(1);
            return;
        }
        if (!regName.trim()) {
            showToast('Por favor introduza o seu nome completo.', 'error');
            setRegStep(1);
            return;
        }
        if (!regPhone.trim()) {
            showToast('Por favor introduza o seu número de telefone / WhatsApp.', 'error');
            setRegStep(1);
            return;
        }
        if (!regPin.trim() || regPin.trim().length !== 4) {
            showToast('Defina um PIN de segurança com 4 dígitos.', 'error');
            setRegStep(1);
            return;
        }
        if (!regDocNumber.trim()) {
            showToast('Por favor introduza o número do seu documento de identificação.', 'error');
            setRegStep(2);
            return;
        }
        if (!docPhotoFile) {
            showToast('A fotografia do documento de identificação (BI / Carta) é obrigatória.', 'error');
            setRegStep(2);
            return;
        }

        setRegLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', regName.trim());
            formData.append('phone', regPhone.trim());
            formData.append('bairro', `${regProvince} - ${regBairro}`.trim());
            formData.append('doc_type', regDocType);
            formData.append('doc_number', regDocNumber.trim());
            formData.append('pin', regPin.trim());
            formData.append('photo', photoFile);
            formData.append('doc_photo', docPhotoFile);

            const res = await fetch(`${API_URL}/api/drivers/register`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.error || 'Erro ao realizar registo.', 'error');
                return;
            }

            saveSession(data);
            setIsOnline(false);
            setIsRegisterModalOpen(false);
            showToast('Registo submetido com sucesso! A sua conta está sob análise pelo Administrador.', 'success');
            fetchDashboard(data.id);
        } catch (err) {
            showToast('Erro de conexão ao registar entregador.', 'error');
        } finally {
            setRegLoading(false);
        }
    };

    // Toggle Availability
    const handleToggleAvailability = async (targetState) => {
        if (!authDriver?.id) return;
        if (authDriver.approval_status !== 'Aprovado') {
            showToast('A sua conta precisa de ser aprovada pelo Administrador para ficar online.', 'error');
            return;
        }
        if (dashboardData?.pending_debt && dashboardData.pending_debt.status !== 'Pago') {
            showToast('Conta temporariamente bloqueada devido a taxa pendente. Efetue o pagamento para ficar online.', 'error');
            return;
        }
        setTogglingOnline(true);
        const newState = targetState !== undefined ? targetState : !isOnline;
        try {
            const res = await fetch(`${API_URL}/api/drivers/${authDriver.id}/availability`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_online: newState })
            });
            if (res.ok) {
                setIsOnline(newState);
                setAuthDriver(prev => ({ ...prev, is_online: newState }));
                showToast(newState ? 'Você está Online e pronto para receber pedidos.' : 'Você está Offline.', 'info');
            }
        } catch (err) {
            showToast('Erro ao atualizar disponibilidade.', 'error');
        } finally {
            setTogglingOnline(false);
        }
    };

    // Prompt Strict Acceptance Modal
    const promptAcceptOrder = (order) => {
        if (dashboardData?.pending_debt && dashboardData.pending_debt.status !== 'Pago') {
            showToast(`A sua conta está bloqueada com uma taxa pendente de ${dashboardData.pending_debt.amount} MT. Pague para aceitar pedidos.`, 'error');
            return;
        }
        if (activeOrders.length > 0) {
            showToast('Você já tem um pedido em andamento! Conclua a entrega atual antes de aceitar outro.', 'error');
            return;
        }
        setConfirmingOrder(order);
    };

    // Confirm and Execute Order Acceptance
    const handleConfirmAcceptOrder = async () => {
        if (!confirmingOrder || !authDriver?.id) return;
        const orderId = confirmingOrder.id;
        setAcceptingId(orderId);
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/accept`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driver_id: authDriver.id })
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Pedido aceito com sucesso! Prepare a entrega imediatamente.', 'success');
                setConfirmingOrder(null);
                setOrdersSubTab('active');
                fetchDashboard(authDriver.id);
            } else {
                showToast(data.error || 'Não foi possível aceitar este pedido.', 'error');
                setConfirmingOrder(null);
                fetchDashboard(authDriver.id);
            }
        } catch (err) {
            showToast('Erro ao comunicar com o servidor.', 'error');
        } finally {
            setAcceptingId(null);
        }
    };

    // Update Order Status (Marking 'Entregue' produces pending debt and displays the white payment screen)
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, driver_id: authDriver?.id })
            });
            if (res.ok) {
                if (newStatus === 'Entregue') {
                    showToast('Entrega concluída! Efetue o pagamento da taxa da plataforma na tela a seguir.', 'success');
                } else {
                    showToast(`Estado da entrega atualizado: ${newStatus}`, 'success');
                }
                fetchDashboard(authDriver?.id);
            }
        } catch (err) {
            showToast('Erro ao atualizar entrega.', 'error');
        }
    };

    // Driver Submits Debt Payment Proof
    const handleSubmitDebtPayment = async (e) => {
        e.preventDefault();
        if (!debtPaymentRef.trim() && !debtReceiptFile) {
            showToast('Por favor introduza o código de confirmação ou anexe o comprovativo.', 'error');
            return;
        }

        setSubmittingDebt(true);
        try {
            const fd = new FormData();
            if (debtPaymentRef.trim()) {
                fd.append('reference', debtPaymentRef.trim());
            }
            if (debtReceiptFile) {
                fd.append('receipt', debtReceiptFile);
            }

            const res = await fetch(`${API_URL}/api/drivers/${authDriver?.id}/pay-debt`, {
                method: 'POST',
                body: fd
            });
            const data = await res.json();
            if (res.ok) {
                showToast('Comprovativo submetido com sucesso! A administração irá validar.', 'success');
                setDebtPaymentRef('');
                setDebtReceiptFile(null);
                setDebtReceiptPreview(null);
                fetchDashboard(authDriver?.id);
            } else {
                showToast(data.error || 'Erro ao submeter comprovativo.', 'error');
            }
        } catch (err) {
            showToast('Erro de comunicação com o servidor.', 'error');
        } finally {
            setSubmittingDebt(false);
        }
    };

    const copyToClipboard = (text) => {
        try {
            navigator.clipboard.writeText(text);
            setCopiedId(true);
            showToast('ID copiado para a área de transferência!', 'info');
            setTimeout(() => setCopiedId(false), 3000);
        } catch (_) {}
    };

    const stats = dashboardData?.stats || {
        today_earnings: 0,
        week_earnings: 0,
        total_earnings: 0,
        today_deliveries: 0,
        total_deliveries: 0,
        active_deliveries: 0,
        total_sales: 0,
        saldo: 0
    };

    const availableOrders = dashboardData?.available_orders || [];
    const activeOrders = dashboardData?.active_orders || [];
    const recentDeliveries = dashboardData?.recent_deliveries || [];
    const warnings = dashboardData?.warnings || authDriver?.warnings || [];
    const pendingDebt = dashboardData?.pending_debt || null;
    const isDebtBlocked = Boolean(pendingDebt && pendingDebt.status !== 'Pago');
    const hasActiveOrder = activeOrders.length > 0;

    // Saldo calculado
    const saldoLiquido = stats.saldo !== undefined ? stats.saldo : Math.max(0, stats.total_earnings - (pendingDebt ? pendingDebt.amount : 0));

    // Milestone calculations: 5k, 20k, 100k
    const currentSales = stats.total_sales || (stats.total_deliveries * 150);

    const rewards = [
        {
            id: '5k',
            target: 5000,
            title: 'Camisa Oficial + Entregador Verificado',
            desc: 'Camisa Oficial de Entregador Tchapo Tchapo + Selo de Verificação no Perfil.',
            icon: <Icons.ShirtReward />,
            badge: '5.000 MT',
            level: 'Nível 1'
        },
        {
            id: '20k',
            target: 20000,
            title: 'Capacete de Segurança + Mochila Térmica + Bónus 1.000 MT',
            desc: 'Capacete Oficial Tchapo Tchapo + Mochila Térmica de Entregas Impermeável + Bónus em dinheiro.',
            icon: <Icons.Helmet />,
            badge: '20.000 MT',
            level: 'Nível 2'
        },
        {
            id: '100k',
            target: 100000,
            title: 'Placa Oficial de Ouro + Super Bónus 5.000 MT',
            desc: 'Placa de Reconhecimento Oficial de Ouro gravada com o seu nome + Bónus de 5.000 MT.',
            icon: <Icons.Plaque />,
            badge: '100.000 MT',
            level: 'Nível Lendário'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "'Inter', -apple-system, sans-serif" }}>
            
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 999999,
                    background: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#059669' : '#1e293b',
                    color: '#fff',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                }}>
                    {toast.type === 'error' ? <Icons.AlertTriangle /> : <Icons.CheckCircle />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Top Store Header */}
            <header style={{
                background: '#111827',
                borderBottom: '1px solid #1f2937',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0.85rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    {/* Brand & Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: '#f59e0b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                padding: '2px'
                            }}>
                                <img
                                    src="/assets/logo_original.png"
                                    alt="Tchapo Tchapo"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.3px' }}>
                                    Tchapo Tchapo
                                </div>
                                <div style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Portal do Entregador
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Right Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {authDriver ? (
                            <>
                                {/* Online / Offline Switch */}
                                {authDriver.approval_status === 'Aprovado' && !isDebtBlocked && (
                                    <button
                                        onClick={() => handleToggleAvailability()}
                                        disabled={togglingOnline}
                                        style={{
                                            background: isOnline ? 'rgba(5, 150, 105, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                                            border: isOnline ? '1.5px solid #059669' : '1px solid #374151',
                                            color: isOnline ? '#34d399' : '#9ca3af',
                                            padding: '0.55rem 1.1rem',
                                            borderRadius: '999px',
                                            fontWeight: 700,
                                            fontSize: '0.82rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span style={{
                                            width: '9px',
                                            height: '9px',
                                            borderRadius: '50%',
                                            background: isOnline ? '#10b981' : '#6b7280',
                                            boxShadow: isOnline ? '0 0 8px #10b981' : 'none'
                                        }} />
                                        <span>{isOnline ? 'Online para Entregas' : 'Indisponível (Offline)'}</span>
                                    </button>
                                )}

                                {isDebtBlocked && (
                                    <span style={{
                                        background: 'rgba(239, 68, 68, 0.15)',
                                        border: '1px solid #ef4444',
                                        color: '#f87171',
                                        padding: '0.45rem 0.9rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}>
                                        <Icons.AlertTriangle />
                                        <span>Bloqueado por Taxa Pendente</span>
                                    </span>
                                )}

                                {/* Profile info pill */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#1f2937', padding: '0.35rem 0.85rem', borderRadius: '10px' }}>
                                    <img
                                        src={authDriver.photo_url || '/assets/logo_original.png'}
                                        alt={authDriver.name}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', background: '#374151' }}
                                    />
                                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{authDriver.name}</span>
                                    {authDriver.approval_status === 'Aprovado' ? (
                                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>ID: {authDriver.id}</span>
                                    ) : (
                                        <span style={{
                                            background: authDriver.approval_status === 'Recusado' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                                            color: authDriver.approval_status === 'Recusado' ? '#f87171' : '#fbbf24',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            letterSpacing: '0.4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {authDriver.approval_status === 'Pendente' ? 'Em Análise' : authDriver.approval_status}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    title="Terminar sessão"
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid #374151',
                                        color: '#ef4444',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icons.LogOut />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    style={{
                                        background: 'transparent',
                                        border: '1.5px solid #374151',
                                        color: '#e2e8f0',
                                        padding: '0.55rem 1.1rem',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    <Icons.LogIn />
                                    <span>Entrar</span>
                                </button>

                                <button
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    style={{
                                        background: '#f59e0b',
                                        border: 'none',
                                        color: '#111827',
                                        padding: '0.6rem 1.25rem',
                                        borderRadius: '10px',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
                                    }}
                                >
                                    <Icons.Plus />
                                    <span>Cadastrar como Entregador</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.5rem 4rem' }}>

                {/* VIEW 1: Non-logged in Hero Landing */}
                {!authDriver && (
                    <div>
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            borderRadius: '24px',
                            padding: '3rem 2.25rem',
                            color: '#fff',
                            marginBottom: '2.5rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.14)',
                            border: '1px solid #334151',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '2.5rem',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    color: '#f59e0b',
                                    padding: '0.45rem 1rem',
                                    borderRadius: '999px',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    marginBottom: '1.25rem',
                                    border: '1px solid rgba(245, 158, 11, 0.3)'
                                }}>
                                    <Icons.Navigation />
                                    <span>Clientes Prontos Fornecidos Pela Tchapo Tchapo</span>
                                </div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.15, margin: '0 0 1.15rem', color: '#fff' }}>
                                    A Tchapo Tchapo Fornece <span style={{ color: '#f59e0b' }}>Clientes Para Si</span>
                                </h1>
                                <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 2rem' }}>
                                    As encomendas da loja online são direcionadas diretamente para o seu telemóvel em qualquer província de Moçambique. Aceite pedidos, realize entregas e mantenha o seu saldo e taxas em dia para receber entregas contínuas!
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => setIsRegisterModalOpen(true)}
                                        style={{
                                            background: '#f59e0b',
                                            color: '#111827',
                                            border: 'none',
                                            padding: '0.95rem 1.85rem',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)'
                                        }}
                                    >
                                        <Icons.Plus />
                                        <span>Quero Ser Entregador Agora</span>
                                    </button>
                                    <button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            color: '#fff',
                                            border: '1px solid #475569',
                                            padding: '0.95rem 1.85rem',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Icons.LogIn />
                                        <span>Já Tenho Conta / Entrar</span>
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(255, 255, 255, 0.04)',
                                borderRadius: '20px',
                                padding: '1.75rem',
                                border: '1.5px solid rgba(245, 158, 11, 0.3)',
                                backdropFilter: 'blur(8px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f59e0b', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icons.Gift />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                                            Carreira & Reconhecimento
                                        </div>
                                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                                            Prêmios & Bónus Incríveis
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center' }}><Icons.ShirtReward /></div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>5.000 MT: Camisa Oficial + Verificado</div>
                                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Camisa da marca + Selo de Entregador Verificado</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}><Icons.Helmet /></div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>20.000 MT: Capacete + Mochila + Bónus</div>
                                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Capacete Oficial + Mochila Térmica + 1.000 MT Bónus</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)' }}>
                                        <div style={{ color: '#fbbf24', display: 'flex', alignItems: 'center' }}><Icons.Plaque /></div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fbbf24' }}>100.000 MT: Placa de Ouro + 5.000 MT</div>
                                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Placa de Reconhecimento Oficial + Super Bónus em Dinheiro</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW 2: Pending Approval Status Screen */}
                {authDriver && authDriver.approval_status === 'Pendente' && (
                    <div style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '3rem 2rem',
                        maxWidth: '620px',
                        margin: '2rem auto',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                        border: '1.5px solid #fde68a',
                        textAlign: 'center'
                    }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Icons.Clock />
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.75rem' }}>
                            Conta em Análise
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
                            Olá, <strong>{authDriver.name}</strong>! O seu cadastro de entregador foi recebido com sucesso e os seus documentos estão a ser analisados pela equipa da Tchapo Tchapo.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={async () => {
                                    await fetchDashboard(authDriver.id);
                                    showToast('Estado verificado com sucesso.', 'info');
                                }}
                                style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Verificar Estado
                            </button>
                            <button onClick={handleLogout} style={{ background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                                Sair
                            </button>
                        </div>
                    </div>
                )}

                {/* VIEW 3: Approved Driver Portal Dashboard */}
                {authDriver && authDriver.approval_status === 'Aprovado' && (
                    <div>

                        {/* ========================================================================= */}
                        {/* TELA BRANCA DE PAGAMENTO DE TAXA APÓS ENTREGA (SOLICITADA PELO UTILIZADOR) */}
                        {/* Cobertura total do site (Fixed Full-Screen Blocking Overlay) */}
                        {/* ========================================================================= */}
                        {isDebtBlocked && (
                            <div style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 999999,
                                background: '#ffffff',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                padding: '1.5rem 1rem 3rem',
                                boxSizing: 'border-box'
                            }}>
                                <div style={{
                                    width: '100%',
                                    maxWidth: '620px',
                                    margin: 'auto 0',
                                    textAlign: 'center',
                                    padding: '1rem 0'
                                }}>
                                    {/* Top Brand Pill & Logout Link */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '1.5rem',
                                        paddingBottom: '1rem',
                                        borderBottom: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src="/assets/logo_original.png" alt="Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                            </div>
                                            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Tchapo Tchapo Entregador</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            style={{
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                color: '#64748b',
                                                padding: '0.4rem 0.85rem',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.35rem'
                                            }}
                                        >
                                            <Icons.LogOut />
                                            <span>Sair da Conta</span>
                                        </button>
                                    </div>

                                    {/* Badge de Estado */}
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        background: debtSecondsLeft === 0 ? '#fee2e2' : '#fef3c7',
                                        color: debtSecondsLeft === 0 ? '#b91c1c' : '#b45309',
                                        padding: '0.45rem 1.1rem',
                                        borderRadius: '999px',
                                        fontSize: '0.82rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '1rem'
                                    }}>
                                        <Icons.AlertTriangle />
                                        <span>{debtSecondsLeft === 0 ? 'Prazo de 2 Horas Esgotado' : 'Taxa da Plataforma Obrigatória'}</span>
                                    </div>

                                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 900, margin: '0 0 0.5rem', color: '#0f172a', letterSpacing: '-0.5px' }}>
                                        Produto Entregue com Sucesso!
                                    </h2>
                                    <p style={{ fontSize: 'clamp(0.88rem, 2.5vw, 0.98rem)', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
                                        A plataforma está temporariamente indisponível para novos pedidos até que efetue o pagamento da taxa para a empresa.
                                    </p>

                                    {/* BOX BRANCA DESTACADA COM OS DADOS EXATOS SOLICITADOS */}
                                    <div style={{
                                        background: '#f8fafc',
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        border: '2px solid #e2e8f0',
                                        marginBottom: '1.5rem',
                                        textAlign: 'left',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1.5px solid #e2e8f0' }}>
                                            <span style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700 }}>Valor a pagar:</span>
                                            <strong style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 900, color: '#dc2626' }}>
                                                {formatMZCurrency(pendingDebt.amount)}
                                            </strong>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                                            <span style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 600 }}>Para o e-Mola:</span>
                                            <strong style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px' }}>
                                                874110586
                                            </strong>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1.5px solid #e2e8f0' }}>
                                            <span style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 600 }}>Titular:</span>
                                            <strong style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                                Massiquine Simango
                                            </strong>
                                        </div>

                                        {/* No conteúdo adicione o seu ID */}
                                        <div style={{
                                            background: '#fef3c7',
                                            border: '1.5px solid #fde68a',
                                            borderRadius: '14px',
                                            padding: '0.85rem 1rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 800, textTransform: 'uppercase' }}>
                                                    No conteúdo da transferência adicione:
                                                </div>
                                                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#92400e', marginTop: '2px' }}>
                                                    ID: {authDriver.id}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(String(authDriver.id))}
                                                style={{
                                                    background: '#fff',
                                                    border: '1px solid #f59e0b',
                                                    color: '#b45309',
                                                    padding: '0.45rem 0.9rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.82rem',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem'
                                                }}
                                            >
                                                <Icons.Copy />
                                                <span>{copiedId ? 'Copiado!' : 'Copiar ID'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* CRONÓMETRO DE 2 HORAS POR BAIXO */}
                                    <div style={{
                                        background: '#f1f5f9',
                                        borderRadius: '18px',
                                        padding: '1.15rem',
                                        marginBottom: '1.5rem',
                                        textAlign: 'center',
                                        border: debtSecondsLeft === 0 ? '2px solid #ef4444' : '1px solid #cbd5e1'
                                    }}>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                                            Tempo Restante para Pagamento (Prazo: 2 Horas)
                                        </div>
                                        <div style={{
                                            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                                            fontWeight: 900,
                                            fontFamily: 'monospace',
                                            color: debtSecondsLeft === 0 ? '#ef4444' : debtSecondsLeft < 1800 ? '#dc2626' : '#059669',
                                            letterSpacing: '2px'
                                        }}>
                                            {formatTimer(debtSecondsLeft)}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: debtSecondsLeft === 0 ? '#b91c1c' : '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
                                            {debtSecondsLeft === 0
                                                ? '⚠️ Prazo esgotado! Advertência registada na conta. Regularize imediatamente.'
                                                : 'A taxa deve ser paga em até 2 horas para manter a conta ativa.'}
                                        </div>
                                    </div>

                                    {/* FORMULÁRIO DE CONFIRMAÇÃO DO E-MOLA */}
                                    {pendingDebt.status === 'Aguardando Confirmação' ? (
                                        <div style={{
                                            background: '#ecfdf5',
                                            border: '1.5px solid #10b981',
                                            padding: '1.25rem',
                                            borderRadius: '16px',
                                            color: '#065f46',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                                <Icons.CheckCircle />
                                                <span>Comprovativo Submetido!</span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                                                Ref: <strong>{pendingDebt.payment_proof}</strong>. A administração da Tchapo Tchapo está a validar para desbloquear a sua conta em instantes.
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitDebtPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ textAlign: 'left' }}>
                                                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334151', marginBottom: '0.4rem' }}>
                                                    Código da Mensagem do e-Mola / M-Pesa:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={debtPaymentRef}
                                                    onChange={(e) => setDebtPaymentRef(e.target.value)}
                                                    placeholder="Ex: PP260915.1234.X09876 ou nº comprovativo"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.85rem 1rem',
                                                        borderRadius: '12px',
                                                        border: '1.5px solid #cbd5e1',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>

                                            <div style={{ textAlign: 'left' }}>
                                                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334151', marginBottom: '0.4rem' }}>
                                                    📸 Anexar Foto / Captura do Comprovativo (Recomendado):
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setDebtReceiptFile(file);
                                                            setDebtReceiptPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem 0',
                                                        fontSize: '0.88rem'
                                                    }}
                                                />
                                                {debtReceiptPreview && (
                                                    <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                                                        <img src={debtReceiptPreview} alt="Pré-visualização do Comprovativo" 
                                                             style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid #cbd5e1', objectFit: 'contain' }} />
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submittingDebt}
                                                style={{
                                                    background: '#059669',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    fontWeight: 800,
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    boxShadow: '0 6px 18px rgba(5, 150, 105, 0.25)',
                                                    transition: 'opacity 0.2s',
                                                    opacity: submittingDebt ? 0.7 : 1
                                                }}
                                            >
                                                <Icons.CheckCircle />
                                                <span>{submittingDebt ? 'A enviar confirmação...' : 'Submeter Confirmação de Pagamento'}</span>
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tabs Bar */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            borderBottom: '1px solid #e2e8f0',
                            paddingBottom: '0.75rem',
                            marginBottom: '1.75rem',
                            overflowX: 'auto',
                            alignItems: 'center'
                        }}>
                            {[
                                { id: 'dashboard', label: 'Painel Geral', icon: <Icons.TrendingUp /> },
                                {
                                    id: 'orders',
                                    label: `Pedidos ${availableOrders.length > 0 ? `(${availableOrders.length} novos)` : `(${activeOrders.length})`}`,
                                    icon: <Icons.Package />,
                                    badge: (availableOrders.length > 0 && !hasActiveOrder && !isDebtBlocked) ? availableOrders.length : null
                                },
                                { id: 'rewards', label: 'Prêmios & Bónus', icon: <Icons.Gift /> },
                                { id: 'warnings', label: `Advertências (${warnings.length})`, icon: <Icons.AlertTriangle /> },
                                { id: 'profile', label: 'O Meu Perfil', icon: <Icons.User /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        background: activeTab === tab.id ? '#111827' : 'transparent',
                                        color: activeTab === tab.id ? '#fff' : '#64748b',
                                        border: 'none',
                                        padding: '0.6rem 1.15rem',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.88rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        transition: 'all 0.15s',
                                        whiteSpace: 'nowrap',
                                        position: 'relative'
                                    }}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    {tab.badge && activeTab !== tab.id && (
                                        <span style={{
                                            background: '#f59e0b',
                                            color: '#111827',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            padding: '0.1rem 0.45rem',
                                            borderRadius: '999px',
                                            marginLeft: '0.2rem'
                                        }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* TAB 1: Dashboard Overview */}
                        {activeTab === 'dashboard' && (
                            <div>
                                {/* Single Order Lockout Warning if driver has an order in progress */}
                                {hasActiveOrder && (
                                    <div style={{
                                        background: '#eff6ff',
                                        border: '1.5px solid #93c5fd',
                                        borderRadius: '16px',
                                        padding: '1.25rem 1.5rem',
                                        marginBottom: '1.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icons.Bike />
                                            </div>
                                            <div>
                                                <strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>
                                                    Você tem 1 entrega em andamento (Pedido #{activeOrders[0].id})
                                                </strong>
                                                <div style={{ fontSize: '0.82rem', color: '#3b82f6', marginTop: '2px' }}>
                                                    Todos os outros pedidos estão indisponíveis até concluir esta entrega e pagar a taxa da plataforma.
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { setActiveTab('orders'); setOrdersSubTab('active'); }}
                                            style={{
                                                background: '#2563eb',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '0.55rem 1.15rem',
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Ver Entrega em Curso
                                        </button>
                                    </div>
                                )}

                                {/* High-priority prompt if orders are waiting to be accepted */}
                                {!isDebtBlocked && !hasActiveOrder && availableOrders.length > 0 && (
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                        borderRadius: '18px',
                                        padding: '1.25rem 1.5rem',
                                        border: '1.5px solid #f59e0b',
                                        marginBottom: '1.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '1rem',
                                        boxShadow: '0 6px 16px rgba(245, 158, 11, 0.15)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f59e0b', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icons.Package />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#92400e' }}>
                                                    {availableOrders.length === 1 ? '1 Novo Pedido Disponível para Aceitar!' : `${availableOrders.length} Novos Pedidos Disponíveis para Aceitar!`}
                                                </div>
                                                <div style={{ fontSize: '0.82rem', color: '#b45309' }}>
                                                    Clientes aguardando entregador em Moçambique. Aceite agora e ganhe 150 MT por entrega.
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { setActiveTab('orders'); setOrdersSubTab('available'); }}
                                            style={{
                                                background: '#111827',
                                                color: '#f59e0b',
                                                border: 'none',
                                                padding: '0.65rem 1.25rem',
                                                borderRadius: '10px',
                                                fontWeight: 800,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            <Icons.CheckCircle />
                                            <span>Ver e Aceitar Pedidos</span>
                                        </button>
                                    </div>
                                )}

                                {/* FINANCIAL METRIC CARDS - INCLUINDO O CARD "SALDO" SOLICITADO */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                    gap: '1.25rem',
                                    marginBottom: '2rem'
                                }}>
                                    {/* CARD DE SALDO SOLICITADO */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                        color: '#fff',
                                        padding: '1.5rem',
                                        borderRadius: '18px',
                                        boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)',
                                        border: '1px solid #10b981'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 800, opacity: 0.9 }}>
                                            <span>Saldo Disponível</span>
                                            <Icons.Wallet />
                                        </div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.5rem' }}>
                                            {formatMZCurrency(saldoLiquido)}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '0.35rem' }}>
                                            Saldo líquido em carteira
                                        </div>
                                    </div>

                                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                                            <span>Ganhos de Hoje</span>
                                            <Icons.TrendingUp />
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: '0.5rem' }}>
                                            {formatMZCurrency(stats.today_earnings)}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                                            {stats.today_deliveries} entregas feitas hoje
                                        </div>
                                    </div>

                                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                                            <span>Total Acumulado</span>
                                            <Icons.Trophy />
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.5rem' }}>
                                            {formatMZCurrency(stats.total_earnings)}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                                            {stats.total_deliveries} entregas finalizadas
                                        </div>
                                    </div>

                                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                                            <span>Entregas em Curso</span>
                                            <Icons.Package />
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: activeOrders.length > 0 ? '#2563eb' : '#0f172a', marginTop: '0.5rem' }}>
                                            {activeOrders.length}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                                            {availableOrders.length} disponíveis na cidade
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: ABA DE PEDIDOS */}
                        {activeTab === 'orders' && (
                            <div>
                                {/* Sub-navigation Pills */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    background: '#fff',
                                    padding: '0.4rem',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    marginBottom: '1.75rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={() => setOrdersSubTab('available')}
                                        style={{
                                            flex: 1,
                                            minWidth: '180px',
                                            background: ordersSubTab === 'available' ? '#f59e0b' : 'transparent',
                                            color: ordersSubTab === 'available' ? '#111827' : '#64748b',
                                            border: 'none',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px',
                                            fontWeight: 800,
                                            fontSize: '0.88rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <Icons.Package />
                                        <span>Disponíveis para Aceitar ({availableOrders.length})</span>
                                    </button>

                                    <button
                                        onClick={() => setOrdersSubTab('active')}
                                        style={{
                                            flex: 1,
                                            minWidth: '180px',
                                            background: ordersSubTab === 'active' ? '#111827' : 'transparent',
                                            color: ordersSubTab === 'active' ? '#fff' : '#64748b',
                                            border: 'none',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px',
                                            fontWeight: 800,
                                            fontSize: '0.88rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <Icons.Bike />
                                        <span>Minhas Entregas ({activeOrders.length})</span>
                                    </button>

                                    <button
                                        onClick={() => setOrdersSubTab('history')}
                                        style={{
                                            flex: 1,
                                            minWidth: '180px',
                                            background: ordersSubTab === 'history' ? '#111827' : 'transparent',
                                            color: ordersSubTab === 'history' ? '#fff' : '#64748b',
                                            border: 'none',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px',
                                            fontWeight: 800,
                                            fontSize: '0.88rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <Icons.CheckCircle />
                                        <span>Histórico Concluído ({recentDeliveries.length})</span>
                                    </button>
                                </div>

                                {/* SUB-VIEW 1: PEDIDOS DISPONÍVEIS (BLOQUEIO TOTAL SE JÁ TIVER PEDIDO OU DÍVIDA) */}
                                {ordersSubTab === 'available' && (
                                    <div>
                                        {/* AVISO SE TIVER PEDIDO EM CURSO OU DÍVIDA */}
                                        {hasActiveOrder ? (
                                            <div style={{
                                                background: '#fff',
                                                padding: '4rem 2rem',
                                                borderRadius: '24px',
                                                border: '2px dashed #93c5fd',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                                    <Icons.Bike />
                                                </div>
                                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', fontWeight: 900, color: '#1e3a8a' }}>
                                                    Pedidos Bloqueados: Entrega em Andamento!
                                                </h3>
                                                <p style={{ margin: '0 0 1.5rem', color: '#475569', fontSize: '0.95rem', maxWidth: '520px', marginInline: 'auto', lineHeight: 1.6 }}>
                                                    Quando aceita um pedido, todos os outros pedidos ficam indisponíveis até que entregue o pedido <strong>#{activeOrders[0].id}</strong> e efetue o pagamento da taxa para a plataforma.
                                                </p>
                                                <button
                                                    onClick={() => setOrdersSubTab('active')}
                                                    style={{
                                                        background: '#2563eb',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '0.85rem 1.75rem',
                                                        borderRadius: '12px',
                                                        fontWeight: 800,
                                                        fontSize: '0.95rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Aceder à Minha Entrega em Curso
                                                </button>
                                            </div>
                                        ) : isDebtBlocked ? (
                                            <div style={{
                                                background: '#fff',
                                                padding: '4rem 2rem',
                                                borderRadius: '24px',
                                                border: '2px dashed #fca5a5',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                                    <Icons.AlertTriangle />
                                                </div>
                                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', fontWeight: 900, color: '#991b1b' }}>
                                                    Pedidos Indisponíveis: Taxa Pendente!
                                                </h3>
                                                <p style={{ margin: '0 0 1.5rem', color: '#475569', fontSize: '0.95rem', maxWidth: '520px', marginInline: 'auto', lineHeight: 1.6 }}>
                                                    Deve efetuar o pagamento da taxa de <strong>{formatMZCurrency(pendingDebt.amount)}</strong> para o e-Mola <strong>874110586</strong> para que os pedidos fiquem disponíveis novamente.
                                                </p>
                                                <button
                                                    onClick={() => setActiveTab('dashboard')}
                                                    style={{
                                                        background: '#dc2626',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '0.85rem 1.75rem',
                                                        borderRadius: '12px',
                                                        fontWeight: 800,
                                                        fontSize: '0.95rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Ver Tela de Pagamento
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <div>
                                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                                                            Pedidos Aguardando Entregador em Moçambique
                                                        </h3>
                                                        <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                                                            Nome e contacto do cliente protegidos até aceitação definitiva do pedido.
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => fetchDashboard(authDriver?.id)}
                                                        style={{
                                                            background: '#f1f5f9',
                                                            color: '#334151',
                                                            border: '1px solid #cbd5e1',
                                                            padding: '0.45rem 0.85rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Atualizar Lista
                                                    </button>
                                                </div>

                                                {availableOrders.length === 0 ? (
                                                    <div style={{ background: '#fff', padding: '4rem 2rem', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                                            <Icons.Package />
                                                        </div>
                                                        <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                                            Nenhum pedido novo disponível no momento
                                                        </h4>
                                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', marginInline: 'auto' }}>
                                                            Assim que um cliente fizer uma encomenda na loja, ela aparecerá aqui.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                                                        {availableOrders.map(order => (
                                                            <div key={order.id} style={{
                                                                background: '#fff',
                                                                borderRadius: '20px',
                                                                padding: '1.5rem',
                                                                border: '1.5px solid #fde68a',
                                                                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                                <div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                                        <div>
                                                                            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
                                                                                Pedido #{order.id}
                                                                            </span>
                                                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                                                {order.created_at ? new Date(order.created_at).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' }) : 'Recente'}
                                                                            </div>
                                                                        </div>

                                                                        <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.78rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                                                                            Disponível
                                                                        </span>
                                                                    </div>

                                                                    {(() => {
                                                                        const loc = extractOrderLocation(order);
                                                                        return (
                                                                            <div style={{ background: '#f8fafc', padding: '1rem 1.15rem', borderRadius: '14px', border: '1.5px solid #e2e8f0', marginBottom: '1.15rem' }}>
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '0.92rem' }}>
                                                                                        <Icons.MapPin />
                                                                                        <span>Província: <strong style={{ color: '#1e40af', fontWeight: 800 }}>{loc.province}</strong></span>
                                                                                    </div>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '0.92rem', paddingLeft: '1.55rem' }}>
                                                                                        <span>Bairro: <strong style={{ color: '#0f172a', fontWeight: 800 }}>{loc.bairro}</strong></span>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ color: '#64748b', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.55rem' }}>
                                                                                    <Icons.ShieldCheck />
                                                                                    <span>Apenas província e bairro visíveis. Endereço exato, nome e telefone liberados após aceitação.</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {order.items && order.items.length > 0 && (
                                                                        <div style={{ marginBottom: '1.25rem' }}>
                                                                            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                                <Icons.Package />
                                                                                <span>Itens do Pedido ({order.items.reduce((s, it) => s + (it.quantity || 1), 0)})</span>
                                                                            </div>
                                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                                                                {order.items.map((it, idx) => {
                                                                                    const imgUrl = resolveImageUrl(it.image);
                                                                                    return (
                                                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', background: '#ffffff', padding: '0.75rem 0.95rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                                                                                            <div style={{ width: '84px', height: '84px', minWidth: '84px', borderRadius: '14px', overflow: 'hidden', background: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                                                                                                {imgUrl ? (
                                                                                                    <img
                                                                                                        src={imgUrl}
                                                                                                        alt={it.product_name}
                                                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                                                        onError={(e) => {
                                                                                                            e.currentTarget.style.display = 'none';
                                                                                                            if (e.currentTarget.nextElementSibling) {
                                                                                                                e.currentTarget.nextElementSibling.style.display = 'flex';
                                                                                                            }
                                                                                                        }}
                                                                                                    />
                                                                                                ) : null}
                                                                                                <div style={{ display: imgUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', width: '100%', height: '100%' }}>
                                                                                                    <Icons.Package />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                                                <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a', lineHeight: 1.35, marginBottom: '0.45rem' }}>
                                                                                                    {it.product_name}
                                                                                                </div>
                                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                                                                                    <span style={{ background: '#0f172a', color: '#ffffff', padding: '3px 9px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>
                                                                                                        {it.quantity}x unidades
                                                                                                    </span>
                                                                                                    {it.price ? (
                                                                                                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#059669' }}>
                                                                                                            {formatMZCurrency(it.price)}
                                                                                                        </span>
                                                                                                    ) : null}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                                                                        <div>
                                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cobrar do Cliente:</div>
                                                                            <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{formatMZCurrency(order.total)}</strong>
                                                                        </div>
                                                                        <div style={{ textAlign: 'right' }}>
                                                                            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Seu Ganho:</div>
                                                                            <strong style={{ color: '#059669', fontSize: '1rem' }}>150 MT</strong>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    onClick={() => promptAcceptOrder(order)}
                                                                    style={{
                                                                        background: '#059669',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        padding: '0.85rem',
                                                                        borderRadius: '12px',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.95rem',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: '0.5rem',
                                                                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                                                                    }}
                                                                >
                                                                    <Icons.CheckCircle />
                                                                    <span>Aceitar este Pedido</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SUB-VIEW 2: MINHAS ENTREGAS EM CURSO */}
                                {ordersSubTab === 'active' && (
                                    <div>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                                                Entregas em Andamento ({activeOrders.length})
                                            </h3>
                                            <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                                                Pedidos aceitos sob a sua inteira responsabilidade. Ao entregar, o site exibirá a tela de pagamento da taxa.
                                            </p>
                                        </div>

                                        {activeOrders.length === 0 ? (
                                            <div style={{ background: '#fff', padding: '4rem 2rem', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                                    <Icons.Bike />
                                                </div>
                                                <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                                    Você não tem nenhuma entrega em andamento
                                                </h4>
                                                <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                    Vá para a aba de pedidos disponíveis para aceitar novas entregas.
                                                </p>
                                                <button onClick={() => setOrdersSubTab('available')} style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                                                    Ver Pedidos Disponíveis
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                                                {activeOrders.map(order => (
                                                    <div key={order.id} style={{
                                                        background: '#fff',
                                                        borderRadius: '20px',
                                                        padding: '1.5rem',
                                                        border: '1.5px solid #2563eb',
                                                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                                                            <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a' }}>
                                                                Pedido #{order.id}
                                                            </span>
                                                            <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.78rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                                                                {order.status || 'Com Entregador'}
                                                            </span>
                                                        </div>

                                                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.88rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 800, marginBottom: '0.45rem' }}>
                                                                <Icons.MapPin />
                                                                <span>{order.bairro || 'Beira'} • {order.address || 'Centro'}</span>
                                                            </div>
                                                            <div style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.25rem' }}>
                                                                Cliente: {order.customer_name || 'Cliente'}
                                                            </div>
                                                            <div style={{ color: '#475569', marginBottom: '0.35rem' }}>
                                                                Contacto: <strong>{order.customer_phone || 'Sem número'}</strong>
                                                            </div>
                                                            <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.95rem' }}>
                                                                Total a Cobrar: {formatMZCurrency(order.total)}
                                                            </div>
                                                        </div>

                                                        {order.items && order.items.length > 0 && (
                                                            <div style={{ marginBottom: '1.25rem' }}>
                                                                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                    <Icons.Package />
                                                                    <span>Itens do Pedido ({order.items.reduce((s, it) => s + (it.quantity || 1), 0)})</span>
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                                                    {order.items.map((it, idx) => {
                                                                        const imgUrl = resolveImageUrl(it.image);
                                                                        return (
                                                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', background: '#ffffff', padding: '0.75rem 0.95rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                                                                                <div style={{ width: '84px', height: '84px', minWidth: '84px', borderRadius: '14px', overflow: 'hidden', background: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                                                                                    {imgUrl ? (
                                                                                        <img
                                                                                            src={imgUrl}
                                                                                            alt={it.product_name}
                                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                                            onError={(e) => {
                                                                                                e.currentTarget.style.display = 'none';
                                                                                                if (e.currentTarget.nextElementSibling) {
                                                                                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    ) : null}
                                                                                    <div style={{ display: imgUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', width: '100%', height: '100%' }}>
                                                                                        <Icons.Package />
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a', lineHeight: 1.35, marginBottom: '0.45rem' }}>
                                                                                        {it.product_name}
                                                                                    </div>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                                                                        <span style={{ background: '#0f172a', color: '#ffffff', padding: '3px 9px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>
                                                                                            {it.quantity}x unidades
                                                                                        </span>
                                                                                        {it.price ? (
                                                                                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#059669' }}>
                                                                                                {formatMZCurrency(it.price)}
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {order.customer_phone && (
                                                                <a
                                                                    href={`https://wa.me/${String(order.customer_phone).replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(order.customer_name || '')},%20sou%20o%20entregador%20da%20Tchapo%20Tchapo%20com%20o%20seu%20pedido%20%23${order.id}.`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        flex: 1,
                                                                        background: '#059669',
                                                                        color: '#fff',
                                                                        textDecoration: 'none',
                                                                        padding: '0.8rem',
                                                                        borderRadius: '10px',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.85rem',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: '0.4rem'
                                                                    }}
                                                                >
                                                                    <Icons.WhatsApp />
                                                                    <span>WhatsApp</span>
                                                                </a>
                                                            )}

                                                            <button
                                                                onClick={() => handleUpdateOrderStatus(order.id, 'Entregue')}
                                                                style={{
                                                                    flex: 1.3,
                                                                    background: '#2563eb',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    padding: '0.8rem',
                                                                    borderRadius: '10px',
                                                                    fontWeight: 800,
                                                                    fontSize: '0.85rem',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '0.4rem',
                                                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                                                                }}
                                                            >
                                                                <Icons.CheckCircle />
                                                                <span>Confirmar Entrega</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SUB-VIEW 3: HISTÓRICO CONCLUÍDO */}
                                {ordersSubTab === 'history' && (
                                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.25rem', fontWeight: 900 }}>
                                            Histórico de Entregas Finalizadas
                                        </h3>
                                        {recentDeliveries.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
                                                Nenhuma entrega finalizada até ao momento.
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                                {recentDeliveries.map(d => (
                                                    <div key={d.id} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '1.15rem',
                                                        background: '#f8fafc',
                                                        borderRadius: '14px',
                                                        border: '1px solid #e2e8f0',
                                                        flexWrap: 'wrap',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <div>
                                                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                                                                Pedido #{d.id} • {d.customer_name}
                                                            </div>
                                                            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                                                                📍 {d.address || d.bairro || 'Beira'} • {d.created_at ? new Date(d.created_at).toLocaleDateString('pt-MZ') : ''}
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontWeight: 900, color: '#059669', fontSize: '1rem' }}>
                                                                {formatMZCurrency(d.total)}
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                                                                Entregue (+150 MT)
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: Prêmios & Bónus Details */}
                        {activeTab === 'rewards' && (
                            <div style={{ background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                                        Metas de Carreira & Premiações
                                    </h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
                                        O seu volume total de vendas e entregas acumulado é de: <strong>{formatMZCurrency(currentSales)}</strong>
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                    {rewards.map(r => {
                                        const unlocked = currentSales >= r.target;
                                        const pct = Math.min(100, Math.round((currentSales / r.target) * 100));
                                        const remaining = Math.max(0, r.target - currentSales);

                                        return (
                                            <div key={r.id} style={{
                                                borderRadius: '20px',
                                                padding: '1.75rem',
                                                border: unlocked ? '2px solid #10b981' : '1px solid #e2e8f0',
                                                background: unlocked ? '#f0fdf4' : '#f8fafc',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: unlocked ? '#10b981' : '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {r.icon}
                                                        </div>
                                                        <span style={{
                                                            background: unlocked ? '#dcfce7' : '#fef3c7',
                                                            color: unlocked ? '#15803d' : '#b45309',
                                                            fontWeight: 800,
                                                            fontSize: '0.78rem',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '999px'
                                                        }}>
                                                            {r.badge}
                                                        </span>
                                                    </div>

                                                    <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                                        {r.title}
                                                    </h4>
                                                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                                                        {r.desc}
                                                    </p>
                                                </div>

                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                                                        <span style={{ fontWeight: 600, color: '#64748b' }}>Progresso:</span>
                                                        <strong style={{ color: unlocked ? '#059669' : '#0f172a' }}>{pct}%</strong>
                                                    </div>

                                                    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                                        <div style={{
                                                            width: `${pct}%`,
                                                            height: '100%',
                                                            background: unlocked ? '#10b981' : '#f59e0b',
                                                            borderRadius: '999px'
                                                        }} />
                                                    </div>

                                                    <div style={{ fontSize: '0.8rem', color: unlocked ? '#059669' : '#64748b', fontWeight: 600 }}>
                                                        {unlocked
                                                            ? 'Prémio Desbloqueado! Pode solicitar o levantamento na central Tchapo Tchapo.'
                                                            : `Faltam ${formatMZCurrency(remaining)} para desbloquear este prémio.`
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: Disciplinary Warnings Tab */}
                        {activeTab === 'warnings' && (
                            <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                                        Registo de Advertências Disciplinares
                                    </h3>
                                    <span style={{
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        color: warnings.length > 0 ? '#dc2626' : '#059669',
                                        background: warnings.length > 0 ? '#fee2e2' : '#dcfce7',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px'
                                    }}>
                                        {warnings.length === 0 ? 'Sem Advertências (Ficha Limpa)' : `${warnings.length} Advertência(s)`}
                                    </span>
                                </div>

                                {warnings.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                            <Icons.CheckCircle />
                                        </div>
                                        <h4 style={{ margin: '0 0 0.4rem', color: '#0f172a', fontWeight: 800 }}>Excelente Conduta!</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Você não possui nenhuma advertência registada. Continue com o bom trabalho!</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {warnings.map((w, idx) => {
                                            const sevStyle = {
                                                Leve: { bg: '#fef3c7', color: '#b45309' },
                                                Média: { bg: '#fed7aa', color: '#c2410c' },
                                                Grave: { bg: '#fee2e2', color: '#b91c1c' }
                                            }[w.severity] || { bg: '#fee2e2', color: '#b91c1c' };

                                            return (
                                                <div key={idx} style={{ background: '#fff5f5', padding: '1.25rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                                        <span style={{ background: sevStyle.bg, color: sevStyle.color, padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                            Gravidade {w.severity || 'Leve'}
                                                        </span>
                                                        <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{w.reason}</strong>
                                                    </div>
                                                    {w.notes && (
                                                        <p style={{ margin: '0.4rem 0', fontSize: '0.85rem', color: '#475569' }}>
                                                            {w.notes}
                                                        </p>
                                                    )}
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                                                        Data: {w.date ? new Date(w.date).toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 5: Profile Details */}
                        {activeTab === 'profile' && (
                            <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', maxWidth: '640px' }}>
                                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                                    Dados do Entregador
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
                                    <img
                                        src={authDriver.photo_url || '/assets/logo_original.png'}
                                        alt={authDriver.name}
                                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f59e0b' }}
                                    />
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <h4 style={{ margin: '0', fontSize: '1.15rem', fontWeight: 800 }}>{authDriver.name}</h4>
                                            {currentSales >= 5000 && (
                                                <span title="Entregador Verificado" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                                                    <Icons.BadgeCheck />
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Entregador Oficial Tchapo Tchapo • <strong>ID: {authDriver.id}</strong></div>
                                        <span style={{ display: 'inline-block', marginTop: '0.35rem', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                                            Conta Aprovada
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b' }}>WhatsApp / Contacto:</span>
                                        <strong>{authDriver.phone}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b' }}>Bairro de Atuação:</span>
                                        <strong>{authDriver.bairro || 'Beira'}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b' }}>Documento:</span>
                                        <strong>{authDriver.doc_type || 'BI'} • {authDriver.doc_number || 'Sem número'}</strong>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        background: '#fee2e2',
                                        color: '#b91c1c',
                                        border: 'none',
                                        padding: '0.85rem',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Icons.LogOut />
                                    <span>Terminar Sessão</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* STRICT CONFIRMATION MODAL ("NÃO SE DEVE VOLTAR ATRÁS") */}
            {confirmingOrder && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999999,
                    backdropFilter: 'blur(8px)',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '2.25rem',
                        maxWidth: '520px',
                        width: '100%',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                        border: '2px solid #f59e0b',
                        textAlign: 'center'
                    }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <Icons.AlertTriangle />
                        </div>

                        <span style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            fontWeight: 900,
                            fontSize: '0.78rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            padding: '0.3rem 0.85rem',
                            borderRadius: '999px',
                            display: 'inline-block',
                            marginBottom: '0.75rem'
                        }}>
                            Compromisso Irrevogável
                        </span>

                        <h3 style={{ margin: '0 0 0.85rem', fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
                            Tem Certeza em Aceitar Este Pedido?
                        </h3>

                        <div style={{
                            background: '#fff7ed',
                            border: '1.5px solid #fdba74',
                            borderRadius: '14px',
                            padding: '1.15rem',
                            textAlign: 'left',
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{ margin: '0 0 0.65rem', fontSize: '0.9rem', color: '#9a3412', fontWeight: 800, lineHeight: 1.5 }}>
                                ⚠️ ATENÇÃO: Quando aceita o pedido, NÃO É PERMITIDO VOLTAR ATRÁS nem cancelar a entrega!
                            </p>
                            <p style={{ margin: 0, fontSize: '0.84rem', color: '#7c2d12', lineHeight: 1.5 }}>
                                A partir deste momento, todos os outros pedidos ficarão indisponíveis até concluir esta entrega e efetuar o pagamento da taxa para a plataforma.
                            </p>
                        </div>

                        <div style={{
                            background: '#f8fafc',
                            padding: '0.95rem 1.25rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'left',
                            marginBottom: '1.75rem',
                            fontSize: '0.88rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span style={{ color: '#64748b' }}>Pedido:</span>
                                <strong>#{confirmingOrder.id}</strong>
                            </div>
                            {(() => {
                                const confLoc = extractOrderLocation(confirmingOrder);
                                return (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <span style={{ color: '#64748b' }}>Província:</span>
                                            <strong style={{ color: '#1e40af' }}>{confLoc.province}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <span style={{ color: '#64748b' }}>Bairro de Entrega:</span>
                                            <strong>{confLoc.bairro}</strong>
                                        </div>
                                    </>
                                );
                            })()}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span style={{ color: '#64748b' }}>Valor da Mercadoria:</span>
                                <strong>{formatMZCurrency(confirmingOrder.total)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.4rem' }}>
                                <span style={{ color: '#059669', fontWeight: 700 }}>Seu Ganho por Entrega:</span>
                                <strong style={{ color: '#059669', fontSize: '0.95rem' }}>150 MT</strong>
                            </div>

                            {confirmingOrder.items && confirmingOrder.items.length > 0 && (
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem', marginTop: '0.65rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Icons.Package />
                                        <span>Itens da Entrega ({confirmingOrder.items.reduce((s, it) => s + (it.quantity || 1), 0)}):</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                                        {confirmingOrder.items.map((it, idx) => {
                                            const imgUrl = resolveImageUrl(it.image);
                                            return (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', padding: '0.5rem 0.65rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ width: '52px', height: '52px', minWidth: '52px', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        {imgUrl ? (
                                                            <img src={imgUrl} alt={it.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                        ) : (
                                                            <Icons.Package />
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {it.product_name}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                                                            Qtd: {it.quantity}x
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.85rem' }}>
                            <button
                                onClick={() => setConfirmingOrder(null)}
                                style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                Cancelar / Voltar
                            </button>

                            <button
                                onClick={handleConfirmAcceptOrder}
                                disabled={acceptingId === confirmingOrder.id}
                                style={{
                                    flex: 1.4,
                                    background: '#059669',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.85rem',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '0.92rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
                                }}
                            >
                                {acceptingId === confirmingOrder.id ? 'A processar...' : 'Sim, Tenho Certeza e Aceito'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 1: Modern Entregador Registration Modal */}
            {isRegisterModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.78)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    backdropFilter: 'blur(8px)',
                    padding: '1.25rem'
                }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '24px',
                        maxWidth: '580px',
                        width: '100%',
                        maxHeight: '92vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.35)',
                        border: '1px solid #e2e8f0',
                        animation: 'fadeInUp 0.2s ease-out'
                    }}>
                        {/* Header with gradient badge and close button */}
                        <div style={{
                            padding: '1.5rem 1.75rem 1.25rem',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            background: '#fafafa'
                        }}>
                            <div>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    background: '#fef3c7',
                                    color: '#b45309',
                                    padding: '0.28rem 0.65rem',
                                    borderRadius: '6px',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Icons.Bike />
                                    <span>Junta-te à Frota Oficial</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                                    Registo de Entregador
                                </h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                                    Receba encomendas dos clientes Tchapo Tchapo em qualquer província de Moçambique e ganhe por entrega.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsRegisterModalOpen(false);
                                    setRegStep(1);
                                }}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    transition: 'all 0.15s'
                                }}
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        {/* Step Progress Bar */}
                        <div style={{ padding: '0.85rem 1.75rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                                onClick={() => setRegStep(1)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    opacity: regStep === 1 ? 1 : 0.6
                                }}
                            >
                                <span style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: regStep >= 1 ? '#0f172a' : '#cbd5e1',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>1</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: regStep === 1 ? '#0f172a' : '#64748b' }}>
                                    Identificação & Contacto
                                </span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: regStep === 2 ? '#0f172a' : '#e2e8f0' }} />
                            <div
                                onClick={() => {
                                    if (photoFile && regName.trim() && regPhone.trim() && regPin.trim().length === 4) {
                                        setRegStep(2);
                                    } else if (!photoFile) {
                                        showToast('Carregue a sua fotografia de perfil antes de avançar.', 'error');
                                    } else if (!regName.trim() || !regPhone.trim()) {
                                        showToast('Preencha o nome e contacto antes de avançar.', 'error');
                                    } else if (!regPin.trim() || regPin.trim().length !== 4) {
                                        showToast('Defina o PIN de 4 dígitos antes de avançar.', 'error');
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: (photoFile && regName.trim() && regPhone.trim() && regPin.trim().length === 4) ? 'pointer' : 'default',
                                    opacity: regStep === 2 ? 1 : 0.6
                                }}
                            >
                                <span style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: regStep === 2 ? '#0f172a' : '#cbd5e1',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>2</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: regStep === 2 ? '#0f172a' : '#64748b' }}>
                                    Documentação
                                </span>
                            </div>
                        </div>

                        {/* Modal Body / Scrollable Form */}
                        <form onSubmit={handleRegister} style={{ overflowY: 'auto', padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            
                            {/* STEP 1: Identification & Contact */}
                            {regStep === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                                    
                                    {/* Profile Photo Upload */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '50%',
                                                background: '#e2e8f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                border: '2px solid #fff',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Foto de Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Icons.User />
                                                )}
                                            </div>
                                            {photoPreview && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPhotoFile(null);
                                                        setPhotoPreview(null);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-4px',
                                                        right: '-4px',
                                                        background: '#ef4444',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '22px',
                                                        height: '22px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}
                                                    title="Remover foto"
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                                                Foto de Perfil (Rosto) *
                                            </div>
                                            <p style={{ margin: '0 0 0.6rem', fontSize: '0.76rem', color: '#64748b' }}>
                                                Foto nítida e obrigatória para identificação perante clientes em Moçambique.
                                            </p>
                                            <label style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                background: '#ffffff',
                                                border: photoFile ? '1.5px solid #10b981' : '1.5px dashed #cbd5e1',
                                                padding: '0.45rem 0.9rem',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                color: photoFile ? '#059669' : '#334155',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}>
                                                <Icons.UploadCloud />
                                                <span>{photoFile ? 'Foto Carregada (Alterar)' : 'Carregar Fotografia *'}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setPhotoFile(file);
                                                        if (file) setPhotoPreview(URL.createObjectURL(file));
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                            <Icons.User />
                                            <span>Nome Completo *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                            placeholder="Ex: Carlos Alberto Macamo"
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem 1rem',
                                                borderRadius: '12px',
                                                border: '1.5px solid #e2e8f0',
                                                fontSize: '0.92rem',
                                                color: '#0f172a',
                                                outline: 'none',
                                                background: '#fdfdfd',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.15s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                    </div>

                                    {/* WhatsApp & Bairro */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                                <Icons.WhatsApp />
                                                <span>WhatsApp / Celular *</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={regPhone}
                                                onChange={(e) => setRegPhone(e.target.value)}
                                                placeholder="84XXXXXXX ou 87XXXXXXX"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.8rem 1rem',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid #e2e8f0',
                                                    fontSize: '0.92rem',
                                                    color: '#0f172a',
                                                    outline: 'none',
                                                    background: '#fdfdfd',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.15s'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                                <Icons.MapPin />
                                                <span>Localização Base (Moçambique) *</span>
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
                                                <select
                                                    value={regProvince}
                                                    onChange={(e) => {
                                                        const p = e.target.value;
                                                        setRegProvince(p);
                                                        const bList = getBairrosByProvince(p);
                                                        if (bList.length > 0) setRegBairro(bList[0]);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.8rem 0.6rem',
                                                        borderRadius: '12px',
                                                        border: '1.5px solid #e2e8f0',
                                                        fontSize: '0.86rem',
                                                        color: '#0f172a',
                                                        outline: 'none',
                                                        background: '#fdfdfd',
                                                        boxSizing: 'border-box',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {ALL_PROVINCES.map(prov => (
                                                        <option key={prov} value={prov}>{prov}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={regBairro}
                                                    onChange={(e) => setRegBairro(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.8rem 0.6rem',
                                                        borderRadius: '12px',
                                                        border: '1.5px solid #e2e8f0',
                                                        fontSize: '0.86rem',
                                                        color: '#0f172a',
                                                        outline: 'none',
                                                        background: '#fdfdfd',
                                                        boxSizing: 'border-box',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {getBairrosByProvince(regProvince).map(b => (
                                                        <option key={b} value={b}>{b}</option>
                                                    ))}
                                                    <option value="Outro Bairro">Outro Bairro</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security PIN */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                                <Icons.Lock />
                                                <span>PIN de Acesso (4 Dígitos) *</span>
                                            </label>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Usado para entrar no portal</span>
                                        </div>
                                        <input
                                            type="password"
                                            maxLength="4"
                                            required
                                            value={regPin}
                                            onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Ex: 4821"
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem 1rem',
                                                borderRadius: '12px',
                                                border: '1.5px solid #e2e8f0',
                                                fontSize: '1rem',
                                                letterSpacing: '3px',
                                                color: '#0f172a',
                                                outline: 'none',
                                                background: '#fdfdfd',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                    </div>

                                    {/* Step 1 Next Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!photoFile) {
                                                showToast('A fotografia de perfil (rosto) é obrigatória para verificação.', 'error');
                                                return;
                                            }
                                            if (!regName.trim()) {
                                                showToast('Por favor introduza o seu nome completo.', 'error');
                                                return;
                                            }
                                            if (!regPhone.trim()) {
                                                showToast('Por favor introduza o seu número de telefone.', 'error');
                                                return;
                                            }
                                            if (!regPin.trim() || regPin.length < 4) {
                                                showToast('Defina um PIN de 4 dígitos para segurança da sua conta.', 'error');
                                                return;
                                            }
                                            setRegStep(2);
                                        }}
                                        style={{
                                            marginTop: '0.5rem',
                                            background: '#0f172a',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '0.9rem',
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            fontSize: '0.92rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'background 0.15s'
                                        }}
                                    >
                                        <span>Continuar para Documentação</span>
                                        <Icons.ChevronRight />
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: ID Document */}
                            {regStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                                    
                                    {/* Document Type & Number */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                                <Icons.IdCard />
                                                <span>Documento *</span>
                                            </label>
                                            <select
                                                value={regDocType}
                                                onChange={(e) => setRegDocType(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.8rem 0.85rem',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid #e2e8f0',
                                                    fontSize: '0.88rem',
                                                    color: '#0f172a',
                                                    outline: 'none',
                                                    background: '#fdfdfd',
                                                    boxSizing: 'border-box',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="BI">Bilhete de Identidade (BI)</option>
                                                <option value="Carta de Condução">Carta de Condução</option>
                                                <option value="DIRE">DIRE</option>
                                                <option value="Passaporte">Passaporte</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                                Número do Documento *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={regDocNumber}
                                                onChange={(e) => setRegDocNumber(e.target.value)}
                                                placeholder="Ex: 110100234567N"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.8rem 1rem',
                                                    borderRadius: '12px',
                                                    border: '1.5px solid #e2e8f0',
                                                    fontSize: '0.92rem',
                                                    color: '#0f172a',
                                                    outline: 'none',
                                                    background: '#fdfdfd',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            />
                                        </div>
                                    </div>

                                    {/* Document Photo Upload Box */}
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                            Fotografia do Documento (Frente do BI / Carta) *
                                        </label>
                                        <div style={{
                                            border: '1.5px dashed #cbd5e1',
                                            borderRadius: '16px',
                                            padding: '1.25rem',
                                            textAlign: 'center',
                                            background: '#f8fafc',
                                            position: 'relative'
                                        }}>
                                            {docPhotoPreview ? (
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <img
                                                        src={docPhotoPreview}
                                                        alt="Documento"
                                                        style={{
                                                            maxHeight: '140px',
                                                            maxWidth: '100%',
                                                            borderRadius: '10px',
                                                            objectFit: 'contain',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDocPhotoFile(null);
                                                            setDocPhotoPreview(null);
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-8px',
                                                            background: '#ef4444',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '26px',
                                                            height: '26px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                        }}
                                                        title="Remover documento"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{
                                                        width: '44px',
                                                        height: '44px',
                                                        borderRadius: '50%',
                                                        background: '#ffffff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#f59e0b',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                                                    }}>
                                                        <Icons.UploadCloud />
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                                            Clique para anexar foto do BI ou Carta
                                                        </span>
                                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                                                            Formatos aceites: JPG, PNG, WEBP (Max: 5MB)
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        required
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            setDocPhotoFile(file);
                                                            if (file) setDocPhotoPreview(URL.createObjectURL(file));
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Buttons: Back and Submit */}
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setRegStep(1)}
                                            style={{
                                                flex: 1,
                                                background: '#f1f5f9',
                                                color: '#475569',
                                                border: '1px solid #cbd5e1',
                                                padding: '0.9rem',
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                fontSize: '0.88rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            <Icons.ChevronLeft />
                                            <span>Voltar</span>
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={regLoading}
                                            style={{
                                                flex: 2,
                                                background: '#f59e0b',
                                                color: '#111827',
                                                border: 'none',
                                                padding: '0.9rem',
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                fontSize: '0.95rem',
                                                cursor: 'pointer',
                                                opacity: regLoading ? 0.7 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
                                            }}
                                        >
                                            <Icons.CheckCircle />
                                            <span>{regLoading ? 'A enviar candidatura...' : 'Concluir & Submeter'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: Enhanced Modern & Mobile-Friendly Driver Login Modal */}
            {isLoginModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    backdropFilter: 'blur(8px)',
                    padding: '1rem',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '24px',
                        padding: 'clamp(1.5rem, 5vw, 2.25rem)',
                        maxWidth: '440px',
                        width: '100%',
                        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.35)',
                        border: '1px solid #e2e8f0',
                        boxSizing: 'border-box',
                        animation: 'fadeInUp 0.2s ease-out'
                    }}>
                        {/* Header with Logo Badge and Close */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: '#f59e0b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <img src="/assets/logo_original.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>
                                        Entrar no Portal
                                    </h3>
                                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                        Portal Oficial do Entregador
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoginModalOpen(false);
                                    setShowLoginPin(false);
                                }}
                                style={{
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b',
                                    transition: 'background 0.15s'
                                }}
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            {/* Phone Input */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem', fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>
                                    <Icons.WhatsApp />
                                    <span>Telemóvel / Celular *</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="tel"
                                        required
                                        autoFocus
                                        value={loginPhone}
                                        onChange={(e) => setLoginPhone(e.target.value)}
                                        placeholder="Ex: 84XXXXXXX ou 87XXXXXXX"
                                        style={{
                                            width: '100%',
                                            padding: '0.85rem 1rem',
                                            borderRadius: '12px',
                                            border: '1.5px solid #cbd5e1',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            fontSize: '0.98rem',
                                            color: '#0f172a',
                                            background: '#f8fafc',
                                            transition: 'all 0.15s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#f59e0b';
                                            e.target.style.background = '#ffffff';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#cbd5e1';
                                            e.target.style.background = '#f8fafc';
                                        }}
                                    />
                                </div>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                                    Número registado no seu cadastro de entregador
                                </span>
                            </div>

                            {/* PIN Input with Show/Hide Toggle */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>
                                        <Icons.Lock />
                                        <span>PIN de Acesso *</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPin(prev => !prev)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#64748b',
                                            fontSize: '0.76rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            padding: 0
                                        }}
                                    >
                                        {showLoginPin ? <Icons.EyeOff /> : <Icons.Eye />}
                                        <span>{showLoginPin ? 'Ocultar' : 'Ver PIN'}</span>
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showLoginPin ? 'text' : 'password'}
                                        maxLength="6"
                                        required
                                        value={loginPin}
                                        onChange={(e) => setLoginPin(e.target.value)}
                                        placeholder="Código PIN (Ex: 1234)"
                                        style={{
                                            width: '100%',
                                            padding: '0.85rem 1rem',
                                            borderRadius: '12px',
                                            border: '1.5px solid #cbd5e1',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            fontSize: '1.1rem',
                                            letterSpacing: showLoginPin ? '2px' : '4px',
                                            color: '#0f172a',
                                            background: '#f8fafc',
                                            transition: 'all 0.15s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#f59e0b';
                                            e.target.style.background = '#ffffff';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#cbd5e1';
                                            e.target.style.background = '#f8fafc';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loginLoading}
                                style={{
                                    marginTop: '0.5rem',
                                    background: '#f59e0b',
                                    color: '#111827',
                                    border: 'none',
                                    padding: '0.95rem',
                                    borderRadius: '12px',
                                    fontWeight: 900,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    opacity: loginLoading ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                <Icons.LogIn />
                                <span>{loginLoading ? 'A verificar credenciais...' : 'Entrar no Painel'}</span>
                            </button>

                            {/* Footer links: Register + Help */}
                            <div style={{
                                borderTop: '1px solid #f1f5f9',
                                paddingTop: '1rem',
                                marginTop: '0.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.6rem',
                                textAlign: 'center',
                                fontSize: '0.84rem',
                                color: '#64748b'
                            }}>
                                <div>
                                    Ainda não é entregador cadastrado?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLoginModalOpen(false);
                                            setIsRegisterModalOpen(true);
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#d97706', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                                    >
                                        Cadastre-se aqui
                                    </button>
                                </div>

                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                    Esqueceu o PIN ou precisa de ajuda?{' '}
                                    <a
                                        href="https://wa.me/258841234567?text=Ola%20Tchapo%20Tchapo,%20preciso%20de%20ajuda%20para%20aceder%20a%20minha%20conta%20de%20entregador."
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}
                                    >
                                        Falar no WhatsApp
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: Document Preview Lightbox */}
            {docPreviewModal && (
                <div
                    onClick={() => setDocPreviewModal(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                        backdropFilter: 'blur(6px)',
                        padding: '2rem'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '750px', width: '100%', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setDocPreviewModal(null)}
                            style={{
                                position: 'absolute',
                                top: '-15px',
                                right: '-15px',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                fontSize: '1rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Icons.Close />
                        </button>
                        <img
                            src={docPreviewModal}
                            alt="Documento do Entregador"
                            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '14px', objectFit: 'contain', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
