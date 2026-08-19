import React, { useEffect, useState, useRef, useCallback } from 'react';

const STATUS_COLORS = {
    'Pendente':       { bg: '#fef3c7', color: '#92400e' },
    'Processando':    { bg: '#dbeafe', color: '#1e40af' },
    'Preparando':     { bg: '#ede9fe', color: '#5b21b6' },
    'Com Motorista':  { bg: '#d1fae5', color: '#065f46' },
    'Entregue':       { bg: '#dcfce7', color: '#166534' },
    'Cancelado':      { bg: '#fee2e2', color: '#991b1b' },
    'Perdido':        { bg: '#fee2e2', color: '#991b1b' },
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
    const [referralsSubTab, setReferralsSubTab] = useState('pending'); // 'pending' or 'completed'

    // Live clock ticker & Users state
    const [now, setNow] = useState(Date.now());
    const [usersList, setUsersList] = useState([]);
    
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
    const [newProdStockStatus, setNewProdStockStatus] = useState('Em Stock');
    const [newProdFeatured, setNewProdFeatured]   = useState(false);

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
    const [editProdStockStatus, setEditProdStockStatus] = useState('Em Stock');
    const [deleteProdToConfirm, setDeleteProdToConfirm] = useState(null);

    // --- Finance management state ---
    const [financeEntries, setFinanceEntries] = useState([]);
    const [financeSummary, setFinanceSummary] = useState({
        total_revenue: 0,
        total_expenses: 0,
        total_investments: 0,
        total_withdrawals: 0,
        net_profit: 0,
        current_balance: 0,
        total_count: 0
    });
    const [financePeriod, setFinancePeriod] = useState('all');
    const [financeTypeFilter, setFinanceTypeFilter] = useState('all');
    const [financeChannelFilter, setFinanceChannelFilter] = useState('all');
    const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
    const [editingFinanceEntry, setEditingFinanceEntry] = useState(null);
    const [finType, setFinType] = useState('receita');
    const [finDesc, setFinDesc] = useState('');
    const [finAmount, setFinAmount] = useState('');
    const [finDate, setFinDate] = useState(new Date().toISOString().slice(0, 10));
    const [finCategory, setFinCategory] = useState('Vendas & Faturamento');
    const [finChannel, setFinChannel] = useState('Dinheiro');
    const [finNotes, setFinNotes] = useState('');
    const [savingFinance, setSavingFinance] = useState(false);
    const [deleteFinanceToConfirm, setDeleteFinanceToConfirm] = useState(null);

    // --- Notifications permission & Service Worker ---
    const subscribeToPushNotifications = async (reg) => {
        if (!reg || !('pushManager' in reg)) return;
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/admin/vapid-public-key');
            if (!res.ok) return;
            const { publicKey } = await res.json();
            
            const padding = '='.repeat((4 - publicKey.length % 4) % 4);
            const base64 = (publicKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const convertedKey = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                convertedKey[i] = rawData.charCodeAt(i);
            }
            
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey
                });
            }
            
            await fetch(import.meta.env.VITE_API_URL + '/api/admin/subscribe-push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });
        } catch (err) {
            console.error('Push sub error:', err);
        }
    };

    const requestNotifPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            alert('O seu navegador não suporta notificações de sistema.');
            return;
        }
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
            setNotifAllowed(true);
            if ('serviceWorker' in navigator) {
                try {
                    const reg = await navigator.serviceWorker.register('/sw.js');
                    if (reg) {
                        await subscribeToPushNotifications(reg);
                        reg.showNotification('🛍️ Tchapo Tchapo Admin', {
                            body: '✅ Notificações ativas! Receberá alertas de novos pedidos mesmo com a aplicação fechada no telemóvel.',
                            icon: '/favicon.ico',
                            vibrate: [200, 100, 200]
                        });
                    }
                } catch (e) {
                    console.error('SW register error:', e);
                }
            }
            setToast('🔔 Notificações no telemóvel ativadas com sucesso!');
            setTimeout(() => setToast(null), 4000);
        } else {
            alert('Permissão de notificações negada. Ative as notificações nas definições do telemóvel.');
        }
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

    // --- Fetch users ---
    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/admin');
            if (!res.ok) return;
            const data = await res.json();
            setUsersList(data);
        } catch (err) {
            console.error('Erro ao buscar utilizadores:', err);
        }
    }, []);

    // --- Fetch finance entries ---
    const fetchFinanceEntries = useCallback(async () => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/financial-entries?period=${financePeriod}`;
            if (financeTypeFilter !== 'all') url += `&type=${encodeURIComponent(financeTypeFilter)}`;
            if (financeChannelFilter !== 'all') url += `&payment_method=${encodeURIComponent(financeChannelFilter)}`;

            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            setFinanceEntries(data.entries || []);
            setFinanceSummary(data.summary || {
                total_revenue: 0,
                total_expenses: 0,
                total_investments: 0,
                total_withdrawals: 0,
                net_profit: 0,
                current_balance: 0,
                total_count: 0
            });
        } catch (err) {
            console.error('Erro ao buscar dados financeiros:', err);
        }
    }, [financePeriod, financeTypeFilter, financeChannelFilter]);

    const openCreateFinanceModal = () => {
        setEditingFinanceEntry(null);
        setFinType('receita');
        setFinDesc('');
        setFinAmount('');
        setFinDate(new Date().toISOString().slice(0, 10));
        setFinCategory('Vendas & Faturamento');
        setFinChannel('Dinheiro');
        setFinNotes('');
        setIsFinanceModalOpen(true);
    };

    const openEditFinanceModal = (entry) => {
        setEditingFinanceEntry(entry);
        setFinType(entry.type || 'receita');
        setFinDesc(entry.description || '');
        setFinAmount(entry.amount || '');
        setFinDate(entry.entry_date || new Date().toISOString().slice(0, 10));
        setFinCategory(entry.category || 'Vendas & Faturamento');
        setFinChannel(entry.payment_method || 'Dinheiro');
        setFinNotes(entry.notes || '');
        setIsFinanceModalOpen(true);
    };

    const handleSaveFinanceEntry = async (e) => {
        e.preventDefault();
        setSavingFinance(true);
        try {
            const payload = {
                type: finType,
                description: finDesc.trim(),
                amount: parseFloat(finAmount) || 0,
                entry_date: finDate,
                category: finCategory,
                payment_method: finChannel,
                notes: finNotes.trim()
            };

            const url = editingFinanceEntry
                ? `${import.meta.env.VITE_API_URL}/api/financial-entries/${editingFinanceEntry.id}`
                : `${import.meta.env.VITE_API_URL}/api/financial-entries`;
            const method = editingFinanceEntry ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Falha ao guardar lançamento');
            }

            setIsFinanceModalOpen(false);
            setToast(editingFinanceEntry ? '✅ Lançamento atualizado!' : '✅ Novo lançamento financeiro registado!');
            setTimeout(() => setToast(null), 3000);
            fetchFinanceEntries();
        } catch (err) {
            alert(err.message);
        } finally {
            setSavingFinance(false);
        }
    };

    const handleDeleteFinanceEntry = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/financial-entries/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Erro ao apagar lançamento');
            setDeleteFinanceToConfirm(null);
            setToast('🗑️ Lançamento apagado com sucesso!');
            setTimeout(() => setToast(null), 3000);
            fetchFinanceEntries();
        } catch (err) {
            alert(err.message);
        }
    };

    const exportFinanceCSV = () => {
        if (!financeEntries || financeEntries.length === 0) {
            alert('Nenhum dado financeiro para exportar.');
            return;
        }
        let csv = 'ID,Data,Tipo,Descricao,Categoria,Canal_Pagamento,Valor_MT,Notas\n';
        financeEntries.forEach(e => {
            const row = [
                e.id,
                `"${e.entry_date || ''}"`,
                `"${e.type || ''}"`,
                `"${(e.description || '').replace(/"/g, '""')}"`,
                `"${(e.category || '').replace(/"/g, '""')}"`,
                `"${e.payment_method || ''}"`,
                e.amount || 0,
                `"${(e.notes || '').replace(/"/g, '""')}"`
            ];
            csv += row.join(',') + '\n';
        });

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `tchapo_financas_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Live 1s clock ticker ---
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Auto-refresh every 10s when logged in ---
    useEffect(() => {
        if (isLoggedIn) {
            requestNotifPermission();
            fetchOrders();
            fetchDrivers();
            fetchProducts();
            fetchWithdrawals();
            fetchUsers();
            fetchFinanceEntries();
            intervalRef.current = setInterval(() => {
                fetchOrders();
                fetchDrivers();
                fetchProducts();
                fetchWithdrawals();
                fetchUsers();
                fetchFinanceEntries();
            }, 10000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isLoggedIn, fetchOrders, fetchDrivers, fetchProducts, fetchWithdrawals, fetchUsers, fetchFinanceEntries, requestNotifPermission]);

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
        if (status === 'Com Motorista') {
            const order = orders.find(o => o.id === id);
            if (!order || !order.driver_id) {
                alert('Por favor, designe um motorista para este pedido primeiro.');
                return;
            }
        }
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
        if (newProdStockStatus) featuresArray.push(`_stock:${newProdStockStatus}`);
        if (newProdFeatured) featuresArray.push('_featured:true');
            
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
                setNewProdStockStatus('Em Stock');
                setNewProdFeatured(false);
                
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
        
        // Extract stock status from features
        const stockFlag = Array.isArray(product.features) ? product.features.find(f => f.startsWith('_stock:')) : null;
        setEditProdStockStatus(stockFlag ? stockFlag.split(':')[1] : 'Em Stock');
        
        // Extract featured flag
        setEditProdFeatured(Array.isArray(product.features) && product.features.includes('_featured:true'));
        
        // Clean features shown to user
        const userFeatures = Array.isArray(product.features) 
            ? product.features.filter(f => !f.startsWith('_device_selection:') && !f.startsWith('_color_selection:') && !f.startsWith('_stock:') && !f.startsWith('_clicks:') && f !== '_featured:true')
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
        if (editProdStockStatus) featuresArray.push(`_stock:${editProdStockStatus}`);
        if (editProdFeatured) featuresArray.push('_featured:true');
        // Preserve existing _clicks from original product if present
        if (editingProduct && Array.isArray(editingProduct.features)) {
            const clicksFlag = editingProduct.features.find(f => f.startsWith('_clicks:'));
            if (clicksFlag) featuresArray.push(clicksFlag);
        }
            
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
                setEditProdStockStatus('Em Stock');
                setEditProdFeatured(false);
                
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
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
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                        }} onClick={() => setNewCount(0)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            {newCount} novo{newCount > 1 ? 's' : ''}
                        </span>
                    )}
                    <button onClick={requestNotifPermission} style={{
                        background: notifAllowed ? '#10b981' : '#f59e0b', color: '#fff', border: 'none',
                        padding: '0.6rem 1.25rem', borderRadius: '10px',
                        fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        {notifAllowed ? 'Notificações Ativas' : 'Ativar Notificações no Telemóvel'}
                    </button>
                    <button onClick={fetchOrders} style={{
                        background: '#374151', color: '#fff', border: 'none',
                        padding: '0.6rem 1.25rem', borderRadius: '10px',
                        fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        Atualizar Dados
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                background: '#1f2937', padding: '0.5rem 2rem',
                display: 'flex', gap: '1rem', borderBottom: '1px solid #374151', overflowX: 'auto'
            }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        background: activeTab === 'orders' ? '#374151' : 'transparent',
                        color: activeTab === 'orders' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.55rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    Encomendas
                </button>
                <button
                    onClick={() => setActiveTab('drivers')}
                    style={{
                        background: activeTab === 'drivers' ? '#374151' : 'transparent',
                        color: activeTab === 'drivers' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.55rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-5a1 1 0 0 0-1 1v5h8V7a1 1 0 0 0-1-1z"/><path d="M9 17h6"/><path d="M12 12v5"/></svg>
                    Motoristas
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    style={{
                        background: activeTab === 'products' ? '#374151' : 'transparent',
                        color: activeTab === 'products' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.55rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    Produtos
                </button>
                <button
                    onClick={() => setActiveTab('referrals')}
                    style={{
                        background: activeTab === 'referrals' ? '#374151' : 'transparent',
                        color: activeTab === 'referrals' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.55rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                    Indicação e Saldo
                    {pendingWithdrawalsCount > 0 && (
                        <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold' }}>
                            {pendingWithdrawalsCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        background: activeTab === 'users' ? '#374151' : 'transparent',
                        color: activeTab === 'users' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.55rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Utilizadores
                </button>
                <button
                    onClick={() => setActiveTab('finance')}
                    style={{
                        background: activeTab === 'finance' ? '#374151' : 'transparent',
                        color: activeTab === 'finance' ? '#fff' : '#9ca3af',
                        border: 'none', padding: '0.55rem 1rem', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Finanças &amp; Caixa
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
                                        <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>⏱️ Temporizador (4h)</th>
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
                                                    <div style={{ fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                                        🕒 {order.time || new Date(order.created_at).toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    {(() => {
                                                        if (order.status === 'Entregue') {
                                                            return <div style={{ padding: '4px 8px', borderRadius: '6px', background: '#dcfce7', color: '#15803d', fontSize: '0.78rem', fontWeight: 700 }}>✅ Entregue a Tempo</div>;
                                                        }
                                                        if (order.status === 'Cancelado') {
                                                            return <div style={{ padding: '4px 8px', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', fontSize: '0.78rem', fontWeight: 700 }}>❌ Cancelado</div>;
                                                        }

                                                        // Use server timer data
                                                        let remSecs;
                                                        if (order.timer_end_at) {
                                                            // Timer is running: compute from absolute deadline
                                                            remSecs = Math.max(0, Math.floor((new Date(order.timer_end_at).getTime() - now) / 1000));
                                                        } else {
                                                            // Timer is paused or not started
                                                            remSecs = order.timer_remaining_secs != null ? order.timer_remaining_secs : 14400;
                                                        }

                                                        if (order.status === 'Pendente' || !order.status) {
                                                            const ph = Math.floor(remSecs / 3600);
                                                            const pm = Math.floor((remSecs % 3600) / 60);
                                                            const ps = Math.floor(remSecs % 60);
                                                            const pausedStr = `${ph.toString().padStart(2, '0')}:${pm.toString().padStart(2, '0')}:${ps.toString().padStart(2, '0')}`;
                                                            return (
                                                                <div style={{
                                                                    padding: '5px 10px', borderRadius: '8px',
                                                                    background: '#fef3c7', border: '1px solid #fde68a',
                                                                    color: '#92400e', fontSize: '0.82rem', fontWeight: 800,
                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px'
                                                                }}>
                                                                    ⏳ {pausedStr} (Pausado)
                                                                </div>
                                                            );
                                                        }

                                                        if (order.status === 'Perdido' || remSecs <= 0) {
                                                            return (
                                                                <div style={{ padding: '4px 8px', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', fontSize: '0.78rem', fontWeight: 700 }}>
                                                                    🔴 PERDIDO (Expirado 4h)
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 500, marginTop: '2px' }}>Pagar 50% ao Estafeta/Cliente</div>
                                                                </div>
                                                            );
                                                        }

                                                        const h = Math.floor(remSecs / 3600);
                                                        const m = Math.floor((remSecs % 3600) / 60);
                                                        const s = Math.floor(remSecs % 60);
                                                        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

                                                        const isWarning = remSecs < 1800;
                                                        return (
                                                            <div style={{
                                                                padding: '5px 10px', borderRadius: '8px',
                                                                background: isWarning ? '#fff7ed' : '#eff6ff',
                                                                border: isWarning ? '1px solid #ffedd5' : '1px solid #dbeafe',
                                                                color: isWarning ? '#c2410c' : '#1d4ed8',
                                                                fontSize: '0.82rem', fontWeight: 800,
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px'
                                                            }}>
                                                                ⏱️ {timeStr} restantes
                                                            </div>
                                                        );
                                                    })()}
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
                                                        <option value="Perdido">🔴 Perdido (Multa 50%)</option>
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
                                        <option value="pendrive">💾 Capacidade de Pendrive (1 GB a 16 GB)</option>
                                        <option value="card">💾 Capacidade de Cartão de Memória (1 GB a 64 GB)</option>
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

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                            🏷️ Estado do Stock
                                        </label>
                                        <select
                                            value={newProdStockStatus}
                                            onChange={(e) => setNewProdStockStatus(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                        >
                                            <option value="Em Stock">✅ Em Stock</option>
                                            <option value="Últimas Unidades">🔥 Últimas Unidades</option>
                                            <option value="Esgotado">❌ Esgotado</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '0.75rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                            <input
                                                type="checkbox"
                                                checked={newProdFeatured}
                                                onChange={(e) => setNewProdFeatured(e.target.checked)}
                                                style={{ width: '18px', height: '18px', accentColor: '#f59e0b', cursor: 'pointer' }}
                                            />
                                            ⭐ Produto em Destaque
                                        </label>
                                    </div>
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

                        {/* Sub-tabs selector */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                            <button
                                onClick={() => setReferralsSubTab('pending')}
                                style={{
                                    background: referralsSubTab === 'pending' ? '#f59e0b' : 'transparent',
                                    color: referralsSubTab === 'pending' ? '#fff' : '#6b7280',
                                    border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                                    cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                                }}
                            >
                                ⏳ Solicitados / Pendentes ({withdrawals.filter(w => w.status === 'Pendente').length})
                            </button>
                            <button
                                onClick={() => setReferralsSubTab('completed')}
                                style={{
                                    background: referralsSubTab === 'completed' ? '#10b981' : 'transparent',
                                    color: referralsSubTab === 'completed' ? '#fff' : '#6b7280',
                                    border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                                    cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                                }}
                            >
                                ✅ Efetuados / Cancelados ({withdrawals.filter(w => w.status !== 'Pendente').length})
                            </button>
                        </div>

                        {withdrawals.filter(w => referralsSubTab === 'pending' ? w.status === 'Pendente' : w.status !== 'Pendente').length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                {referralsSubTab === 'pending' ? 'Nenhuma solicitação de saque pendente.' : 'Nenhum saque efetuado ou cancelado ainda.'}
                            </div>
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
                                            {referralsSubTab === 'pending' && <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {withdrawals.filter(w => referralsSubTab === 'pending' ? w.status === 'Pendente' : w.status !== 'Pendente').map(w => (
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
                                                {referralsSubTab === 'pending' && (
                                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                            <button 
                                                                onClick={() => handleProcessWithdrawal(w.id, 'Pago')}
                                                                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                            >
                                                                Pagar ({w.payment_method || 'M-Pesa'})
                                                            </button>
                                                            <button 
                                                                onClick={() => handleProcessWithdrawal(w.id, 'Cancelado')}
                                                                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>👥 Contas Criadas e Acessos à Loja</h2>
                            <p style={{ margin: '0.2rem 0 0', color: '#6b7280', fontSize: '0.85rem' }}>Visualização de todas as contas registadas e atividade em tempo real.</p>
                        </div>
                        <button onClick={fetchUsers} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                            ↻ Atualizar Lista
                        </button>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Utilizador / Nome</th>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Email & Contacto</th>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Data de Criação</th>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Última Vez Acessado</th>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
                                    <th style={{ padding: '0.85rem 1.25rem' }}>Histórico Pedidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#111827' }}>
                                            👤 {u.name}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#4b5563' }}>
                                            <div>📧 {u.email}</div>
                                            {u.phone && u.phone !== 'Sem telefone' && (
                                                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>📞 {u.phone}</div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#6b7280', fontSize: '0.85rem' }}>
                                            📅 {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#6b7280', fontSize: '0.85rem' }}>
                                            🕒 {u.last_seen_at ? new Date(u.last_seen_at).toLocaleString('pt-MZ', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            {u.is_online ? (
                                                <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.8rem' }}>
                                                    🟢 Online
                                                </span>
                                            ) : (
                                                <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.8rem' }}>
                                                    ⚪ Offline
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#111827' }}>
                                            📦 {u.order_count} pedido{u.order_count !== 1 ? 's' : ''}
                                        </td>
                                    </tr>
                                ))}
                                {usersList.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                            Nenhum utilizador registado até ao momento.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'finance' && (
                <div style={{ padding: '1.5rem 2rem' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>💰 Finanças &amp; Fluxo de Caixa Manual</span>
                            </h2>
                            <p style={{ margin: '0.2rem 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                                Gestão de faturamento, gastos, investimentos, retiradas e saldo real em caixa.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={openCreateFinanceModal}
                                style={{
                                    background: '#059669', color: '#fff', border: 'none',
                                    padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 700,
                                    cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                + Novo Lançamento
                            </button>
                            <button
                                onClick={exportFinanceCSV}
                                style={{
                                    background: '#3b82f6', color: '#fff', border: 'none',
                                    padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 600,
                                    cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Exportar CSV
                            </button>
                            <button
                                onClick={() => window.print()}
                                style={{
                                    background: '#475569', color: '#fff', border: 'none',
                                    padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 600,
                                    cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                Imprimir
                            </button>
                            <button
                                onClick={fetchFinanceEntries}
                                style={{
                                    background: '#f59e0b', color: '#fff', border: 'none',
                                    padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 600,
                                    cursor: 'pointer', fontSize: '0.85rem'
                                }}
                            >
                                ↻ Atualizar
                            </button>
                        </div>
                    </div>

                    {/* KPI Stat Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                            borderRadius: '16px', padding: '1.25rem 1.5rem', color: '#fff',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column', gap: '0.35rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    💵 Saldo Atual em Caixa
                                </span>
                                <span style={{ fontSize: '1.2rem', background: 'rgba(255,255,255,0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💰</span>
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                                {financeSummary.current_balance.toLocaleString('pt-MZ')} MT
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#d1fae5' }}>
                                (Receitas + Aportes) − (Gastos + Retiradas)
                            </div>
                        </div>

                        <div style={{
                            background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column', gap: '0.35rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    📈 Faturamento / Receitas
                                </span>
                                <span style={{ fontSize: '1.1rem', background: '#dcfce7', color: '#16a34a', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↗️</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>
                                {financeSummary.total_revenue.toLocaleString('pt-MZ')} MT
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {financeEntries.filter(e => e.type === 'receita').length} lançamentos de entrada
                            </div>
                        </div>

                        <div style={{
                            background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column', gap: '0.35rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    📉 Despesas / Gastos
                                </span>
                                <span style={{ fontSize: '1.1rem', background: '#fee2e2', color: '#dc2626', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↘️</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>
                                {financeSummary.total_expenses.toLocaleString('pt-MZ')} MT
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {financeEntries.filter(e => e.type === 'despesa').length} custos operacionais
                            </div>
                        </div>

                        <div style={{
                            background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column', gap: '0.35rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    💎 Lucro Líquido Real
                                </span>
                                <span style={{ fontSize: '1.1rem', background: '#e0f2fe', color: '#0284c7', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📊</span>
                            </div>
                            <div style={{
                                fontSize: '1.5rem', fontWeight: 800,
                                color: financeSummary.net_profit >= 0 ? '#0284c7' : '#dc2626'
                            }}>
                                {financeSummary.net_profit.toLocaleString('pt-MZ')} MT
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Receitas − Despesas Operacionais
                            </div>
                        </div>

                        <div style={{
                            background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column', gap: '0.35rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    🟣 Investimentos / Aportes
                                </span>
                                <span style={{ fontSize: '1.1rem', background: '#f3e8ff', color: '#9333ea', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏛️</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#9333ea' }}>
                                {financeSummary.total_investments.toLocaleString('pt-MZ')} MT
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Injeções de capital &amp; stock
                            </div>
                        </div>

                        <div style={{
                            background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column', gap: '0.35rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    🔵 Retiradas / Pró-labore
                                </span>
                                <span style={{ fontSize: '1.1rem', background: '#ffedd5', color: '#ea580c', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c' }}>
                                {financeSummary.total_withdrawals.toLocaleString('pt-MZ')} MT
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                Retiradas de lucros / sócios
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div style={{
                        background: '#fff', borderRadius: '14px', padding: '1rem 1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {[
                                { key: 'all', label: 'Todo o Período' },
                                { key: 'today', label: 'Hoje' },
                                { key: 'week', label: 'Esta Semana' },
                                { key: 'month', label: 'Este Mês' }
                            ].map(p => (
                                <button
                                    key={p.key}
                                    onClick={() => setFinancePeriod(p.key)}
                                    style={{
                                        background: financePeriod === p.key ? '#0f172a' : '#f1f5f9',
                                        color: financePeriod === p.key ? '#fff' : '#475569',
                                        border: 'none', padding: '0.45rem 0.9rem', borderRadius: '8px',
                                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                                    }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                                value={financeTypeFilter}
                                onChange={(e) => setFinanceTypeFilter(e.target.value)}
                                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: '#fff' }}
                            >
                                <option value="all">🔍 Todos os Tipos</option>
                                <option value="receita">🟢 Apenas Receitas / Vendas</option>
                                <option value="despesa">🔴 Apenas Despesas / Gastos</option>
                                <option value="investimento">🟣 Apenas Investimentos</option>
                                <option value="retirada">🔵 Apenas Retiradas</option>
                            </select>

                            <select
                                value={financeChannelFilter}
                                onChange={(e) => setFinanceChannelFilter(e.target.value)}
                                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: '#fff' }}
                            >
                                <option value="all">💳 Todos os Canais</option>
                                <option value="Dinheiro">💵 Dinheiro (Caixa)</option>
                                <option value="M-Pesa">📱 M-Pesa</option>
                                <option value="eMola">📱 eMola</option>
                                <option value="Conta Bancária">🏦 Conta Bancária</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '0.85rem 1.25rem' }}>Data</th>
                                        <th style={{ padding: '0.85rem 1.25rem' }}>Tipo</th>
                                        <th style={{ padding: '0.85rem 1.25rem' }}>Descrição</th>
                                        <th style={{ padding: '0.85rem 1.25rem' }}>Categoria</th>
                                        <th style={{ padding: '0.85rem 1.25rem' }}>Canal / Conta</th>
                                        <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Valor (MT)</th>
                                        <th style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {financeEntries.map((e) => {
                                        const isPositive = (e.type === 'receita' || e.type === 'investimento');
                                        const typeLabels = {
                                            receita: { label: '🟢 Receita', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', sign: '+' },
                                            despesa: { label: '🔴 Despesa', bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', sign: '-' },
                                            investimento: { label: '🟣 Investimento', bg: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff', sign: '+' },
                                            retirada: { label: '🔵 Retirada', bg: '#ffedd5', color: '#c2410c', border: '#fed7aa', sign: '-' }
                                        };
                                        const conf = typeLabels[e.type] || { label: e.type, bg: '#f1f5f9', color: '#334155', border: '#cbd5e1', sign: '' };

                                        return (
                                            <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1rem 1.25rem', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                    📅 {e.entry_date ? new Date(e.entry_date + 'T00:00:00').toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                                                    <span style={{
                                                        background: conf.bg, color: conf.color, border: `1px solid ${conf.border}`,
                                                        padding: '0.25rem 0.65rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700
                                                    }}>
                                                        {conf.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{e.description}</div>
                                                    {e.notes && <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>📝 {e.notes}</div>}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', color: '#334155', fontWeight: 600, fontSize: '0.85rem' }}>
                                                    🏷️ {e.category || 'Geral'}
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                                                    <span style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '0.25rem 0.6rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 }}>
                                                        💳 {e.payment_method || 'Dinheiro'}
                                                    </span>
                                                </td>
                                                <td style={{
                                                    padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 800, fontSize: '1.05rem',
                                                    color: isPositive ? '#16a34a' : '#dc2626', whiteSpace: 'nowrap'
                                                }}>
                                                    {conf.sign} {Number(e.amount || 0).toLocaleString('pt-MZ')} MT
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    <button
                                                        onClick={() => openEditFinanceModal(e)}
                                                        title="Editar"
                                                        style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '0.4rem 0.65rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginRight: '0.35rem' }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteFinanceToConfirm(e)}
                                                        title="Apagar"
                                                        style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '0.4rem 0.65rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {financeEntries.length === 0 && (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
                                                <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Nenhum registo financeiro encontrado</div>
                                                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                                    Clique no botão "+ Novo Lançamento" acima para adicionar receitas, despesas, investimentos ou retiradas.
                                                </div>
                                                <button
                                                    onClick={openCreateFinanceModal}
                                                    style={{ background: '#059669', color: '#fff', border: 'none', padding: '0.55rem 1.2rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                    + Lançar Agora
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
                                    <option value="pendrive">💾 Capacidade de Pendrive (1 GB a 16 GB)</option>
                                    <option value="card">💾 Capacidade de Cartão de Memória (1 GB a 64 GB)</option>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        🏷️ Estado do Stock
                                    </label>
                                    <select
                                        value={editProdStockStatus}
                                        onChange={(e) => setEditProdStockStatus(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}
                                    >
                                        <option value="Em Stock">✅ Em Stock</option>
                                        <option value="Últimas Unidades">🔥 Últimas Unidades</option>
                                        <option value="Esgotado">❌ Esgotado</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '0.75rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                        <input
                                            type="checkbox"
                                            checked={editProdFeatured}
                                            onChange={(e) => setEditProdFeatured(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: '#f59e0b', cursor: 'pointer' }}
                                        />
                                        ⭐ Produto em Destaque
                                    </label>
                                </div>
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

            {/* Finance Entry Modal (Create / Edit) */}
            {isFinanceModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '20px', padding: '2rem',
                        maxWidth: '520px', width: '92%', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#111827' }}>
                                {editingFinanceEntry ? '✏️ Editar Lançamento Financeiro' : '➕ Novo Lançamento Financeiro'}
                            </h3>
                            <button
                                onClick={() => setIsFinanceModalOpen(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveFinanceEntry} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>
                                    Tipo de Movimentação
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                    {[
                                        { val: 'receita', label: '🟢 Receita / Venda', border: '#bbf7d0', bg: '#f0fdf4', color: '#166534', accent: '#16a34a' },
                                        { val: 'despesa', label: '🔴 Despesa / Gasto', border: '#fecaca', bg: '#fef2f2', color: '#991b1b', accent: '#dc2626' },
                                        { val: 'investimento', label: '🟣 Investimento', border: '#e9d5ff', bg: '#faf5ff', color: '#6b21a8', accent: '#9333ea' },
                                        { val: 'retirada', label: '🔵 Retirada Sócio', border: '#fed7aa', bg: '#fff7ed', color: '#9a3412', accent: '#ea580c' }
                                    ].map(t => (
                                        <label
                                            key={t.val}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 0.75rem',
                                                border: `2px solid ${finType === t.val ? t.accent : t.border}`, borderRadius: '10px',
                                                background: t.bg, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: t.color
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="react-fin-type"
                                                value={t.val}
                                                checked={finType === t.val}
                                                onChange={() => setFinType(t.val)}
                                                style={{ accentColor: t.accent }}
                                            />
                                            {t.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>
                                    Descrição / Motivo *
                                </label>
                                <input
                                    type="text"
                                    value={finDesc}
                                    onChange={(e) => setFinDesc(e.target.value)}
                                    placeholder="Ex: Venda de lote fones, Combustível, Compra de Stock..."
                                    required
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>
                                        Valor (MT) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={finAmount}
                                        onChange={(e) => setFinAmount(e.target.value)}
                                        placeholder="0.00"
                                        required
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700 }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>
                                        Data *
                                    </label>
                                    <input
                                        type="date"
                                        value={finDate}
                                        onChange={(e) => setFinDate(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>
                                        Categoria
                                    </label>
                                    <select
                                        value={finCategory}
                                        onChange={(e) => setFinCategory(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', background: '#fff' }}
                                    >
                                        <option value="Vendas & Faturamento">Vendas &amp; Faturamento</option>
                                        <option value="Stock & Mercadoria">Stock &amp; Mercadoria</option>
                                        <option value="Logística & Entregas">Logística &amp; Entregas</option>
                                        <option value="Marketing & Divulgação">Marketing &amp; Divulgação</option>
                                        <option value="Operacional & Escritório">Operacional &amp; Escritório</option>
                                        <option value="Salários & Equipe">Salários &amp; Equipe</option>
                                        <option value="Retirada de Lucro">Retirada de Lucro</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>
                                        Canal / Forma
                                    </label>
                                    <select
                                        value={finChannel}
                                        onChange={(e) => setFinChannel(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', background: '#fff' }}
                                    >
                                        <option value="Dinheiro">💵 Dinheiro (Caixa)</option>
                                        <option value="M-Pesa">📱 M-Pesa</option>
                                        <option value="eMola">📱 eMola</option>
                                        <option value="Conta Bancária">🏦 Conta Bancária</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>
                                    Observações / Notas (Opcional)
                                </label>
                                <textarea
                                    value={finNotes}
                                    onChange={(e) => setFinNotes(e.target.value)}
                                    rows="2"
                                    placeholder="Informações adicionais..."
                                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsFinanceModalOpen(false)}
                                    style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingFinance}
                                    style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontWeight: 700, opacity: savingFinance ? 0.7 : 1 }}
                                >
                                    {savingFinance ? 'A guardar...' : '💾 Salvar Lançamento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Finance Confirmation Modal */}
            {deleteFinanceToConfirm && (
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
                        <h3 style={{ marginBottom: '0.5rem', color: '#111827' }}>Apagar Lançamento?</h3>
                        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Tem a certeza de que deseja apagar o registo "<strong>{deleteFinanceToConfirm.description}</strong>" no valor de <strong>{Number(deleteFinanceToConfirm.amount || 0).toLocaleString('pt-MZ')} MT</strong>?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setDeleteFinanceToConfirm(null)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '2px solid #e5e7eb', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDeleteFinanceEntry(deleteFinanceToConfirm.id)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
                            >
                                Sim, Apagar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
