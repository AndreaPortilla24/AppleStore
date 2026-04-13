import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { pedidosApi } from 'api';
import { useCart } from 'context/CartContext';
import { useAuth } from 'context/AuthContext';
import { StoreNavbar, CartDrawer } from 'components/layout/StoreNavbar';
import { StatusBadge, formatCurrency, formatDate, LoadingSpinner, EmptyState } from 'components/common';

// ===== CHECKOUT =====
export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('COMPRA');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('El carrito está vacío'); return; }
    setLoading(true);
    try {
      await pedidosApi.create({
        tipoPedido: tipo,
        fechaEstimadaEntrega: fecha || null,
        detalles: items.map(i => ({ idProducto: i.idProducto, cantidad: i.cantidad }))
      });
      clear();
      toast.success('¡Pedido realizado con éxito!');
      navigate('/store/pedidos');
    } catch (err) {
      toast.error(err.response?.data || 'Error al procesar el pedido');
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div>
        <StoreNavbar />
        <CartDrawer />
        <div className="page-container" style={{ maxWidth: 600, margin: '60px auto' }}>
          <EmptyState icon="🛒" title="Carrito vacío" message="Agrega productos para continuar" />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => navigate('/store')}>Ir a la tienda</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StoreNavbar />
      <CartDrawer />
      <div className="page-container" style={{ maxWidth: 900, margin: '40px auto' }}>
        <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => navigate('/store')}>
          <ArrowLeft size={16} /> Seguir comprando
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
          {/* Formulario */}
          <div>
            <h1 className="page-title" style={{ marginBottom: 24 }}>Finalizar pedido</h1>
            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Tipo de pedido</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {['COMPRA', 'SEPARADO'].map(t => (
                      <label key={t} style={{ flex: 1, cursor: 'pointer' }}>
                        <input type="radio" name="tipo" value={t} checked={tipo === t}
                          onChange={() => setTipo(t)} style={{ display: 'none' }} />
                        <div style={{
                          padding: '12px 16px', border: '2px solid',
                          borderColor: tipo === t ? 'var(--accent)' : 'var(--border)',
                          borderRadius: 'var(--radius-md)', textAlign: 'center',
                          background: tipo === t ? 'rgba(41,151,255,0.1)' : 'var(--bg-elevated)',
                          transition: 'all 0.2s'
                        }}>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>
                            {t === 'COMPRA' ? '🛍️ Compra' : '📦 Separado'}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                            {t === 'COMPRA' ? 'Pago y entrega inmediata' : 'Reserva el producto'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha estimada de entrega (opcional)</label>
                  <input className="form-input" type="date" value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dirección de entrega</label>
                  <input className="form-input" value={user?.direccion || ''}
                    placeholder="Sin dirección registrada" readOnly style={{ opacity: 0.7 }} />
                </div>
                <button className="btn btn-primary btn-lg" type="submit"
                  disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Procesando...' : `Confirmar pedido • ${formatCurrency(total)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>
                Resumen ({items.length} item{items.length > 1 ? 's' : ''})
              </h3>
              {items.map(i => (
                <div key={i.idProducto} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{i.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>x{i.cantidad}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {formatCurrency(i.precio * i.cantidad)}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginTop: 16 }}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MIS PEDIDOS =====
export function MyOrdersPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    pedidosApi.getMisPedidos().then(r => setPedidos(r.data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar este pedido?')) return;
    try {
      await pedidosApi.cancelar(id);
      setPedidos(prev => prev.map(p => p.idPedido === id ? { ...p, estado: 'CANCELADO' } : p));
      toast.success('Pedido cancelado');
    } catch { toast.error('No se puede cancelar'); }
  };

  return (
    <div>
      <StoreNavbar />
      <CartDrawer />
      <div className="page-container" style={{ maxWidth: 900, margin: '40px auto' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Mis pedidos</h1>
            <p className="page-subtitle">{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/store')}>
            <ShoppingBag size={16} /> Seguir comprando
          </button>
        </div>

        {loading ? <LoadingSpinner /> : pedidos.length === 0 ? (
          <EmptyState icon="📦" title="Sin pedidos" message="Aún no has realizado ningún pedido" />
        ) : pedidos.map(pedido => (
          <div key={pedido.idPedido} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Pedido #{pedido.idPedido}</span>
                  <StatusBadge status={pedido.estado} />
                  <span className="badge badge-gray">{pedido.tipoPedido}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {formatDate(pedido.fechaCreacion)}
                  {pedido.fechaEstimadaEntrega && ` · Entrega: ${formatDate(pedido.fechaEstimadaEntrega)}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(pedido.total)}</div>
                {['PENDIENTE', 'CONFIRMADO'].includes(pedido.estado) && (
                  <button className="btn btn-danger btn-sm" style={{ marginTop: 8 }}
                    onClick={() => handleCancel(pedido.idPedido)}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
            {pedido.detalles?.length > 0 && (
              <div style={{
                marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)',
                display: 'flex', flexWrap: 'wrap', gap: 10
              }}>
                {pedido.detalles.map(d => (
                  <div key={d.idDetalle} style={{
                    fontSize: 13, background: 'var(--bg-elevated)',
                    padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}>
                    <Package size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {d.nombreProducto} ×{d.cantidad}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
