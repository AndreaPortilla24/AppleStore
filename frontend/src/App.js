import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from 'context/AuthContext';
import { CartProvider } from 'context/CartContext';
import './index.css';

// Auth
import { LoginPage, RegisterPage } from 'pages/LoginPage';

// Cliente / Tienda
import { StorePage } from 'pages/client/StorePage';
import { CheckoutPage, MyOrdersPage } from 'pages/client/ClientPages';

// Admin
import { AdminDashboard } from 'pages/admin/AdminDashboard';
import { AdminProductos } from 'pages/admin/AdminProductos';
import { AdminPedidos, AdminUsuarios } from 'pages/admin/AdminPages';
import { AdminReportes, AdminAuditoria } from 'pages/admin/AdminReportes';

// Empleado
import { EmpleadoDashboard, EmpleadoPedidos, EmpleadoReportes } from 'pages/employee/EmployeePages';

// ===== Ruta protegida =====
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/store" replace />;
  return children;
}

// ===== Rutas =====
function AppRoutes() {
  const { user } = useAuth();

  const homeTarget = !user ? '/store'
    : user.rol === 'ADMINISTRADOR' ? '/admin/dashboard'
    : user.rol === 'EMPLEADO'      ? '/empleado/dashboard'
    : '/store';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homeTarget} replace />} />

      {/* Auth */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Tienda */}
      <Route path="/store"          element={<StorePage />} />
      <Route path="/store/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/store/pedidos"  element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMINISTRADOR']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/productos" element={<ProtectedRoute roles={['ADMINISTRADOR']}><AdminProductos /></ProtectedRoute>} />
      <Route path="/admin/pedidos"   element={<ProtectedRoute roles={['ADMINISTRADOR']}><AdminPedidos /></ProtectedRoute>} />
      <Route path="/admin/usuarios"  element={<ProtectedRoute roles={['ADMINISTRADOR']}><AdminUsuarios /></ProtectedRoute>} />
      <Route path="/admin/reportes"  element={<ProtectedRoute roles={['ADMINISTRADOR']}><AdminReportes /></ProtectedRoute>} />
      <Route path="/admin/auditoria" element={<ProtectedRoute roles={['ADMINISTRADOR']}><AdminAuditoria /></ProtectedRoute>} />

      {/* Empleado */}
      <Route path="/empleado/dashboard" element={<ProtectedRoute roles={['EMPLEADO']}><EmpleadoDashboard /></ProtectedRoute>} />
      <Route path="/empleado/pedidos"   element={<ProtectedRoute roles={['EMPLEADO']}><EmpleadoPedidos /></ProtectedRoute>} />
      <Route path="/empleado/reportes"  element={<ProtectedRoute roles={['EMPLEADO']}><EmpleadoReportes /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/store" replace />} />
    </Routes>
  );
}

// ===== Root =====
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#30d158', secondary: '#000' } },
              error:   { iconTheme: { primary: '#ff453a', secondary: '#000' } },
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
