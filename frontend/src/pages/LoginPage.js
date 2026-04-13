import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Apple, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from 'api';
import { useAuth } from 'context/AuthContext';

export function LoginPage() {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const data = res.data;
      login({
        idUsuario: data.idUsuario, nombre: data.nombre, apellido: data.apellido,
        correo: data.correo, rol: data.rol
      }, data.token);
      toast.success(`¡Bienvenido, ${data.nombre}!`);
      if (data.rol === 'ADMINISTRADOR') navigate('/admin/dashboard');
      else if (data.rol === 'EMPLEADO') navigate('/empleado/dashboard');
      else navigate('/store');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(41,151,255,0.1) 0%, transparent 60%)'
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Apple size={40} color="var(--accent)" style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>Iniciar sesión</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>AppleStore — Accede a tu cuenta</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input className="form-input" type="email" placeholder="tu@email.com"
                value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading}
              style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Regístrate</Link>
            </p>
          </div>
        </div>
        <div style={{ marginTop: 24, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 16, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>Demo credentials:</strong>
          <div>🔴 Admin: admin@applestore.com / admin123</div>
          <div>🔵 Empleado: empleado@applestore.com / empleado123</div>
          <div>⚪ Cliente: cliente@applestore.com / cliente123</div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', password: '', telefono: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(form);
      toast.success('Cuenta creada. ¡Inicia sesión!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data || 'Error al registrar');
    } finally { setLoading(false); }
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm({ ...form, [k]: e.target.value }) });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(41,151,255,0.1) 0%, transparent 60%)',
      padding: '40px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Apple size={36} color="var(--accent)" style={{ marginBottom: 12 }} />
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Crear cuenta</h1>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="Juan" {...f('nombre')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input className="form-input" placeholder="García" {...f('apellido')} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Correo</label>
              <input className="form-input" type="email" placeholder="juan@email.com" {...f('correo')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" type="password" placeholder="Mínimo 6 caracteres" {...f('password')} required minLength={6} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" placeholder="300 123 4567" {...f('telefono')} />
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input className="form-input" placeholder="Calle 1 #2-3" {...f('direccion')} />
              </div>
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
