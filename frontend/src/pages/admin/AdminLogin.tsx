import {useState, FormEvent} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {adminLogin} from '../../services/api';
import {brand} from '../../content';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as {from?: Location})?.from?.pathname || '/admin';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(password);
      navigate(from, {replace: true});
    } catch (err) {
      setError('Senha incorreta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-3xl text-white">{brand.name}</a>
          <p className="mt-2 font-mono text-label text-regolith/60 uppercase">Admin Dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 bg-void-2/60 ring-1 ring-white/10 rounded-[8px] p-8">
          <div>
            <label htmlFor="password" className="block font-mono text-label text-regolith/60 uppercase mb-2">
              Senha de admin
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
              className="w-full rounded-[4px] bg-white/[0.04] px-4 py-3.5 text-body text-white ring-1 ring-white/15 outline-none placeholder:text-regolith/40 focus:ring-terminal"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 font-mono text-sm text-center animate-shake">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[4px] bg-terminal px-5 py-3.5 font-mono text-label text-void uppercase transition-colors hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Acessar Dashboard'}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-label text-regolith/50">
          <a href="/" className="text-terminal hover:text-white underline">Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}