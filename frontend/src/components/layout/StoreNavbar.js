import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Apple } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { useCart } from 'context/CartContext';
import { formatCurrency } from 'components/common';

export function StoreNavbar({ activeCategory, onCategoryChange, categories }) {
  const { user, logout } = useAuth();
  const { count, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/store')}>
        <Apple size={20} style={{ marginRight: 6, verticalAlign: 'middle' }} />
      </div>
      <div className="nav-links">
        <button className="nav-link" onClick={() => onCategoryChange && onCategoryChange('')}>
          Todos
        </button>
        {categories?.map(cat => (
          <button
            key={cat}
            className="nav-link"
            style={{ color: activeCategory === cat ? 'var(--text-primary)' : undefined }}
            onClick={() => onCategoryChange && onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <div className="cart-badge" onClick={() => setIsOpen(true)}>
          <ShoppingCart size={20} />
          {count > 0 && <span className="cart-count">{count}</span>}
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/store/pedidos')}>
              <User size={15} /> Mis pedidos
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export function CartDrawer() {
  const { items, removeItem, updateQty, total, isOpen, setIsOpen, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    setIsOpen(false);
    navigate('/store/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Carrito</h2>
          <button className="btn btn-ghost btn-icon" onClick={() => setIsOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
              <ShoppingCart size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : items.map(item => (
            <div key={item.idProducto} className="cart-item">
              {item.imagenUrl && (
                <img src={item.imagenUrl} alt={item.nombre} className="cart-item-img"
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
              <div className="cart-item-info">
                <div className="cart-item-name">{item.nombre}</div>
                <div className="cart-item-price">{formatCurrency(item.precio)}</div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQty(item.idProducto, item.cantidad - 1)}>−</button>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.cantidad}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.idProducto, item.cantidad + 1)}>+</button>
                  <button
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 12 }}
                    onClick={() => removeItem(item.idProducto)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleCheckout}>
              Proceder al pago
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={clear}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
