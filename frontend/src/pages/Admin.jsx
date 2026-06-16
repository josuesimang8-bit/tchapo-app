import React, { useEffect, useState, useRef, useCallback } from 'react';

const STATUS_COLORS = {
    'Pendente':       { bg: '#fef3c7', color: '#92400e' },
    'Processando':    { bg: '#dbeafe', color: '#1e40af' },
    'Preparando':     { bg: '#ede9fe', color: '#5b21b6' },
    'Com Motorista':  { bg: '#d1fae5', color: '#065f46' },
    'Entregue':       { bg: '#dcfce7', color: '#166534' },
    'Cancelado':      { bg: '#fee2e2', color: '#991b1b' },
};

// Generates a short notification sound using Web Audio API
function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const times = [0, 0.15, 0.3];
        times.forEach((t) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = t === 0 ? 880 : t === 0.15 ? 1100 : 1320;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.4, ctx.currentTime + t);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.12);
            osc.start(ctx.currentTime + t);
            osc.stop(ctx.currentTime + t + 0.15);
        });
    } catch (e) { /* silent fail */ }
}

export default function Admin() {
    const [orders, setOrders]           = useState([]);
    const [drivers, setDrivers]         = useState([]);
    const [isLoggedIn, setIsLoggedIn]   = useState(false);
    const [pin, setPin]                 = useState('');
    const [newCount, setNewCount]       = useState(0);
    const [notifAllowed, setNotifAllowed] = useState(false);
    const [toast, setToast]             = useState(null);
    const [deleteToConfirm, setDeleteToConfirm] = useState(null);
    const intervalRef                   = useRef(null);
    const prevOrdersRef                 = useRef([]);
    const prevWithdrawalsRef            = useRef([]);
    
    // Tabs state: 'orders', 'drivers' or 'products'
    const [activeTab, setActiveTab]     = useState('orders');

    // New Driver form state
    const [newDriverName, setNewDriverName]   = useState('');
    const [newDriverPhone, setNewDriverPhone] = useState('');
    const [newDriverPhoto, setNewDriverPhoto] = useState(null);
    const [uploading, setUploading]           = useState(false);

    // --- Product management state ---
    const [products, setProducts]             = useState([]);

    // Referral withdrawals state
    const [withdrawals, setWithdrawals] = useState([]);
    const [pendingWithdrawalsCount, setPendingWithdrawalsCount] = useState(0);
    
    // New Product form state
    const [newProdName, setNewProdName]       = useState('');
    const [newProdPrice, setNewProdPrice]     = useState('');
    const [newProdCategory, setNewProdCategory] = useState('Smartphones');
    const [newProdCustomCat, setNewProdCustomCat] = useState('');
    const [newProdDesc, setNewProdDesc]       = useState('');
    const [newProdFeatures, setNewProdFeatures] = useState('');
    const [newProdPhoto, setNewProdPhoto]     = useState(null);
    const [uploadingProd, setUploadingProd]   = useState(false);
    const [newProdDeviceSel, setNewProdDeviceSel] = useState('none');
    const [newProdColorSel, setNewProdColorSel]   = useState('show');

    // Edit Product modal state
    const [editingProduct, setEditingProduct] = useState(null);
    const [editProdName, setEditProdName]     = useState('');
    const [editProdPrice, setEditProdPrice]   = useState('');
    const [editProdCategory, setEditProdCategory] = useState('');
    const [editProdCustomCat, setEditProdCustomCat] = useState('');
    const [editProdDesc, setEditProdDesc]     = useState('');
    const [editProdFeatures, setEditProdFeatures] = useState('');
    const [editProdImageUrl, setEditProdImageUrl] = useState('');
    const [editProdPhoto, setEditProdPhoto]   = useState(null);
    const [savingProd, setSavingProd]         = useState(false);
    const [editProdDeviceSel, setEditProdDeviceSel] = useState('none');
    const [editProdColorSel, setEditProdColorSel]   = useState('show');

    const [deleteProdToConfirm, setDeleteProdToConfirm] = useState(null);

    // --- Notifications permission ---
    const requestNotifPermission = useCallback(async () => {
        if (!('Notification' in window)) return;
        const perm = await Notification.requestPermission();
        setNotifAllowed(perm === 'granted');
    }, []);

    // --- Send desktop notification ---
    const sendNotification = useCallback((order) => {
        playNotificationSound();
        if (notifAllowed) {
            const n = new Notification('🛍️ Novo Pedido — Tchapo Tchapo!', {
                body: `${order.customer_name} • ${order.bairro} • ${order.total} MT`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `order-${order.id}`,
                requireInteraction: true,
            });
            n.onclick = () => { window.focus(); n.close(); };
        }
        setToast(`🔔 Novo pedido de ${order.customer_name} (${order.bairro}) — ${order.total} MT`);
        setTimeout(() => setToast(null), 6000);
    }, [notifAllowed]);

    // --- Fetch orders & detect new ones ---
    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders');
            if (!res.ok) return;
            const data = await res.json();
            const prev = prevOrdersRef.current;

            if (prev.length > 0 && data.length > prev.length) {
                const newOrders = data.filter(o => !prev.find(p => p.id === o.id));
                newOrders.forEach(o => sendNotification(o));
                setNewCount(c => c + newOrders.length);
            }

            prevOrdersRef.current = data;
            setOrders(data);
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
        }
    }, [sendNotification]);

    // --- Fetch drivers ---
    const fetchDrivers = useCallback(async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/drivers');
            if (!res.ok) return;
            const data = await res.json();
            setDrivers(data);
        } catch (err) {
            console.error('Erro ao buscar motoristas:', err);
        }
    }, []);

    // --- Fetch products ---
    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/products/admin');
            if (!res.ok) return;
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
        }
    }, []);

    // --- Fetch withdrawals ---
    const fetchWithdrawals = useCallback(async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/referrals/admin/withdrawals');
            if (!res.ok) return;
            const data = await res.json();
            setWithdrawals(data);
            const pending = data.filter(w => w.status === 'Pendente');
            const prev = prevWithdrawalsRef.current;
            
            if (prev.length > 0 && pending.length > pendingWithdrawalsCount) {
                const newWithdrawals = pending.filter(w => !prev.find(oldW => oldW.id === w.id));
                newWithdrawals.forEach(w => {
                    playNotificationSound();
                    if (notifAllowed) {
                        const n = new Notification('💰 Novo Saque Solicitado!', {
                            body: `${w.user_name} • ${w.payment_method || 'M-Pesa'}: ${w.payment_phone} • ${w.amount} MT`,
                            icon: '/favicon.ico',
                            badge: '/favicon.ico',
                            tag: `withdraw-${w.id}`,
                            requireInteraction: true,
                        });
                        n.onclick = () => { window.focus(); n.close(); };
                    }
                });
                setToast('🔔 Nova solicitação de saque recebida!');
                setTimeout(() => setToast(null), 4000);
            }
            
            prevWithdrawalsRef.current = pending;
            setPendingWithdrawalsCount(pending.length);
        } catch (err) {
            console.error('Erro ao buscar saques:', err);
        }
    }, [pendingWithdrawalsCount, notifAllowed]);

    const handleProcessWithdrawal = async (id, status) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/admin/withdrawals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setToast(`Saque marcado como ${status === 'Pago' ? 'pago' : 'cancelado'} com sucesso!`);
                setTimeout(() => setToast(null), 3000);
                fetchWithdrawals();
            } else {
                const err = await res.json();
                setToast(`Erro: ${err.error || 'Não foi possível atualizar o estado.'}`);
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error('Erro ao processar saque:', err);
            setToast('Erro de rede ao processar saque.');
            setTimeout(() => setToast(null), 3000);
        }
    };

    // --- Auto-refresh every 10s when logged in ---
    useEffect(() => {
        if (isLoggedIn) {
            requestNotifPermission();
            fetchOrders();
            fetchDrivers();
            fetchProducts();
            fetchWithdrawals();
            intervalRef.current = setInterval(() => {
                fetchOrders();
                fetchDrivers();
                fetchProducts();
                fetchWithdrawals();
            }, 10000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isLoggedIn, fetchOrders, fetchDrivers, fetchProducts, fetchWithdrawals, requestNotifPermission]);

    // --- Tab title badge ---
    useEffect(() => {
        document.title = newCount > 0
            ? `(${newCount}) Novos Pedidos — Admin Tchapo`
            : 'Admin — Tchapo Tchapo';
    }, [newCount]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (pin === '1234') {
            setIsLoggedIn(true);
        } else {
            alert('PIN Incorreto. Dica: 1234');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(import.meta.env.VITE_API_URL + `/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchOrders();
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
        }
    };

    const assignDriver = async (orderId, driverId) => {
        try {
            await fetch(import.meta.env.VITE_API_URL + `/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driver_id: driverId ? parseInt(driverId) : null })
            });
            fetchOrders();
            setToast('Motorista designado com sucesso!');
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error('Erro ao designar motorista:', err);
        }
    };

    const handleAddDriver = async (e) => {
        e.preventDefault();
        if (!newDriverName || !newDriverPhone) return;

        setUploading(true);
        let photoUrl = '';

        if (newDriverPhoto) {
            const formData = new FormData();
            formData.append('photo', newDriverPhoto);
            try {
                const uploadRes = await fetch(import.meta.env.VITE_API_URL + '/api/drivers/upload', {
                    method: 'POST',
                    body: formData
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    photoUrl = uploadData.photo_url;
                }
            } catch (err) {
                console.error('Erro ao carregar foto do motorista:', err);
            }
        }

        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newDriverName,
                    phone: newDriverPhone,
                    photo_url: photoUrl
                })
            });
            if (res.ok) {
                setNewDriverName('');
                setNewDriverPhone('');
                setNewDriverPhoto(null);
                
                // Reset file input element
                const fileInput = document.getElementById('driver-photo-input');
                if (fileInput) fileInput.value = '';

                fetchDrivers();
                setToast('Motorista adicionado com sucesso!');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error('Erro ao registar motorista:', err);
        } finally {
            setUploading(false);
        }
    };

    const toggleDriverActive = async (driver) => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + `/api/drivers/${driver.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !driver.active })
            });
            if (res.ok) {
                fetchDrivers();
            }
        } catch (err) {
            console.error('Erro ao atualizar estado do motorista:', err);
        }
    };

    const handleDeleteDriver = async (id) => {
        if (!confirm('Deseja realmente remover este motorista?')) return;
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + `/api/drivers/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchDrivers();
                setToast('Motorista removido com sucesso.');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error('Erro ao remover motorista:', err);
        }
    };

    const downloadPDF = (id) => {
        window.open(import.meta.env.VITE_API_URL + `/api/orders/${id}/pdf`, '_blank');
    };

    const deleteOrder = async (id) => {
        try {
            await fetch(import.meta.env.VITE_API_URL + `/api/orders/${id}`, { method: 'DELETE' });
            setOrders(prev => prev.filter(o => o.id !== id));
            prevOrdersRef.current = prevOrdersRef.current.filter(o => o.id !== id);
            setToast('Pedido apagado com sucesso.');
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error('Erro ao apagar pedido:', err);
        } finally {
            setDeleteToConfirm(null);
        }
    };

    // --- Product management handlers ---
    const handleRegisterProduct = async (e) => {
        e.preventDefault();
        if (!newProdName || !newProdPrice) return;
        
        setUploadingProd(true);
        let photoUrl = '';
        
        if (newProdPhoto) {
            const formData = new FormData();
            formData.append('photo', newProdPhoto);
            try {
                const uploadRes = await fetch(import.meta.env.VITE_API_URL + '/api/products/upload', {
                    method: 'POST',
                    body: formData
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    photoUrl = uploadData.photo_url;
                }
            } catch (err) {
                console.error('Erro ao carregar foto do produto:', err);
            }
        }
        
        const finalCategory = newProdCategory === 'Outro' ? newProdCustomCat : newProdCategory;
        const featuresArray = newProdFeatures
            ? newProdFeatures.split(',').map(f => f.trim()).filter(Boolean)
            : [];
        
        featuresArray.push(`_device_selection:${newProdDeviceSel}`);
        featuresArray.push(`_color_selection:${newProdColorSel}`);
            
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newProdName,
                    price: parseFloat(newProdPrice),
                    category: finalCategory || 'Acessórios',
                    image: photoUrl || 'assets/default_product.png',
                    desc: newProdDesc,
                    features: featuresArray,
                    active: true
                })
            });
            if (res.ok) {
                setNewProdName('');
                setNewProdPrice('');
                setNewProdCategory('Smartphones');
                setNewProdCustomCat('');
                setNewProdDesc('');
                setNewProdFeatures('');
                setNewProdPhoto(null);
                setNewProdDeviceSel('none');
                
                const fileInput = document.getElementById('product-photo-input');
                if (fileInput) fileInput.value = '';
                
                fetchProducts();
                setToast('Produto adicionado com sucesso!');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error('Erro ao criar produto:', err);
        } finally {
            setUploadingProd(false);
        }
    };

    const startEditingProduct = (product) => {
        setEditingProduct(product);
        setEditProdName(product.name);
        setEditProdPrice(product.price.toString());
        
        const isKnown = ['Smartphones', 'Áudio', 'Wearables', 'Acessórios'].includes(product.category);
        if (isKnown) {
            setEditProdCategory(product.category);
            setEditProdCustomCat('');
        } else {
            setEditProdCategory('Outro');
            setEditProdCustomCat(product.category);
        }
        
        setEditProdDesc(product.desc || '');
        
        // Extract device selection config from features
        const devSelFlag = Array.isArray(product.features) ? product.features.find(f => f.startsWith('_device_selection:')) : null;
        const devSelValue = devSelFlag ? devSelFlag.split(':')[1] : 'none';
        setEditProdDeviceSel(devSelValue);
        
        // Extract color selection config from features
        const colorSelFlag = Array.isArray(product.features) ? product.features.find(f => f.startsWith('_color_selection:')) : null;
        const colorSelValue = colorSelFlag ? colorSelFlag.split(':')[1] : 'show';
        setEditProdColorSel(colorSelValue);
        
        // Clean features shown to user
        const userFeatures = Array.isArray(product.features) 
            ? product.features.filter(f => !f.startsWith('_device_selection:') && !f.startsWith('_color_selection:'))
            : [];
        setEditProdFeatures(userFeatures.join(', '));
        
        setEditProdImageUrl(product.image || '');
        setEditProdPhoto(null);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;
        
        setSavingProd(true);
        let photoUrl = editProdImageUrl;
        
        if (editProdPhoto) {
            const formData = new FormData();
            formData.append('photo', editProdPhoto);
            try {
                const uploadRes = await fetch(import.meta.env.VITE_API_URL + '/api/products/upload', {
                    method: 'POST',
                    body: formData
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    photoUrl = uploadData.photo_url;
                }
            } catch (err) {
                console.error('Erro ao carregar foto do produto na edição:', err);
            }
        }
        
        const finalCategory = editProdCategory === 'Outro' ? editProdCustomCat : editProdCategory;
        const featuresArray = editProdFeatures
            ? editProdFeatures.split(',').map(f => f.trim()).filter(Boolean)
            : [];
            
        featuresArray.push(`_device_selection:${editProdDeviceSel}`);
        featuresArray.push(`_color_selection:${editProdColorSel}`);
            
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + `/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editProdName,
                    price: parseFloat(editProdPrice),
                    category: finalCategory || 'Acessórios',
                    image: photoUrl,
                    desc: editProdDesc,
                    features: featuresArray
                })
            });
            if (res.ok) {
                setEditingProduct(null);
                setEditProdName('');
                setEditProdPrice('');
                setEditProdCategory('');
                setEditProdCustomCat('');
                setEditProdDesc('');
                setEditProdFeatures('');
                setEditProdImageUrl('');
                setEditProdPhoto(null);
                setEditProdDeviceSel('none');
                
                fetchProducts();
                setToast('Produto atualizado com sucesso!');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);
        } finally {
            setSavingProd(false);
        }
    };

    const toggleProductActive = async (product) => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + `/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !product.active })
            });
            if (res.ok) {
                fetchProducts();
                setToast(`Produto ${!product.active ? 'ativado' : 'desativado'} com sucesso!`);
                setTimeout(() => setToast(null), 2000);
            }
        } catch (err) {
            console.error('Erro ao alternar estado do produto:', err);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + `/api/products/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchProducts();
                setToast('Produto removido com sucesso.');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error('Erro ao apagar produto:', err);
        } finally {
            setDeleteProdToConfirm(null);
        }
    };

    // ===================== LOGIN SCREEN =====================
    if (!isLoggedIn) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                height: '100vh', background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'
            }}>
                <form onSubmit={handleLogin} style={{
                    background: '#fff', padding: '3rem 2.5rem', borderRadius: '20px',
                    textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    minWidth: '320px'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛍️</div>
                    <h2 style={{ margin: '0 0 0.5rem', color: '#111827' }}>Tchapo Tchapo</h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>Painel de Administrador</p>
                    <input
                        type="password" value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="PIN de Acesso"
                        style={{
                            display: 'block', width: '100%', boxSizing: 'border-box',
                            margin: '0 0 1.5rem', padding: '1rem', fontSize: '1.4rem',
                            textAlign: 'center', border: '2px solid #e5e7eb',
                            borderRadius: '12px', letterSpacing: '0.5rem', outline: 'none'
                        }}
                    />
                    <button type="submit" style={{
                        width: '100%', padding: '1rem', background: '#f59e0b',
                        color: '#fff', border: 'none', borderRadius: '12px',
                        fontSize: '1rem', fontWeight: 700, cursor: 'pointer'
                    }}>
                        Entrar
                    </button>
                </form>
            </div>
        );
    }

    // ===================== ADMIN DASHBOARD =====================
    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'Inter, sans-serif' }}>

            {/* Toast notification */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
                    background: '#111827', color: '#fff', padding: '1rem 1.5rem',
                    borderRadius: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    maxWidth: '380px', animation: 'slideIn 0.3s ease',
                    borderLeft: '4px solid #f59e0b', fontSize: '0.95rem'
                }}>
                    {toast}
                </div>
            )}

            {/* Header */}
            <div style={{
                background: '#111827', color: '#fff', padding: '1.25rem 2rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🛍️</span>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Painel de Gestão — Tchapo Tchapo</h1>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.8rem' }}>
                            Actualizado automaticamente a cada 10 segundos
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {newCount > 0 && (
                        <span style={{
                            background: '#ef4444', color: '#fff', borderRadius: '999px',
                            padding: '0.25rem 0.75rem', fontSize: '0.85rem', fontWeight: 700,
                            cursor: 'pointer'
                        }} onClick={() => setNewCount(0)}>
                            🔔 {newCount} novo{newCount > 1 ? 's' : ''}
                        </span>
                    )}
                    <button onClick={fetchOrders} style={{
                        background: '#f59e0b', color: '#fff', border: 'none',
                        padding: '0.6rem 1.25rem', borderRadius: '10px',
                        fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                    }}>
                        ↻ Atualizar Dados
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                background: '#1f2937', padding: '0.5rem 2rem',
                display: 'flex', gap: '1rem', borderBottom: '1px solid #374151'
            }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        background: activeTab === 'orders' ? '#374151' : 'transparent',
                        color: activeTab === 'orders' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
                    }}
                >
                    📦 Encomendas
                </button>
                <button
                    onClick={() => setActiveTab('drivers')}
                    style={{
                        background: activeTab === 'drivers' ? '#374151' : 'transparent',
                        color: activeTab === 'drivers' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
                    }}
                >
                    🛵 Motoristas
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    style={{
                        background: activeTab === 'products' ? '#374151' : 'transparent',
                        color: activeTab === 'products' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
                    }}
                >
                    🏷️ Produtos
                </button>
                <button
                    onClick={() => setActiveTab('referrals')}
                    style={{
                        background: activeTab === 'referrals' ? '#374151' : 'transparent',
                        color: activeTab === 'referrals' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}
                >
                    🎁 Saques
                    {pendingWithdrawalsCount > 0 && (
                        <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold' }}>
                            {pendingWithdrawalsCount}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'orders' && (
                <>
                    {/* Stats bar */}
                    <div style={{
                        display: 'flex', gap: '1rem', padding: '1.5rem 2rem',
                        flexWrap: 'wrap'
                    }}>
                        {['Pendente', 'Processando', 'Preparando', 'Com Motorista', 'Entregue'].map(s => {
                            const count = orders.filter(o => o.status === s || (s === 'Pendente' && !o.status)).length;
                            const style = STATUS_COLORS[s] || STATUS_COLORS['Pendente'];
                            return (
                                <div key={s} style={{
                                    background: style.bg, color: style.color,
                                    padding: '0.75rem 1.25rem', borderRadius: '12px',
                                    fontWeight: 700, fontSize: '0.9rem', flex: '1', textAlign: 'center',
                                    minWidth: '120px'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{count}</div>
                                    {s}
                                </div>
                            );
                        })}
                        <div style={{
                            background: '#ede9fe', color: '#5b21b6',
                            padding: '0.75rem 1.25rem', borderRadius: '12px',
                            fontWeight: 700, fontSize: '0.9rem', flex: '1', textAlign: 'center',
                            minWidth: '120px'
                        }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{orders.length}</div>
                            Total
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ padding: '0 2rem 2rem' }}>
                        <div style={{ overflowX: 'auto', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                                <thead style={{ background: '#111827', color: '#fff' }}>
                                    <tr>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>ID</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Cliente</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Produtos Pedidos</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Bairro</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Pagamento</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Total</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Hora Entrega</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Designar Motorista</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, idx) => {
                                        const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS['Pendente'];
                                        return (
                                            <tr key={order.id} style={{
                                                borderBottom: '1px solid #f3f4f6',
                                                background: idx % 2 === 0 ? '#fff' : '#fafafa',
                                                transition: 'background 0.2s'
                                            }}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#6b7280', fontSize: '0.85rem' }}>
                                                    #{order.id}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#111827' }}>
                                                    {order.customer_name}
                                                    {order.phone && (
                                                        <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginTop: '2px' }}>
                                                            📞 {order.phone}
                                                        </div>
                                                    )}
                                                    {order.address && (
                                                        <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 400 }}>
                                                            {order.address}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#374151', fontSize: '0.85rem' }}>
                                                    {order.order_items && order.order_items.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {order.order_items.map((item, i) => (
                                                                <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                                    <span style={{
                                                                        background: '#f3f4f6',
                                                                        padding: '2px 6px',
                                                                        borderRadius: '12px',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.75rem',
                                                                        color: '#4b5563'
                                                                    }}>
                                                                        {item.quantity}x
                                                                    </span>
                                                                    <span style={{ fontWeight: 500 }}>{item.product_name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Nenhum item</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{order.bairro}</td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#374151' }}>{order.payment || '—'}</td>
                                                <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#111827' }}>
                                                    {Number(order.total).toLocaleString('pt-MZ')} MT
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#6b7280', fontSize: '0.85rem' }}>
                                                    {order.time || new Date(order.created_at).toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <select
                                                        value={order.driver_id || ''}
                                                        onChange={(e) => assignDriver(order.id, e.target.value)}
                                                        style={{
                                                            padding: '0.4rem 0.75rem', borderRadius: '8px',
                                                            border: '1px solid #d1d5db', background: '#fff',
                                                            fontSize: '0.85rem', cursor: 'pointer', outline: 'none'
                                                        }}
                                                    >
                                                        <option value="">Nenhum Motorista</option>
                                                        {drivers.filter(d => d.active).map(d => (
                                                            <option key={d.id} value={d.id}>{d.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <select
                                                        value={order.status || 'Pendente'}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                        style={{
                                                            padding: '0.4rem 0.75rem', borderRadius: '8px',
                                                            border: 'none', fontWeight: 600, cursor: 'pointer',
                                                            background: statusStyle.bg, color: statusStyle.color,
                                                            fontSize: '0.85rem', outline: 'none'
                                                        }}
                                                    >
                                                        <option value="Pendente">📋 Pendente</option>
                                                        <option value="Processando">🔄 Processando</option>
                                                        <option value="Preparando">📦 Preparando</option>
                                                        <option value="Com Motorista">🛵 Com Motorista</option>
                                                        <option value="Entregue">✅ Entregue</option>
                                                        <option value="Cancelado">❌ Cancelado</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => downloadPDF(order.id)}
                                                            style={{
                                                                background: '#3b82f6', color: '#fff', border: 'none',
                                                                padding: '0.45rem 0.9rem', borderRadius: '8px',
                                                                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                                                            }}
                                                        >
                                                            PDF
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteToConfirm(order)}
                                                            style={{
                                                                background: '#fee2e2', color: '#991b1b', border: 'none',
                                                                padding: '0.45rem 0.9rem', borderRadius: '8px',
                                                                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                                                            }}
                                                            title="Apagar pedido"
                                                        >
                                                            Apagar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="10" style={{
                                                padding: '3rem', textAlign: 'center',
                                                color: '#9ca3af', fontSize: '0.95rem'
                                            }}>
                                                Nenhum pedido encontrado. A aguardar pedidos... 🕐
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'drivers' && (
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {/* Register Driver Card */}
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: '0 0 1.5rem', color: '#111827' }}>👥 Registar Novo Motorista</h3>
                            <form onSubmit={handleAddDriver} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text" value={newDriverName} required
                                        onChange={(e) => setNewDriverName(e.target.value)}
                                        placeholder="Ex: Carlos Alberto"
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Contacto WhatsApp (com indicativo, ex: 258840000000)
                                    </label>
                                    <input
                                        type="text" value={newDriverPhone} required
                                        onChange={(e) => setNewDriverPhone(e.target.value)}
                                        placeholder="Ex: 258841234567"
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Foto de Perfil
                                    </label>
                                    <input
                                        type="file" accept="image/*" id="driver-photo-input"
                                        onChange={(e) => setNewDriverPhoto(e.target.files[0])}
                                        style={{ width: '100%', padding: '0.5rem 0' }}
                                    />
                                </div>
                                <button type="submit" disabled={uploading} style={{
                                    marginTop: '0.5rem', padding: '0.75rem', background: '#f59e0b',
                                    color: '#fff', border: 'none', borderRadius: '8px',
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    transition: 'background 0.2s', opacity: uploading ? 0.7 : 1
                                }}>
                                    {uploading ? 'A carregar ficheiro...' : 'Adicionar Motorista'}
                                </button>
                            </form>
                        </div>

                        {/* Registered Drivers List Card */}
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: '0 0 1.5rem', color: '#111827' }}>🛵 Motoristas Registados</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
                                {drivers.map(d => (
                                    <div key={d.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '1rem', background: '#f9fafb', borderRadius: '12px',
                                        border: '1px solid #f3f4f6'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img
                                                src={d.photo_url || 'https://via.placeholder.com/50'}
                                                alt={d.name}
                                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', background: '#e5e7eb' }}
                                            />
                                            <div>
                                                <h4 style={{ margin: 0, color: '#111827', fontWeight: 600 }}>{d.name}</h4>
                                                <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '0.8rem' }}>📲 {d.phone}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <button
                                                onClick={() => toggleDriverActive(d)}
                                                style={{
                                                    border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px',
                                                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                                                    background: d.active ? '#d1fae5' : '#fee2e2',
                                                    color: d.active ? '#065f46' : '#991b1b'
                                                }}
                                            >
                                                {d.active ? 'Online 🟢' : 'Offline 🔴'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDriver(d.id)}
                                                style={{
                                                    border: 'none', background: 'transparent', color: '#ef4444',
                                                    cursor: 'pointer', fontSize: '1rem'
                                                }}
                                                title="Remover motorista"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {drivers.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        Nenhum motorista cadastrado.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {/* Registrar Produto */}
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: '0 0 1.5rem', color: '#111827' }}>🏷️ Registar Novo Produto</h3>
                            <form onSubmit={handleRegisterProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Nome do Produto
                                    </label>
                                    <input
                                        type="text" value={newProdName} required
                                        onChange={(e) => setNewProdName(e.target.value)}
                                        placeholder="Ex: iPhone 15 Pro Max"
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                            Preço (MT)
                                        </label>
                                        <input
                                            type="number" value={newProdPrice} required min="0" step="any"
                                            onChange={(e) => setNewProdPrice(e.target.value)}
                                            placeholder="Ex: 89000"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                            Categoria
                                        </label>
                                        <select
                                            value={newProdCategory}
                                            onChange={(e) => setNewProdCategory(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                        >
                                            <option value="Smartphones">Smartphones</option>
                                            <option value="Áudio">Áudio</option>
                                            <option value="Wearables">Wearables</option>
                                            <option value="Acessórios">Acessórios</option>
                                            <option value="Outro">Outra (Customizada)...</option>
                                        </select>
                                    </div>
                                </div>

                                {newProdCategory === 'Outro' && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                            Nome da Categoria Customizada
                                        </label>
                                        <input
                                            type="text" value={newProdCustomCat} required
                                            onChange={(e) => setNewProdCustomCat(e.target.value)}
                                            placeholder="Ex: Eletrodomésticos"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Destaques / Features (separados por vírgula)
                                    </label>
                                    <input
                                        type="text" value={newProdFeatures}
                                        onChange={(e) => setNewProdFeatures(e.target.value)}
                                        placeholder="Ex: 🔋 Bateria 48h, 📸 Câmera 48MP"
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Seleção de Dispositivo na Loja
                                    </label>
                                    <select
                                        value={newProdDeviceSel}
                                        onChange={(e) => setNewProdDeviceSel(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                    >
                                        <option value="none">Nenhum (Venda Normal)</option>
                                        <option value="iphone">Modelos de iPhone (Fixed List)</option>
                                        <option value="iphone_outro">Modelos de iPhone + Opção "Outro"</option>
                                        <option value="outro">Digitação Livre (Apenas "Outro")</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Seleção de Cor na Loja
                                    </label>
                                    <select
                                        value={newProdColorSel}
                                        onChange={(e) => setNewProdColorSel(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                    >
                                        <option value="show">Sim (Exibir seleção de cor)</option>
                                        <option value="none">Não (Ocultar seleção de cor)</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Descrição do Produto
                                    </label>
                                    <textarea
                                        value={newProdDesc} rows="3"
                                        onChange={(e) => setNewProdDesc(e.target.value)}
                                        placeholder="Descrição detalhada sobre o produto..."
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Foto do Produto
                                    </label>
                                    <input
                                        type="file" accept="image/*" id="product-photo-input"
                                        onChange={(e) => setNewProdPhoto(e.target.files[0])}
                                        style={{ width: '100%', padding: '0.5rem 0' }}
                                    />
                                </div>

                                <button type="submit" disabled={uploadingProd} style={{
                                    marginTop: '0.5rem', padding: '0.75rem', background: '#f59e0b',
                                    color: '#fff', border: 'none', borderRadius: '8px',
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    transition: 'background 0.2s', opacity: uploadingProd ? 0.7 : 1
                                }}>
                                    {uploadingProd ? 'A guardar produto...' : 'Adicionar Produto'}
                                </button>
                            </form>
                        </div>

                        {/* Lista de Inventário de Produtos */}
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1.5rem', color: '#111827' }}>📦 Inventário de Produtos</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '580px', overflowY: 'auto' }}>
                                {products.map(p => (
                                    <div key={p.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '1rem', background: '#f9fafb', borderRadius: '12px',
                                        border: '1px solid #f3f4f6', gap: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            <img
                                                src={p.image || 'https://via.placeholder.com/60'}
                                                alt={p.name}
                                                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', background: '#e5e7eb', flexShrink: 0 }}
                                            />
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <h4 style={{ margin: 0, color: '#111827', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{p.name}</h4>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '4px', alignItems: 'center' }}>
                                                    <span style={{ background: '#e5e7eb', color: '#374151', padding: '1px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{p.category}</span>
                                                    <span style={{ color: '#111827', fontWeight: 700, fontSize: '0.85rem' }}>{Number(p.price).toLocaleString('pt-MZ')} MT</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                            <button
                                                onClick={() => toggleProductActive(p)}
                                                style={{
                                                    border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px',
                                                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                                                    background: p.active ? '#d1fae5' : '#fee2e2',
                                                    color: p.active ? '#065f46' : '#991b1b'
                                                }}
                                            >
                                                {p.active ? 'Ativo 🟢' : 'Inativo 🔴'}
                                            </button>
                                            <button
                                                onClick={() => startEditingProduct(p)}
                                                style={{
                                                    border: 'none', background: '#e5e7eb', color: '#374151',
                                                    padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer',
                                                    fontSize: '0.75rem', fontWeight: 600
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => setDeleteProdToConfirm(p)}
                                                style={{
                                                    border: 'none', background: 'transparent', color: '#ef4444',
                                                    cursor: 'pointer', fontSize: '1.2rem'
                                                }}
                                                title="Remover produto"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {products.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        Nenhum produto cadastrado no inventário.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'referrals' && (
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>💰</span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Total de Saques Solicitados</span>
                            <strong style={{ fontSize: '1.8rem', color: '#111827' }}>
                                {withdrawals.reduce((sum, w) => sum + Number(w.amount), 0).toLocaleString()} MT
                            </strong>
                        </div>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>⏳</span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Saques Pendentes</span>
                            <strong style={{ fontSize: '1.8rem', color: '#f59e0b' }}>
                                {withdrawals.filter(w => w.status === 'Pendente').reduce((sum, w) => sum + Number(w.amount), 0).toLocaleString()} MT
                            </strong>
                        </div>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Total Pago</span>
                            <strong style={{ fontSize: '1.8rem', color: '#10b981' }}>
                                {withdrawals.filter(w => w.status === 'Pago').reduce((sum, w) => sum + Number(w.amount), 0).toLocaleString()} MT
                            </strong>
                        </div>
                    </div>

                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: '#111827' }}>📋 Gerenciamento de Saques (Indicações)</h3>
                            <button onClick={fetchWithdrawals} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Atualizar
                            </button>
                        </div>

                        {withdrawals.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Nenhuma solicitação de saque registada.</div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#374151', fontSize: '0.9rem' }}>
                                            <th style={{ padding: '0.75rem' }}>Cliente</th>
                                            <th style={{ padding: '0.75rem' }}>Email</th>
                                            <th style={{ padding: '0.75rem' }}>Valor</th>
                                            <th style={{ padding: '0.75rem' }}>Método / Telefone</th>
                                            <th style={{ padding: '0.75rem' }}>Data</th>
                                            <th style={{ padding: '0.75rem' }}>Estado</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {withdrawals.map(w => (
                                            <tr key={w.id} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '0.85rem', color: '#4b5563' }}>
                                                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#111827' }}>{w.user_name}</td>
                                                <td style={{ padding: '0.75rem' }}>{w.user_email}</td>
                                                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#111827' }}>{Number(w.amount).toLocaleString()} MT</td>
                                                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#2563eb' }}>{w.payment_method || 'M-Pesa'}: {w.payment_phone}</td>
                                                <td style={{ padding: '0.75rem' }}>{new Date(w.created_at).toLocaleString('pt-MZ')}</td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        backgroundColor: w.status === 'Pago' ? '#d1fae5' : (w.status === 'Cancelado' ? '#fee2e2' : '#fef3c7'),
                                                        color: w.status === 'Pago' ? '#065f46' : (w.status === 'Cancelado' ? '#991b1b' : '#92400e')
                                                    }}>
                                                        {w.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    {w.status === 'Pendente' ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                            <button 
                                                                onClick={() => handleProcessWithdrawal(w.id, 'Pago')}
                                                                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                            >
                                                                Pagar (M-Pesa)
                                                            </button>
                                                            <button 
                                                                onClick={() => handleProcessWithdrawal(w.id, 'Cancelado')}
                                                                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Processado</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '20px', padding: '2.5rem',
                        maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem', color: '#111827' }}>✏️ Editar Produto</h3>
                        <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                    Nome do Produto
                                </label>
                                <input
                                    type="text" value={editProdName} required
                                    onChange={(e) => setEditProdName(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Preço (MT)
                                    </label>
                                    <input
                                        type="number" value={editProdPrice} required min="0" step="any"
                                        onChange={(e) => setEditProdPrice(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Categoria
                                    </label>
                                    <select
                                        value={editProdCategory}
                                        onChange={(e) => setEditProdCategory(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                    >
                                        <option value="Smartphones">Smartphones</option>
                                        <option value="Áudio">Áudio</option>
                                        <option value="Wearables">Wearables</option>
                                        <option value="Acessórios">Acessórios</option>
                                        <option value="Outro">Outra (Customizada)...</option>
                                    </select>
                                </div>
                            </div>

                            {editProdCategory === 'Outro' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        Nome da Categoria Customizada
                                    </label>
                                    <input
                                        type="text" value={editProdCustomCat} required
                                        onChange={(e) => setEditProdCustomCat(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                    Destaques / Features (separados por vírgula)
                                </label>
                                <input
                                    type="text" value={editProdFeatures}
                                    onChange={(e) => setEditProdFeatures(e.target.value)}
                                    placeholder="Ex: 🔋 Bateria 48h, 📸 Câmera 48MP"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                    Seleção de Dispositivo na Loja
                                </label>
                                <select
                                    value={editProdDeviceSel}
                                    onChange={(e) => setEditProdDeviceSel(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                >
                                    <option value="none">Nenhum (Venda Normal)</option>
                                    <option value="iphone">Modelos de iPhone (Fixed List)</option>
                                    <option value="iphone_outro">Modelos de iPhone + Opção "Outro"</option>
                                    <option value="outro">Digitação Livre (Apenas "Outro")</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                    Seleção de Cor na Loja
                                </label>
                                <select
                                    value={editProdColorSel}
                                    onChange={(e) => setEditProdColorSel(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                >
                                    <option value="show">Sim (Exibir seleção de cor)</option>
                                    <option value="none">Não (Ocultar seleção de cor)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                    Descrição do Produto
                                </label>
                                <textarea
                                    value={editProdDesc} rows="3"
                                    onChange={(e) => setEditProdDesc(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                    Nova Foto do Produto (opcional)
                                </label>
                                <input
                                    type="file" accept="image/*"
                                    onChange={(e) => setEditProdPhoto(e.target.files[0])}
                                    style={{ width: '100%', padding: '0.5rem 0' }}
                                />
                                {editProdImageUrl && !editProdPhoto && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>Foto atual:</span>
                                        <img src={editProdImageUrl} alt="Atual" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setEditingProduct(null)} style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '8px',
                                    border: '2px solid #e5e7eb', background: '#fff',
                                    fontWeight: 600, cursor: 'pointer'
                                }}>Cancelar</button>
                                <button type="submit" disabled={savingProd} style={{
                                    flex: 1, padding: '0.75rem', background: '#f59e0b',
                                    color: '#fff', border: 'none', borderRadius: '8px',
                                    fontWeight: 700, cursor: 'pointer', opacity: savingProd ? 0.7 : 1
                                }}>
                                    {savingProd ? 'A guardar...' : 'Guardar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Product confirmation modal */}
            {deleteProdToConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '20px', padding: '2.5rem',
                        maxWidth: '420px', width: '90%', textAlign: 'center',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h3 style={{ marginBottom: '0.5rem', color: '#111827' }}>Apagar Produto?</h3>
                        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            O produto <strong>{deleteProdToConfirm.name}</strong> será removido permanentemente. Esta acção não pode ser revertida.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteProdToConfirm(null)} style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px',
                                border: '2px solid #e5e7eb', background: '#fff',
                                fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem'
                            }}>Cancelar</button>
                            <button onClick={() => deleteProduct(deleteProdToConfirm.id)} style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px',
                                border: 'none', background: '#ef4444', color: '#fff',
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem'
                            }}>Sim, Apagar</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>

            {/* Delete confirmation modal */}
            {deleteToConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '20px', padding: '2.5rem',
                        maxWidth: '420px', width: '90%', textAlign: 'center',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
                        <h3 style={{ marginBottom: '0.5rem', color: '#111827' }}>Apagar Pedido #{deleteToConfirm.id}?</h3>
                        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            O pedido de <strong>{deleteToConfirm.customer_name}</strong> será removido permanentemente. Esta acção não pode ser revertida.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setDeleteToConfirm(null)} style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px',
                                border: '2px solid #e5e7eb', background: '#fff',
                                fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem'
                            }}>Cancelar</button>
                            <button onClick={() => deleteOrder(deleteToConfirm.id)} style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px',
                                border: 'none', background: '#ef4444', color: '#fff',
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem'
                            }}>Sim, Apagar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
