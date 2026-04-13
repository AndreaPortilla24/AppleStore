import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

// ===== LoadingSpinner =====
export function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="loading-center">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{text}</p>
      </div>
    </div>
  );
}

// ===== Modal =====
export function Modal({ isOpen, onClose, title, children, maxWidth = 560 }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ===== ConfirmModal =====
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, danger = false }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: danger ? 'rgba(255,69,58,0.15)' : 'rgba(41,151,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <AlertTriangle size={24} color={danger ? 'var(--danger)' : 'var(--accent)'} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            style={{ flex: 1 }}
            onClick={() => { onConfirm(); onClose(); }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== StatusBadge =====
const STATUS_MAP = {
  // Pedidos
  PENDIENTE: { label: 'Pendiente', cls: 'badge-yellow' },
  CONFIRMADO: { label: 'Confirmado', cls: 'badge-blue' },
  EN_PROCESO: { label: 'En proceso', cls: 'badge-blue' },
  ENVIADO: { label: 'Enviado', cls: 'badge-blue' },
  ENTREGADO: { label: 'Entregado', cls: 'badge-green' },
  CANCELADO: { label: 'Cancelado', cls: 'badge-red' },
  // Servicios
  RECIBIDO: { label: 'Recibido', cls: 'badge-yellow' },
  DIAGNOSTICO: { label: 'Diagnóstico', cls: 'badge-blue' },
  EN_REPARACION: { label: 'En reparación', cls: 'badge-blue' },
  LISTO: { label: 'Listo', cls: 'badge-green' },
  // Productos
  ACTIVO: { label: 'Activo', cls: 'badge-green' },
  INACTIVO: { label: 'Inactivo', cls: 'badge-gray' },
  DESCONTINUADO: { label: 'Descontinuado', cls: 'badge-red' },
  // Roles
  ADMINISTRADOR: { label: 'Admin', cls: 'badge-red' },
  EMPLEADO: { label: 'Empleado', cls: 'badge-blue' },
  CLIENTE: { label: 'Cliente', cls: 'badge-gray' },
};

export function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { label: status, cls: 'badge-gray' };
  return <span className={`badge ${config.cls}`}>{config.label}</span>;
}

// ===== EmptyState =====
export function EmptyState({ icon, title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon || '📭'}</div>
      <h3>{title || 'Sin datos'}</h3>
      <p style={{ marginTop: 8 }}>{message || 'No hay información disponible.'}</p>
    </div>
  );
}

// ===== FormInput helper =====
export function FormField({ label, error, children }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

// ===== CurrencyFormat =====
export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}
