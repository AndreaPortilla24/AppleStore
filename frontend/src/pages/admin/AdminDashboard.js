import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, Package, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { reportesApi } from 'api';
import { DashboardLayout } from 'components/layout/Sidebar';
import { formatCurrency, LoadingSpinner } from 'components/common';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const STAT_CONFIG = [
  { key: 'totalPedidos',      label: 'Total Pedidos',     icon: ShoppingBag, color: '#2997ff', bg: 'rgba(41,151,255,0.15)' },
  { key: 'pedidosPendientes', label: 'Pendientes',        icon: Clock,       color: '#ffd60a', bg: 'rgba(255,214,10,0.15)' },
  { key: 'pedidosEntregados', label: 'Entregados',        icon: CheckCircle, color: '#30d158', bg: 'rgba(48,209,88,0.15)' },
  { key: 'totalProductos',    label: 'Total Productos',   icon: Package,     color: '#bf5af2', bg: 'rgba(191,90,242,0.15)' },
  { key: 'productosConStock', label: 'Con Stock',         icon: TrendingUp,  color: '#30d158', bg: 'rgba(48,209,88,0.15)' },
  { key: 'ventasTotales',     label: 'Ventas Totales',    icon: TrendingUp,  color: '#2997ff', bg: 'rgba(41,151,255,0.15)', currency: true },
];

const PIE_COLORS = ['#2997ff', '#ff453a'];

export function AdminDashboard() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = () => {
    setLoading(true);
    reportesApi.getConsolidado().then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, [location.key]);

  if (loading) return <DashboardLayout role="admin"><LoadingSpinner /></DashboardLayout>;

  const barData = [
    { name: 'Pendientes',  value: data?.pedidosPendientes || 0, fill: '#ffd60a' },
    { name: 'Confirmados', value: (data?.totalPedidos || 0) - (data?.pedidosPendientes || 0) - (data?.pedidosEntregados || 0), fill: '#2997ff' },
    { name: 'Entregados',  value: data?.pedidosEntregados  || 0, fill: '#30d158' },
    { name: 'Sin stock',   value: (data?.totalProductos || 0) - (data?.productosConStock || 0), fill: '#ff453a' },
  ];

  const pieData = [
    { name: 'Con stock',  value: data?.productosConStock || 0 },
    { name: 'Sin stock',  value: (data?.totalProductos || 0) - (data?.productosConStock || 0) },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Resumen general del sistema</p>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {STAT_CONFIG.map(cfg => {
            const Icon = cfg.icon;
            const value = data?.[cfg.key] ?? 0;
            return (
              <div key={cfg.key} className="stat-card">
                <div className="stat-icon" style={{ background: cfg.bg }}>
                  <Icon size={22} color={cfg.color} />
                </div>
                <div>
                  <div className="stat-value">
                    {cfg.currency ? formatCurrency(value) : value?.toLocaleString()}
                  </div>
                  <div className="stat-label">{cfg.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: 18 }}>Resumen de pedidos</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} barSize={40}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: 18 }}>Inventario</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Legend iconType="circle" formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{v}</span>} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
