import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { productosApi } from 'api';
import { DashboardLayout } from 'components/layout/Sidebar';
import { Modal, ConfirmModal, StatusBadge, formatCurrency, LoadingSpinner } from 'components/common';

const EMPTY_FORM = { nombre: '', categoria: '', modelo: '', estado: 'ACTIVO', invDisponible: 0, invSeparado: 0, precio: '', imagenUrl: '', descripcion: '' };

export function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);

  const load = () => productosApi.getAllAdmin().then(r => setProductos(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setShowModal(true); };
  const openDelete = (p) => { setDeleting(p); setShowConfirm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, precio: Number(form.precio), invDisponible: Number(form.invDisponible), invSeparado: Number(form.invSeparado) };
      if (editing) {
        const r = await productosApi.update(editing.idProducto, payload);
        setProductos(prev => prev.map(p => p.idProducto === editing.idProducto ? r.data : p));
        toast.success('Producto actualizado');
      } else {
        const r = await productosApi.create(payload);
        setProductos(prev => [...prev, r.data]);
        toast.success('Producto creado');
      }
      setShowModal(false);
    } catch { toast.error('Error al guardar producto'); }
  };

  const handleDelete = async () => {
    try {
      await productosApi.delete(deleting.idProducto);
      setProductos(prev => prev.map(p => p.idProducto === deleting.idProducto ? { ...p, estado: 'INACTIVO' } : p));
      toast.success('Producto desactivado');
    } catch { toast.error('Error'); }
  };

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(search.toLowerCase()) ||
    p.modelo?.toLowerCase().includes(search.toLowerCase())
  );

  const f = (k) => ({ value: form[k] ?? '', onChange: e => setForm({ ...form, [k]: e.target.value }) });

  return (
    <DashboardLayout role="admin">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Productos</h1>
            <p className="page-subtitle">{productos.length} productos en el catálogo</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nuevo producto</button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Buscar productos..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Modelo</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.idProducto}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.imagenUrl ? (
                          <img src={p.imagenUrl} alt="" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8, background: '#1a1a1a', padding: 4 }}
                            onError={e => e.target.style.display = 'none'} />
                        ) : <div style={{ width: 40, height: 40, background: 'var(--bg-elevated)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} color="var(--text-tertiary)" /></div>}
                        <span style={{ fontWeight: 500 }}>{p.nombre}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{p.categoria}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.modelo}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(p.precio)}</td>
                    <td>
                      <div style={{ fontSize: 13 }}>
                        <span style={{ color: p.invDisponible > 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {p.invDisponible} disp.
                        </span>
                        {p.invSeparado > 0 && <span style={{ color: 'var(--warning)', marginLeft: 8 }}>{p.invSeparado} sep.</span>}
                      </div>
                    </td>
                    <td><StatusBadge status={p.estado} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(p)}><Edit size={15} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => openDelete(p)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar producto' : 'Nuevo producto'} maxWidth={640}>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="iPhone 15 Pro" {...f('nombre')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <input className="form-input" placeholder="iPhone, Mac, iPad..." {...f('categoria')} />
              </div>
              <div className="form-group">
                <label className="form-label">Modelo</label>
                <input className="form-input" placeholder="A3101" {...f('modelo')} />
              </div>
              <div className="form-group">
                <label className="form-label">Precio (COP)</label>
                <input className="form-input" type="number" placeholder="4299000" {...f('precio')} required min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-select" {...f('estado')}>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="DESCONTINUADO">Descontinuado</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Stock disponible</label>
                <input className="form-input" type="number" {...f('invDisponible')} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock separado</label>
                <input className="form-input" type="number" {...f('invSeparado')} min={0} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">URL de imagen</label>
                <input className="form-input" placeholder="https://..." {...f('imagenUrl')} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Descripción</label>
                <textarea className="form-textarea" placeholder="Descripción del producto..." {...f('descripcion')} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editing ? 'Guardar cambios' : 'Crear producto'}</button>
            </div>
          </form>
        </Modal>

        <ConfirmModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete}
          title="Desactivar producto" message={`¿Desactivar "${deleting?.nombre}"? El producto ya no aparecerá en la tienda.`} danger />
      </div>
    </DashboardLayout>
  );
}
