import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  BarChart3, LogOut, Apple, ShieldCheck
} from 'lucide-react';

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Apple size={22} color="var(--accent)" />
        AppleStore
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">Principal</div>
        <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/admin/productos" icon={Package}         label="Productos" />
        <NavItem to="/admin/pedidos"   icon={ShoppingBag}     label="Pedidos" />

        <div className="sidebar-section">Administración</div>
        <NavItem to="/admin/usuarios"  icon={Users}       label="Usuarios" />
        <NavItem to="/admin/reportes"  icon={BarChart3}   label="Reportes" />
        <NavItem to="/admin/auditoria" icon={ShieldCheck} label="Auditoría" />
      </nav>
      <div className="sidebar-footer">
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>
            {user?.nombre} {user?.apellido}
          </strong>
          {user?.correo}
        </div>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleLogout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function EmpleadoSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Apple size={22} color="var(--accent)" />
        AppleStore
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">Principal</div>
        <NavItem to="/empleado/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/empleado/pedidos"   icon={ShoppingBag}     label="Pedidos" />
        <NavItem to="/empleado/reportes"  icon={BarChart3}       label="Reportes" />
      </nav>
      <div className="sidebar-footer">
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>
            {user?.nombre} {user?.apellido}
          </strong>
          <span className="badge badge-blue" style={{ marginTop: 4 }}>Empleado</span>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleLogout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function DashboardLayout({ children, role }) {
  return (
    <div style={{ display: 'flex' }}>
      {role === 'admin' ? <AdminSidebar /> : <EmpleadoSidebar />}
      <main className="main-content">{children}</main>
    </div>
  );
}
