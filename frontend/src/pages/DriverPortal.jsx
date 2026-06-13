import React, { useEffect, useState, useCallback } from 'react';

const STATUS_COLORS = {
    'Pendente':       { bg: '#fef3c7', color: '#92400e' },
    'Processando':    { bg: '#dbeafe', color: '#1e40af' },
    'Preparando':     { bg: '#ede9fe', color: '#5b21b6' },
    'Com Motorista':  { bg: '#d1fae5', color: '#065f46' },
    'Entregue':       { bg: '#dcfce7', color: '#166534' },
    'Cancelado':      { bg: '#fee2e2', color: '#991b1b' },
};

export default function DriverPortal() {
    const [drivers, setDrivers]           = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [orders, setOrders]             = useState([]);
    const [loading, setLoading]           = useState(false);
    const [toast, setToast]               = useState(null);

    // --- Fetch all drivers ---
    const fetchDrivers = useCallback(async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/drivers');
            if (res.ok) {
                const data = await res.json();
                setDrivers(data);
                
                // If a driver was already selected, update their state from the new list
                if (selectedDriver) {
                    const updated = data.find(d => d.id === selectedDriver.id);
                    if (updated) setSelectedDriver(updated);
                }
            }
        } catch (err) {
            console.error('Erro ao buscar motoristas:', err);
        }
    }, [selectedDriver]);

    // --- Fetch orders assigned to selected driver ---
    const fetchAssignedOrders = useCallback(async () => {
        if (!selectedDriver) return;
        setLoading(true);
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders');
            if (res.ok) {
                const allOrders = await res.json();
                // Filter orders for this driver that are not completed or cancelled
                const filtered = allOrders.filter(o => 
                    o.driver_id === selectedDriver.id && 
                    o.status !== 'Entregue' && 
                    o.status !== 'Cancelado'
                );
                setOrders(filtered);
            }
        } catch (err) {
            console.error('Erro ao buscar encomendas do motorista:', err);
        } finally {
            setLoading(false);
        }
    }, [selectedDriver]);

    // --- Initial fetch ---
    useEffect(() => {
        fetchDrivers();
    }, []);

    // --- Fetch orders when driver changes or at interval ---
    useEffect(() => {
        if (selectedDriver) {
            fetchAssignedOrders();
            const interval = setInterval(fetchAssignedOrders, 10000);
            return () => clearInterval(interval);
        }
    }, [selectedDriver, fetchAssignedOrders]);

    // --- Toggle active status ---
    const handleToggleActive = async () => {
        if (!selectedDriver) return;
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + `/api/drivers/${selectedDriver.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !selectedDriver.active })
            });
            if (res.ok) {
                const updated = await res.json();
                setSelectedDriver(updated);
                showToast(`Estado alterado para: ${updated.active ? 'Online 🟢' : 'Offline 🔴'}`);
                fetchDrivers();
            }
        } catch (err) {
            console.error('Erro ao atualizar estado:', err);
        }
    };

    // --- Update order status ---
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + `/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                showToast(`Encomenda #${orderId} atualizada para "${newStatus}"!`);
                fetchAssignedOrders();
            }
        } catch (err) {
            console.error('Erro ao atualizar estado da encomenda:', err);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const contactClient = (phone) => {
        let cleaned = phone.replace(/\s+/g, '').replace('+', '');
        if (!cleaned.startsWith('258') && cleaned.length === 9) {
            cleaned = '258' + cleaned;
        }
        window.open(`https://wa.me/${cleaned}?text=Olá,%20sou%20o%20motorista%20do%20Tchapo%20Tchapo%20e%20estou%20a%20caminho%20da%20sua%20entrega.`, '_blank');
    };

    // ==================== TOAST NOTIFICATION ====================
    const renderToast = () => toast && (
        <div style={{
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, background: '#111827', color: '#fff', padding: '0.8rem 1.5rem',
            borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            fontSize: '0.9rem', fontWeight: 600, borderLeft: '4px solid #f59e0b'
        }}>
            {toast}
        </div>
    );

    // ==================== DRIVER LOGIN SELECTOR ====================
    if (!selectedDriver) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
                background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', padding: '1rem',
                fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
            }}>
                <div style={{
                    background: '#fff', padding: '2.5rem 2rem', borderRadius: '24px',
                    width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🛵</div>
                    <h2 style={{ margin: '0 0 0.5rem', color: '#111827', fontWeight: 800 }}>Portal de Motoristas</h2>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Selecione o seu perfil para ver as suas entregas atribuídas
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {drivers.map(d => (
                            <button
                                key={d.id}
                                onClick={() => setSelectedDriver(d)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', width: '100%',
                                    padding: '1rem', background: '#f9fafb', border: '1px solid #e5e7eb',
                                    borderRadius: '16px', cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.2s', outline: 'none'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f59e0b'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                            >
                                <img
                                    src={d.photo_url || 'https://via.placeholder.com/45'}
                                    alt={d.name}
                                    style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: '#e5e7eb' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, color: '#111827', fontSize: '0.95rem', fontWeight: 700 }}>{d.name}</h4>
                                    <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '0.8rem' }}>
                                        {d.active ? '🟢 Disponível (Online)' : '🔴 Offline'}
                                    </p>
                                </div>
                                <span style={{ fontSize: '1.2rem', color: '#f59e0b' }}>→</span>
                            </button>
                        ))}
                        {drivers.length === 0 && (
                            <div style={{ padding: '2rem', color: '#9ca3af', fontSize: '0.9rem' }}>
                                Nenhum motorista registado na loja. Solicite ao administrador para adicionar o seu perfil.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ==================== DRIVER DASHBOARD ====================
    return (
        <div style={{
            minHeight: '100vh', background: '#f3f4f6', fontFamily: 'Inter, sans-serif',
            display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
        }}>
            {renderToast()}

            {/* Profile Header */}
            <div style={{
                background: '#111827', color: '#fff', padding: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                        src={selectedDriver.photo_url || 'https://via.placeholder.com/50'}
                        alt={selectedDriver.name}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f59e0b' }}
                    />
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{selectedDriver.name}</h2>
                        <button
                            onClick={handleToggleActive}
                            style={{
                                border: 'none', background: 'transparent', padding: '2px 0 0',
                                color: selectedDriver.active ? '#10b981' : '#ef4444',
                                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                            }}
                        >
                            <span style={{ fontSize: '0.6rem' }}>●</span>
                            {selectedDriver.active ? 'Trabalhando (Online)' : 'Fora de Serviço (Offline)'}
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => { setSelectedDriver(null); setOrders([]); }}
                    style={{
                        background: '#374151', color: '#f3f4f6', border: 'none',
                        padding: '0.5rem 1rem', borderRadius: '8px',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    Sair
                </button>
            </div>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '1.5rem', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: '#111827', fontWeight: 800 }}>🛵 As Minhas Entregas ({orders.length})</h3>
                    <button onClick={fetchAssignedOrders} style={{
                        background: '#fff', border: '1px solid #d1d5db', padding: '0.4rem 0.8rem',
                        borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', color: '#4b5563'
                    }}>
                        ↻ Atualizar
                    </button>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>A carregar entregas...</div>
                )}

                {!loading && orders.map(order => {
                    const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS['Pendente'];
                    return (
                        <div
                            key={order.id}
                            style={{
                                background: '#fff', borderRadius: '16px', padding: '1.25rem',
                                marginBottom: '1.25rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem'
                            }}
                        >
                            {/* Order Header Card */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>CÓDIGO PEDIDO</span>
                                    <h4 style={{ margin: '2px 0 0', color: '#111827', fontSize: '1.1rem', fontWeight: 800 }}>#{order.id}</h4>
                                </div>
                                <span style={{
                                    background: statusColor.bg, color: statusColor.color,
                                    padding: '0.3rem 0.6rem', borderRadius: '8px',
                                    fontSize: '0.78rem', fontWeight: 700
                                }}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Client Details */}
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div>
                                    <strong style={{ color: '#4b5563' }}>Cliente:</strong>
                                    <span style={{ marginLeft: '4px', color: '#111827', fontWeight: 600 }}>{order.customer_name}</span>
                                </div>
                                <div>
                                    <strong style={{ color: '#4b5563' }}>Bairro:</strong>
                                    <span style={{ marginLeft: '4px', color: '#111827', fontWeight: 600 }}>{order.bairro}</span>
                                </div>
                                <div>
                                    <strong style={{ color: '#4b5563' }}>Morada:</strong>
                                    <span style={{ marginLeft: '4px', color: '#111827' }}>{order.address}</span>
                                </div>
                                <div>
                                    <strong style={{ color: '#4b5563' }}>Horário:</strong>
                                    <span style={{ marginLeft: '4px', color: '#f59e0b', fontWeight: 700 }}>⏱️ {order.time}</span>
                                </div>
                                <div>
                                    <strong style={{ color: '#4b5563' }}>Pagamento:</strong>
                                    <span style={{ marginLeft: '4px', color: '#111827' }}>💳 {order.payment}</span>
                                </div>
                                <div>
                                    <strong style={{ color: '#4b5563' }}>Total a Receber:</strong>
                                    <span style={{ marginLeft: '4px', color: '#111827', fontWeight: 800, fontSize: '1rem' }}>
                                        {Number(order.total).toLocaleString('pt-MZ')} MT
                                    </span>
                                </div>
                            </div>

                            {/* Products List */}
                            <div style={{ padding: '0.25rem 0.5rem' }}>
                                <strong style={{ color: '#4b5563', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Produtos do Pedido:</strong>
                                {order.order_items && order.order_items.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {order.order_items.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem' }}>
                                                <span style={{
                                                    background: '#ede9fe', 
                                                    color: '#5b21b6',
                                                    padding: '2px 8px', 
                                                    borderRadius: '12px', 
                                                    fontWeight: 700,
                                                    fontSize: '0.78rem'
                                                }}>
                                                    {item.quantity}x
                                                </span>
                                                <span style={{ fontWeight: 600, color: '#111827' }}>{item.product_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.85rem' }}>Nenhum item encontrado</span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                {order.phone && (
                                    <button
                                        onClick={() => contactClient(order.phone)}
                                        style={{
                                            flex: 1, padding: '0.8rem', background: '#25D366',
                                            color: '#fff', border: 'none', borderRadius: '12px',
                                            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                                        }}
                                    >
                                        💬 WhatsApp
                                    </button>
                                )}
                                
                                {order.status !== 'Com Motorista' ? (
                                    <button
                                        onClick={() => handleUpdateOrderStatus(order.id, 'Com Motorista')}
                                        style={{
                                            flex: 1.5, padding: '0.8rem', background: '#f59e0b',
                                            color: '#fff', border: 'none', borderRadius: '12px',
                                            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                                        }}
                                    >
                                        🛵 Iniciar Entrega
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUpdateOrderStatus(order.id, 'Entregue')}
                                        style={{
                                            flex: 1.5, padding: '0.8rem', background: '#10b981',
                                            color: '#fff', border: 'none', borderRadius: '12px',
                                            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                                        }}
                                    >
                                        ✅ Entregue
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {!loading && orders.length === 0 && (
                    <div style={{
                        textAlign: 'center', padding: '4rem 2rem', background: '#fff',
                        borderRadius: '20px', color: '#9ca3af', border: '1px dashed #d1d5db'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h4 style={{ margin: 0, color: '#4b5563', fontWeight: 700 }}>Sem entregas pendentes!</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
                            Excelente trabalho! Aguarde que o administrador lhe atribua novos pedidos.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
