import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MZ_PROVINCES, ALL_PROVINCES, DEFAULT_PROVINCE, getBairrosByProvince } from '../data/mozambiqueLocations';

// Modern SVG Icons (No Emojis)
const IconsBase = {
    RefreshCw: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
        </svg>
    ),
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
    ),
    FileText: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    ),
    Sun: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/>
            <path d="m19.07 4.93-1.41 1.41"/>
        </svg>
    ),
    Moon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
    ),
    Phone: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
    )
};

// Safe Proxy to guarantee no undefined Icon can ever crash the interface
const Icons = new Proxy(IconsBase, {
    get: (target, prop) => {
        if (typeof prop === 'string' && prop in target) return target[prop];
        return () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
            </svg>
        );
    }
});

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

// Format driver ID to 4 digits (e.g. 7 -> 0007)
export const formatDriverId = (id) => {
    if (id == null || id === '') return '';
    const num = Number(id);
    return !isNaN(num) ? String(num).padStart(4, '0') : String(id).padStart(4, '0');
};

// Pickup prices list allowed by the store
const STORE_PICKUP_PRICES = [
    { name: 'Fita Led RGB 5 metros', price: 250 },
    { name: 'Protetor de Vidro', price: 50 },
    { name: 'Capas de Silicone', price: 100 },
    { name: 'Bluetooth Speaker', price: 250 },
    { name: 'Mouse com Fio', price: 250 },
    { name: 'Carregador para Carro', price: 200 },
    { name: 'Pro 2', price: 250 },
    { name: 'AirPods Pro', price: 500 },
    { name: 'JBL Bluetooth Speaker', price: 8000 },
    { name: 'JBL Headphone', price: 700 },
    { name: 'Mouse Gamer Com Fio', price: 400 },
    { name: 'Cabo Carregador 4 em 1', price: 100 },
    { name: 'Carregador Magsafe Para iPhone', price: 800 },
    { name: 'Ventoinha Portátil', price: 200 },
    { name: 'Router Wifi', price: 1800 },
    { name: 'Auriculares com Fio', price: 80 },
    { name: 'Combo: Mouse Teclado', price: 900 },
    { name: 'Power Bank 10000 Volts', price: 800 },
    { name: 'Chaleira Elétrica', price: 300 },
    { name: 'Video Maker', price: 1000 },
    { name: 'Capas Transparentes Magnéticas', price: 200 },
    { name: 'LCD para Celulares Androides', price: 1100 },
    { name: 'Game Stick', price: 1200 },
    { name: 'Câmera de Vigilância', price: 1100 },
    { name: 'Gamepad V8', price: 1100 },
    { name: 'Auriculares com Fio para Pescoço', price: 180 },
    { name: 'Remote Universal', price: 150 },
    { name: 'Pilhas Duracell', price: 50 },
    { name: 'Colunas Bluetooth (Home Theater)', price: 2500 },
    { name: 'Microfone (Lapela)', price: 500 },
    { name: 'Nokia Mini BM10', price: 1000 },
    { name: 'Bateria Nokia', price: 50 },
    { name: 'Extensor 4 ports', price: 150 },
    { name: 'Ventosas', price: 250 },
    { name: 'Protetor de SmartWatch', price: 350 },
    { name: 'Ventoinha', price: 900 },
    { name: 'JBL Live Flex', price: 350 },
    { name: 'Carregador Magsafe Para iPhone (Cabo)', price: 500 },
    { name: 'P47 Headphone', price: 200 },
    { name: 'Earbuds M10 NEWEST', price: 300 },
    { name: 'Tsunami', price: 20 },
    { name: 'Balsám', price: 30 },
    { name: 'Pasta Removedora de mancha de fumaça', price: 95 },
    { name: 'Sprey Bucal Oral', price: 150 },
    { name: 'Pasta de Dentes Clareadora de Carvão', price: 100 },
    { name: 'Aquecedor de Cera Roll On Depilador', price: 350 },
    { name: 'Chá de Emagrecimento', price: 200 },
    { name: 'Cantil Cold Keeping Cup', price: 580 },
    { name: 'Perfume para Carro', price: 85 },
    { name: 'Vaselina para Lábios', price: 20 },
    { name: 'Secador de Unhas', price: 950 },
    { name: 'Gillette Fusion 5', price: 500 },
    { name: 'Creme de Pé', price: 75 },
    { name: 'Creme de Pé (Extrato de Banana)', price: 100 },
    { name: 'Creme de Pé (Anti-Rachaduras)', price: 155 },
    { name: 'Creme de Estrias', price: 200 },
    { name: 'Creme de Estrias (Stretch Mark)', price: 120 },
    { name: 'Creme de Peitos', price: 150 },
    { name: 'Oléo para Alargamento de Ancas', price: 250 },
    { name: 'Creme Elevador de Quadril', price: 200 },
    { name: 'Firmante de Quadril', price: 180 },
    { name: 'Gel antibacteriano intimo', price: 100 },
    { name: 'Creme Corporal de Emagrecimento', price: 250 },
    { name: 'Creme para Abdómen (Six Pack)', price: 200 },
    { name: 'Creme Corporal de Emagrecimento (Red)', price: 180 },
    { name: 'Protetor Solar', price: 130 }
];

const normalizeForMatch = (str) => {
    if (!str) return '';
    return str.toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const findPickupItem = (productName) => {
    if (!productName) return null;
    const cleanName = normalizeForMatch(productName);
    
    // Explicit priority rule for Pro 2 vs AirPods Pro
    if (cleanName.includes('pro 2') || cleanName.includes('2a geracao') || cleanName.includes('2 geracao') || cleanName.includes('u40')) {
        const pro2 = STORE_PICKUP_PRICES.find(p => p.name === 'Pro 2');
        if (pro2) return pro2;
    }
    if (cleanName.includes('airpods pro') || cleanName === 'airpod pro') {
        const airpodsPro = STORE_PICKUP_PRICES.find(p => p.name === 'AirPods Pro');
        if (airpodsPro) return airpodsPro;
    }

    // 1. Exact match
    const exact = STORE_PICKUP_PRICES.find(p => normalizeForMatch(p.name) === cleanName);
    if (exact) return exact;

    // 2. Substring match
    const sub = STORE_PICKUP_PRICES.find(p => {
        const cleanP = normalizeForMatch(p.name);
        return cleanName.includes(cleanP) || cleanP.includes(cleanName);
    });
    if (sub) return sub;

    // 3. Significant word match
    const words = cleanName.split(' ').filter(w => w.length > 2);
    let bestMatch = null;
    let maxMatchedWords = 0;
    for (const p of STORE_PICKUP_PRICES) {
        const pWords = normalizeForMatch(p.name).split(' ').filter(w => w.length > 2);
        const common = words.filter(w => pWords.includes(w));
        if (common.length > maxMatchedWords) {
            maxMatchedWords = common.length;
            bestMatch = p;
        }
    }
    if (bestMatch && maxMatchedWords >= 1) return bestMatch;
    return null;
};

const calcOrderPickupAndProfit = (order) => {
    if (!order) return { pickupTotal: 0, orderTotal: 0, estimatedProfit: 150, platformFee: 22, driverNetProfit: 128, hasMatchedAny: false, itemsWithPickup: [] };
    
    let totalPickup = 0;
    let hasMatchedAny = false;
    let items = [];
    if (order.items) {
        if (typeof order.items === 'string') {
            try { items = JSON.parse(order.items); } catch (_) { items = []; }
        } else if (Array.isArray(order.items)) {
            items = order.items;
        }
    } else if (order.order_items && Array.isArray(order.order_items)) {
        items = order.order_items;
    }
    
    const itemsWithPickup = items.map(it => {
        if (!it) return { product_name: 'Produto', quantity: 1, price: 0, pickupPrice: null, pickupTotal: null, matchedName: 'Produto' };
        const prodName = it.product_name || it.name || 'Produto';
        const match = findPickupItem(prodName);
        const qty = Number(it.quantity) || 1;
        const pickupUnit = match ? Number(match.price) : null;
        if (pickupUnit !== null && !isNaN(pickupUnit)) {
            totalPickup += pickupUnit * qty;
            hasMatchedAny = true;
        }
        return {
            ...it,
            product_name: prodName,
            pickupPrice: pickupUnit,
            pickupTotal: pickupUnit !== null ? pickupUnit * qty : null,
            matchedName: match ? match.name : prodName
        };
    });

    const orderTotal = Number(order.total) || 0;
    let estimatedProfit = 0;

    if (hasMatchedAny && totalPickup > 0) {
        estimatedProfit = Math.max(0, orderTotal - totalPickup);
    } else {
        estimatedProfit = 150;
    }

    // Taxa da plataforma: exatamente 15% do lucro estimado (mínimo 20 MT)
    const platformFee = Math.max(20, Math.round(estimatedProfit * 0.15));
    const driverNetProfit = Math.max(0, estimatedProfit - platformFee);

    return {
        pickupTotal: totalPickup,
        orderTotal,
        estimatedProfit,
        platformFee,
        driverNetProfit,
        hasMatchedAny,
        itemsWithPickup
    };
};

// Fallback image assets matching product keywords
const PRODUCT_IMAGE_FALLBACKS = {
    'airpods pro': 'assets/airpods_pro_1777767746082.png',
    'pro 2': 'assets/airpods_pro_1777767746082.png',
    'airpods 3': 'assets/airpods_3_1777767759427.png',
    'airpods (3ª geração)': 'assets/airpods_3_1777767759427.png',
    'fita led': 'assets/led_lights_1777769768426.png',
    'coluna bluetooth': 'assets/bluetooth_speaker_1777774326728.png',
    'bluetooth speaker': 'assets/bluetooth_speaker_1777774326728.png',
    'smartwatch': 'assets/smartwatch_1777774341144.png',
    'capas de silicone': 'assets/iphone_silicone_case.png',
    'power bank': 'assets/power_bank_1777774355353.png',
    'celular android': 'assets/android_phone_1777769782866.png'
};

const getProductFallbackImage = (productName) => {
    if (!productName) return null;
    const clean = normalizeForMatch(productName);
    for (const [key, path] of Object.entries(PRODUCT_IMAGE_FALLBACKS)) {
        if (clean.includes(normalizeForMatch(key)) || normalizeForMatch(key).includes(clean)) {
            return path;
        }
    }
    return null;
};

class DriverPortalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('DriverPortal Error caught:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem 1rem',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontFamily: "'Montserrat', sans-serif",
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '440px', background: '#1e293b', padding: '2rem', borderRadius: '20px', border: '1px solid #334155' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.6rem' }}>
                            ⚠️
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 900 }}>Recarregando Central</h3>
                        <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>
                            Ocorreu uma pequena instabilidade na visualização. Clique no botão abaixo para restaurar o portal imediatamente.
                        </p>
                        {this.state.error && (
                            <details style={{ textAlign: 'left', marginBottom: '1.25rem', fontSize: '0.75rem', color: '#ef4444', background: '#0f172a', padding: '0.6rem 0.8rem', borderRadius: '8px', overflowX: 'auto' }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Ver detalhes do erro</summary>
                                <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{String(this.state.error?.message || this.state.error)}</pre>
                            </details>
                        )}
                        <button
                            type="button"
                            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
                            style={{
                                background: '#f59e0b',
                                color: '#111827',
                                border: 'none',
                                padding: '0.85rem 1.75rem',
                                borderRadius: '12px',
                                fontWeight: 800,
                                fontSize: '0.92rem',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Atualizar Página
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function DriverPortalContent() {
    const API_URL = import.meta.env.VITE_API_URL || '';

    const resolveImageUrl = (img, fallbackName = null) => {
        let target = img;
        if (!target && fallbackName) {
            target = getProductFallbackImage(fallbackName);
        }
        if (!target || typeof target !== 'string') return null;
        if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('data:') || target.startsWith('blob:')) return target;
        const clean = target.startsWith('/') ? target : '/' + target;
        return API_URL ? `${API_URL}${clean}` : clean;
    };

    const extractOrderLocation = (order) => {
        if (!order) return { province: 'Sofala', bairro: 'Beira' };
        let prov = typeof order.province === 'string' ? order.province.trim() : '';
        let bai = typeof order.bairro === 'string' 
            ? order.bairro.trim() 
            : (typeof order.customer_bairro === 'string' ? order.customer_bairro.trim() : '');
        
        if (bai && bai.includes(' - ')) {
            const parts = bai.split(' - ');
            if (parts.length >= 2) {
                const potentialProv = parts[0].trim();
                const matchedProv = (ALL_PROVINCES || []).find(p => p && p.toLowerCase() === potentialProv.toLowerCase());
                if (matchedProv) {
                    prov = matchedProv;
                    bai = parts.slice(1).join(' - ').trim();
                }
            }
        }

        if (bai && bai.includes('(') && bai.includes(')')) {
            const match = bai.match(/^(.*?)\s*\((.*?)\)$/);
            if (match) {
                bai = match[1].trim();
                const paren = (match[2] || '').trim();
                if (!prov && paren) {
                    const lowParen = paren.toLowerCase();
                    if (lowParen === 'beira') prov = 'Sofala';
                    else if (lowParen === 'maputo' || lowParen === 'matola') prov = 'Maputo';
                    else if (lowParen === 'nampula') prov = 'Nampula';
                    else if (lowParen === 'quelimane') prov = 'Zambézia';
                    else if (lowParen === 'tete') prov = 'Tete';
                    else if (lowParen === 'chimoio') prov = 'Manica';
                    else prov = paren;
                }
            }
        }

        if (!prov && bai) {
            const lowerBai = bai.toLowerCase();
            for (const item of (MZ_PROVINCES || [])) {
                if (item?.name && lowerBai.includes(item.name.toLowerCase())) {
                    prov = item.name;
                    break;
                }
                if (item?.capital && lowerBai.includes(item.capital.toLowerCase())) {
                    prov = item.name;
                    break;
                }
            }
        }

        if (prov) {
            const lowProv = prov.toLowerCase();
            if (lowProv === 'beira') prov = 'Sofala';
            else if (lowProv.includes('matola')) prov = 'Maputo';

            const exactProv = (ALL_PROVINCES || []).find(p => p && p.toLowerCase() === prov.toLowerCase());
            if (exactProv) {
                prov = exactProv;
            }
        }

        return {
            province: prov || 'Sofala',
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
    const [showBalance, setShowBalance] = useState(true);
    const [earningsPeriod, setEarningsPeriod] = useState('today'); // 'today' | '7days' | '30days'

    // Unified Dark Mode (Preto Puro)
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const saved = localStorage.getItem('darkMode') || localStorage.getItem('tchapo_dark_mode');
            return saved === 'true';
        } catch (_) {
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
            localStorage.setItem('tchapo_dark_mode', darkMode ? 'true' : 'false');
            if (darkMode) {
                document.documentElement.classList.add('dark-mode');
                document.body.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
                document.body.classList.remove('dark-mode');
            }
        } catch (_) {}
    }, [darkMode]);

    // Modal Controls
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [docPreviewModal, setDocPreviewModal] = useState(null);
    const [confirmingOrder, setConfirmingOrder] = useState(null); // Strict Acceptance Modal
    const [previewPhoto, setPreviewPhoto] = useState(null); // Product Photo Lightbox Modal

    // Debt Payment State (e-Mola Fee Screen)
    const [debtPaymentRef, setDebtPaymentRef] = useState('');
    const [debtReceiptFile, setDebtReceiptFile] = useState(null);
    const [debtReceiptPreview, setDebtReceiptPreview] = useState(null);
    const [submittedProofPreview, setSubmittedProofPreview] = useState(null);
    const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('Todas');
    const [submittingDebt, setSubmittingDebt] = useState(false);
    const [debtSecondsLeft, setDebtSecondsLeft] = useState(7200);
    const [copiedId, setCopiedId] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [reEditProof, setReEditProof] = useState(false);
    const [checkingDebtStatus, setCheckingDebtStatus] = useState(false);

    // Login Form State
    const [loginPhone, setLoginPhone] = useState('');
    const [loginPin, setLoginPin] = useState('');
    const [showLoginPin, setShowLoginPin] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Register Form State
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regProvince, setRegProvince] = useState(DEFAULT_PROVINCE);
    const [regBairro, setRegBairro] = useState('');
    const [regDocType, setRegDocType] = useState('BI');
    const [regDocNumber, setRegDocNumber] = useState('');
    const [regPin, setRegPin] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [docPhotoFile, setDocPhotoFile] = useState(null);
    const [docPhotoPreview, setDocPhotoPreview] = useState(null);
    const [regLoading, setRegLoading] = useState(false);
    const [regStep, setRegStep] = useState(1); // 1: Perfil & Contacto | 2: Documentos | 3: Lista de Levantamento
    const [regTermsAgreed, setRegTermsAgreed] = useState(false);

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

    // Handle Register - Validate and show price list
    const handleRegister = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

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
        if (!regBairro.trim()) {
            showToast('Por favor introduza o nome do seu bairro.', 'error');
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

        // All valid — show price list (Step 3)
        setRegStep(3);
    };

    // Final Submit - Actually send registration to API
    const handleFinalSubmit = async () => {
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
            setRegStep(1);
            setRegTermsAgreed(false);
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
                try { fetchDashboard(authDriver.id); } catch (_) {}
            }
        } catch (err) {
            showToast('Erro ao atualizar disponibilidade.', 'error');
        } finally {
            setTogglingOnline(false);
        }
    };

    // Prompt Strict Acceptance Modal
    const promptAcceptOrder = (order) => {
        if (!isOnline) {
            showToast('Você está offline! Ative o modo Online para receber e aceitar pedidos.', 'warning');
            return;
        }
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
        if (!isOnline) {
            showToast('Você precisa ficar Online para aceitar pedidos.', 'warning');
            return;
        }
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
                body: JSON.stringify({
                    status: newStatus,
                    driver_id: authDriver?.id,
                    delivered_at: newStatus === 'Entregue' ? new Date().toISOString() : undefined
                })
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
        const trimmedRef = debtPaymentRef.trim();
        if (!trimmedRef && !debtReceiptFile) {
            showToast('Por favor introduza o código de confirmação ou anexe o comprovativo.', 'error');
            return;
        }

        setSubmittingDebt(true);
        try {
            const fd = new FormData();
            if (trimmedRef) {
                fd.append('reference', trimmedRef);
            }
            if (debtReceiptFile) {
                fd.append('receipt', debtReceiptFile);
            }

            // Preserve local image preview immediately
            if (debtReceiptPreview) {
                setSubmittedProofPreview(debtReceiptPreview);
            }

            const res = await fetch(`${API_URL}/api/drivers/${authDriver?.id}/pay-debt`, {
                method: 'POST',
                body: fd
            });

            let data = {};
            try {
                data = await res.json();
            } catch (_) {
                data = {};
            }

            if (res.ok) {
                showToast('Comprovativo submetido com sucesso! A administração irá validar.', 'success');
                setDebtPaymentRef('');
                setDebtReceiptFile(null);
                setReEditProof(false);

                const currentDebt = dashboardData?.pending_debt || {};
                const optimisticDebt = data.pending_debt || {
                    ...currentDebt,
                    status: 'Aguardando Confirmação',
                    payment_proof: trimmedRef || 'Comprovativo de Imagem Anexado',
                    payment_proof_url: debtReceiptPreview || currentDebt.payment_proof_url || null,
                    paid_submission_at: new Date().toISOString()
                };

                setDashboardData(prev => ({
                    ...(prev || {}),
                    pending_debt: optimisticDebt
                }));

                try {
                    await fetchDashboard(authDriver?.id);
                } catch (_) {}
            } else {
                showToast(data.error || 'Erro ao submeter comprovativo.', 'error');
            }
        } catch (err) {
            console.error('Error submitting debt proof:', err);
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

    const copyPhoneToClipboard = (text) => {
        try {
            navigator.clipboard.writeText(text);
            setCopiedPhone(true);
            showToast('Número e-Mola copiado!', 'info');
            setTimeout(() => setCopiedPhone(false), 3000);
        } catch (_) {}
    };

    const handleCheckDebtApproval = async () => {
        if (!authDriver?.id) return;
        setCheckingDebtStatus(true);
        try {
            await fetchDashboard(authDriver.id);
            showToast('Estado verificado com sucesso.', 'info');
        } catch (_) {
            showToast('Erro ao consultar o servidor.', 'error');
        } finally {
            setCheckingDebtStatus(false);
        }
    };

    const stats = dashboardData?.stats || {
        today_earnings: 0,
        week_earnings: 0,
        month_earnings: 0,
        total_earnings: 0,
        today_deliveries: 0,
        week_deliveries: 0,
        month_deliveries: 0,
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

    // Debt payment countdown timer sync
    useEffect(() => {
        if (!pendingDebt?.due_at) return;
        const updateCountdown = () => {
            const diffSecs = Math.max(0, Math.floor((new Date(pendingDebt.due_at).getTime() - Date.now()) / 1000));
            setDebtSecondsLeft(diffSecs);
        };
        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [pendingDebt?.due_at]);

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
        <div className="rp-driver-shell" style={{ minHeight: '100vh', background: darkMode ? '#000000' : '#f8fafc', color: darkMode ? '#ffffff' : '#0f172a', fontFamily: "'Montserrat', sans-serif" }}>
            
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'calc(100% - 32px)',
                    maxWidth: '440px',
                    zIndex: 999999,
                    background: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#059669' : '#0f172a',
                    color: '#fff',
                    padding: '0.85rem 1.2rem',
                    borderRadius: '16px',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                }}>
                    {toast.type === 'error' ? <Icons.AlertTriangle /> : <Icons.CheckCircle />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Tchapo Mobile Header */}
            <header style={{
                background: darkMode ? '#111111' : '#ffffff',
                borderBottom: darkMode ? '1px solid #222222' : '1px solid #e2e8f0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.6)' : '0 2px 10px rgba(0, 0, 0, 0.03)',
                height: '62px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '480px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Brand or Driver Profile */}
                    {authDriver ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '2px solid #f64c00',
                                background: darkMode ? '#1e1e1e' : '#f1f5f9',
                                flexShrink: 0
                            }}>
                                <img
                                    src={authDriver.photo_url || '/assets/logo_original.png'}
                                    alt={authDriver.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.currentTarget.src = '/assets/logo_original.png'; }}
                                />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: darkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2 }}>
                                    Olá, {authDriver.name ? authDriver.name.split(' ')[0] : 'Entregador'}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                    {authDriver.approval_status === 'Aprovado' ? `ID: #${formatDriverId(authDriver.id)}` : 'Conta em Análise'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #f64c00 0%, #ff6b2b 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2px'
                            }}>
                                <img
                                    src="/assets/logo_original.png"
                                    alt="Tchapo Tchapo"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <div>
                                <div style={{ color: darkMode ? '#ffffff' : '#0f172a', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                                    Tchapo Tchapo
                                </div>
                                <div style={{ color: '#f64c00', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                    Portal do Entregador
                                </div>
                            </div>
                        </a>
                    )}

                    {/* Right Header Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Dark Mode Toggle Button */}
                        <button
                            type="button"
                            onClick={() => setDarkMode(!darkMode)}
                            className="rp-theme-toggle"
                            title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Noturno"}
                            aria-label={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Noturno"}
                        >
                            {darkMode ? <Icons.Sun /> : <Icons.Moon />}
                        </button>

                        {authDriver ? (
                            <>
                                {authDriver.approval_status === 'Aprovado' && !isDebtBlocked && (
                                    <button
                                        onClick={() => handleToggleAvailability()}
                                        disabled={togglingOnline}
                                        style={{
                                            background: isOnline ? 'rgba(16, 185, 129, 0.12)' : (darkMode ? '#1a1a1a' : '#f1f5f9'),
                                            border: isOnline ? '1.5px solid #10b981' : (darkMode ? '1px solid #2a2a2a' : '1px solid #cbd5e1'),
                                            color: isOnline ? '#10b981' : (darkMode ? '#94a3b8' : '#64748b'),
                                            padding: '0.45rem 0.85rem',
                                            borderRadius: '999px',
                                            fontWeight: 800,
                                            fontSize: '0.78rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.45rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontFamily: "'Montserrat', sans-serif"
                                        }}
                                    >
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: isOnline ? '#10b981' : '#94a3b8',
                                            boxShadow: isOnline ? '0 0 8px #10b981' : 'none'
                                        }} />
                                        <span>{isOnline ? 'Online' : 'Offline'}</span>
                                    </button>
                                )}

                                {isDebtBlocked && (
                                    <span style={{
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.74rem',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}>
                                        <Icons.AlertTriangle />
                                        <span>Taxa</span>
                                    </span>
                                )}

                                {!isDebtBlocked && (
                                    <button
                                        onClick={handleLogout}
                                        title="Terminar sessão"
                                        style={{
                                            background: darkMode ? '#1a1a1a' : '#f8fafc',
                                            border: darkMode ? '1px solid #2a2a2a' : '1px solid #e2e8f0',
                                            color: darkMode ? '#94a3b8' : '#64748b',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <Icons.LogOut />
                                    </button>
                                )}
                            </>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                style={{
                                    background: darkMode ? '#1a1a1a' : '#f1f5f9',
                                    border: darkMode ? '1px solid #2a2a2a' : '1px solid #e2e8f0',
                                    color: darkMode ? '#ffffff' : '#0f172a',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    fontFamily: "'Montserrat', sans-serif"
                                }}
                            >
                                <Icons.LogIn />
                                <span>Entrar</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Mobile Container */}
            <main className="rp-mobile-container" style={{ maxWidth: '480px', margin: '0 auto', padding: '1rem 1rem 100px', boxSizing: 'border-box', background: darkMode ? '#000000' : '#f8fafc' }}>

                {/* VIEW 1: Non-logged in Mobile Landing */}
                {!authDriver && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Hero Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            borderRadius: '22px',
                            padding: '1.75rem 1.5rem',
                            color: '#ffffff',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)'
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                background: 'rgba(246, 76, 0, 0.18)',
                                border: '1px solid rgba(246, 76, 0, 0.35)',
                                color: '#ff6b2b',
                                padding: '0.35rem 0.85rem',
                                borderRadius: '999px',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.4px',
                                marginBottom: '1rem'
                            }}>
                                <Icons.Navigation />
                                <span>Clientes Prontos Tchapo Tchapo</span>
                            </div>

                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 0.85rem', letterSpacing: '-0.5px' }}>
                                Ganhe Dinheiro com <span style={{ color: '#f64c00' }}>Entregas Rápidas</span>
                            </h1>

                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
                                As encomendas da loja online são enviadas diretamente para o seu telemóvel. Aceite pedidos na sua província e receba os seus lucros!
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <button
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    className="rp-btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    <Icons.Plus />
                                    <span>Cadastrar como Entregador</span>
                                </button>

                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.18)',
                                        padding: '0.85rem',
                                        borderRadius: '16px',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        fontFamily: "'Montserrat', sans-serif",
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <Icons.LogIn />
                                    <span>Já Tenho Conta / Entrar</span>
                                </button>
                            </div>
                        </div>

                        {/* Career & Rewards Card */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '20px',
                            padding: '1.25rem',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #f64c00 0%, #ff6b2b 100%)',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icons.Gift />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: '#f64c00', fontWeight: 800, textTransform: 'uppercase' }}>
                                        Reconhecimento Oficial
                                    </div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                        Metas & Super Prêmios
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ color: '#f64c00', display: 'flex' }}><Icons.ShirtReward /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>5.000 MT: Camisa + Verificado</div>
                                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Camisa da marca + Selo Oficial Verificado</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ color: '#0284c7', display: 'flex' }}><Icons.Helmet /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>20.000 MT: Capacete + Mochila + Bónus</div>
                                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Capacete Oficial + Mochila Térmica + 1.000 MT</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fefce8', padding: '0.75rem 0.85rem', borderRadius: '14px', border: '1px solid #fde047' }}>
                                    <div style={{ color: '#ca8a04', display: 'flex' }}><Icons.Plaque /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#854d0e' }}>100.000 MT: Placa de Ouro + 5.000 MT</div>
                                        <div style={{ fontSize: '0.74rem', color: '#a16207' }}>Placa de Reconhecimento Oficial em Ouro</div>
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
                    <div style={{ paddingBottom: '95px' }}>

                        {/* ========================================================================= */}
                        {/* TELA DE COBRANÇA DA TAXA APÓS ENTREGA (ESTILO OFICIAL DA LOJA TCHAPO TCHAPO) */}
                        {/* Cobertura total e travamento contínuo até confirmação pelo Admin */}
                        {/* ========================================================================= */}
                        {isDebtBlocked && (
                            <div style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 999999,
                                background: darkMode ? '#0f172a' : '#f8fafc',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                padding: '0.85rem 0.65rem 3rem',
                                boxSizing: 'border-box'
                            }}>
                                {/* Brand Top Bar styled like the Store Header */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: '540px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.65rem 0.85rem',
                                    background: darkMode ? '#1e293b' : '#ffffff',
                                    borderRadius: '16px',
                                    border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    marginBottom: '1rem',
                                    boxSizing: 'border-box',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(245,158,11,0.3)', flexShrink: 0 }}>
                                            <img src="/assets/logo_original.png" alt="Tchapo Tchapo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 900, fontSize: '0.94rem', color: darkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                                                Tchapo Tchapo
                                            </div>
                                            <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Central do Entregador
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{
                                            fontSize: '0.74rem',
                                            fontWeight: 800,
                                            color: '#64748b',
                                            background: darkMode ? '#0f172a' : '#f1f5f9',
                                            padding: '0.28rem 0.55rem',
                                            borderRadius: '8px'
                                        }}>
                                            ID: #{formatDriverId(authDriver?.id)}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Store-Styled Card */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: '540px',
                                    background: darkMode ? '#1e293b' : '#ffffff',
                                    borderRadius: '20px',
                                    padding: '1.25rem 1rem',
                                    border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                    boxShadow: '0 12px 36px -10px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    boxSizing: 'border-box'
                                }}>
                                    {/* AVISO URGENTE PÓS-TIMER (SOLICITAÇÃO EXPLÍCITA DO UTILIZADOR) */}
                                    {debtSecondsLeft === 0 ? (
                                        <div style={{
                                            background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                                            border: '2px solid #ef4444',
                                            borderRadius: '14px',
                                            padding: '1rem',
                                            marginBottom: '1.15rem',
                                            textAlign: 'center',
                                            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.15)'
                                        }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '50%',
                                                background: '#fee2e2',
                                                color: '#dc2626',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <Icons.AlertTriangle />
                                            </div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#dc2626', margin: '0 0 0.3rem' }}>
                                                ⚠️ AVISO URGENTE: Prazo de 2 Horas Esgotado!
                                            </h3>
                                            <p style={{ fontSize: '0.85rem', color: darkMode ? '#fca5a5' : '#b91c1c', fontWeight: 800, lineHeight: 1.4, margin: 0 }}>
                                                Deve efetuar o pagamento de forma imediata para evitar a suspensão da conta.
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.45rem',
                                            background: 'rgba(245, 158, 11, 0.12)',
                                            color: '#d97706',
                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                            padding: '0.35rem 0.95rem',
                                            borderRadius: '999px',
                                            fontSize: '0.76rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '0.85rem'
                                        }}>
                                            <Icons.Clock />
                                            <span>Taxa da Plataforma Obrigatória</span>
                                        </div>
                                    )}

                                    <h2 style={{ fontSize: 'clamp(1.15rem, 4.5vw, 1.55rem)', fontWeight: 900, margin: '0 0 0.35rem', color: darkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.25 }}>
                                        Cobrança de Taxa por Pedido Entregue
                                    </h2>
                                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 1.15rem' }}>
                                        A plataforma está temporariamente bloqueada para novos pedidos até que a comissão desta entrega seja confirmada pela administração.
                                    </p>

                                    {/* CRONÓMETRO DE 2 HORAS ESTILIZADO NO PADRÃO DA LOJA */}
                                    <div style={{
                                        background: darkMode ? '#0f172a' : '#f8fafc',
                                        borderRadius: '16px',
                                        padding: '0.85rem 1rem',
                                        marginBottom: '1.15rem',
                                        border: debtSecondsLeft === 0 ? '2px solid #ef4444' : darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '0.45rem'
                                    }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                                Tempo Restante para Pagamento:
                                            </div>
                                            <div style={{ fontSize: '0.76rem', color: debtSecondsLeft === 0 ? '#ef4444' : '#64748b', fontWeight: 600, marginTop: '2px' }}>
                                                {debtSecondsLeft === 0 ? 'Prazo expirado' : 'Prazo regular de 2 horas'}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: 'clamp(1.35rem, 5vw, 1.65rem)',
                                            fontWeight: 900,
                                            fontFamily: 'monospace',
                                            color: debtSecondsLeft === 0 ? '#ef4444' : debtSecondsLeft < 1800 ? '#f59e0b' : '#10b981',
                                            letterSpacing: '1px'
                                        }}>
                                            {formatTimer(debtSecondsLeft)}
                                        </div>
                                    </div>

                                    {/* CARTÃO FINANCEIRO DE DETALHES DO PEDIDO */}
                                    <div style={{
                                        background: darkMode ? '#0f172a' : '#f8fafc',
                                        borderRadius: '16px',
                                        padding: '1rem',
                                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                        marginBottom: '1.15rem',
                                        textAlign: 'left'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', paddingBottom: '0.65rem', borderBottom: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
                                            <div>
                                                <div style={{ fontSize: '0.82rem', color: darkMode ? '#cbd5e1' : '#475569', fontWeight: 700 }}>
                                                    Taxa da Plataforma (15% do Lucro):
                                                </div>
                                                {pendingDebt?.profit ? (
                                                    <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                                                        Seu Lucro neste pedido: +{formatMZCurrency(pendingDebt.profit)}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <strong style={{ fontSize: 'clamp(1.25rem, 4.5vw, 1.55rem)', fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.5px' }}>
                                                {formatMZCurrency(pendingDebt?.amount || 0)}
                                            </strong>
                                        </div>

                                        {/* Dados do e-Mola */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                                            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Número e-Mola:</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                                    874110586
                                                </strong>
                                                <button
                                                    type="button"
                                                    onClick={() => copyPhoneToClipboard('874110586')}
                                                    style={{
                                                        background: 'rgba(245, 158, 11, 0.15)',
                                                        border: 'none',
                                                        color: '#f59e0b',
                                                        padding: '0.22rem 0.5rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 800,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {copiedPhone ? 'Copiado!' : 'Copiar'}
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
                                            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Titular da Conta:</span>
                                            <strong style={{ fontSize: '0.9rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                                Massiquine Simango
                                            </strong>
                                        </div>

                                        {/* Caixa de ID de 4 dígitos obrigatório */}
                                        <div style={{
                                            background: darkMode ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
                                            border: '1.5px solid #fde68a',
                                            borderRadius: '12px',
                                            padding: '0.75rem 0.85rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '0.45rem'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 800, textTransform: 'uppercase' }}>
                                                    Adicione no conteúdo / motivo da transferência:
                                                </div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#92400e', marginTop: '2px' }}>
                                                    ID: {formatDriverId(authDriver?.id)}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(formatDriverId(authDriver?.id))}
                                                style={{
                                                    background: '#ffffff',
                                                    border: '1px solid #f59e0b',
                                                    color: '#b45309',
                                                    padding: '0.4rem 0.75rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    boxShadow: '0 2px 5px rgba(245,158,11,0.15)'
                                                }}
                                            >
                                                <Icons.Copy />
                                                <span>{copiedId ? 'Copiado!' : 'Copiar ID'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* ESTADO TRAVADO DE VALIDAÇÃO (A TELA NÃO DESAPARECE ATÉ O ADMIN CONFIRMAR) */}
                                    {pendingDebt?.status === 'Aguardando Confirmação' && !reEditProof ? (
                                        <div style={{
                                            background: darkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4',
                                            border: '2px solid #10b981',
                                            padding: '1.25rem 1rem',
                                            borderRadius: '18px',
                                            textAlign: 'center',
                                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)'
                                        }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                background: '#dcfce7',
                                                color: '#15803d',
                                                marginBottom: '0.65rem'
                                            }}>
                                                <Icons.CheckCircle />
                                            </div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: darkMode ? '#34d399' : '#15803d', margin: '0 0 0.45rem' }}>
                                                Comprovativo em Validação
                                            </h3>
                                            <div style={{ fontSize: '0.85rem', color: darkMode ? '#cbd5e1' : '#334151', lineHeight: 1.5, marginBottom: '1rem' }}>
                                                Ref: <strong style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>{typeof pendingDebt?.payment_proof === 'string' ? pendingDebt.payment_proof : (pendingDebt?.payment_proof ? JSON.stringify(pendingDebt.payment_proof) : 'Comprovativo enviado')}</strong>.
                                                <br />
                                                A administração da <strong>Tchapo Tchapo</strong> foi notificada e está a validar o pagamento.
                                                <br />
                                                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'inline-block', marginTop: '6px' }}>
                                                    🔒 Esta tela permanecerá ativa até que o administrador confirme no painel. A sua conta será liberada automaticamente.
                                                </span>
                                            </div>

                                            {/* Foto do comprovativo enviado, se houver */}
                                            {(submittedProofPreview || pendingDebt?.payment_proof_url) && (
                                                <div style={{ marginBottom: '1.15rem', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                                                        Foto do Comprovativo Anexado:
                                                    </div>
                                                    <img
                                                        src={submittedProofPreview || resolveImageUrl(pendingDebt?.payment_proof_url) || ''}
                                                        alt="Comprovativo submetido"
                                                        style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '12px', border: '1.5px solid #10b981', objectFit: 'contain', background: '#000' }}
                                                        onError={(e) => {
                                                            if (submittedProofPreview && e.currentTarget.src !== submittedProofPreview) {
                                                                e.currentTarget.src = submittedProofPreview;
                                                            } else {
                                                                e.currentTarget.style.display = 'none';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={handleCheckDebtApproval}
                                                    disabled={checkingDebtStatus}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        color: '#ffffff',
                                                        border: 'none',
                                                        padding: '0.85rem 1.15rem',
                                                        borderRadius: '12px',
                                                        fontWeight: 800,
                                                        fontSize: '0.88rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                                                        opacity: checkingDebtStatus ? 0.7 : 1
                                                    }}
                                                >
                                                    <Icons.RefreshCw />
                                                    <span>{checkingDebtStatus ? 'A consultar aprovação...' : 'Verificar Se Já Fui Liberado'}</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setReEditProof(true)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#64748b',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline'
                                                    }}
                                                >
                                                    Preciso corrigir ou reenviar o comprovativo
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitDebtPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ textAlign: 'left' }}>
                                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: darkMode ? '#e2e8f0' : '#334151', marginBottom: '0.4rem' }}>
                                                    Código da Mensagem e-Mola / M-Pesa:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={debtPaymentRef}
                                                    onChange={(e) => setDebtPaymentRef(e.target.value)}
                                                    placeholder="Ex: PP260915.1234.X09876 ou nº comprovativo"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.8rem 0.95rem',
                                                        borderRadius: '12px',
                                                        border: darkMode ? '1.5px solid #475569' : '1.5px solid #cbd5e1',
                                                        background: darkMode ? '#0f172a' : '#ffffff',
                                                        color: darkMode ? '#ffffff' : '#0f172a',
                                                        fontSize: '0.88rem',
                                                        outline: 'none',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>

                                            <div style={{ textAlign: 'left' }}>
                                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: darkMode ? '#e2e8f0' : '#334151', marginBottom: '0.4rem' }}>
                                                    📸 Anexar Foto do Comprovativo (Recomendado):
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
                                                        padding: '0.4rem 0',
                                                        fontSize: '0.82rem',
                                                        color: darkMode ? '#cbd5e1' : '#475569'
                                                    }}
                                                />
                                                {debtReceiptPreview && (
                                                    <div style={{ marginTop: '0.55rem', textAlign: 'center' }}>
                                                        <img src={debtReceiptPreview} alt="Comprovativo" 
                                                             style={{ maxHeight: '140px', borderRadius: '10px', border: '1px solid #cbd5e1', objectFit: 'contain' }} />
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submittingDebt}
                                                style={{
                                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: '0.95rem',
                                                    borderRadius: '14px',
                                                    fontWeight: 900,
                                                    fontSize: '0.94rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                                                    transition: 'opacity 0.2s',
                                                    opacity: submittingDebt ? 0.7 : 1
                                                }}
                                            >
                                                <Icons.CheckCircle />
                                                <span>{submittingDebt ? 'A submeter confirmação...' : 'Submeter Comprovativo de Pagamento'}</span>
                                            </button>

                                            {reEditProof && (
                                                <button
                                                    type="button"
                                                    onClick={() => setReEditProof(false)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#64748b',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ← Cancelar e voltar ao estado anterior
                                                </button>
                                            )}
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 1: Dashboard Overview */}
                        {activeTab === 'dashboard' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {/* Hero Wallet Card */}
                                <div className="rp-hero-wallet">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                                Ganhos Estimados
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowBalance(!showBalance)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    border: 'none',
                                                    color: '#cbd5e1',
                                                    width: '26px',
                                                    height: '26px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 0
                                                }}
                                                title={showBalance ? 'Ocultar ganhos' : 'Mostrar ganhos'}
                                            >
                                                {showBalance ? <Icons.Eye /> : <Icons.EyeOff />}
                                            </button>
                                        </div>
                                        <div style={{
                                            background: isOnline ? 'rgba(16, 185, 129, 0.18)' : 'rgba(148, 163, 184, 0.15)',
                                            color: isOnline ? '#34d399' : '#94a3b8',
                                            padding: '3px 9px',
                                            borderRadius: '999px',
                                            fontSize: '0.72rem',
                                            fontWeight: 800,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#10b981' : '#94a3b8' }} />
                                            <span>{isOnline ? 'Pronto' : 'Pausa'}</span>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.8px', margin: '4px 0 6px', color: '#ffffff', lineHeight: 1.15 }}>
                                        {showBalance ? formatMZCurrency(saldoLiquido) : '•••••••'}
                                    </div>

                                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '14px', fontWeight: 500 }}>
                                        Ganhos estimados líquidos já com taxas deduzidas
                                    </div>

                                    {/* Quick action buttons in wallet card */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {availableOrders.length > 0 && !hasActiveOrder && !isDebtBlocked && isOnline ? (
                                            <button
                                                onClick={() => { setActiveTab('orders'); setOrdersSubTab('available'); }}
                                                style={{
                                                    flex: 1,
                                                    background: 'linear-gradient(135deg, #f64c00 0%, #ff6b2b 100%)',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: '10px 14px',
                                                    borderRadius: '14px',
                                                    fontWeight: 800,
                                                    fontSize: '0.82rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    boxShadow: '0 4px 14px rgba(246, 76, 0, 0.35)',
                                                    fontFamily: "'Montserrat', sans-serif"
                                                }}
                                            >
                                                <Icons.Package />
                                                <span>{availableOrders.length} Pedidos Prontos ➔</span>
                                            </button>
                                        ) : hasActiveOrder ? (
                                            <button
                                                onClick={() => { setActiveTab('orders'); setOrdersSubTab('active'); }}
                                                style={{
                                                    flex: 1,
                                                    background: '#2563eb',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: '10px 14px',
                                                    borderRadius: '14px',
                                                    fontWeight: 800,
                                                    fontSize: '0.82rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    fontFamily: "'Montserrat', sans-serif"
                                                }}
                                            >
                                                <Icons.Bike />
                                                <span>Ver Rota Atual ➔</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => fetchDashboard(authDriver?.id)}
                                                style={{
                                                    flex: 1,
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    color: '#ffffff',
                                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                                    padding: '10px 14px',
                                                    borderRadius: '14px',
                                                    fontWeight: 700,
                                                    fontSize: '0.82rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    fontFamily: "'Montserrat', sans-serif"
                                                }}
                                            >
                                                <Icons.CheckCircle />
                                                <span>Atualizar Ganhos</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Active Delivery Alert Banner */}
                                {hasActiveOrder && (
                                    <div style={{
                                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                        border: '1px solid #bfdbfe',
                                        borderRadius: '18px',
                                        padding: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '10px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icons.Bike />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#1e40af' }}>
                                                    Entrega #{activeOrders[0].id} em Rota
                                                </div>
                                                <div style={{ fontSize: '0.74rem', color: '#3b82f6' }}>
                                                    Finalize e pague a taxa para liberar mais pedidos
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setActiveTab('orders'); setOrdersSubTab('active'); }}
                                            style={{
                                                background: '#2563eb',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                fontWeight: 800,
                                                fontSize: '0.76rem',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                fontFamily: "'Montserrat', sans-serif"
                                            }}
                                        >
                                            Abrir ➔
                                        </button>
                                    </div>
                                )}

                                {/* Available Orders Prompt Banner */}
                                {!isDebtBlocked && !hasActiveOrder && availableOrders.length > 0 && (
                                    <div className="rp-alert-banner">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #f64c00 0%, #ff6b2b 100%)',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Icons.Package />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#9a3412' }}>
                                                    {availableOrders.length === 1 ? '1 Novo Pedido Pronto!' : `${availableOrders.length} Novos Pedidos Prontos!`}
                                                </div>
                                                <div style={{ fontSize: '0.72rem', color: '#c2410c' }}>
                                                    Aceite antes que outro entregador reserve
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setActiveTab('orders'); setOrdersSubTab('available'); }}
                                            style={{
                                                background: '#0f172a',
                                                color: '#f64c00',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                fontWeight: 800,
                                                fontSize: '0.76rem',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                fontFamily: "'Montserrat', sans-serif"
                                            }}
                                        >
                                            Aceitar ➔
                                        </button>
                                    </div>
                                )}

                                {/* Period Filter Bar: Hoje | 7 Dias | 30 Dias */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                    padding: '0 2px'
                                }}>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: darkMode ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Ganhos do Período
                                    </span>
                                    <div style={{
                                        display: 'inline-flex',
                                        background: darkMode ? '#181818' : '#f1f5f9',
                                        borderRadius: '12px',
                                        padding: '3px',
                                        border: darkMode ? '1px solid #27272a' : '1px solid #e2e8f0',
                                        gap: '2px'
                                    }}>
                                        {[
                                            { id: 'today', label: 'Hoje' },
                                            { id: '7days', label: '7 Dias' },
                                            { id: '30days', label: '30 Dias' }
                                        ].map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setEarningsPeriod(p.id)}
                                                style={{
                                                    border: 'none',
                                                    borderRadius: '9px',
                                                    padding: '5px 10px',
                                                    fontSize: '0.74rem',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    background: earningsPeriod === p.id ? '#f64c00' : 'transparent',
                                                    color: earningsPeriod === p.id ? '#ffffff' : (darkMode ? '#a1a1aa' : '#64748b'),
                                                    boxShadow: earningsPeriod === p.id ? '0 2px 6px rgba(246,76,0,0.35)' : 'none',
                                                    transition: 'all 0.18s ease'
                                                }}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2x2 KPI Stats Grid */}
                                <div className="rp-stats-grid">
                                    {/* Stat 1: Ganhos do Período */}
                                    <div className="rp-stat-card">
                                        <div className="rp-stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
                                            <Icons.TrendingUp />
                                        </div>
                                        <div>
                                            <div className="rp-stat-number" style={{ color: '#059669' }}>
                                                {formatMZCurrency(
                                                    earningsPeriod === 'today' 
                                                        ? stats.today_earnings 
                                                        : earningsPeriod === '7days' 
                                                            ? stats.week_earnings 
                                                            : (stats.month_earnings || 0)
                                                )}
                                            </div>
                                            <div className="rp-stat-label">
                                                {earningsPeriod === 'today' ? 'Ganhos Hoje' : earningsPeriod === '7days' ? 'Ganhos (7 Dias)' : 'Ganhos (30 Dias)'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stat 2: Entregas Feitas no Período */}
                                    <div className="rp-stat-card">
                                        <div className="rp-stat-icon-box" style={{ background: 'rgba(14, 165, 233, 0.12)', color: '#0284c7' }}>
                                            <Icons.CheckCircle />
                                        </div>
                                        <div>
                                            <div className="rp-stat-number" style={{ color: '#0284c7' }}>
                                                {earningsPeriod === 'today' 
                                                    ? stats.today_deliveries 
                                                    : earningsPeriod === '7days' 
                                                        ? (stats.week_deliveries ?? stats.today_deliveries) 
                                                        : (stats.month_deliveries ?? stats.total_deliveries)} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>/ {stats.total_deliveries}</span>
                                            </div>
                                            <div className="rp-stat-label">
                                                {earningsPeriod === 'today' ? 'Entregas Hoje' : earningsPeriod === '7days' ? 'Entregas (7 Dias)' : 'Entregas (30 Dias)'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stat 3: Total Acumulado */}
                                    <div className="rp-stat-card">
                                        <div className="rp-stat-icon-box" style={{ background: 'rgba(246, 76, 0, 0.12)', color: '#f64c00' }}>
                                            <Icons.Trophy />
                                        </div>
                                        <div>
                                            <div className="rp-stat-number" style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>
                                                {formatMZCurrency(stats.total_earnings)}
                                            </div>
                                            <div className="rp-stat-label">Total Ganho</div>
                                        </div>
                                    </div>

                                    {/* Stat 4: Taxa da Plataforma */}
                                    <div className="rp-stat-card">
                                        <div className="rp-stat-icon-box" style={{ background: isDebtBlocked ? 'rgba(239, 68, 68, 0.12)' : 'rgba(241, 245, 249, 0.9)', color: isDebtBlocked ? '#dc2626' : '#64748b' }}>
                                            <Icons.Clock />
                                        </div>
                                        <div>
                                            <div className="rp-stat-number" style={{ color: isDebtBlocked ? '#dc2626' : (darkMode ? '#ffffff' : '#0f172a') }}>
                                                {isDebtBlocked ? formatMZCurrency(pendingDebt.amount) : '0 MT'}
                                            </div>
                                            <div className="rp-stat-label">{isDebtBlocked ? 'Taxa Devida' : 'Taxa em Dia'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Career Reward Milestone Preview Card */}
                                {(() => {
                                    const nextReward = rewards.find(r => currentSales < r.target) || rewards[rewards.length - 1];
                                    const pct = Math.min(100, Math.round((currentSales / nextReward.target) * 100));
                                    return (
                                        <div style={{
                                            background: '#ffffff',
                                            borderRadius: '18px',
                                            padding: '14px 16px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ color: '#f64c00' }}><Icons.Gift /></div>
                                                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>
                                                        Meta de Carreira: {nextReward.badge}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('rewards')}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#f64c00',
                                                        fontWeight: 800,
                                                        fontSize: '0.74rem',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        fontFamily: "'Montserrat', sans-serif"
                                                    }}
                                                >
                                                    Ver Todas ➔
                                                </button>
                                            </div>

                                            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', margin: '8px 0 6px' }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg, #f64c00 0%, #ff6b2b 100%)', borderRadius: '999px' }} />
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                                                <span>{formatMZCurrency(currentSales)} acumulados</span>
                                                <strong style={{ color: '#0f172a' }}>{pct}% Concluído</strong>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* TAB 2: ABA DE PEDIDOS */}
                        {activeTab === 'orders' && (
                            <div>
                                {/* Segmented Filter Pills */}
                                <div className="rp-segment-bar">
                                    <button
                                        type="button"
                                        onClick={() => setOrdersSubTab('available')}
                                        className={`rp-segment-btn ${ordersSubTab === 'available' ? 'active' : ''}`}
                                    >
                                        <Icons.Package />
                                        <span>Prontos ({availableOrders.length})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setOrdersSubTab('active')}
                                        className={`rp-segment-btn ${ordersSubTab === 'active' ? 'active' : ''}`}
                                    >
                                        <Icons.Bike />
                                        <span>Em Rota ({activeOrders.length})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setOrdersSubTab('history')}
                                        className={`rp-segment-btn ${ordersSubTab === 'history' ? 'active' : ''}`}
                                    >
                                        <Icons.CheckCircle />
                                        <span>Histórico ({recentDeliveries.length})</span>
                                    </button>
                                </div>

                                {/* SUB-VIEW 1: PEDIDOS DISPONÍVEIS */}
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
                                        ) : !isOnline ? (
                                            <div style={{
                                                background: darkMode ? '#18181b' : '#ffffff',
                                                padding: '3.5rem 1.5rem',
                                                borderRadius: '24px',
                                                border: darkMode ? '1.5px solid #27272a' : '1.5px solid #e2e8f0',
                                                textAlign: 'center',
                                                boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.04)'
                                            }}>
                                                <div style={{
                                                    width: '68px',
                                                    height: '68px',
                                                    borderRadius: '50%',
                                                    background: darkMode ? '#27272a' : '#f1f5f9',
                                                    color: '#94a3b8',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 1.25rem',
                                                    position: 'relative'
                                                }}>
                                                    <Icons.Bike />
                                                    <span style={{
                                                        position: 'absolute',
                                                        bottom: '2px',
                                                        right: '2px',
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        background: '#ef4444',
                                                        border: '2.5px solid ' + (darkMode ? '#18181b' : '#ffffff')
                                                    }} />
                                                </div>
                                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', fontWeight: 900, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                                    Você está Offline
                                                </h3>
                                                <p style={{ margin: '0 0 1.75rem', color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.95rem', maxWidth: '460px', marginInline: 'auto', lineHeight: 1.6 }}>
                                                    Não pode receber novos pedidos enquanto estiver offline. Fique online para começar a receber e aceitar entregas na sua área.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleAvailability(true)}
                                                    disabled={togglingOnline}
                                                    style={{
                                                        background: '#10b981',
                                                        color: '#ffffff',
                                                        border: 'none',
                                                        padding: '0.95rem 2rem',
                                                        borderRadius: '14px',
                                                        fontWeight: 900,
                                                        fontSize: '1rem',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.65rem',
                                                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                >
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffffff' }} />
                                                    <span>{togglingOnline ? 'A conectar...' : 'Ficar Online Agora'}</span>
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

                                                 {/* Filtro por Províncias */}
                                                 <div style={{
                                                     background: darkMode ? '#18181b' : '#f8fafc',
                                                     border: darkMode ? '1px solid #27272a' : '1px solid #e2e8f0',
                                                     borderRadius: '16px',
                                                     padding: '12px 14px',
                                                     marginBottom: '1.25rem',
                                                     display: 'flex',
                                                     flexDirection: 'column',
                                                     gap: '10px'
                                                 }}>
                                                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 800, color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                                             <span style={{ color: '#f64c00' }}><Icons.MapPin /></span>
                                                             <span>Filtro de Pedidos por Província:</span>
                                                         </div>
                                                         {selectedProvinceFilter !== 'Todas' && (
                                                             <button
                                                                 type="button"
                                                                 onClick={() => setSelectedProvinceFilter('Todas')}
                                                                 style={{
                                                                     background: 'transparent',
                                                                     border: 'none',
                                                                     color: '#f64c00',
                                                                     fontSize: '0.8rem',
                                                                     fontWeight: 700,
                                                                     cursor: 'pointer',
                                                                     textDecoration: 'underline'
                                                                 }}
                                                             >
                                                                 Ver todas ({availableOrders.length})
                                                             </button>
                                                         )}
                                                     </div>

                                                     {/* Scrollable Province Pills */}
                                                     <div style={{
                                                         display: 'flex',
                                                         alignItems: 'center',
                                                         gap: '8px',
                                                         overflowX: 'auto',
                                                         paddingBottom: '4px',
                                                         WebkitOverflowScrolling: 'touch'
                                                     }}>
                                                         {['Todas', ...ALL_PROVINCES].map(prov => {
                                                             const count = prov === 'Todas'
                                                                 ? availableOrders.length
                                                                 : availableOrders.filter(o => {
                                                                    const loc = extractOrderLocation(o);
                                                                    return (loc?.province || '').toLowerCase() === (prov || '').toLowerCase();
                                                                }).length;
                                                             const isSelected = (selectedProvinceFilter || 'Todas').toLowerCase() === (prov || '').toLowerCase();

                                                             return (
                                                                 <button
                                                                     key={prov}
                                                                     type="button"
                                                                     onClick={() => setSelectedProvinceFilter(prov)}
                                                                     style={{
                                                                         padding: '6px 14px',
                                                                         borderRadius: '999px',
                                                                         fontSize: '0.8rem',
                                                                         fontWeight: isSelected ? 800 : 600,
                                                                         border: isSelected ? '1.5px solid #f64c00' : (darkMode ? '1px solid #3f3f46' : '1px solid #cbd5e1'),
                                                                         background: isSelected ? '#f64c00' : (darkMode ? '#27272a' : '#ffffff'),
                                                                         color: isSelected ? '#ffffff' : (darkMode ? '#e4e4e7' : '#475569'),
                                                                         cursor: 'pointer',
                                                                         whiteSpace: 'nowrap',
                                                                         display: 'inline-flex',
                                                                         alignItems: 'center',
                                                                         gap: '6px',
                                                                         transition: 'all 0.15s ease',
                                                                         flexShrink: 0
                                                                     }}
                                                                 >
                                                                     <span>{prov}</span>
                                                                     <span style={{
                                                                         fontSize: '0.72rem',
                                                                         background: isSelected ? 'rgba(255,255,255,0.28)' : (darkMode ? '#3f3f46' : '#e2e8f0'),
                                                                         color: isSelected ? '#ffffff' : (darkMode ? '#a1a1aa' : '#64748b'),
                                                                         padding: '1px 6px',
                                                                         borderRadius: '999px',
                                                                         fontWeight: 800
                                                                     }}>
                                                                         {count}
                                                                     </span>
                                                                 </button>
                                                             );
                                                         })}
                                                     </div>
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
                                                 ) : (() => {
                                                     const filteredAvailableOrders = availableOrders.filter(order => {
                                                         if (!selectedProvinceFilter || selectedProvinceFilter === 'Todas') return true;
                                                          const loc = extractOrderLocation(order);
                                                          return (loc?.province || '').toLowerCase() === (selectedProvinceFilter || '').toLowerCase();
                                                     });

                                                     if (filteredAvailableOrders.length === 0) {
                                                         return (
                                                             <div style={{ background: darkMode ? '#18181b' : '#fff', padding: '3.5rem 1.5rem', borderRadius: '24px', border: darkMode ? '1px solid #27272a' : '1px solid #e2e8f0', textAlign: 'center' }}>
                                                                 <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: darkMode ? '#27272a' : '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                                                     <Icons.MapPin />
                                                                 </div>
                                                                 <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: darkMode ? '#fff' : '#0f172a' }}>
                                                                     Nenhum pedido disponível na província de {selectedProvinceFilter}
                                                                 </h4>
                                                                 <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', marginInline: 'auto' }}>
                                                                     Existem {availableOrders.length} pedido(s) disponível(is) noutras províncias.
                                                                 </p>
                                                                 <button
                                                                     type="button"
                                                                     onClick={() => setSelectedProvinceFilter('Todas')}
                                                                     style={{
                                                                         background: '#f64c00',
                                                                         color: '#fff',
                                                                         border: 'none',
                                                                         padding: '0.65rem 1.25rem',
                                                                         borderRadius: '10px',
                                                                         fontWeight: 800,
                                                                         fontSize: '0.88rem',
                                                                         cursor: 'pointer'
                                                                     }}
                                                                 >
                                                                     Ver Todas as Províncias ({availableOrders.length})
                                                                 </button>
                                                             </div>
                                                         );
                                                     }

                                                     return (
                                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                             {filteredAvailableOrders.map(order => {
                                                                 const pInfo = calcOrderPickupAndProfit(order);
                                                                 const loc = extractOrderLocation(order);
                                                                 return (
                                                                     <div key={order.id} className="rp-order-card">
                                                                         {/* Header with Order ID & Status */}
                                                                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                 <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a' }}>
                                                                                     Pedido #{order.id}
                                                                                 </span>
                                                                                 {order.time && (
                                                                                     <span style={{
                                                                                         background: (order.time.includes('Rápida') || order.time.includes('Imediato')) ? '#fee2e2' : '#eff6ff',
                                                                                         color: (order.time.includes('Rápida') || order.time.includes('Imediato')) ? '#b91c1c' : '#1d4ed8',
                                                                                         fontSize: '0.72rem',
                                                                                         fontWeight: 800,
                                                                                         padding: '2px 8px',
                                                                                         borderRadius: '999px',
                                                                                         display: 'inline-flex',
                                                                                         alignItems: 'center',
                                                                                         gap: '4px'
                                                                                     }}>
                                                                                         <Icons.Clock />
                                                                                         {order.time}
                                                                                     </span>
                                                                                 )}
                                                                             </div>

                                                                             <span style={{
                                                                                 background: 'rgba(246, 76, 0, 0.1)',
                                                                                 color: '#f64c00',
                                                                                 fontSize: '0.74rem',
                                                                                 fontWeight: 800,
                                                                                 padding: '3px 10px',
                                                                                 borderRadius: '999px',
                                                                                 border: '1px solid rgba(246, 76, 0, 0.25)'
                                                                             }}>
                                                                                 Disponível
                                                                             </span>
                                                                         </div>

                                                                         {/* Clean Single-line Location Tag */}
                                                                         <div style={{
                                                                             background: '#f8fafc',
                                                                             padding: '8px 12px',
                                                                             borderRadius: '12px',
                                                                             border: '1px solid #e2e8f0',
                                                                             marginBottom: '12px',
                                                                             display: 'flex',
                                                                             alignItems: 'center',
                                                                             justifyContent: 'space-between'
                                                                         }}>
                                                                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#0f172a' }}>
                                                                                 <span style={{ color: '#f64c00' }}><Icons.MapPin /></span>
                                                                                 <span><strong>{loc.bairro || 'Beira'}</strong> • {loc.province}</span>
                                                                             </div>
                                                                             <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Dados pós-aceite</span>
                                                                         </div>

                                                                         {/* Items Preview */}
                                                                         {order.items && order.items.length > 0 && (
                                                                             <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                 {order.items.map((it, idx) => {
                                                                                     const imgUrl = resolveImageUrl(it.image, it.product_name);
                                                                                     const pickupItem = findPickupItem(it.product_name);
                                                                                     return (
                                                                                         <div key={idx} style={{
                                                                                             display: 'flex',
                                                                                             alignItems: 'center',
                                                                                             gap: '12px',
                                                                                             background: '#ffffff',
                                                                                             padding: '10px 12px',
                                                                                             borderRadius: '16px',
                                                                                             border: '1px solid #e2e8f0',
                                                                                             boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                                                                         }}>
                                                                                             {/* Photo Thumbnail */}
                                                                                             <div
                                                                                                 onClick={() => setPreviewPhoto({ name: it.product_name, image: imgUrl, price: it.price, quantity: it.quantity, pickupPrice: pickupItem?.price })}
                                                                                                 title="Toque para ver a foto do produto"
                                                                                                 style={{
                                                                                                     width: '74px',
                                                                                                     height: '74px',
                                                                                                     minWidth: '74px',
                                                                                                     borderRadius: '14px',
                                                                                                     overflow: 'hidden',
                                                                                                     background: '#f8fafc',
                                                                                                     border: '1.5px solid #e2e8f0',
                                                                                                     display: 'flex',
                                                                                                     alignItems: 'center',
                                                                                                     justifyContent: 'center',
                                                                                                     flexShrink: 0,
                                                                                                     cursor: 'pointer',
                                                                                                     position: 'relative'
                                                                                                 }}
                                                                                             >
                                                                                                 {imgUrl ? (
                                                                                                     <>
                                                                                                         <img
                                                                                                             src={imgUrl}
                                                                                                             alt={it.product_name}
                                                                                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                                                             onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                                                         />
                                                                                                         <div style={{
                                                                                                             position: 'absolute',
                                                                                                             bottom: '3px',
                                                                                                             right: '3px',
                                                                                                             background: 'rgba(15, 23, 42, 0.75)',
                                                                                                             color: '#ffffff',
                                                                                                             borderRadius: '4px',
                                                                                                             padding: '1px 4px',
                                                                                                             fontSize: '0.62rem',
                                                                                                             display: 'flex',
                                                                                                             alignItems: 'center'
                                                                                                         }}>
                                                                                                             🔍
                                                                                                         </div>
                                                                                                     </>
                                                                                                 ) : (
                                                                                                     <div style={{ color: '#94a3b8' }}><Icons.Package /></div>
                                                                                                 )}
                                                                                             </div>

                                                                                             {/* Aligned Details */}
                                                                                             <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                                                 <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                                                     {it.product_name}
                                                                                                 </div>
                                                                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                                                                     <span style={{ background: '#0f172a', color: '#ffffff', padding: '2px 7px', borderRadius: '6px', fontWeight: 800, fontSize: '0.72rem' }}>
                                                                                                         {it.quantity}x unid.
                                                                                                     </span>
                                                                                                     {pickupItem && (
                                                                                                         <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 7px', borderRadius: '6px', fontWeight: 800, fontSize: '0.72rem' }}>
                                                                                                             Levantamento: {formatMZCurrency(pickupItem.price)}
                                                                                                         </span>
                                                                                                     )}
                                                                                                     <button
                                                                                                         type="button"
                                                                                                         onClick={() => setPreviewPhoto({ name: it.product_name, image: imgUrl, price: it.price, quantity: it.quantity, pickupPrice: pickupItem?.price })}
                                                                                                         style={{
                                                                                                             background: '#eff6ff',
                                                                                                             border: '1px solid #bfdbfe',
                                                                                                             color: '#1d4ed8',
                                                                                                             padding: '2px 8px',
                                                                                                             borderRadius: '6px',
                                                                                                             fontWeight: 800,
                                                                                                             fontSize: '0.72rem',
                                                                                                             cursor: 'pointer',
                                                                                                             display: 'inline-flex',
                                                                                                             alignItems: 'center',
                                                                                                             gap: '3px'
                                                                                                         }}
                                                                                                     >
                                                                                                         <span>👁️ Ver foto do produto</span>
                                                                                                     </button>
                                                                                                 </div>
                                                                                             </div>
                                                                                         </div>
                                                                                     );
                                                                                 })}
                                                                             </div>
                                                                         )}

                                                                    {/* Financial Breakdown Ticket */}
                                                                    <div style={{
                                                                        background: '#f8fafc',
                                                                        borderRadius: '14px',
                                                                        border: '1px solid #e2e8f0',
                                                                        padding: '10px 12px',
                                                                        marginBottom: '12px'
                                                                    }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.8rem' }}>
                                                                            <span style={{ color: '#64748b' }}>Cobrar do Cliente:</span>
                                                                            <strong style={{ color: '#0f172a', fontWeight: 800 }}>{formatMZCurrency(order.total)}</strong>
                                                                        </div>
                                                                        {pInfo.pickupTotal > 0 && (
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.8rem' }}>
                                                                                <span style={{ color: '#b45309' }}>Levantamento na Loja:</span>
                                                                                <strong style={{ color: '#b45309', fontWeight: 800 }}>{formatMZCurrency(pInfo.pickupTotal)}</strong>
                                                                            </div>
                                                                        )}
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.8rem' }}>
                                                                            <span style={{ color: '#64748b' }}>Lucro Bruto Estimado:</span>
                                                                            <strong style={{ color: '#0f172a', fontWeight: 800 }}>+{formatMZCurrency(pInfo.estimatedProfit)}</strong>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem' }}>
                                                                            <span style={{ color: '#dc2626' }}>Taxa Plataforma (15%):</span>
                                                                            <strong style={{ color: '#dc2626', fontWeight: 800 }}>-{formatMZCurrency(pInfo.platformFee)}</strong>
                                                                        </div>

                                                                        <div style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'center',
                                                                            borderTop: '1px dashed #cbd5e1',
                                                                            paddingTop: '8px'
                                                                        }}>
                                                                            <div>
                                                                                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#059669' }}>Seu Lucro Líquido:</div>
                                                                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Direto no seu bolso</div>
                                                                            </div>
                                                                            <span style={{
                                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                                color: '#ffffff',
                                                                                padding: '4px 12px',
                                                                                borderRadius: '10px',
                                                                                fontWeight: 900,
                                                                                fontSize: '1rem',
                                                                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                                                                            }}>
                                                                                +{formatMZCurrency(pInfo.driverNetProfit)}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Action Button */}
                                                                    <button
                                                                        onClick={() => promptAcceptOrder(order)}
                                                                        className="rp-btn-primary"
                                                                        style={{ width: '100%' }}
                                                                    >
                                                                        <Icons.CheckCircle />
                                                                        <span>Aceitar Pedido • Ganhe +{formatMZCurrency(pInfo.driverNetProfit)} ➔</span>
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })()}
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
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
                                                {activeOrders.map(order => (
                                                    <div key={order.id} style={{
                                                        background: '#fff',
                                                        borderRadius: '22px',
                                                        padding: '1.35rem',
                                                        border: '1.5px solid #bfdbfe',
                                                        boxShadow: '0 4px 20px -2px rgba(37, 99, 235, 0.08)'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                                                            <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a' }}>
                                                                Pedido #{order.id}
                                                            </span>
                                                            <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.78rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                                                                {order.status || 'Com Entregador'}
                                                            </span>
                                                        </div>

                                                        {order.time && (
                                                            <div style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.45rem',
                                                                background: (order.time.includes('Rápida') || order.time.includes('Imediato')) ? '#fee2e2' : '#eff6ff',
                                                                color: (order.time.includes('Rápida') || order.time.includes('Imediato')) ? '#b91c1c' : '#1d4ed8',
                                                                border: (order.time.includes('Rápida') || order.time.includes('Imediato')) ? '1px solid #fca5a5' : '1px solid #bfdbfe',
                                                                padding: '0.35rem 0.85rem',
                                                                borderRadius: '999px',
                                                                fontSize: '0.82rem',
                                                                fontWeight: 800,
                                                                marginBottom: '0.85rem'
                                                            }}>
                                                                <Icons.Clock />
                                                                <span>Horário de Entrega: {order.time}</span>
                                                            </div>
                                                        )}

                                                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.88rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 800, marginBottom: '0.45rem' }}>
                                                                <Icons.MapPin />
                                                                <span>{order.bairro || 'Beira'} • {order.address || 'Centro'}</span>
                                                            </div>
                                                            <div style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.35rem' }}>
                                                                👤 Cliente: <strong>{order.customer_name || 'Cliente'}</strong>
                                                            </div>
                                                            {(() => {
                                                                const rawPhone = order.phone || order.customer_phone || order.contact || order.telefone || order.cellphone || order.whatsapp || order.customer_contact;
                                                                const cleanPhone = rawPhone ? String(rawPhone).replace(/\D/g, '') : '';
                                                                return (
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', color: '#334151', marginBottom: '0.45rem', paddingBottom: '0.45rem', borderBottom: '1px solid #e2e8f0' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                                            <Icons.Phone />
                                                                            <span>Contacto:</span>
                                                                            <strong style={{ color: '#0f172a', fontSize: '0.96rem', letterSpacing: '0.3px' }}>
                                                                                {rawPhone || 'Sem número'}
                                                                            </strong>
                                                                        </div>
                                                                        {cleanPhone && (
                                                                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                                                <a
                                                                                    href={`tel:${cleanPhone}`}
                                                                                    style={{
                                                                                        background: '#eff6ff',
                                                                                        color: '#1d4ed8',
                                                                                        border: '1px solid #bfdbfe',
                                                                                        padding: '0.32rem 0.75rem',
                                                                                        borderRadius: '8px',
                                                                                        fontSize: '0.78rem',
                                                                                        fontWeight: 800,
                                                                                        textDecoration: 'none',
                                                                                        display: 'inline-flex',
                                                                                        alignItems: 'center',
                                                                                        gap: '0.3rem'
                                                                                    }}
                                                                                >
                                                                                    <Icons.Phone />
                                                                                    <span>Ligar</span>
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                            {(() => {
                                                                const actPickup = calcOrderPickupAndProfit(order);
                                                                return (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.45rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.55rem' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Cobrar do Cliente:</span>
                                                                            <strong style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.92rem' }}>{formatMZCurrency(order.total)}</strong>
                                                                        </div>
                                                                        {actPickup.pickupTotal > 0 && (
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <span style={{ color: '#b45309', fontSize: '0.82rem', fontWeight: 600 }}>Levantamento na Loja:</span>
                                                                                <strong style={{ color: '#b45309', fontWeight: 800, fontSize: '0.92rem' }}>{formatMZCurrency(actPickup.pickupTotal)}</strong>
                                                                            </div>
                                                                        )}
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <span style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 600 }}>Lucro Estimado Bruto:</span>
                                                                            <strong style={{ color: '#334155', fontWeight: 800, fontSize: '0.9rem' }}>+{formatMZCurrency(actPickup.estimatedProfit)}</strong>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <span style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>Taxa da Plataforma (15%):</span>
                                                                            <strong style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.88rem' }}>-{formatMZCurrency(actPickup.platformFee)}</strong>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px dashed #cbd5e1', paddingTop: '0.45rem', marginTop: '0.2rem' }}>
                                                                            <span style={{ color: '#059669', fontSize: '0.86rem', fontWeight: 900 }}>Seu Lucro Líquido no Bolso:</span>
                                                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.98rem' }}>
                                                                                +{formatMZCurrency(actPickup.driverNetProfit)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
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
                                                                        const pItem = findPickupItem(it.product_name);
                                                                        return (
                                                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', background: '#ffffff', padding: '0.75rem 0.95rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                                                                                {/* Photo Thumbnail */}
                                                                                <div
                                                                                    onClick={() => setPreviewPhoto({ name: it.product_name, image: imgUrl, price: it.price, quantity: it.quantity, pickupPrice: pItem?.price })}
                                                                                    title="Toque para ampliar foto"
                                                                                    style={{
                                                                                        width: '92px',
                                                                                        height: '92px',
                                                                                        minWidth: '92px',
                                                                                        borderRadius: '14px',
                                                                                        overflow: 'hidden',
                                                                                        background: '#f8fafc',
                                                                                        border: '1.5px solid #e2e8f0',
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        position: 'relative',
                                                                                        flexShrink: 0,
                                                                                        cursor: 'pointer'
                                                                                    }}
                                                                                >
                                                                                    {imgUrl ? (
                                                                                        <>
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
                                                                                            <div style={{
                                                                                                position: 'absolute',
                                                                                                bottom: '4px',
                                                                                                right: '4px',
                                                                                                background: 'rgba(15, 23, 42, 0.75)',
                                                                                                color: '#ffffff',
                                                                                                borderRadius: '6px',
                                                                                                padding: '2px 5px',
                                                                                                fontSize: '0.66rem',
                                                                                                fontWeight: 700,
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                gap: '2px'
                                                                                            }}>
                                                                                                🔍 Ampliar
                                                                                            </div>
                                                                                        </>
                                                                                    ) : null}
                                                                                    <div style={{ display: imgUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', width: '100%', height: '100%' }}>
                                                                                        <Icons.Package />
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a', lineHeight: 1.35, marginBottom: '0.45rem' }}>
                                                                                        {it.product_name}
                                                                                    </div>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                                                        <span style={{ background: '#0f172a', color: '#ffffff', padding: '3px 9px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>
                                                                                            {it.quantity}x unidades
                                                                                        </span>
                                                                                        {it.price ? (
                                                                                            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#64748b' }}>
                                                                                                Venda: {formatMZCurrency(it.price)}
                                                                                            </span>
                                                                                        ) : null}
                                                                                        {pItem && (
                                                                                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '8px', fontWeight: 800, fontSize: '0.78rem' }}>
                                                                                                Levantamento: {formatMZCurrency(pItem.price)}
                                                                                            </span>
                                                                                        )}
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => setPreviewPhoto({ name: it.product_name, image: imgUrl, price: it.price, quantity: it.quantity, pickupPrice: pItem?.price })}
                                                                                            style={{
                                                                                                background: '#eff6ff',
                                                                                                color: '#1d4ed8',
                                                                                                border: '1px solid #bfdbfe',
                                                                                                padding: '3px 8px',
                                                                                                borderRadius: '8px',
                                                                                                fontWeight: 800,
                                                                                                fontSize: '0.74rem',
                                                                                                cursor: 'pointer',
                                                                                                display: 'inline-flex',
                                                                                                alignItems: 'center',
                                                                                                gap: '3px'
                                                                                            }}
                                                                                        >
                                                                                            <Icons.Eye />
                                                                                            <span>Ver foto</span>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            <a
                                                                href={`${API_URL}/api/orders/${order.id}/pdf`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    flex: 1,
                                                                    background: '#0f172a',
                                                                    color: '#fff',
                                                                    textDecoration: 'none',
                                                                    padding: '0.8rem',
                                                                    borderRadius: '10px',
                                                                    fontWeight: 800,
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '0.45rem',
                                                                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.18)'
                                                                }}
                                                            >
                                                                <Icons.FileText />
                                                                <span>Baixar Fatura (PDF)</span>
                                                            </a>

                                                            {(() => {
                                                                const rawPhone = order.phone || order.customer_phone || order.contact || order.telefone || order.cellphone || order.whatsapp || order.customer_contact;
                                                                if (!rawPhone) return null;
                                                                const cleanPhone = String(rawPhone).replace(/\D/g, '');
                                                                if (!cleanPhone) return null;
                                                                return (
                                                                    <a
                                                                        href={`tel:${cleanPhone}`}
                                                                        style={{
                                                                            flex: 1,
                                                                            background: '#0284c7',
                                                                            color: '#fff',
                                                                            textDecoration: 'none',
                                                                            padding: '0.8rem 0.5rem',
                                                                            borderRadius: '10px',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.85rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            gap: '0.4rem',
                                                                            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                                                                        }}
                                                                    >
                                                                        <Icons.Phone />
                                                                        <span>Ligar para Cliente</span>
                                                                    </a>
                                                                );
                                                            })()}

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
                                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                                                            <div style={{ fontWeight: 900, color: '#059669', fontSize: '1rem' }}>
                                                                {formatMZCurrency(d.total)}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <a
                                                                    href={`${API_URL}/api/orders/${d.id}/pdf`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 800,
                                                                        color: '#0f172a',
                                                                        background: '#e2e8f0',
                                                                        padding: '0.2rem 0.6rem',
                                                                        borderRadius: '999px',
                                                                        textDecoration: 'none',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.25rem'
                                                                    }}
                                                                >
                                                                    <Icons.FileText />
                                                                    <span>Fatura PDF</span>
                                                                </a>
                                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                                                                    Entregue (+150 MT)
                                                                </span>
                                                            </div>
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
                            <div style={{ background: darkMode ? '#111111' : '#ffffff', padding: '1.5rem', borderRadius: '24px', border: darkMode ? '1px solid #222222' : '1px solid #e2e8f0', color: darkMode ? '#ffffff' : '#0f172a' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.35rem', fontWeight: 900, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                        Metas de Carreira & Premiações
                                    </h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
                                        O seu volume total de vendas e entregas acumulado é de: <strong style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>{formatMZCurrency(currentSales)}</strong>
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
                                                border: unlocked ? '2px solid #10b981' : (darkMode ? '1px solid #222222' : '1px solid #e2e8f0'),
                                                background: unlocked ? (darkMode ? '#052e16' : '#f0fdf4') : (darkMode ? '#161616' : '#f8fafc'),
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
                                                            background: unlocked ? (darkMode ? '#064e3b' : '#dcfce7') : (darkMode ? '#451a03' : '#fef3c7'),
                                                            color: unlocked ? '#34d399' : '#fbbf24',
                                                            fontWeight: 800,
                                                            fontSize: '0.78rem',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '999px'
                                                        }}>
                                                            {r.badge}
                                                        </span>
                                                    </div>

                                                    <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                                        {r.title}
                                                    </h4>
                                                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: darkMode ? '#a1a1aa' : '#475569', lineHeight: 1.5 }}>
                                                        {r.desc}
                                                    </p>
                                                </div>

                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                                                        <span style={{ fontWeight: 600, color: '#64748b' }}>Progresso:</span>
                                                        <strong style={{ color: unlocked ? '#10b981' : (darkMode ? '#ffffff' : '#0f172a') }}>{pct}%</strong>
                                                    </div>

                                                    <div style={{ width: '100%', height: '10px', background: darkMode ? '#222222' : '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                                        <div style={{
                                                            width: `${pct}%`,
                                                            height: '100%',
                                                            background: unlocked ? '#10b981' : '#f59e0b',
                                                            borderRadius: '999px'
                                                        }} />
                                                    </div>

                                                    <div style={{ fontSize: '0.8rem', color: unlocked ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
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
                            <div style={{ background: darkMode ? '#111111' : '#ffffff', padding: '1.75rem', borderRadius: '20px', border: darkMode ? '1px solid #222222' : '1px solid #e2e8f0', color: darkMode ? '#ffffff' : '#0f172a' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                        Registo de Advertências Disciplinares
                                    </h3>
                                    <span style={{
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        color: warnings.length > 0 ? '#ef4444' : '#10b981',
                                        background: warnings.length > 0 ? (darkMode ? '#451a1a' : '#fee2e2') : (darkMode ? '#064e3b' : '#dcfce7'),
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px'
                                    }}>
                                        {warnings.length === 0 ? 'Sem Advertências (Ficha Limpa)' : `${warnings.length} Advertência(s)`}
                                    </span>
                                </div>

                                {warnings.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: darkMode ? '#064e3b' : '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                            <Icons.CheckCircle />
                                        </div>
                                        <h4 style={{ margin: '0 0 0.4rem', color: darkMode ? '#ffffff' : '#0f172a', fontWeight: 800 }}>Excelente Conduta!</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Você não possui nenhuma advertência registada. Continue com o bom trabalho!</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {warnings.map((w, idx) => {
                                            const sevStyle = {
                                                Leve: { bg: darkMode ? '#451a03' : '#fef3c7', color: '#fbbf24' },
                                                Média: { bg: darkMode ? '#431407' : '#fed7aa', color: '#f97316' },
                                                Grave: { bg: darkMode ? '#451a1a' : '#fee2e2', color: '#ef4444' }
                                            }[w.severity] || { bg: darkMode ? '#451a1a' : '#fee2e2', color: '#ef4444' };

                                            return (
                                                <div key={idx} style={{ background: darkMode ? '#1c1313' : '#fff5f5', padding: '1.25rem', borderRadius: '14px', border: darkMode ? '1px solid #3f1d1d' : '1px solid #fecaca' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                                        <span style={{ background: sevStyle.bg, color: sevStyle.color, padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                            Gravidade {w.severity || 'Leve'}
                                                        </span>
                                                        <strong style={{ color: darkMode ? '#ffffff' : '#0f172a', fontSize: '0.95rem' }}>{w.reason}</strong>
                                                    </div>
                                                    {w.notes && (
                                                        <p style={{ margin: '0.4rem 0', fontSize: '0.85rem', color: darkMode ? '#a1a1aa' : '#475569' }}>
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
                            <div style={{ background: darkMode ? '#111111' : '#ffffff', padding: '1.5rem', borderRadius: '20px', border: darkMode ? '1px solid #222222' : '1px solid #e2e8f0', color: darkMode ? '#ffffff' : '#0f172a', maxWidth: '640px' }}>
                                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#0f172a' }}>
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
                                            <h4 style={{ margin: '0', fontSize: '1.15rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#0f172a' }}>{authDriver.name}</h4>
                                            {currentSales >= 5000 && (
                                                <span title="Entregador Verificado" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                                                    <Icons.BadgeCheck />
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Entregador Oficial Tchapo Tchapo • <strong>ID: #{formatDriverId(authDriver.id)}</strong></div>
                                        <span style={{ display: 'inline-block', marginTop: '0.35rem', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                                            Conta Aprovada
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                                    {/* Dark Mode Switch Option */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: darkMode ? '1px solid #222222' : '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '10px',
                                                background: darkMode ? '#1f1f1f' : '#f1f5f9',
                                                color: darkMode ? '#f59e0b' : '#64748b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {darkMode ? <Icons.Sun /> : <Icons.Moon />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: darkMode ? '#ffffff' : '#0f172a' }}>
                                                    Modo Noturno
                                                </div>
                                                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                                                    {darkMode ? 'Tema preto puro ativado' : 'Tema claro padrão'}
                                                </div>
                                            </div>
                                        </div>
                                        <label className="rp-switch" aria-label="Alternar Modo Noturno">
                                            <input
                                                type="checkbox"
                                                checked={darkMode}
                                                onChange={() => setDarkMode(prev => !prev)}
                                            />
                                            <span className="rp-slider" />
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: darkMode ? '1px solid #222222' : '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b' }}>WhatsApp / Contacto:</span>
                                        <strong style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>{authDriver.phone}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: darkMode ? '1px solid #222222' : '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b' }}>Bairro de Atuação:</span>
                                        <strong style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>{authDriver.bairro || 'Beira'}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: darkMode ? '1px solid #222222' : '1px solid #f1f5f9' }}>
                                        <span style={{ color: '#64748b' }}>Documento:</span>
                                        <strong style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>{authDriver.doc_type || 'BI'} • {authDriver.doc_number || 'Sem número'}</strong>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        background: darkMode ? '#261212' : '#fee2e2',
                                        color: '#ef4444',
                                        border: darkMode ? '1px solid #451a1a' : 'none',
                                        padding: '0.85rem',
                                        borderRadius: '12px',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <Icons.LogOut />
                                    <span>Terminar Sessão</span>
                                </button>
                            </div>
                        )}

                        {/* MOBILE DOCK NAVIGATION (100% SMARTPHONE FIRST) */}
                        {!isDebtBlocked && (
                            <nav className="rp-mobile-dock">
                                {/* Tab 1: Início */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('dashboard');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`rp-dock-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                                >
                                    <Icons.TrendingUp />
                                    <span>Início</span>
                                </button>

                                {/* Tab 2: Metas */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('rewards');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`rp-dock-item ${activeTab === 'rewards' ? 'active' : ''}`}
                                >
                                    <Icons.Gift />
                                    <span>Metas</span>
                                </button>

                                {/* Tab 3: Central Elevated FAB (Pedidos) */}
                                <div className={`rp-dock-fab-wrapper ${activeTab === 'orders' ? 'active' : ''}`}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab('orders');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="rp-dock-fab"
                                        title="Pedidos Prontos"
                                    >
                                        <Icons.Package />
                                        {availableOrders.length > 0 && !hasActiveOrder && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-4px',
                                                right: '-4px',
                                                background: '#ef4444',
                                                color: '#ffffff',
                                                fontSize: '0.65rem',
                                                fontWeight: 900,
                                                borderRadius: '999px',
                                                minWidth: '18px',
                                                height: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '0 4px',
                                                border: '2px solid #ffffff',
                                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)'
                                            }}>
                                                {availableOrders.length}
                                            </span>
                                        )}
                                    </button>
                                    <span className="rp-dock-fab-label">Pedidos</span>
                                </div>

                                {/* Tab 4: Avisos */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('warnings');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`rp-dock-item ${activeTab === 'warnings' ? 'active' : ''}`}
                                >
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <Icons.AlertTriangle />
                                        {warnings.length > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-6px',
                                                right: '-10px',
                                                background: '#ef4444',
                                                color: '#ffffff',
                                                fontSize: '0.62rem',
                                                fontWeight: 900,
                                                borderRadius: '999px',
                                                minWidth: '16px',
                                                height: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '0 2px'
                                            }}>
                                                {warnings.length}
                                            </span>
                                        )}
                                    </div>
                                    <span>Avisos</span>
                                </button>

                                {/* Tab 5: Perfil */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('profile');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`rp-dock-item ${activeTab === 'profile' ? 'active' : ''}`}
                                >
                                    <Icons.User />
                                    <span>Perfil</span>
                                </button>
                            </nav>
                        )}
                    </div>
                )}
            </main>

            {/* STRICT CONFIRMATION MODAL ("NÃO SE DEVE VOLTAR ATRÁS") */}
            {confirmingOrder && (() => {
                const confPickup = calcOrderPickupAndProfit(confirmingOrder);
                return (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                        backdropFilter: 'blur(8px)',
                        padding: '1.5rem'
                    }}>
                        <div style={{
                            background: darkMode ? '#111111' : '#fff',
                            borderRadius: '24px',
                            padding: '2.25rem',
                            maxWidth: '540px',
                            width: '100%',
                            boxShadow: darkMode ? '0 25px 60px rgba(0,0,0,0.8)' : '0 25px 60px rgba(0,0,0,0.35)',
                            border: '2px solid #f59e0b',
                            textAlign: 'center',
                            maxHeight: '92vh',
                            overflowY: 'auto',
                            color: darkMode ? '#ffffff' : '#0f172a'
                        }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: darkMode ? '#451a03' : '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                <Icons.AlertTriangle />
                            </div>

                            <span style={{
                                background: darkMode ? '#451a1a' : '#fee2e2',
                                color: '#ef4444',
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

                            <h3 style={{ margin: '0 0 0.85rem', fontSize: '1.45rem', fontWeight: 900, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                Confirmação de Levantamento & Entrega
                            </h3>

                            {/* WARNING & EXPLICIT PICKUP AGREEMENT */}
                            <div style={{
                                background: darkMode ? '#221408' : '#fff7ed',
                                border: '1.5px solid #fdba74',
                                borderRadius: '14px',
                                padding: '1.15rem',
                                textAlign: 'left',
                                marginBottom: '1.35rem'
                            }}>
                                <div style={{ fontSize: '0.88rem', color: darkMode ? '#fb923c' : '#9a3412', fontWeight: 800, lineHeight: 1.45, marginBottom: '0.55rem' }}>
                                    ⚠️ TERMO DE LEVANTAMENTO DO PRODUTO:
                                </div>
                                <div style={{ fontSize: '0.85rem', color: darkMode ? '#fed7aa' : '#7c2d12', lineHeight: 1.5, marginBottom: '0.65rem' }}>
                                    {confPickup.itemsWithPickup && confPickup.itemsWithPickup.length > 0 ? (
                                        <div>
                                            Ao aceitar, você concorda e aceita expressamente que irá levantar na loja:
                                            <ul style={{ margin: '0.4rem 0 0.5rem', paddingLeft: '1.25rem' }}>
                                                {confPickup.itemsWithPickup.map((it, idx) => (
                                                    <li key={idx} style={{ marginBottom: '0.3rem' }}>
                                                        <strong>{it.product_name}</strong> ({it.quantity || 1}x) por{' '}
                                                        <span style={{ color: '#f59e0b', fontWeight: 800 }}>
                                                            {it.pickupPrice ? `${formatMZCurrency(it.pickupPrice)} cada` : 'preço de levantamento da loja'}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <span>Ao aceitar este pedido, você concorda que irá levantar o produto na loja pelo preço acordado.</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.82rem', color: darkMode ? '#fb923c' : '#9a3412', fontWeight: 700, lineHeight: 1.4, borderTop: '1px dashed #fdba74', paddingTop: '0.45rem' }}>
                                    🚫 Quando aceita o pedido, NÃO É PERMITIDO VOLTAR ATRÁS nem cancelar a entrega.
                                </div>
                            </div>

                            <div style={{
                                background: darkMode ? '#181818' : '#f8fafc',
                                padding: '0.95rem 1.25rem',
                                borderRadius: '12px',
                                border: darkMode ? '1px solid #282828' : '1px solid #e2e8f0',
                                textAlign: 'left',
                                marginBottom: '1.75rem',
                                fontSize: '0.88rem',
                                color: darkMode ? '#ffffff' : '#0f172a'
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
                                {confirmingOrder.time && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                        <span style={{ color: '#64748b' }}>Horário de Entrega:</span>
                                        <strong style={{ color: (confirmingOrder.time.includes('Rápida') || confirmingOrder.time.includes('Imediato')) ? '#dc2626' : '#1e40af' }}>
                                            {confirmingOrder.time}
                                        </strong>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span style={{ color: '#64748b' }}>Valor a Cobrar do Cliente:</span>
                                    <strong style={{ color: '#0f172a' }}>{formatMZCurrency(confirmingOrder.total)}</strong>
                                </div>
                                {confPickup.pickupTotal > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                        <span style={{ color: '#b45309', fontWeight: 600 }}>Preço de Levantamento (Loja):</span>
                                        <strong style={{ color: '#b45309' }}>{formatMZCurrency(confPickup.pickupTotal)}</strong>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span style={{ color: '#475569', fontWeight: 600 }}>Lucro Estimado Bruto:</span>
                                    <strong style={{ color: '#334155' }}>+{formatMZCurrency(confPickup.estimatedProfit)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span style={{ color: '#dc2626', fontWeight: 600 }}>Taxa da Plataforma (15%):</span>
                                    <strong style={{ color: '#dc2626' }}>-{formatMZCurrency(confPickup.platformFee)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px dashed #cbd5e1', paddingTop: '0.55rem', marginTop: '0.3rem' }}>
                                    <div>
                                        <div style={{ color: '#059669', fontWeight: 900, fontSize: '0.92rem' }}>Seu Lucro Líquido:</div>
                                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Valor líquido no seu bolso</div>
                                    </div>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: '#ffffff',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '10px',
                                        fontWeight: 900,
                                        fontSize: '1.05rem',
                                        boxShadow: '0 2px 8px rgba(5,150,105,0.25)'
                                    }}>
                                        +{formatMZCurrency(confPickup.driverNetProfit)}
                                    </span>
                                </div>

                                {confPickup.itemsWithPickup && confPickup.itemsWithPickup.length > 0 && (
                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem', marginTop: '0.65rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <Icons.Package />
                                            <span>Itens da Entrega ({confPickup.itemsWithPickup.reduce((s, it) => s + (it.quantity || 1), 0)}):</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                                            {confPickup.itemsWithPickup.map((it, idx) => {
                                                const imgUrl = resolveImageUrl(it.image, it.product_name);
                                                return (
                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', padding: '0.6rem 0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                        <div
                                                            onClick={() => setPreviewPhoto({ name: it.product_name, image: imgUrl, price: it.price, quantity: it.quantity, pickupPrice: it.pickupPrice })}
                                                            title="Toque para ampliar foto"
                                                            style={{ width: '56px', height: '56px', minWidth: '56px', borderRadius: '10px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                                                        >
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
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '3px' }}>
                                                                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                                                                    Qtd: {it.quantity || 1}x
                                                                </span>
                                                                {it.pickupPrice ? (
                                                                    <span style={{ fontSize: '0.76rem', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                                                                        Levantamento: {formatMZCurrency(it.pickupPrice)}
                                                                    </span>
                                                                ) : null}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPreviewPhoto({ name: it.product_name, image: imgUrl, price: it.price, quantity: it.quantity, pickupPrice: it.pickupPrice })}
                                                                    style={{
                                                                        background: '#eff6ff',
                                                                        border: '1px solid #bfdbfe',
                                                                        color: '#1d4ed8',
                                                                        padding: '1px 6px',
                                                                        borderRadius: '6px',
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 800,
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    👁️ Foto
                                                                </button>
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
                                    {acceptingId === confirmingOrder.id 
                                        ? 'A processar...' 
                                        : confPickup.pickupTotal > 0 
                                            ? `Sim, Levantar (${formatMZCurrency(confPickup.pickupTotal)}) & Ganhar +${formatMZCurrency(confPickup.driverNetProfit)}` 
                                            : `Sim, Aceitar & Ganhar +${formatMZCurrency(confPickup.driverNetProfit)}`}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* MODAL 1: Modern Entregador Registration Modal (100% Mobile Ergonomic & Dark Mode Ready) */}
            {isRegisterModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    backdropFilter: 'blur(8px)',
                    padding: '0.5rem',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        background: darkMode ? '#121212' : '#ffffff',
                        borderRadius: '20px',
                        maxWidth: '460px',
                        width: '100%',
                        maxHeight: '94vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: darkMode ? '0 25px 60px -15px rgba(0, 0, 0, 0.9)' : '0 25px 60px -15px rgba(15, 23, 42, 0.35)',
                        border: darkMode ? '1px solid #27272a' : '1px solid #e2e8f0',
                        animation: 'fadeInUp 0.2s ease-out'
                    }}>
                        {/* Header with badge, title and close button */}
                        <div style={{
                            padding: '1rem 1.15rem 0.85rem',
                            borderBottom: darkMode ? '1px solid #222222' : '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            background: darkMode ? '#161616' : '#fafafa'
                        }}>
                            <div>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    color: '#f59e0b',
                                    padding: '0.22rem 0.6rem',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.4px',
                                    marginBottom: '0.35rem'
                                }}>
                                    <Icons.Bike />
                                    <span>Frota Oficial Tchapo Tchapo</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.3px' }}>
                                    Registo de Entregador
                                </h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: darkMode ? '#a1a1aa' : '#64748b' }}>
                                    Faça entregas na sua cidade e ganhe por cada rota concluída.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsRegisterModalOpen(false);
                                    setRegStep(1);
                                    setRegTermsAgreed(false);
                                }}
                                style={{
                                    background: darkMode ? '#222222' : '#ffffff',
                                    border: darkMode ? '1px solid #333333' : '1px solid #e2e8f0',
                                    borderRadius: '50%',
                                    width: '34px',
                                    height: '34px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: darkMode ? '#cbd5e1' : '#64748b',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    flexShrink: 0,
                                    transition: 'all 0.15s'
                                }}
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        {/* Mobile-Ergonomic Step Progress Bar (Zero text wrapping) */}
                        <div style={{
                            padding: '0.65rem 0.9rem',
                            background: darkMode ? '#181818' : '#f8fafc',
                            borderBottom: darkMode ? '1px solid #222222' : '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}>
                            {[
                                { step: 1, title: '1. Pessoal' },
                                { step: 2, title: '2. Documentos' },
                                { step: 3, title: '3. Preços' }
                            ].map((s, idx) => {
                                const isActive = regStep === s.step;
                                const isPassed = regStep > s.step;
                                return (
                                    <React.Fragment key={s.step}>
                                        <div
                                            onClick={() => {
                                                if (s.step === 1) setRegStep(1);
                                                else if (s.step === 2 && photoFile && regName.trim() && regPhone.trim() && regPin.trim().length === 4 && regBairro.trim()) setRegStep(2);
                                                else if (s.step === 3 && regStep === 3) setRegStep(3);
                                            }}
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '6px 2px',
                                                borderRadius: '8px',
                                                background: isActive 
                                                    ? (darkMode ? '#27272a' : '#ffffff') 
                                                    : 'transparent',
                                                border: isActive 
                                                    ? (darkMode ? '1px solid #3f3f46' : '1px solid #e2e8f0') 
                                                    : '1px solid transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <span style={{
                                                fontSize: '0.74rem',
                                                fontWeight: isActive ? 800 : 600,
                                                color: isActive 
                                                    ? '#f64c00' 
                                                    : isPassed 
                                                        ? (darkMode ? '#34d399' : '#059669') 
                                                        : (darkMode ? '#71717a' : '#94a3b8'),
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {isPassed ? `✓ ${s.title.split('. ')[1]}` : s.title}
                                            </span>
                                        </div>
                                        {idx < 2 && (
                                            <div style={{
                                                width: '6px',
                                                height: '2px',
                                                background: regStep > idx + 1 ? '#10b981' : (darkMode ? '#2e2e2e' : '#e2e8f0'),
                                                borderRadius: '1px',
                                                flexShrink: 0
                                            }} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Modal Body: Single Smooth Scroll Container */}
                        <form onSubmit={handleRegister} style={{
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            padding: '1.1rem 1.15rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxSizing: 'border-box'
                        }}>
                            
                            {/* STEP 1: Personal & Contact Details */}
                            {regStep === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                                    
                                    {/* Profile Photo Upload Card */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.9rem',
                                        padding: '0.85rem',
                                        background: darkMode ? '#181818' : '#f8fafc',
                                        borderRadius: '14px',
                                        border: darkMode ? '1px dashed #333333' : '1px dashed #cbd5e1'
                                    }}>
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '50%',
                                                background: darkMode ? '#262626' : '#e2e8f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                border: darkMode ? '2px solid #333333' : '2px solid #ffffff',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                                            }}>
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Foto de Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ color: darkMode ? '#71717a' : '#94a3b8' }}><Icons.User /></span>
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
                                                        bottom: '-3px',
                                                        right: '-3px',
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
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                                                    }}
                                                    title="Remover foto"
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: darkMode ? '#ffffff' : '#0f172a', marginBottom: '0.15rem' }}>
                                                Foto de Perfil (Rosto) *
                                            </div>
                                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: darkMode ? '#a1a1aa' : '#64748b', lineHeight: 1.3 }}>
                                                Foto nítida e obrigatória para identificação perante clientes.
                                            </p>
                                            <label style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                background: darkMode ? '#222222' : '#ffffff',
                                                border: photoFile ? '1.5px solid #10b981' : (darkMode ? '1.5px solid #333333' : '1.5px dashed #cbd5e1'),
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '8px',
                                                fontSize: '0.76rem',
                                                fontWeight: 700,
                                                color: photoFile ? '#059669' : (darkMode ? '#e2e8f0' : '#334155'),
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}>
                                                <Icons.UploadCloud />
                                                <span>{photoFile ? 'Foto Carregada ✓' : 'Carregar Fotografia *'}</span>
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
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
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
                                                height: '46px',
                                                padding: '0 0.9rem',
                                                borderRadius: '12px',
                                                border: darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0',
                                                fontSize: '0.9rem',
                                                color: darkMode ? '#ffffff' : '#0f172a',
                                                outline: 'none',
                                                background: darkMode ? '#181818' : '#fdfdfd',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#f64c00'}
                                            onBlur={(e) => e.target.style.borderColor = darkMode ? '#2e2e2e' : '#e2e8f0'}
                                        />
                                    </div>

                                    {/* WhatsApp / Mobile */}
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                                            <Icons.WhatsApp />
                                            <span>WhatsApp / Celular *</span>
                                        </label>
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            required
                                            value={regPhone}
                                            onChange={(e) => setRegPhone(e.target.value)}
                                            placeholder="84XXXXXXX ou 87XXXXXXX"
                                            style={{
                                                width: '100%',
                                                height: '46px',
                                                padding: '0 0.9rem',
                                                borderRadius: '12px',
                                                border: darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0',
                                                fontSize: '0.9rem',
                                                color: darkMode ? '#ffffff' : '#0f172a',
                                                outline: 'none',
                                                background: darkMode ? '#181818' : '#fdfdfd',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#f64c00'}
                                            onBlur={(e) => e.target.style.borderColor = darkMode ? '#2e2e2e' : '#e2e8f0'}
                                        />
                                    </div>

                                    {/* Location (Província & Bairro) - 2 Column Clean Grid */}
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                                            <Icons.MapPin />
                                            <span>Localização (Província & Bairro) *</span>
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            <select
                                                value={regProvince}
                                                onChange={(e) => setRegProvince(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    height: '46px',
                                                    padding: '0 0.6rem',
                                                    borderRadius: '12px',
                                                    border: darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0',
                                                    fontSize: '0.84rem',
                                                    color: darkMode ? '#ffffff' : '#0f172a',
                                                    outline: 'none',
                                                    background: darkMode ? '#181818' : '#fdfdfd',
                                                    boxSizing: 'border-box',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {ALL_PROVINCES.map(prov => (
                                                    <option key={prov} value={prov}>{prov}</option>
                                                ))}
                                            </select>

                                            <input
                                                type="text"
                                                required
                                                value={regBairro}
                                                onChange={(e) => setRegBairro(e.target.value)}
                                                placeholder="Nome do Bairro *"
                                                style={{
                                                    width: '100%',
                                                    height: '46px',
                                                    padding: '0 0.75rem',
                                                    borderRadius: '12px',
                                                    border: darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0',
                                                    fontSize: '0.84rem',
                                                    color: darkMode ? '#ffffff' : '#0f172a',
                                                    outline: 'none',
                                                    background: darkMode ? '#181818' : '#fdfdfd',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#f64c00'}
                                                onBlur={(e) => e.target.style.borderColor = darkMode ? '#2e2e2e' : '#e2e8f0'}
                                            />
                                        </div>
                                    </div>

                                    {/* Security PIN */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                                                <Icons.Lock />
                                                <span>PIN de Acesso (4 Dígitos) *</span>
                                            </label>
                                            <span style={{ fontSize: '0.72rem', color: darkMode ? '#71717a' : '#64748b' }}>Usado para entrar no portal</span>
                                        </div>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            maxLength="4"
                                            required
                                            value={regPin}
                                            onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                                            placeholder="••••"
                                            style={{
                                                width: '100%',
                                                height: '46px',
                                                padding: '0 0.9rem',
                                                borderRadius: '12px',
                                                border: darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0',
                                                fontSize: '1.1rem',
                                                letterSpacing: '5px',
                                                color: darkMode ? '#ffffff' : '#0f172a',
                                                outline: 'none',
                                                background: darkMode ? '#181818' : '#fdfdfd',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#f64c00'}
                                            onBlur={(e) => e.target.style.borderColor = darkMode ? '#2e2e2e' : '#e2e8f0'}
                                        />
                                    </div>

                                    {/* Step 1 Next Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!photoFile) {
                                                showToast('A fotografia de perfil (rosto) é obrigatória.', 'error');
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
                                                showToast('Defina um PIN de 4 dígitos para a sua conta.', 'error');
                                                return;
                                            }
                                            if (!regBairro.trim()) {
                                                showToast('Por favor introduza o nome do seu bairro.', 'error');
                                                return;
                                            }
                                            setRegStep(2);
                                        }}
                                        style={{
                                            marginTop: '0.4rem',
                                            background: '#f64c00',
                                            color: '#ffffff',
                                            border: 'none',
                                            height: '48px',
                                            borderRadius: '12px',
                                            fontWeight: 800,
                                            fontSize: '0.92rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.4rem',
                                            boxShadow: '0 4px 14px rgba(246, 76, 0, 0.35)',
                                            transition: 'transform 0.1s ease'
                                        }}
                                    >
                                        <span>Avançar para Documentos</span>
                                        <Icons.ChevronRight />
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: Identification Document */}
                            {regStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                                    
                                    {/* Document Type & Number (2 Column Clean Grid) */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '0.5rem' }}>
                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                                                <Icons.IdCard />
                                                <span>Tipo *</span>
                                            </label>
                                            <select
                                                value={regDocType}
                                                onChange={(e) => setRegDocType(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    height: '46px',
                                                    padding: '0 0.6rem',
                                                    borderRadius: '12px',
                                                    border: darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0',
                                                    fontSize: '0.82rem',
                                                    color: darkMode ? '#ffffff' : '#0f172a',
                                                    outline: 'none',
                                                    background: darkMode ? '#181818' : '#fdfdfd',
                                                    boxSizing: 'border-box',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="BI">BI</option>
                                                <option value="Carta de Condução">Carta Condução</option>
                                                <option value="DIRE">DIRE</option>
                                                <option value="Passaporte">Passaporte</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                                                Número do Doc *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={regDocNumber}
                                                onChange={(e) => setRegDocNumber(e.target.value)}
                                                placeholder="Ex: 110100234567N"
                                                style={{
                                                    width: '100%',
                                                    height: '46px',
                                                    padding: '0 0.75rem',
                                                    borderRadius: '12px',
                                                    border: darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0',
                                                    fontSize: '0.86rem',
                                                    color: darkMode ? '#ffffff' : '#0f172a',
                                                    outline: 'none',
                                                    background: darkMode ? '#181818' : '#fdfdfd',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#f64c00'}
                                                onBlur={(e) => e.target.style.borderColor = darkMode ? '#2e2e2e' : '#e2e8f0'}
                                            />
                                        </div>
                                    </div>

                                    {/* Document Photo Upload Box */}
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                                            Fotografia do Documento (Frente) *
                                        </label>
                                        <div style={{
                                            border: darkMode ? '1.5px dashed #333333' : '1.5px dashed #cbd5e1',
                                            borderRadius: '14px',
                                            padding: '1rem',
                                            textAlign: 'center',
                                            background: darkMode ? '#181818' : '#f8fafc',
                                            position: 'relative'
                                        }}>
                                            {docPhotoPreview ? (
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <img
                                                        src={docPhotoPreview}
                                                        alt="Documento"
                                                        style={{
                                                            maxHeight: '130px',
                                                            maxWidth: '100%',
                                                            borderRadius: '10px',
                                                            objectFit: 'contain',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
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
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                                                        }}
                                                        title="Remover documento"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0' }}>
                                                    <div style={{
                                                        width: '42px',
                                                        height: '42px',
                                                        borderRadius: '50%',
                                                        background: darkMode ? '#262626' : '#ffffff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#f64c00',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                                                    }}>
                                                        <Icons.UploadCloud />
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                                            Anexar foto do BI ou Carta
                                                        </span>
                                                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: darkMode ? '#a1a1aa' : '#64748b' }}>
                                                            Tire foto ou anexe imagem (JPG, PNG até 5MB)
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

                                    {/* Buttons: Back and Proceed to Step 3 */}
                                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setRegStep(1)}
                                            style={{
                                                flex: 1,
                                                background: darkMode ? '#222222' : '#f1f5f9',
                                                color: darkMode ? '#e2e8f0' : '#475569',
                                                border: darkMode ? '1px solid #333333' : '1px solid #cbd5e1',
                                                height: '48px',
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.3rem'
                                            }}
                                        >
                                            <Icons.ChevronLeft />
                                            <span>Voltar</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleRegister}
                                            disabled={regLoading}
                                            style={{
                                                flex: 2,
                                                background: '#f64c00',
                                                color: '#ffffff',
                                                border: 'none',
                                                height: '48px',
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                fontSize: '0.92rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.4rem',
                                                boxShadow: '0 4px 14px rgba(246, 76, 0, 0.35)'
                                            }}
                                        >
                                            <span>Ver Preços de Loja</span>
                                            <Icons.ChevronRight />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Store Pickup Price List & Agreement */}
                            {regStep === 3 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    
                                    {/* Warning Banner */}
                                    <div style={{
                                        background: darkMode ? 'rgba(245, 158, 11, 0.12)' : '#fef3c7',
                                        border: darkMode ? '1.5px solid rgba(245, 158, 11, 0.35)' : '1.5px solid #fbbf24',
                                        borderRadius: '12px',
                                        padding: '0.75rem 0.85rem',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.55rem'
                                    }}>
                                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>⚠️</span>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: darkMode ? '#fbbf24' : '#92400e', marginBottom: '0.15rem' }}>
                                                Atenção — Preços de Levantamento da Loja
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: darkMode ? '#fef3c7' : '#a16207', lineHeight: 1.4 }}>
                                                Estes são os valores oficiais permitidos pela loja para o levantamento de produtos. Poderão sofrer atualizações conforme o mercado.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pickup Price List (Compact mobile table) */}
                                    <div>
                                        <div style={{
                                            fontSize: '0.82rem',
                                            fontWeight: 800,
                                            color: darkMode ? '#ffffff' : '#0f172a',
                                            marginBottom: '0.45rem',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>Produto</span>
                                            <span>Preço Levantamento</span>
                                        </div>
                                        <div style={{
                                            maxHeight: '220px',
                                            overflowY: 'auto',
                                            WebkitOverflowScrolling: 'touch',
                                            borderRadius: '12px',
                                            border: darkMode ? '1px solid #262626' : '1px solid #e2e8f0',
                                            background: darkMode ? '#181818' : '#ffffff'
                                        }}>
                                            {STORE_PICKUP_PRICES.map((item, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '0.5rem 0.75rem',
                                                    background: idx % 2 === 0 
                                                        ? (darkMode ? '#1c1c1c' : '#f8fafc') 
                                                        : (darkMode ? '#181818' : '#ffffff'),
                                                    borderBottom: idx < STORE_PICKUP_PRICES.length - 1 
                                                        ? (darkMode ? '1px solid #27272a' : '1px solid #f1f5f9') 
                                                        : 'none'
                                                }}>
                                                    <span style={{ fontSize: '0.78rem', color: darkMode ? '#e2e8f0' : '#334155', fontWeight: 600 }}>
                                                        {item.name}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', color: '#f64c00', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                                        {item.price.toLocaleString('pt-MZ')} MT
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Agreement Checkbox */}
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.65rem',
                                        background: regTermsAgreed 
                                            ? (darkMode ? 'rgba(5, 150, 105, 0.15)' : '#ecfdf5') 
                                            : (darkMode ? '#181818' : '#f8fafc'),
                                        border: regTermsAgreed 
                                            ? '1.5px solid #10b981' 
                                            : (darkMode ? '1.5px solid #2e2e2e' : '1.5px solid #e2e8f0'),
                                        padding: '0.75rem 0.85rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={regTermsAgreed}
                                            onChange={(e) => setRegTermsAgreed(e.target.checked)}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                accentColor: '#059669',
                                                cursor: 'pointer',
                                                marginTop: '2px',
                                                flexShrink: 0
                                            }}
                                        />
                                        <span style={{ fontSize: '0.78rem', color: darkMode ? '#e2e8f0' : '#1e293b', lineHeight: 1.4, fontWeight: 600 }}>
                                            Declaro que li e concordo integralmente com a tabela de preços de levantamento da loja Tchapo Tchapo.
                                        </span>
                                    </label>

                                    {/* Buttons: Back and Submit */}
                                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.35rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setRegStep(2)}
                                            style={{
                                                flex: 1,
                                                background: darkMode ? '#222222' : '#f1f5f9',
                                                color: darkMode ? '#e2e8f0' : '#475569',
                                                border: darkMode ? '1px solid #333333' : '1px solid #cbd5e1',
                                                height: '48px',
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.3rem'
                                            }}
                                        >
                                            <Icons.ChevronLeft />
                                            <span>Voltar</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!regTermsAgreed) {
                                                    showToast('Por favor confirme que concorda com a lista de levantamento.', 'error');
                                                    return;
                                                }
                                                handleFinalSubmit();
                                            }}
                                            disabled={regLoading || !regTermsAgreed}
                                            style={{
                                                flex: 2,
                                                background: regTermsAgreed ? '#059669' : (darkMode ? '#333333' : '#94a3b8'),
                                                color: '#ffffff',
                                                border: 'none',
                                                height: '48px',
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                cursor: regTermsAgreed ? 'pointer' : 'not-allowed',
                                                opacity: regLoading ? 0.7 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.45rem',
                                                boxShadow: regTermsAgreed ? '0 4px 14px rgba(5, 150, 105, 0.35)' : 'none',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Icons.CheckCircle />
                                            <span>{regLoading ? 'A enviar...' : 'Concluir Registo ✓'}</span>
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
                    background: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    backdropFilter: 'blur(8px)',
                    padding: '1rem',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        background: darkMode ? '#111111' : '#ffffff',
                        borderRadius: '24px',
                        padding: 'clamp(1.5rem, 5vw, 2.25rem)',
                        maxWidth: '440px',
                        width: '100%',
                        boxShadow: darkMode ? '0 25px 60px -15px rgba(0,0,0,0.85)' : '0 25px 60px -15px rgba(0,0,0,0.35)',
                        border: darkMode ? '1px solid #222222' : '1px solid #e2e8f0',
                        boxSizing: 'border-box',
                        animation: 'fadeInUp 0.2s ease-out',
                        color: darkMode ? '#ffffff' : '#0f172a'
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
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: darkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.3px' }}>
                                        Entrar no Portal
                                    </h3>
                                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
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
                                    background: darkMode ? '#1a1a1a' : '#f1f5f9',
                                    border: darkMode ? '1px solid #2a2a2a' : 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: darkMode ? '#ffffff' : '#64748b',
                                    transition: 'background 0.15s'
                                }}
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            {/* Phone Input */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem', fontWeight: 700, fontSize: '0.85rem', color: darkMode ? '#ffffff' : '#1e293b' }}>
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
                                            border: darkMode ? '1.5px solid #2a2a2a' : '1.5px solid #cbd5e1',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            fontSize: '0.98rem',
                                            color: darkMode ? '#ffffff' : '#0f172a',
                                            background: darkMode ? '#181818' : '#f8fafc',
                                            transition: 'all 0.15s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#f59e0b';
                                            e.target.style.background = darkMode ? '#1e1e1e' : '#ffffff';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = darkMode ? '#2a2a2a' : '#cbd5e1';
                                            e.target.style.background = darkMode ? '#181818' : '#f8fafc';
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
                                            border: darkMode ? '1.5px solid #2a2a2a' : '1.5px solid #cbd5e1',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            fontSize: '1.1rem',
                                            letterSpacing: showLoginPin ? '2px' : '4px',
                                            color: darkMode ? '#ffffff' : '#0f172a',
                                            background: darkMode ? '#181818' : '#f8fafc',
                                            transition: 'all 0.15s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#f59e0b';
                                            e.target.style.background = darkMode ? '#1e1e1e' : '#ffffff';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = darkMode ? '#2a2a2a' : '#cbd5e1';
                                            e.target.style.background = darkMode ? '#181818' : '#f8fafc';
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

            {/* MODAL 4: Product Photo Lightbox */}
            {previewPhoto && (
                <div
                    onClick={() => setPreviewPhoto(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                        backdropFilter: 'blur(6px)',
                        padding: '1rem',
                        boxSizing: 'border-box'
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '460px',
                            width: '100%',
                            background: darkMode ? '#1e293b' : '#ffffff',
                            borderRadius: '24px',
                            padding: '1.25rem',
                            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.9rem',
                            boxSizing: 'border-box'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: darkMode ? '1px solid #334155' : '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icons.Package />
                                </div>
                                <div style={{ fontWeight: 900, fontSize: '0.98rem', color: darkMode ? '#ffffff' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {previewPhoto.name}
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewPhoto(null)}
                                style={{
                                    background: darkMode ? '#334155' : '#f1f5f9',
                                    color: darkMode ? '#e2e8f0' : '#475569',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        {/* Image Preview */}
                        <div style={{
                            width: '100%',
                            height: '280px',
                            background: darkMode ? '#0f172a' : '#f8fafc',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
                        }}>
                            {previewPhoto.image ? (
                                <img
                                    src={previewPhoto.image}
                                    alt={previewPhoto.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div style={{ display: previewPhoto.image ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                                <div style={{ transform: 'scale(1.5)' }}><Icons.Package /></div>
                                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Foto ilustrativa indisponível</span>
                            </div>
                        </div>

                        {/* Meta info */}
                        <div style={{
                            background: darkMode ? '#0f172a' : '#f8fafc',
                            padding: '0.75rem 1rem',
                            borderRadius: '14px',
                            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.45rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Quantidade:</span>
                                <span style={{ background: '#0f172a', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.78rem' }}>
                                    {previewPhoto.quantity || 1}x {previewPhoto.quantity > 1 ? 'unidades' : 'unidade'}
                                </span>
                            </div>

                            {previewPhoto.price ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Preço de Venda:</span>
                                    <strong style={{ fontSize: '0.98rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#0f172a' }}>
                                        {formatMZCurrency(previewPhoto.price)}
                                    </strong>
                                </div>
                            ) : null}

                            {previewPhoto.pickupPrice ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingTop: '0.45rem' }}>
                                    <span style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: 700 }}>Valor de Levantamento:</span>
                                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>
                                        {formatMZCurrency(previewPhoto.pickupPrice)}
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setPreviewPhoto(null)}
                            style={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            Fechar Visualização
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DriverPortal() {
    return (
        <DriverPortalErrorBoundary>
            <DriverPortalContent />
        </DriverPortalErrorBoundary>
    );
}
