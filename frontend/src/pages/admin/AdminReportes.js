import React, { useEffect, useState } from 'react';
import { reportesApi, auditApi } from 'api';
import { DashboardLayout } from 'components/layout/Sidebar';
import { formatCurrency, LoadingSpinner } from 'components/common';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';

export function AdminReportes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportesApi.getConsolidado().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout role="admin"><LoadingSpinner /></DashboardLayout>;

  const barData = [
    { name: 'Total',      value: data?.totalPedidos      || 0 },
    { name: 'Entregados', value: data?.pedidosEntregados || 0 },
    { name: 'Pendientes', value: data?.pedidosPendientes || 0 },
  ];

  const invData = [
    { name: 'Con stock',  value: data?.productosConStock || 0,                                                    fill: '#30d158' },
    { name: 'Sin stock',  value: (data?.totalProductos || 0) - (data?.productosConStock || 0), fill: '#ff453a' },
  ];

  const CARD = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 };

  const tasaEntrega = data?.totalPedidos
    ? Math.round((data.pedidosEntregados / data.totalPedidos) * 100)
    : 0;

  return (
    <DashboardLayout role="admin">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Reportes</h1>
            <p className="page-subtitle">Análisis consolidado del negocio</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: 'Ventas totales',  value: formatCurrency(data?.ventasTotales || 0), color: '#30d158' },
            { label: 'Total pedidos',   value: data?.totalPedidos,                        color: '#2997ff' },
            { label: 'Tasa de entrega', value: `${tasaEntrega}%`,                         color: '#bf5af2' },
            { label: 'Productos activos', value: data?.productosConStock,                 color: '#ff9f0a' },
          ].map(kpi => (
            <div key={kpi.label} style={CARD}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{kpi.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Gráficas */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
          <div style={CARD}>
            <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Informe tabular — Pedidos</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' }} />
                <Bar dataKey="value" fill="#2997ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={CARD}>
            <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Informe gráfico — Inventario</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={invData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                  {invData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Legend iconType="circle" formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{v}</span>} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla consolidada */}
        <div style={CARD}>
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Informe consolidado</h3>
          <table className="table">
            <thead>
              <tr><th>Métrica</th><th>Valor</th><th>Descripción</th></tr>
            </thead>
            <tbody>
              {[
                ['Total de pedidos',    data?.totalPedidos,                              'Pedidos registrados en el sistema'],
                ['Pedidos entregados',  data?.pedidosEntregados,                         'Pedidos completados exitosamente'],
                ['Pedidos pendientes',  data?.pedidosPendientes,                         'Pedidos en espera de procesamiento'],
                ['Total productos',     data?.totalProductos,                            'Productos en el catálogo'],
                ['Productos con stock', data?.productosConStock,                         'Productos disponibles para venta'],
                ['Ventas totales',      formatCurrency(data?.ventasTotales || 0),        'Ingresos de pedidos entregados'],
                ['Tasa de entrega',     `${tasaEntrega}%`,                               'Porcentaje de pedidos entregados'],
              ].map(([label, value, desc]) => (
                <tr key={label}>
                  <td style={{ fontWeight: 600 }}>{label}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>{value ?? '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function AdminAuditoria() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    auditApi.getAll().then(r => setLogs(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? logs.filter(l =>
        l.accion?.includes(filter.toUpperCase()) ||
        l.entidad?.toLowerCase().includes(filter.toLowerCase()) ||
        l.nombreUsuario?.toLowerCase().includes(filter.toLowerCase())
      )
    : logs;

  const ACCION_COLOR = {
    LOGIN: 'badge-green', REGISTRO: 'badge-blue', CREAR: 'badge-blue',
    ACTUALIZAR: 'badge-yellow', ACTUALIZAR_ESTADO: 'badge-yellow',
    ELIMINAR: 'badge-red', CANCELAR: 'badge-red',
    CAMBIAR_ROL: 'badge-yellow', FINALIZAR: 'badge-green',
  };

  return (
    <DashboardLayout role="admin">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Auditoría</h1>
            <p className="page-subtitle">Registro completo de actividad del sistema</p>
          </div>
        </div>

        <div style={{ marginBottom: 20, maxWidth: 380 }}>
          <input
            className="form-input"
            placeholder="Filtrar por acción, entidad o usuario..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th><th>Usuario</th><th>Rol</th>
                  <th>Acción</th><th>Entidad</th><th>ID</th><th>Detalle</th><th>IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Sin registros</td></tr>
                ) : filtered.slice(0, 200).map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString('es-CO')}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{log.nombreUsuario}</td>
                    <td><span className="badge badge-gray" style={{ fontSize: 11 }}>{log.rolUsuario}</span></td>
                    <td><span className={`badge ${ACCION_COLOR[log.accion] || 'badge-gray'}`} style={{ fontSize: 11 }}>{log.accion}</span></td>
                    <td style={{ fontSize: 13 }}>{log.entidad}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{log.idEntidad || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 200 }}>{log.detalle?.substring(0, 60)}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{log.ipAddress}</td>
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
