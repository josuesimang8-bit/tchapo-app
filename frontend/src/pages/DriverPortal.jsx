import React, { useEffect, useState, useCallback, useRef } from 'react';

// Modern SVG Icons (No Emojis)
const Icons = {
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
    Close: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
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

export default function DriverPortal() {
    const API_URL = import.meta.env.VITE_API_URL || '';

    // Auth & Driver State
    const [authDriver, setAuthDriver] = useState(() => {
        try {
            const saved = localStorage.getItem('tchapo_driver_session');
            return saved ? JSON.parse(saved) : null;
        } catch (_) {
            return null;
        }
    });

    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'warnings' | 'profile'
    const [dashboardData, setDashboardData] = useState(null);
    const [toast, setToast] = useState(null);

    // Modal Controls
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [docPreviewModal, setDocPreviewModal] = useState(null);

    // Login Form State
    const [loginPhone, setLoginPhone] = useState('');
    const [loginPin, setLoginPin] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Register Form State
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regBairro, setRegBairro] = useState('Macuti');
    const [regVehicleType, setRegVehicleType] = useState('Mota');
    const [regVehiclePlate, setRegVehiclePlate] = useState('');
    const [regDocType, setRegDocType] = useState('BI'); // 'BI' | 'Carta de Condução' | 'DIRE' | 'Passaporte'
    const [regDocNumber, setRegDocNumber] = useState('');
    const [regPin, setRegPin] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [docPhotoFile, setDocPhotoFile] = useState(null);
    const [docPhotoPreview, setDocPhotoPreview] = useState(null);
    const [regLoading, setRegLoading] = useState(false);

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

    // Heartbeat to keep online status active
    useEffect(() => {
        if (authDriver?.id && isOnline && authDriver.approval_status === 'Aprovado' && !isLoggedOutRef.current) {
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
    }, [authDriver?.id, isOnline, authDriver?.approval_status, API_URL]);

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
            setIsOnline(Boolean(data.is_online));
            setIsLoginModalOpen(false);
            showToast(`Bem-vindo de volta, ${data.name}!`, 'success');
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
        if (!regName.trim() || !regPhone.trim()) {
            showToast('Por favor preencha o seu nome e telefone.', 'error');
            return;
        }
        if (!regDocNumber.trim()) {
            showToast('Por favor introduza o número do seu documento.', 'error');
            return;
        }

        setRegLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', regName.trim());
            formData.append('phone', regPhone.trim());
            formData.append('bairro', regBairro.trim());
            formData.append('vehicle_type', regVehicleType);
            formData.append('vehicle_plate', regVehiclePlate.trim());
            formData.append('doc_type', regDocType);
            formData.append('doc_number', regDocNumber.trim());
            formData.append('pin', regPin.trim() || '1234');

            if (photoFile) {
                formData.append('photo', photoFile);
            }
            if (docPhotoFile) {
                formData.append('doc_photo', docPhotoFile);
            }

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
            setIsRegisterModalOpen(false);
            showToast('Registo submetido com sucesso! A sua conta está pendente de aprovação.', 'success');
        } catch (err) {
            showToast('Erro de conexão ao registar motorista.', 'error');
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
                showToast(newState ? 'Você está Online e pronto para entregas.' : 'Você está Offline.', 'info');
            }
        } catch (err) {
            showToast('Erro ao atualizar disponibilidade.', 'error');
        } finally {
            setTogglingOnline(false);
        }
    };

    // Update Order Status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, driver_id: authDriver?.id })
            });
            if (res.ok) {
                showToast(`Estado da entrega atualizado para: ${newStatus}`, 'success');
                fetchDashboard(authDriver?.id);
            }
        } catch (err) {
            showToast('Erro ao atualizar entrega.', 'error');
        }
    };

    const stats = dashboardData?.stats || {
        today_earnings: 0,
        week_earnings: 0,
        total_earnings: 0,
        today_deliveries: 0,
        total_deliveries: 0,
        active_deliveries: 0,
        total_sales: 0
    };

    const activeOrders = dashboardData?.active_orders || [];
    const recentDeliveries = dashboardData?.recent_deliveries || [];
    const warnings = dashboardData?.warnings || authDriver?.warnings || [];

    // Milestone calculations: 5k (Camisa + Verificado), 20k (Capacete + Mochila + 1.000 MT), 100k (Placa de Ouro + 5.000 MT)
    const currentSales = stats.total_sales || (stats.total_deliveries * 150);

    const rewards = [
        {
            id: '5k',
            target: 5000,
            title: 'Camisa Oficial + Motorista Verificado',
            desc: 'Camisa Oficial de Motorista Tchapo Tchapo + Selo de Verificação no Perfil.',
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
                    zIndex: 99999,
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
                                    Portal do Motorista
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Right Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {authDriver ? (
                            <>
                                {/* Online / Offline Switch */}
                                {authDriver.approval_status === 'Aprovado' && (
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

                                {/* Profile info pill */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#1f2937', padding: '0.35rem 0.85rem', borderRadius: '10px' }}>
                                    <img
                                        src={authDriver.photo_url || '/assets/logo_original.png'}
                                        alt={authDriver.name}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', background: '#374151' }}
                                    />
                                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{authDriver.name}</span>
                                    {currentSales >= 5000 && (
                                        <span title="Motorista Verificado" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                                            <Icons.BadgeCheck />
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
                                    <span>Cadastrar como Motorista</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.5rem 4rem' }}>

                {/* VIEW 1: Non-logged in Hero Landing & Welcome Hub */}
                {!authDriver && (
                    <div>
                        {/* Hero Card */}
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
                                    Não precisa de procurar clientes ou esperar na rua. As encomendas da loja online são direcionadas diretamente para o seu telemóvel na Beira. Ganhe muito dinheiro por entrega e conquiste bónus e prêmios incríveis!
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
                                        <span>Quero Ser Motorista Agora</span>
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

                            {/* Reward Showcase Box */}
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.04)',
                                borderRadius: '20px',
                                padding: '1.75rem',
                                border: '1.5px solid rgba(245, 158, 11, 0.3)',
                                backdropFilter: 'blur(8px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: '#f59e0b',
                                        color: '#111827',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
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
                                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Camisa da marca + Selo de Motorista Verificado</div>
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

                        {/* SECTION: Como Funciona na Prática */}
                        <div style={{ marginBottom: '3.5rem' }}>
                            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
                                <span style={{
                                    background: '#fef3c7',
                                    color: '#b45309',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.8px',
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '999px',
                                    display: 'inline-block',
                                    marginBottom: '0.6rem'
                                }}>
                                    Simples e Eficiente
                                </span>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.75rem' }}>
                                    Como Funciona Ser Motorista Tchapo Tchapo
                                </h2>
                                <p style={{ fontSize: '1rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                                    A Tchapo Tchapo cuida de todo o trabalho pesado de vendas e marketing para garantir que você tenha entregas contínuas na Beira.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontWeight: 900, fontSize: '1.2rem' }}>
                                        1
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
                                        Registo e Documentos
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                        Inscreva-se em menos de 2 minutos enviando o seu BI ou Carta de Condução e foto. A administração valida e aprova a sua conta.
                                    </p>
                                </div>

                                <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontWeight: 900, fontSize: '1.2rem' }}>
                                        2
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
                                        Ligue o Botão Online
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                        Você decide quando rodar. Basta clicar no alternador Online no seu painel para sinalizar à central que está disponível para pedidos.
                                    </p>
                                </div>

                                <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontWeight: 900, fontSize: '1.2rem' }}>
                                        3
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
                                        Clientes Fornecidos
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                        Os pedidos chegam com endereço, valor total e botão de WhatsApp direto para o cliente com mensagem pronta. Sem complicações.
                                    </p>
                                </div>

                                <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontWeight: 900, fontSize: '1.2rem' }}>
                                        4
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
                                        Entregue e Ganhe Prêmios
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                        Receba os seus ganhos por entrega e acumule volume de vendas para desbloquear a Camisa Oficial (5k), Capacete (20k) e Placa de Ouro (100k).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: Tabela de Prêmios e Bónus Incríveis */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '24px',
                            padding: '2.5rem 2rem',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                        }}>
                            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: '#d97706',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Icons.Trophy />
                                    <span>Plano de Carreira do Motorista</span>
                                </div>
                                <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>
                                    Metas, Prêmios e Bónus Exclusivos
                                </h2>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
                                    Reconhecemos e premiamos o seu esforço com equipamentos de primeira linha e gratificações em dinheiro real.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
                                {/* 5K */}
                                <div style={{
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    border: '2px solid #fde68a',
                                    background: 'linear-gradient(180deg, #fffbeb 0%, #fff 100%)',
                                    position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        background: '#fef3c7',
                                        color: '#b45309',
                                        fontWeight: 800,
                                        fontSize: '0.78rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px'
                                    }}>
                                        5.000 MT
                                    </span>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f59e0b', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                        <Icons.ShirtReward />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                                        Nível 1 • Bronze
                                    </h3>
                                    <div style={{ fontWeight: 700, color: '#d97706', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                        Camisa Oficial + Selo Verificado
                                    </div>
                                    <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                                        <li>Camisa Oficial de Motorista Tchapo Tchapo</li>
                                        <li>Selo de Motorista Verificado no sistema</li>
                                        <li>Prioridade na distribuição de pedidos da zona</li>
                                    </ul>
                                </div>

                                {/* 20K */}
                                <div style={{
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    border: '2px solid #bae6fd',
                                    background: 'linear-gradient(180deg, #f0f9ff 0%, #fff 100%)',
                                    position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        background: '#e0f2fe',
                                        color: '#0369a1',
                                        fontWeight: 800,
                                        fontSize: '0.78rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px'
                                    }}>
                                        20.000 MT
                                    </span>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                        <Icons.Helmet />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                                        Nível 2 • Prata
                                    </h3>
                                    <div style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                        Capacete + Mochila + Bónus 1.000 MT
                                    </div>
                                    <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                                        <li>Capacete de Segurança Oficial Tchapo Tchapo</li>
                                        <li>Mochila Térmica de Entregas Impermeável</li>
                                        <li>Bónus direto em dinheiro de 1.000 MT</li>
                                    </ul>
                                </div>

                                {/* 100K */}
                                <div style={{
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    border: '2px solid #fef08a',
                                    background: 'linear-gradient(180deg, #fefce8 0%, #fff 100%)',
                                    position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        background: '#fef08a',
                                        color: '#854d0e',
                                        fontWeight: 800,
                                        fontSize: '0.78rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px'
                                    }}>
                                        100.000 MT
                                    </span>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eab308', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                        <Icons.Plaque />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                                        Nível 3 • Ouro Lendário
                                    </h3>
                                    <div style={{ fontWeight: 700, color: '#ca8a04', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                        Placa Oficial + Super Bónus 5.000 MT
                                    </div>
                                    <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                                        <li>Placa de Reconhecimento Oficial de Honra gravada</li>
                                        <li>Super Bónus Especial de 5.000 MT em dinheiro</li>
                                        <li>Destaque permanente como Motorista de Honra</li>
                                    </ul>
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
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: '#fef3c7',
                            color: '#d97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Icons.Clock />
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.75rem' }}>
                            Conta em Análise
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
                            Olá, <strong>{authDriver.name}</strong>! O seu cadastro de motorista foi recebido com sucesso e os seus documentos estão a ser analisados pela equipa da Tchapo Tchapo.
                        </p>

                        <div style={{
                            background: '#f8fafc',
                            padding: '1.25rem',
                            borderRadius: '14px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'left',
                            marginBottom: '2rem',
                            fontSize: '0.88rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#64748b' }}>Contacto:</span>
                                <strong>{authDriver.phone}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#64748b' }}>Veículo:</span>
                                <strong>{authDriver.vehicle_type || 'Mota'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Documento:</span>
                                <strong>{authDriver.doc_type || 'BI'} ({authDriver.doc_number || 'Em análise'})</strong>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => fetchDashboard(authDriver.id)}
                                style={{
                                    background: '#f59e0b',
                                    color: '#111827',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Verificar Estado
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'transparent',
                                    color: '#64748b',
                                    border: '1px solid #cbd5e1',
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                )}

                {/* VIEW 3: Approved Driver Portal Dashboard */}
                {authDriver && authDriver.approval_status === 'Aprovado' && (
                    <div>
                        {/* Tabs Bar */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            borderBottom: '1px solid #e2e8f0',
                            paddingBottom: '0.75rem',
                            marginBottom: '1.75rem',
                            overflowX: 'auto'
                        }}>
                            {[
                                { id: 'dashboard', label: 'Painel Geral', icon: <Icons.TrendingUp /> },
                                { id: 'rewards', label: 'Prêmios & Bónus', icon: <Icons.Gift /> },
                                { id: 'orders', label: `Entregas (${activeOrders.length})`, icon: <Icons.Package /> },
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
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* TAB 1: Dashboard Overview */}
                        {activeTab === 'dashboard' && (
                            <div>
                                {/* REWARDS PROGRESS SUMMARY BOX */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    borderRadius: '22px',
                                    padding: '1.75rem 2rem',
                                    color: '#fff',
                                    marginBottom: '2rem',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    border: '1px solid #334151'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f59e0b', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icons.Trophy />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                                                    Carreira de Entregas
                                                </div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                                                    Progresso de Prêmios & Bónus
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setActiveTab('rewards')}
                                            style={{
                                                background: 'rgba(245,158,11,0.15)',
                                                border: '1px solid #f59e0b',
                                                color: '#f59e0b',
                                                padding: '0.45rem 1rem',
                                                borderRadius: '999px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Ver Todos os Prêmios
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                        {rewards.map(r => {
                                            const pct = Math.min(100, Math.round((currentSales / r.target) * 100));
                                            const unlocked = currentSales >= r.target;
                                            return (
                                                <div key={r.id} style={{
                                                    background: 'rgba(0,0,0,0.3)',
                                                    borderRadius: '16px',
                                                    padding: '1.25rem',
                                                    border: unlocked ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: unlocked ? '#34d399' : '#f59e0b' }}>
                                                            {r.level} • {r.badge}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: unlocked ? '#10b981' : '#94a3b8' }}>
                                                            {unlocked ? 'Desbloqueado' : `${pct}%`}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff', marginBottom: '0.5rem' }}>
                                                        {r.title}
                                                    </div>
                                                    <div style={{ width: '100%', height: '8px', background: '#334151', borderRadius: '999px', overflow: 'hidden' }}>
                                                        <div style={{
                                                            width: `${pct}%`,
                                                            height: '100%',
                                                            background: unlocked ? '#10b981' : '#f59e0b',
                                                            borderRadius: '999px'
                                                        }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Financial Metric Cards */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                    gap: '1.25rem',
                                    marginBottom: '2rem'
                                }}>
                                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                                            <span>Ganhos de Hoje</span>
                                            <Icons.Wallet />
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669', marginTop: '0.5rem' }}>
                                            {formatMZCurrency(stats.today_earnings)}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                                            {stats.today_deliveries} entregas feitas hoje
                                        </div>
                                    </div>

                                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 700 }}>
                                            <span>Ganhos Esta Semana</span>
                                            <Icons.TrendingUp />
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: '0.5rem' }}>
                                            {formatMZCurrency(stats.week_earnings)}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                                            Acumulado nos últimos 7 dias
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
                                            <span>Pedidos em Aberto</span>
                                            <Icons.Package />
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: activeOrders.length > 0 ? '#2563eb' : '#0f172a', marginTop: '0.5rem' }}>
                                            {activeOrders.length}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                                            Prontos ou em trânsito
                                        </div>
                                    </div>
                                </div>

                                {/* Active Deliveries Section */}
                                <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                            Entregas Designadas para Si
                                        </h3>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                                            {activeOrders.length} em andamento
                                        </span>
                                    </div>

                                    {activeOrders.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                                <Icons.Package />
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>Nenhuma entrega em aberto no momento.</p>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Mantenha o estado Online para ser notificado de novos pedidos.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                                            {activeOrders.map(order => (
                                                <div key={order.id} style={{
                                                    background: '#f8fafc',
                                                    borderRadius: '16px',
                                                    padding: '1.25rem',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                                                            Pedido #{order.id}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            padding: '0.2rem 0.6rem',
                                                            borderRadius: '999px',
                                                            background: order.status === 'Com Motorista' ? '#d1fae5' : '#dbeafe',
                                                            color: order.status === 'Com Motorista' ? '#065f46' : '#1e40af'
                                                        }}>
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div style={{ fontSize: '0.85rem', color: '#334151', marginBottom: '0.5rem' }}>
                                                        <strong>Cliente:</strong> {order.customer_name || 'Cliente'}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: '#334151', marginBottom: '0.5rem' }}>
                                                        <strong>Endereço:</strong> {order.address || 'Beira'} ({order.bairro || 'Centro'})
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, marginBottom: '1rem' }}>
                                                        <strong>Total a Cobrar:</strong> {formatMZCurrency(order.total)}
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {order.customer_phone && (
                                                            <a
                                                                href={`https://wa.me/${String(order.customer_phone).replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(order.customer_name || '')},%20sou%20o%20motorista%20da%20Tchapo%20Tchapo%20com%20o%20seu%20pedido%20%23${order.id}.`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    flex: 1,
                                                                    background: '#059669',
                                                                    color: '#fff',
                                                                    textDecoration: 'none',
                                                                    padding: '0.6rem',
                                                                    borderRadius: '8px',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.82rem',
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

                                                        {order.status === 'Processando' || order.status === 'Preparando' ? (
                                                            <button
                                                                onClick={() => handleUpdateOrderStatus(order.id, 'Com Motorista')}
                                                                style={{
                                                                    flex: 1,
                                                                    background: '#2563eb',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    padding: '0.6rem',
                                                                    borderRadius: '8px',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.82rem',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Recolher Pedido
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateOrderStatus(order.id, 'Entregue')}
                                                                style={{
                                                                    flex: 1,
                                                                    background: '#16a34a',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    padding: '0.6rem',
                                                                    borderRadius: '8px',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.82rem',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Confirmar Entrega
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB: Prêmios & Bónus Details */}
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

                        {/* TAB 2: Orders & Delivery History */}
                        {activeTab === 'orders' && (
                            <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: 800 }}>
                                    Histórico de Entregas Realizadas
                                </h3>
                                {recentDeliveries.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                        Nenhuma entrega finalizada até ao momento.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {recentDeliveries.map(d => (
                                            <div key={d.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '1rem',
                                                background: '#f8fafc',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                flexWrap: 'wrap',
                                                gap: '0.5rem'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                                                        Pedido #{d.id} • {d.customer_name}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                                                        📍 {d.address || d.bairro || 'Beira'} • {d.created_at ? new Date(d.created_at).toLocaleDateString('pt-MZ') : ''}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 800, color: '#059669' }}>
                                                        {formatMZCurrency(d.total)}
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                                                        Entregue
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: Disciplinary Warnings Tab */}
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
                                                <div key={idx} style={{
                                                    background: '#fff5f5',
                                                    padding: '1.25rem',
                                                    borderRadius: '14px',
                                                    border: '1px solid #fecaca'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                                        <span style={{
                                                            background: sevStyle.bg,
                                                            color: sevStyle.color,
                                                            padding: '0.15rem 0.5rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 800
                                                        }}>
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

                        {/* TAB 4: Profile Details */}
                        {activeTab === 'profile' && (
                            <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', maxWidth: '640px' }}>
                                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                                    Dados do Motorista
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
                                                <span title="Motorista Verificado" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                                                    <Icons.BadgeCheck />
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Motorista Oficial Tchapo Tchapo</div>
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
                                        <span style={{ color: '#64748b' }}>Tipo de Veículo:</span>
                                        <strong>{authDriver.vehicle_type || 'Mota'} {authDriver.vehicle_plate ? `(${authDriver.vehicle_plate})` : ''}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b' }}>Documento:</span>
                                        <strong>{authDriver.doc_type || 'BI'} • {authDriver.doc_number || 'Sem número'}</strong>
                                    </div>
                                </div>

                                {authDriver.doc_photo_url && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>
                                            Documento Submetido
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <img
                                                src={authDriver.doc_photo_url}
                                                alt="Documento"
                                                style={{ width: '80px', height: '55px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                                                onClick={() => setDocPreviewModal(authDriver.doc_photo_url)}
                                            />
                                            <button
                                                onClick={() => setDocPreviewModal(authDriver.doc_photo_url)}
                                                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                                            >
                                                Visualizar Foto do Documento
                                            </button>
                                        </div>
                                    </div>
                                )}

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

            {/* MODAL 1: Driver Registration Modal */}
            {isRegisterModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    backdropFilter: 'blur(5px)',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '2rem',
                        maxWidth: '560px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                                    Cadastrar como Motorista
                                </h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                                    Preencha os seus dados para submeter à aprovação da equipa.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsRegisterModalOpen(false)}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                    Nome Completo *
                                </label>
                                <input
                                    type="text" required
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    placeholder="Ex: Carlos Alberto Macamo"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Contacto WhatsApp *
                                    </label>
                                    <input
                                        type="text" required
                                        value={regPhone}
                                        onChange={(e) => setRegPhone(e.target.value)}
                                        placeholder="Ex: 258841234567"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Bairro Base na Beira *
                                    </label>
                                    <input
                                        type="text" required
                                        value={regBairro}
                                        onChange={(e) => setRegBairro(e.target.value)}
                                        placeholder="Ex: Macuti, Ponta Gêa"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Tipo de Veículo
                                    </label>
                                    <select
                                        value={regVehicleType}
                                        onChange={(e) => setRegVehicleType(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                                    >
                                        <option value="Mota">Moto / Scooter</option>
                                        <option value="Carro">Carro / Viatura</option>
                                        <option value="Bicicleta">Bicicleta</option>
                                        <option value="Carrinha">Carrinha / Van</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Matrícula (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={regVehiclePlate}
                                        onChange={(e) => setRegVehiclePlate(e.target.value)}
                                        placeholder="Ex: ABC-123-MC"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Tipo de Documento *
                                    </label>
                                    <select
                                        value={regDocType}
                                        onChange={(e) => setRegDocType(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                                    >
                                        <option value="BI">Bilhete de Identidade (BI)</option>
                                        <option value="Carta de Condução">Carta de Condução</option>
                                        <option value="DIRE">DIRE</option>
                                        <option value="Passaporte">Passaporte</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Número do Documento (ID) *
                                    </label>
                                    <input
                                        type="text" required
                                        value={regDocNumber}
                                        onChange={(e) => setRegDocNumber(e.target.value)}
                                        placeholder="Ex: 110100234567N"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Foto de Perfil
                                    </label>
                                    <input
                                        type="file" accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setPhotoFile(file);
                                            if (file) setPhotoPreview(URL.createObjectURL(file));
                                        }}
                                        style={{ width: '100%', fontSize: '0.8rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                        Foto do Documento (BI / Carta) *
                                    </label>
                                    <input
                                        type="file" accept="image/*" required
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setDocPhotoFile(file);
                                            if (file) setDocPhotoPreview(URL.createObjectURL(file));
                                        }}
                                        style={{ width: '100%', fontSize: '0.8rem' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                    Defina o seu PIN de 4 dígitos para Acesso *
                                </label>
                                <input
                                    type="password" maxLength="6" required
                                    value={regPin}
                                    onChange={(e) => setRegPin(e.target.value)}
                                    placeholder="Ex: 1234"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={regLoading}
                                style={{
                                    marginTop: '0.5rem',
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
                                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                                }}
                            >
                                <Icons.CheckCircle />
                                <span>{regLoading ? 'A enviar registo...' : 'Submeter Cadastro de Motorista'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: Login Modal */}
            {isLoginModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    backdropFilter: 'blur(5px)',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '2.25rem',
                        maxWidth: '420px',
                        width: '100%',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                                    Entrar no Portal
                                </h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                                    Aceda ao seu painel com telefone e PIN.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsLoginModalOpen(false)}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                    Telefone Registado *
                                </label>
                                <input
                                    type="text" required
                                    value={loginPhone}
                                    onChange={(e) => setLoginPhone(e.target.value)}
                                    placeholder="Ex: 258841234567 ou 841234567"
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#334151' }}>
                                    PIN de Acesso *
                                </label>
                                <input
                                    type="password" maxLength="6" required
                                    value={loginPin}
                                    onChange={(e) => setLoginPin(e.target.value)}
                                    placeholder="••••"
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', letterSpacing: '2px' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loginLoading}
                                style={{
                                    background: '#f59e0b',
                                    color: '#111827',
                                    border: 'none',
                                    padding: '0.85rem',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    opacity: loginLoading ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                                }}
                            >
                                <Icons.LogIn />
                                <span>{loginLoading ? 'A verificar...' : 'Entrar no Painel'}</span>
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                                Ainda não tem conta?{' '}
                                <button
                                    type="button"
                                    onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}
                                    style={{ background: 'none', border: 'none', color: '#d97706', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                >
                                    Cadastre-se aqui
                                </button>
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
                            alt="Documento do Motorista"
                            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '14px', objectFit: 'contain', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
