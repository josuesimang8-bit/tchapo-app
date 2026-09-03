import React, { useEffect, useState, useCallback, useRef } from 'react';

const STATUS_COLORS = {
    'Pendente':       { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    'Processando':    { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
    'Preparando':     { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' },
    'Com Motorista':  { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
    'Entregue':       { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    'Cancelado':      { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
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

    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'warnings' | 'profile'
    const [dashboardData, setDashboardData] = useState(null);
    const [toast, setToast] = useState(null);

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
    const [regDocType, setRegDocType] = useState('BI'); // 'BI' | 'Carta de Condução' | 'DIRE'
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

    const showToast = (msg, type = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Save session
    const saveSession = (driver) => {
        setAuthDriver(driver);
        try {
            localStorage.setItem('tchapo_driver_session', JSON.stringify(driver));
        } catch (_) {}
    };

    const handleLogout = () => {
        if (authDriver && isOnline) {
            handleToggleAvailability(false);
        }
        localStorage.removeItem('tchapo_driver_session');
        setAuthDriver(null);
        setDashboardData(null);
        setIsOnline(false);
        showToast('Sessão terminada.', 'info');
    };

    // Fetch Dashboard Data
    const fetchDashboard = useCallback(async (driverId = authDriver?.id) => {
        if (!driverId) return;
        try {
            const res = await fetch(`${API_URL}/api/drivers/${driverId}/dashboard`);
            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
                if (data.driver) {
                    setIsOnline(Boolean(data.driver.is_online));
                    setAuthDriver(prev => ({ ...prev, ...data.driver }));
                    try {
                        localStorage.setItem('tchapo_driver_session', JSON.stringify({ ...authDriver, ...data.driver }));
                    } catch (_) {}
                }
            }
        } catch (err) {
            console.error('Erro ao buscar dados do dashboard:', err);
        }
    }, [API_URL, authDriver]);

    // Initial Load & Polling
    useEffect(() => {
        if (authDriver?.id) {
            fetchDashboard(authDriver.id);
            const interval = setInterval(() => fetchDashboard(authDriver.id), 8000);
            return () => clearInterval(interval);
        }
    }, [authDriver?.id, fetchDashboard]);

    // Heartbeat to keep online status active
    useEffect(() => {
        if (authDriver?.id && isOnline && authDriver.approval_status === 'Aprovado') {
            heartbeatRef.current = setInterval(async () => {
                try {
                    await fetch(`${API_URL}/api/drivers/${authDriver.id}/availability`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ is_online: true })
                    });
                } catch (_) {}
            }, 25000);
            return () => clearInterval(heartbeatRef.current);
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
                throw new Error(data.error || 'Falha ao iniciar sessão');
            }
            saveSession(data);
            setIsOnline(Boolean(data.is_online));
            showToast(`Bem-vindo, ${data.name}!`, 'success');
            fetchDashboard(data.id);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoginLoading(false);
        }
    };

    // Handle Register
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!regName.trim() || !regPhone.trim()) {
            showToast('Por favor preencha o Nome e Telefone.', 'error');
            return;
        }
        if (!regDocNumber.trim()) {
            showToast(`Por favor introduza o número do seu ${regDocType}.`, 'error');
            return;
        }

        setRegLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', regName.trim());
            formData.append('phone', regPhone.trim());
            formData.append('bairro', regBairro);
            formData.append('vehicle_type', regVehicleType);
            formData.append('vehicle_plate', regVehiclePlate.trim());
            formData.append('doc_type', regDocType);
            formData.append('doc_number', regDocNumber.trim());
            formData.append('pin', regPin.trim() || '1234');

            if (photoFile) formData.append('photo', photoFile);
            if (docPhotoFile) formData.append('doc_photo', docPhotoFile);

            const res = await fetch(`${API_URL}/api/drivers/register`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao submeter cadastro');

            saveSession(data);
            showToast('Cadastro submetido! Aguarda aprovação.', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setRegLoading(false);
        }
    };

    // Handle Availability Toggle
    const handleToggleAvailability = async (targetState = !isOnline) => {
        if (!authDriver) return;
        setTogglingOnline(true);
        try {
            const res = await fetch(`${API_URL}/api/drivers/${authDriver.id}/availability`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_online: targetState })
            });
            if (res.ok) {
                setIsOnline(targetState);
                showToast(targetState ? '🟢 Você está ONLINE e pronto para entregas!' : '⚪ Você está OFFLINE (Pausa)', targetState ? 'success' : 'info');
                fetchDashboard(authDriver.id);
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
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                showToast(`Encomenda #${orderId} atualizada para "${newStatus}"!`, 'success');
                fetchDashboard(authDriver.id);
            }
        } catch (err) {
            showToast('Erro ao atualizar estado da encomenda.', 'error');
        }
    };

    const contactClient = (phone, customerName = 'Cliente', orderId = '') => {
        let cleaned = (phone || '').replace(/\s+/g, '').replace('+', '');
        if (!cleaned.startsWith('258') && cleaned.length === 9) {
            cleaned = '258' + cleaned;
        }
        const msg = encodeURIComponent(`Olá ${customerName}, sou o estafeta da Tchapo Tchapo responsável pela sua entrega #${orderId}. Já estou a caminho! 🛵💨`);
        window.open(`https://wa.me/${cleaned}?text=${msg}`, '_blank');
    };

    // 1. NOT LOGGED IN / AUTH SCREENS
    if (!authDriver) {
        return (
            <div style={styles.authContainer}>
                <div style={styles.authCard}>
                    <div style={styles.authHeader}>
                        <div style={styles.logoBadge}>🛵 TCHAPO TCHAPO</div>
                        <h1 style={styles.authTitle}>Portal do Motorista</h1>
                        <p style={styles.authSubtitle}>Faça login ou cadastre-se para realizar entregas na Beira</p>
                    </div>

                    <div style={styles.tabToggle}>
                        <button
                            type="button"
                            style={{ ...styles.tabBtn, ...(authMode === 'login' ? styles.tabBtnActive : {}) }}
                            onClick={() => setAuthMode('login')}
                        >
                            🔑 Iniciar Sessão
                        </button>
                        <button
                            type="button"
                            style={{ ...styles.tabBtn, ...(authMode === 'register' ? styles.tabBtnActive : {}) }}
                            onClick={() => setAuthMode('register')}
                        >
                            📝 Novo Cadastro
                        </button>
                    </div>

                    {authMode === 'login' && (
                        <form onSubmit={handleLogin} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>📱 Telefone / WhatsApp</label>
                                <input
                                    type="tel"
                                    placeholder="Ex: 841234567"
                                    style={styles.input}
                                    value={loginPhone}
                                    onChange={(e) => setLoginPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>🔒 PIN de Acesso (4 dígitos)</label>
                                <input
                                    type="password"
                                    placeholder="Ex: 1234"
                                    maxLength={6}
                                    style={styles.input}
                                    value={loginPin}
                                    onChange={(e) => setLoginPin(e.target.value)}
                                />
                                <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>
                                    PIN padrão é <strong>1234</strong> caso não tenha configurado.
                                </small>
                            </div>

                            <button type="submit" style={styles.primaryBtn} disabled={loginLoading}>
                                {loginLoading ? 'A verificar...' : '🚀 Entrar no Painel'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Ainda não é estafeta? </span>
                                <button
                                    type="button"
                                    style={styles.linkBtn}
                                    onClick={() => setAuthMode('register')}
                                >
                                    Cadastre-se aqui
                                </button>
                            </div>
                        </form>
                    )}

                    {authMode === 'register' && (
                        <form onSubmit={handleRegister} style={styles.form}>
                            <div style={styles.sectionDivider}>
                                <span>1. DADOS PESSOAIS</span>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>👤 Nome Completo *</label>
                                <input
                                    type="text"
                                    placeholder="Seu nome e apelido"
                                    style={styles.input}
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={styles.inputRow}>
                                <div style={{ ...styles.inputGroup, flex: 1 }}>
                                    <label style={styles.label}>📱 Telefone (WhatsApp) *</label>
                                    <input
                                        type="tel"
                                        placeholder="84 / 85 / 87..."
                                        style={styles.input}
                                        value={regPhone}
                                        onChange={(e) => setRegPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ ...styles.inputGroup, flex: 1 }}>
                                    <label style={styles.label}>📍 Bairro Principal</label>
                                    <select
                                        style={styles.input}
                                        value={regBairro}
                                        onChange={(e) => setRegBairro(e.target.value)}
                                    >
                                        <option value="Macuti">Macuti</option>
                                        <option value="Ponta Gêa">Ponta Gêa</option>
                                        <option value="Maquinino">Maquinino</option>
                                        <option value="Pioneiros">Pioneiros</option>
                                        <option value="Estoril">Estoril</option>
                                        <option value="Palmeiras">Palmeiras</option>
                                        <option value="Munhava">Munhava</option>
                                        <option value="Manga">Manga</option>
                                        <option value="Chota">Chota</option>
                                        <option value="Inhamizua">Inhamizua</option>
                                        <option value="Matacuane">Matacuane</option>
                                        <option value="Macurungo">Macurungo</option>
                                        <option value="Outro (Beira)">Outro (Beira)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={styles.sectionDivider}>
                                <span>2. VEÍCULO & TRANSPORTE</span>
                            </div>

                            <div style={styles.inputRow}>
                                <div style={{ ...styles.inputGroup, flex: 1 }}>
                                    <label style={styles.label}>🛵 Tipo de Veículo</label>
                                    <select
                                        style={styles.input}
                                        value={regVehicleType}
                                        onChange={(e) => setRegVehicleType(e.target.value)}
                                    >
                                        <option value="Mota">Mota 🏍️</option>
                                        <option value="Bicicleta">Bicicleta 🚲</option>
                                        <option value="Carro">Carro 🚗</option>
                                        <option value="A pé">A pé 🚶</option>
                                    </select>
                                </div>
                                <div style={{ ...styles.inputGroup, flex: 1 }}>
                                    <label style={styles.label}>Matrícula / Modelo</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: ABC-123-MC"
                                        style={styles.input}
                                        value={regVehiclePlate}
                                        onChange={(e) => setRegVehiclePlate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={styles.sectionDivider}>
                                <span>3. DOCUMENTAÇÃO OBRIGATÓRIA</span>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>📄 Escolha o Documento *</label>
                                <div style={styles.docTypeSelector}>
                                    {['BI', 'Carta de Condução', 'DIRE'].map((doc) => (
                                        <button
                                            key={doc}
                                            type="button"
                                            style={{
                                                ...styles.docTypeBtn,
                                                ...(regDocType === doc ? styles.docTypeBtnActive : {})
                                            }}
                                            onClick={() => setRegDocType(doc)}
                                        >
                                            {doc === 'BI' ? '🆔 BI' : doc === 'Carta de Condução' ? '🚗 Carta Condução' : '🌍 DIRE'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>🔢 Número / ID do {regDocType} *</label>
                                <input
                                    type="text"
                                    placeholder={`Ex: Número do ${regDocType}`}
                                    style={styles.input}
                                    value={regDocNumber}
                                    onChange={(e) => setRegDocNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={styles.inputRow}>
                                <div style={{ ...styles.inputGroup, flex: 1 }}>
                                    <label style={styles.label}>📸 Foto do {regDocType} *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={styles.fileInput}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setDocPhotoFile(file);
                                                setDocPhotoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {docPhotoPreview && (
                                        <img src={docPhotoPreview} alt="Doc Preview" style={styles.thumbPreview} />
                                    )}
                                </div>

                                <div style={{ ...styles.inputGroup, flex: 1 }}>
                                    <label style={styles.label}>🤳 Foto de Perfil (Rosto)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={styles.fileInput}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setPhotoFile(file);
                                                setPhotoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {photoPreview && (
                                        <img src={photoPreview} alt="Photo Preview" style={styles.thumbPreview} />
                                    )}
                                </div>
                            </div>

                            <div style={styles.sectionDivider}>
                                <span>4. SEGURANÇA DE ACESSO</span>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>🔒 Criar PIN de Acesso (4 dígitos)</label>
                                <input
                                    type="password"
                                    placeholder="Ex: 5678"
                                    maxLength={6}
                                    style={styles.input}
                                    value={regPin}
                                    onChange={(e) => setRegPin(e.target.value)}
                                />
                            </div>

                            <button type="submit" style={styles.primaryBtn} disabled={regLoading}>
                                {regLoading ? 'A enviar documentação...' : '📩 Submeter Cadastro para Aprovação'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Já tem conta? </span>
                                <button
                                    type="button"
                                    style={styles.linkBtn}
                                    onClick={() => setAuthMode('login')}
                                >
                                    Fazer Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                {renderToast()}
            </div>
        );
    }

    // 2. APPROVAL PENDING / REJECTED / SUSPENDED STATE
    const approvalStatus = authDriver.approval_status || 'Pendente';

    if (approvalStatus !== 'Aprovado') {
        return (
            <div style={styles.authContainer}>
                <div style={styles.authCard}>
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        {approvalStatus === 'Pendente' && (
                            <>
                                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>⏳</div>
                                <h2 style={{ color: '#0b3c6d', fontSize: '1.6rem', fontWeight: 800 }}>Cadastro em Análise</h2>
                                <div style={styles.badgePending}>Aguardando Aprovação do Administrador</div>
                                <p style={{ color: '#475569', fontSize: '0.95rem', margin: '1.2rem 0', lineHeight: 1.6 }}>
                                    Olá <strong>{authDriver.name}</strong>, a sua conta e documentação (<strong>{authDriver.doc_type || 'BI'} nº {authDriver.doc_number || 'enviado'}</strong>) foram submetidas com sucesso e estão a ser revistas pela administração da Tchapo Tchapo.
                                </p>
                                <div style={styles.pendingInfoBox}>
                                    <div><strong>Telefone:</strong> {authDriver.phone}</div>
                                    <div><strong>Veículo:</strong> {authDriver.vehicle_type || 'Mota'} ({authDriver.bairro || 'Beira'})</div>
                                    <div><strong>Estado:</strong> <span style={{ color: '#d97706', fontWeight: 700 }}>Em Revisão</span></div>
                                </div>
                            </>
                        )}

                        {approvalStatus === 'Recusado' && (
                            <>
                                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>❌</div>
                                <h2 style={{ color: '#991b1b', fontSize: '1.6rem', fontWeight: 800 }}>Cadastro Não Aprovado</h2>
                                <p style={{ color: '#475569', fontSize: '0.95rem', margin: '1.2rem 0' }}>
                                    O seu pedido de adesão não foi aceite pela equipa da Tchapo Tchapo. Por favor verifique a documentação enviada ou contacte o suporte.
                                </p>
                            </>
                        )}

                        {approvalStatus === 'Suspenso' && (
                            <>
                                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🚫</div>
                                <h2 style={{ color: '#991b1b', fontSize: '1.6rem', fontWeight: 800 }}>Conta Suspensa</h2>
                                <p style={{ color: '#475569', fontSize: '0.95rem', margin: '1.2rem 0' }}>
                                    A sua conta de motorista foi temporariamente suspensa por motivos administrativos ou violação de diretrizes.
                                </p>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                style={{ ...styles.primaryBtn, flex: 1 }}
                                onClick={() => fetchDashboard(authDriver.id)}
                            >
                                🔄 Atualizar Estado
                            </button>
                            <button
                                style={{ ...styles.secondaryBtn, flex: 1 }}
                                onClick={handleLogout}
                            >
                                Sair da Conta
                            </button>
                        </div>
                    </div>
                </div>
                {renderToast()}
            </div>
        );
    }

    // 3. MAIN DRIVER PORTAL DASHBOARD (APPROVED)
    const stats = dashboardData?.stats || {
        today_earnings: 0,
        week_earnings: 0,
        total_earnings: 0,
        today_deliveries: 0,
        total_deliveries: 0,
        active_deliveries: 0,
        rate_per_delivery: 150
    };

    const activeOrders = dashboardData?.active_orders || [];
    const recentDeliveries = dashboardData?.recent_deliveries || [];
    const warnings = dashboardData?.warnings || [];

    return (
        <div style={styles.mainContainer}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.driverProfile}>
                        <img
                            src={authDriver.photo_url || '/assets/default_avatar.png'}
                            alt={authDriver.name}
                            style={styles.avatarImg}
                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(authDriver.name); }}
                        />
                        <div>
                            <div style={styles.driverName}>{authDriver.name}</div>
                            <div style={styles.driverMetaText}>
                                🛵 {authDriver.vehicle_type || 'Mota'} • {authDriver.bairro || 'Beira'}
                            </div>
                        </div>
                    </div>

                    <div style={styles.availabilityWrapper}>
                        <button
                            type="button"
                            disabled={togglingOnline}
                            onClick={() => handleToggleAvailability(!isOnline)}
                            style={{
                                ...styles.availabilityBtn,
                                ...(isOnline ? styles.onlineActiveBtn : styles.offlineBtn)
                            }}
                        >
                            <span style={{
                                ...styles.pulsingDot,
                                backgroundColor: isOnline ? '#22c55e' : '#94a3b8',
                                boxShadow: isOnline ? '0 0 10px #22c55e' : 'none'
                            }}></span>
                            {isOnline ? '🟢 DISPONÍVEL (ONLINE)' : '⚪ INDISPONÍVEL (OFFLINE)'}
                        </button>
                    </div>
                </div>
            </header>

            <div style={styles.navBar}>
                <div style={styles.navBarInner}>
                    <button
                        style={{ ...styles.navTab, ...(activeTab === 'dashboard' ? styles.navTabActive : {}) }}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 Faturamento
                    </button>
                    <button
                        style={{ ...styles.navTab, ...(activeTab === 'orders' ? styles.navTabActive : {}) }}
                        onClick={() => setActiveTab('orders')}
                    >
                        🛵 Entregas ({activeOrders.length})
                    </button>
                    <button
                        style={{ ...styles.navTab, ...(activeTab === 'warnings' ? styles.navTabActive : {}) }}
                        onClick={() => setActiveTab('warnings')}
                    >
                        ⚠️ Advertências {warnings.length > 0 && <span style={styles.warningCountBadge}>{warnings.length}</span>}
                    </button>
                    <button
                        style={{ ...styles.navTab, ...(activeTab === 'profile' ? styles.navTabActive : {}) }}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 Meu Perfil
                    </button>
                </div>
            </div>

            <main style={styles.content}>
                {activeTab === 'dashboard' && (
                    <div style={styles.tabContent}>
                        {!isOnline && (
                            <div style={styles.offlineNotice}>
                                ⚠️ <strong>Você está offline.</strong> Ative o botão <em>"DISPONÍVEL"</em> no topo para receber novos pedidos e entregas!
                            </div>
                        )}

                        <div style={styles.metricGrid}>
                            <div style={styles.metricCard}>
                                <div style={styles.metricLabel}>💰 Ganho Hoje</div>
                                <div style={styles.metricValue}>{formatMZCurrency(stats.today_earnings)}</div>
                                <div style={styles.metricSub}>{stats.today_deliveries} entregas feitas hoje</div>
                            </div>

                            <div style={styles.metricCard}>
                                <div style={styles.metricLabel}>📅 Esta Semana</div>
                                <div style={styles.metricValue}>{formatMZCurrency(stats.week_earnings)}</div>
                                <div style={styles.metricSub}>Acumulado 7 dias</div>
                            </div>

                            <div style={styles.metricCard}>
                                <div style={styles.metricLabel}>🏁 Total Entregas</div>
                                <div style={styles.metricValue}>{stats.total_deliveries}</div>
                                <div style={styles.metricSub}>Concluídas com sucesso</div>
                            </div>

                            <div style={styles.metricCard}>
                                <div style={styles.metricLabel}>💵 Faturamento Total</div>
                                <div style={{ ...styles.metricValue, color: '#16a34a' }}>{formatMZCurrency(stats.total_earnings)}</div>
                                <div style={styles.metricSub}>Taxa: {stats.rate_per_delivery} MT / entrega</div>
                            </div>
                        </div>

                        <div style={styles.sectionCard}>
                            <div style={styles.sectionHeaderRow}>
                                <h3 style={styles.sectionTitle}>🛵 Entregas em Curso ({activeOrders.length})</h3>
                                <button style={styles.linkBtn} onClick={() => setActiveTab('orders')}>Ver Todas ➔</button>
                            </div>

                            {activeOrders.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
                                    <div style={{ fontWeight: 700, color: '#475569' }}>Nenhuma entrega em andamento</div>
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Assim que o administrador atribuir um pedido, ele aparecerá aqui.</div>
                                </div>
                            ) : (
                                activeOrders.map(order => (
                                    <div key={order.id} style={styles.orderCard}>
                                        <div style={styles.orderHeader}>
                                            <span style={styles.orderId}>Pedido #{order.id}</span>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: STATUS_COLORS[order.status]?.bg || '#eee',
                                                color: STATUS_COLORS[order.status]?.color || '#333'
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div style={styles.orderBody}>
                                            <div><strong>👤 Cliente:</strong> {order.customer_name}</div>
                                            <div><strong>📍 Destino:</strong> {order.bairro} — {order.address}</div>
                                            <div><strong>💵 Valor a Cobrar:</strong> {formatMZCurrency(order.total)} ({order.payment})</div>
                                        </div>
                                        <div style={styles.orderActions}>
                                            <button
                                                style={styles.whatsappActionBtn}
                                                onClick={() => contactClient(order.phone, order.customer_name, order.id)}
                                            >
                                                📱 Contactar Cliente no WhatsApp
                                            </button>
                                            {order.status !== 'Com Motorista' && (
                                                <button
                                                    style={styles.transitActionBtn}
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'Com Motorista')}
                                                >
                                                    🛵 Iniciar Transporte
                                                </button>
                                            )}
                                            <button
                                                style={styles.deliverActionBtn}
                                                onClick={() => handleUpdateOrderStatus(order.id, 'Entregue')}
                                            >
                                                ✅ Concluir Entrega
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div style={styles.tabContent}>
                        <h2 style={styles.pageTitle}>Gestão de Entregas</h2>

                        <div style={styles.sectionCard}>
                            <h3 style={styles.sectionTitle}>🔴 Pedidos Ativos para Entrega ({activeOrders.length})</h3>
                            {activeOrders.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p>Nenhuma entrega ativa no momento.</p>
                                </div>
                            ) : (
                                activeOrders.map(order => (
                                    <div key={order.id} style={styles.orderCard}>
                                        <div style={styles.orderHeader}>
                                            <span style={styles.orderId}>Pedido #{order.id}</span>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: STATUS_COLORS[order.status]?.bg || '#eee',
                                                color: STATUS_COLORS[order.status]?.color || '#333'
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div style={styles.orderBody}>
                                            <div><strong>Cliente:</strong> {order.customer_name}</div>
                                            <div><strong>Telefone:</strong> {order.phone}</div>
                                            <div><strong>Endereço:</strong> {order.bairro}, {order.address}</div>
                                            <div><strong>Total:</strong> {formatMZCurrency(order.total)} ({order.payment})</div>
                                            {order.items && order.items.length > 0 && (
                                                <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px' }}>
                                                    <strong>Itens:</strong>
                                                    <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.85rem' }}>
                                                        {order.items.map((it, idx) => (
                                                            <li key={idx}>{it.quantity}x {it.product_name || it.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <div style={styles.orderActions}>
                                            <button
                                                style={styles.whatsappActionBtn}
                                                onClick={() => contactClient(order.phone, order.customer_name, order.id)}
                                            >
                                                📱 WhatsApp do Cliente
                                            </button>
                                            {order.status !== 'Com Motorista' ? (
                                                <button
                                                    style={styles.transitActionBtn}
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'Com Motorista')}
                                                >
                                                    🛵 Peguei a Encomenda
                                                </button>
                                            ) : (
                                                <button
                                                    style={styles.deliverActionBtn}
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'Entregue')}
                                                >
                                                    ✅ Entrega Efetuada com Sucesso
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={styles.sectionCard}>
                            <h3 style={styles.sectionTitle}>🏁 Histórico de Entregas Concluídas ({recentDeliveries.length})</h3>
                            {recentDeliveries.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p>Nenhuma entrega concluída recentemente.</p>
                                </div>
                            ) : (
                                <div style={styles.historyList}>
                                    {recentDeliveries.map(order => (
                                        <div key={order.id} style={styles.historyItem}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#1e293b' }}>
                                                    Pedido #{order.id} — {order.customer_name}
                                                </div>
                                                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                    {order.bairro} • {new Date(order.created_at).toLocaleDateString('pt-MZ')}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 800, color: '#16a34a' }}>+150 MT</div>
                                                <div style={{ fontSize: '0.78rem', color: '#059669' }}>Entregue ✅</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'warnings' && (
                    <div style={styles.tabContent}>
                        <h2 style={styles.pageTitle}>Registo de Advertências e Conduta</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                            Mantenha um bom índice de pontualidade e comunicação para evitar penalizações na sua conta.
                        </p>

                        {warnings.length === 0 ? (
                            <div style={styles.noWarningsCard}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
                                <h3 style={{ color: '#166534', fontWeight: 800, marginBottom: '0.25rem' }}>Excelente Registo!</h3>
                                <p style={{ color: '#15803d', fontSize: '0.9rem' }}>
                                    Você não possui nenhuma advertência registada. Continue prestando um serviço pontual e de qualidade!
                                </p>
                            </div>
                        ) : (
                            <div style={styles.warningList}>
                                {warnings.map(w => {
                                    const isGrave = w.severity === 'Grave';
                                    const isMedia = w.severity === 'Média';
                                    const cardColor = isGrave ? '#fee2e2' : isMedia ? '#ffedd5' : '#fef9c3';
                                    const borderColor = isGrave ? '#ef4444' : isMedia ? '#f97316' : '#eab308';
                                    const textColor = isGrave ? '#991b1b' : isMedia ? '#9a3412' : '#854d0e';

                                    return (
                                        <div key={w.id} style={{ ...styles.warningCard, background: cardColor, borderColor }}>
                                            <div style={styles.warningHeader}>
                                                <span style={{ fontWeight: 800, color: textColor }}>
                                                    ⚠️ Advertência ({w.severity || 'Leve'})
                                                </span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                    {w.issued_at ? new Date(w.issued_at).toLocaleString('pt-MZ') : 'Recentemente'}
                                                </span>
                                            </div>
                                            <div style={{ ...styles.warningReason, color: textColor }}>
                                                <strong>Motivo:</strong> {w.reason}
                                            </div>
                                            {w.notes && (
                                                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                                                    <strong>Observações:</strong> {w.notes}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div style={styles.tabContent}>
                        <h2 style={styles.pageTitle}>Meu Perfil de Estafeta</h2>

                        <div style={styles.profileCard}>
                            <div style={styles.profileHeaderSection}>
                                <img
                                    src={authDriver.photo_url || '/assets/default_avatar.png'}
                                    alt={authDriver.name}
                                    style={styles.profileBigAvatar}
                                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(authDriver.name); }}
                                />
                                <div>
                                    <h3 style={{ fontSize: '1.3rem', color: '#0b3c6d', fontWeight: 800 }}>{authDriver.name}</h3>
                                    <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>
                                        🟢 Estafeta Aprovado Tchapo Tchapo
                                    </div>
                                </div>
                            </div>

                            <div style={styles.profileDetailsGrid}>
                                <div style={styles.profileDetailItem}>
                                    <span style={styles.detailLabel}>📱 Telefone</span>
                                    <span style={styles.detailValue}>{authDriver.phone}</span>
                                </div>
                                <div style={styles.profileDetailItem}>
                                    <span style={styles.detailLabel}>📍 Bairro de Actuação</span>
                                    <span style={styles.detailValue}>{authDriver.bairro || 'Beira'}</span>
                                </div>
                                <div style={styles.profileDetailItem}>
                                    <span style={styles.detailLabel}>🛵 Veículo</span>
                                    <span style={styles.detailValue}>{authDriver.vehicle_type || 'Mota'} ({authDriver.vehicle_plate || 'Sem matrícula'})</span>
                                </div>
                                <div style={styles.profileDetailItem}>
                                    <span style={styles.detailLabel}>📄 Documento Cadastrado</span>
                                    <span style={styles.detailValue}>{authDriver.doc_type || 'BI'}: {authDriver.doc_number || 'N/A'}</span>
                                </div>
                            </div>

                            {authDriver.doc_photo_url && (
                                <div style={{ marginTop: '1.2rem' }}>
                                    <span style={styles.detailLabel}>📸 Foto do Documento Enviado</span>
                                    <img src={authDriver.doc_photo_url} alt="Documento" style={styles.docImagePreview} />
                                </div>
                            )}

                            <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.2rem' }}>
                                <button style={styles.logoutBtn} onClick={handleLogout}>
                                    🚪 Sair da Conta (Logout)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {renderToast()}
        </div>
    );

    function renderToast() {
        if (!toast) return null;
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        return (
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                background: isError ? '#991b1b' : isSuccess ? '#166534' : '#0f172a',
                color: '#fff',
                padding: '0.85rem 1.6rem',
                borderRadius: '30px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                {toast.msg}
            </div>
        );
    }
}

const styles = {
    authContainer: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0b3c6d 0%, #032042 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    },
    authCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
    },
    authHeader: {
        textAlign: 'center',
        marginBottom: '1.5rem'
    },
    logoBadge: {
        display: 'inline-block',
        background: '#f97316',
        color: '#ffffff',
        fontWeight: 900,
        fontSize: '0.85rem',
        padding: '4px 12px',
        borderRadius: '20px',
        letterSpacing: '1px',
        marginBottom: '0.5rem'
    },
    authTitle: {
        color: '#0b3c6d',
        fontSize: '1.75rem',
        fontWeight: 800,
        margin: '0.2rem 0'
    },
    authSubtitle: {
        color: '#64748b',
        fontSize: '0.9rem'
    },
    tabToggle: {
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '1.5rem'
    },
    tabBtn: {
        flex: 1,
        padding: '0.65rem',
        border: 'none',
        background: 'transparent',
        borderRadius: '10px',
        fontWeight: 700,
        fontSize: '0.9rem',
        color: '#64748b',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    tabBtnActive: {
        background: '#ffffff',
        color: '#0b3c6d',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    sectionDivider: {
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#94a3b8',
        letterSpacing: '1px',
        margin: '0.5rem 0 0.2rem 0',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '4px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    inputRow: {
        display: 'flex',
        gap: '0.75rem'
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: '#1e293b'
    },
    input: {
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '1.5px solid #cbd5e1',
        fontSize: '0.95rem',
        outline: 'none',
        fontFamily: 'inherit'
    },
    fileInput: {
        fontSize: '0.85rem',
        color: '#475569'
    },
    docTypeSelector: {
        display: 'flex',
        gap: '6px'
    },
    docTypeBtn: {
        flex: 1,
        padding: '0.5rem',
        border: '1.5px solid #cbd5e1',
        background: '#f8fafc',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: 700,
        color: '#475569',
        cursor: 'pointer'
    },
    docTypeBtnActive: {
        background: '#eff6ff',
        borderColor: '#3b82f6',
        color: '#1d4ed8'
    },
    thumbPreview: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginTop: '6px',
        border: '1px solid #cbd5e1'
    },
    primaryBtn: {
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        color: '#fff',
        border: 'none',
        padding: '0.9rem',
        borderRadius: '12px',
        fontWeight: 800,
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.35)',
        marginTop: '0.5rem'
    },
    secondaryBtn: {
        background: '#f1f5f9',
        color: '#475569',
        border: '1px solid #cbd5e1',
        padding: '0.9rem',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: 'pointer'
    },
    linkBtn: {
        background: 'none',
        border: 'none',
        color: '#f97316',
        fontWeight: 700,
        cursor: 'pointer',
        textDecoration: 'underline'
    },
    badgePending: {
        display: 'inline-block',
        background: '#fef3c7',
        color: '#92400e',
        padding: '4px 14px',
        borderRadius: '20px',
        fontWeight: 700,
        fontSize: '0.85rem'
    },
    pendingInfoBox: {
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '1rem',
        textAlign: 'left',
        fontSize: '0.9rem',
        color: '#334155',
        lineHeight: 1.8,
        border: '1px solid #e2e8f0'
    },
    mainContainer: {
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    },
    header: {
        background: '#0b3c6d',
        color: '#ffffff',
        padding: '1rem 1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    headerInner: {
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    driverProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    avatarImg: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ffffff'
    },
    driverName: {
        fontWeight: 800,
        fontSize: '1.15rem'
    },
    driverMetaText: {
        fontSize: '0.82rem',
        color: '#cbd5e1'
    },
    availabilityWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    availabilityBtn: {
        border: 'none',
        padding: '0.65rem 1.4rem',
        borderRadius: '30px',
        fontWeight: 800,
        fontSize: '0.88rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    onlineActiveBtn: {
        background: '#15803d',
        color: '#ffffff',
        border: '2px solid #4ade80'
    },
    offlineBtn: {
        background: '#334155',
        color: '#cbd5e1',
        border: '2px solid #64748b'
    },
    pulsingDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%'
    },
    navBar: {
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    navBarInner: {
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        overflowX: 'auto'
    },
    navTab: {
        flex: 1,
        padding: '1rem 0.5rem',
        background: 'transparent',
        border: 'none',
        borderBottom: '3px solid transparent',
        fontWeight: 700,
        fontSize: '0.92rem',
        color: '#64748b',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
    },
    navTabActive: {
        color: '#0b3c6d',
        borderBottomColor: '#f97316'
    },
    warningCountBadge: {
        background: '#ef4444',
        color: '#fff',
        fontSize: '0.75rem',
        padding: '2px 6px',
        borderRadius: '10px'
    },
    content: {
        maxWidth: '1000px',
        margin: '1.5rem auto',
        padding: '0 1rem'
    },
    tabContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    pageTitle: {
        fontSize: '1.4rem',
        fontWeight: 800,
        color: '#0b3c6d',
        margin: 0
    },
    offlineNotice: {
        background: '#fffbeb',
        border: '1.5px solid #fef3c7',
        color: '#92400e',
        padding: '1rem',
        borderRadius: '12px',
        fontSize: '0.92rem'
    },
    metricGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
    },
    metricCard: {
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0'
    },
    metricLabel: {
        fontSize: '0.85rem',
        color: '#64748b',
        fontWeight: 700,
        marginBottom: '6px'
    },
    metricValue: {
        fontSize: '1.65rem',
        fontWeight: 900,
        color: '#0b3c6d'
    },
    metricSub: {
        fontSize: '0.78rem',
        color: '#94a3b8',
        marginTop: '4px'
    },
    sectionCard: {
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0'
    },
    sectionHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: 800,
        color: '#0b3c6d',
        margin: 0
    },
    emptyState: {
        textAlign: 'center',
        padding: '2rem 1rem',
        color: '#64748b'
    },
    orderCard: {
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        background: '#fafafa'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
    },
    orderId: {
        fontWeight: 800,
        color: '#0b3c6d',
        fontSize: '1.05rem'
    },
    statusBadge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontWeight: 700,
        fontSize: '0.8rem'
    },
    orderBody: {
        fontSize: '0.9rem',
        color: '#334155',
        lineHeight: 1.6,
        marginBottom: '1rem'
    },
    orderActions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
    },
    whatsappActionBtn: {
        flex: 1,
        minWidth: '200px',
        background: '#25D366',
        color: '#ffffff',
        border: 'none',
        padding: '0.65rem 1rem',
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: '0.88rem',
        cursor: 'pointer'
    },
    transitActionBtn: {
        background: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        padding: '0.65rem 1rem',
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: '0.88rem',
        cursor: 'pointer'
    },
    deliverActionBtn: {
        background: '#16a34a',
        color: '#ffffff',
        border: 'none',
        padding: '0.65rem 1rem',
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: '0.88rem',
        cursor: 'pointer'
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    historyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
    },
    noWarningsCard: {
        background: '#f0fdf4',
        border: '1.5px solid #bbf7d0',
        borderRadius: '16px',
        padding: '2.5rem 1.5rem',
        textAlign: 'center'
    },
    warningList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    warningCard: {
        border: '1.5px solid',
        borderRadius: '12px',
        padding: '1rem'
    },
    warningHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
    },
    warningReason: {
        fontSize: '0.95rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    profileCard: {
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
    },
    profileHeaderSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '1.5rem'
    },
    profileBigAvatar: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #0b3c6d'
    },
    profileDetailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
    },
    profileDetailItem: {
        background: '#f8fafc',
        padding: '0.85rem',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    detailLabel: {
        fontSize: '0.78rem',
        fontWeight: 700,
        color: '#64748b'
    },
    detailValue: {
        fontSize: '0.95rem',
        fontWeight: 800,
        color: '#1e293b'
    },
    docImagePreview: {
        width: '100%',
        maxWidth: '320px',
        borderRadius: '10px',
        marginTop: '6px',
        border: '1px solid #cbd5e1'
    },
    logoutBtn: {
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fecaca',
        padding: '0.75rem 1.5rem',
        borderRadius: '10px',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer'
    }
};
