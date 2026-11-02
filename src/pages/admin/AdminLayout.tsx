import {useEffect, useState} from 'react';
import {Outlet, Navigate, useLocation} from 'react-router-dom';
import {getAdminToken, adminLogout} from '../../services/api';

export function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = getAdminToken();
    setAuthed(!!token);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="animate-pulse text-terminal">Verificando acesso...</div>
      </div>
    );
  }

  if (!authed) {
    return <Navigate to="/admin/login" replace state={{from: location}} />;
  }

  return (
    <div className="min-h-screen bg-void">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl text-white">Admin Dashboard</h1>
        <button
          onClick={() => { adminLogout(); window.location.href = '/admin/login'; }}
          className="px-4 py-2 rounded-[4px] bg-white/5 text-white/75 hover:bg-white/10 font-mono text-label transition-colors"
        >
          Sair
        </button>
      </header>
      <main className="px-6 py-8 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}