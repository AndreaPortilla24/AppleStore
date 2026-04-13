import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { pedidosApi, usuariosApi } from 'api';
import { DashboardLayout } from 'components/layout/Sidebar';
import { StatusBadge, formatCurrency, formatDate, LoadingSpinner, EmptyState, ConfirmModal } from 'components/common';

// ===== PEDIDOS =====
export function AdminPedidos() {
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
    <DashboardLayout role="admin">
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
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.idPedido}>
                    <td style={{ fontWeight: 600 }}>#{p.idPedido}</td>
                    <td>{p.nombreCliente}</td>
                    <td><span className="badge badge-gray">{p.tipoPedido}</span></td>
                    <td><StatusBadge status={p.estado} /></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {formatDate(p.fechaCreacion)}
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(p.total)}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 160, padding: '6px 10px', fontSize: 13 }}
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

// ===== USUARIOS =====
export function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    usuariosApi.getAll().then(r => setUsuarios(r.data)).finally(() => setLoading(false));
  }, []);

  const cambiarRol = async (id, rol) => {
    try {
      const r = await usuariosApi.cambiarRol(id, rol);
      setUsuarios(prev => prev.map(u => u.idUsuario === id ? r.data : u));
      toast.success('Rol actualizado');
    } catch { toast.error('Error al cambiar rol'); }
  };

  const handleDelete = async () => {
    try {
      await usuariosApi.eliminar(deleting.idUsuario);
      setUsuarios(prev => prev.filter(u => u.idUsuario !== deleting.idUsuario));
      toast.success('Usuario eliminado');
    } catch { toast.error('No se puede eliminar'); }
  };

  return (
    <DashboardLayout role="admin">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Usuarios</h1>
            <p className="page-subtitle">{usuarios.length} usuarios registrados</p>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.idUsuario}>
                    <td style={{ fontWeight: 600 }}>#{u.idUsuario}</td>
                    <td style={{ fontWeight: 500 }}>{u.nombre} {u.apellido}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.correo}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.telefono || '—'}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 150, padding: '5px 10px', fontSize: 13 }}
                        value={u.rol}
                        onChange={e => cambiarRol(u.idUsuario, e.target.value)}
                      >
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="EMPLEADO">EMPLEADO</option>
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                      </select>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {formatDate(u.fechaRegistro)}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => setDeleting(u)}
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmModal
          isOpen={!!deleting}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
          title="Eliminar usuario"
          message={`¿Eliminar a ${deleting?.nombre} ${deleting?.apellido}? Esta acción es irreversible.`}
          danger
        />
      </div>
    </DashboardLayout>
  );
}
