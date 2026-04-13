import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { productosApi } from 'api';
import { useCart } from 'context/CartContext';
import { StoreNavbar, CartDrawer } from 'components/layout/StoreNavbar';
import { formatCurrency, LoadingSpinner } from 'components/common';

export function StorePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([productosApi.getAll(), productosApi.getCategorias()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? products.filter(p => p.categoria === activeCategory)
    : products;

  const handleAdd = (product, e) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.nombre} agregado al carrito`);
  };

  return (
    <div>
      <StoreNavbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
      />
      <CartDrawer />

      {/* Hero */}
      {!activeCategory && (
        <div className="hero">
          <div>
            <p className="hero-eyebrow">Apple Store Colombia</p>
            <h1 className="hero-title">Think Different.<br />Shop Different.</h1>
            <p className="hero-subtitle">
              Los mejores productos Apple con garantía oficial y precios competitivos.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="page-container" id="products">
        {activeCategory && (
          <div className="page-header">
            <div>
              <h1 className="page-title">{activeCategory}</h1>
              <p className="page-subtitle">{filtered.length} productos disponibles</p>
            </div>
            <button className="btn btn-ghost" onClick={() => setActiveCategory('')}>Ver todos</button>
          </div>
        )}

        {loading ? <LoadingSpinner /> : (
          <div className="grid-3" style={{ gap: 24 }}>
            {filtered.map(product => (
              <div
                key={product.idProducto}
                className="product-card"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-img-wrapper" style={{ aspectRatio: '1', maxHeight: 220 }}>
                  {product.imagenUrl ? (
                    <img src={product.imagenUrl} alt={product.nombre}
                      onError={e => { e.target.src = ''; e.target.style.display = 'none'; }} />
                  ) : (
                    <Package size={48} color="var(--text-tertiary)" />
                  )}
                </div>
                <div className="product-info">
                  <div className="product-category">{product.categoria}</div>
                  <div className="product-name">{product.nombre}</div>
                  <div className="product-model">{product.modelo}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} fill="var(--warning)" color="var(--warning)" />
                    ))}
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>(4.9)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div>
                      <div className="product-price">{formatCurrency(product.precio)}</div>
                      <div className="product-stock">
                        {product.invDisponible > 0
                          ? <span style={{ color: 'var(--success)', fontSize: 12 }}>✓ En stock ({product.invDisponible})</span>
                          : <span style={{ color: 'var(--danger)', fontSize: 12 }}>Sin stock</span>
                        }
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={e => handleAdd(product, e)}
                      disabled={product.invDisponible === 0}
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div style={{ background: '#1a1a1a', borderRadius: 'var(--radius-lg)', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1' }}>
                {selectedProduct.imagenUrl ? (
                  <img src={selectedProduct.imagenUrl} alt={selectedProduct.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : <Package size={64} color="var(--text-tertiary)" />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  {selectedProduct.categoria}
                </p>
                <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8 }}>
                  {selectedProduct.nombre}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 6 }}>
                  Modelo: {selectedProduct.modelo}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  {selectedProduct.descripcion}
                </p>
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                  {formatCurrency(selectedProduct.precio)}
                </div>
                <div style={{ fontSize: 13, color: selectedProduct.invDisponible > 0 ? 'var(--success)' : 'var(--danger)', marginBottom: 24 }}>
                  {selectedProduct.invDisponible > 0 ? `✓ ${selectedProduct.invDisponible} en stock` : '✗ Sin stock'}
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={selectedProduct.invDisponible === 0}
                  onClick={e => { handleAdd(selectedProduct, e); setSelectedProduct(null); }}
                >
                  <ShoppingCart size={18} /> Agregar al carrito
                </button>
                <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setSelectedProduct(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
