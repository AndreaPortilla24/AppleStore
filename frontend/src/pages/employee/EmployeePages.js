import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { pedidosApi, reportesApi } from 'api';
import { DashboardLayout } from 'components/layout/Sidebar';
import { StatusBadge, formatCurrency, formatDate, LoadingSpinner, EmptyState } from 'components/common';
import { ShoppingBag, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ===== DASHBOARD EMPLEADO =====
export function EmpleadoDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pedidosApi.getAll().then(r => setPedidos(r.data)).finally(() => setLoading(false));
  }, []);

  const pendientes  = pedidos.filter(p => p.estado === 'PENDIENTE').length;
  const confirmados = pedidos.filter(p => p.estado === 'CONFIRMADO').length;
  const entregados  = pedidos.filter(p => p.estado === 'ENTREGADO').length;
  const cancelados  = pedidos.filter(p => p.estado === 'CANCELADO').length;

  const chartData = [
    { name: 'Pendiente',  value: pendientes,  fill: '#ffd60a' },
    { name: 'Confirmado', value: confirmados, fill: '#2997ff' },
    { name: 'En proceso', value: pedidos.filter(p => p.estado === 'EN_PROCESO').length, fill: '#bf5af2' },
    { name: 'Enviado',    value: pedidos.filter(p => p.estado === 'ENVIADO').length,    fill: '#ff9f0a' },
    { name: 'Entregado',  value: entregados,  fill: '#30d158' },
    { name: 'Cancelado',  value: cancelados,  fill: '#ff453a' },
  ];

  const stats = [
    { label: 'Total pedidos',     value: pedidos.length, color: '#2997ff', icon: ShoppingBag },
    { label: 'Pendientes',        value: pendientes,     color: '#ffd60a', icon: ShoppingBag },
    { label: 'Entregados',        value: entregados,     color: '#30d158', icon: ShoppingBag },
    { label: 'Cancelados',        value: cancelados,     color: '#ff453a', icon: ShoppingBag },
  ];

  return (
    <DashboardLayout role="empleado">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Mi Panel</h1>
            <p className="page-subtitle">Resumen de pedidos</p>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="stat-card">
                    <div className="stat-icon" style={{ background: s.color + '20' }}>
                      <Icon size={22} color={s.color} />
                    </div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Pedidos por estado</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <React.Fragment key={i}>
                        <Bar dataKey="value" fill={entry.fill} />
                      </React.Fragment>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

// ===== PEDIDOS EMPLEADO =====
export function EmpleadoPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    pedidosApi.getAll().then(r => setPedidos(r.data)).finally(() => setLoading(false));
  }, []);

  const updateEstado = async (id, estado) => {
    try {
      const r = await pedidosApi.updateEstado(id, estado);
      setPedidos(prev => prev.map(p => p.idPedido === id ? r.data : p));
      toast.success('Estado actualizado');
    } catch { toast.error('Error al actualizar'); }
  };

  const ESTADOS = ['', 'PENDIENTE', 'CONFIRMADO', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
  const filtered = filter ? pedidos.filter(p => p.estado === filter) : pedidos;

  return (
    <DashboardLayout role="empleado">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Pedidos</h1>
            <p className="page-subtitle">{pedidos.length} pedidos en total</p>
          </div>
          <div className="tabs">
            {ESTADOS.map(e => (
              <button key={e} className={`tab${filter === e ? ' active' : ''}`} onClick={() => setFilter(e)}>
                {e || 'Todos'}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon="📦" title="Sin pedidos" message="No hay pedidos con este estado" />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Cliente</th><th>Tipo</th><th>Estado</th>
                  <th>Fecha</th><th>Total</th><th>Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.idPedido}>
                    <td style={{ fontWeight: 600 }}>#{p.idPedido}</td>
                    <td>{p.nombreCliente}</td>
                    <td><span className="badge badge-gray">{p.tipoPedido}</span></td>
                    <td><StatusBadge status={p.estado} /></td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatDate(p.fechaCreacion)}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(p.total)}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 150, padding: '5px 10px', fontSize: 13 }}
                        value={p.estado}
                        onChange={e => updateEstado(p.idPedido, e.target.value)}
                      >
                        {['PENDIENTE','CONFIRMADO','EN_PROCESO','ENVIADO','ENTREGADO','CANCELADO'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ===== REPORTES EMPLEADO =====
export function EmpleadoReportes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportesApi.getConsolidado().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout role="empleado"><LoadingSpinner /></DashboardLayout>;

  const kpis = [
    { label: 'Total pedidos',     value: data?.totalPedidos,      color: '#2997ff' },
    { label: 'Pedidos entregados',value: data?.pedidosEntregados,  color: '#30d158' },
    { label: 'Pedidos pendientes',value: data?.pedidosPendientes,  color: '#ffd60a' },
    { label: 'Productos en stock',value: data?.productosConStock,  color: '#bf5af2' },
    { label: 'Total productos',   value: data?.totalProductos,     color: '#ff9f0a' },
    { label: 'Ventas totales',    value: new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(data?.ventasTotales||0), color: '#30d158' },
  ];

  return (
    <DashboardLayout role="empleado">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Reportes</h1>
            <p className="page-subtitle">Resumen de operaciones</p>
          </div>
        </div>
        <div className="grid-3" style={{ marginBottom: 32 }}>
          {kpis.map(k => (
            <div key={k.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: k.color, marginBottom: 8 }}>{k.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
