import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { requestMagicLink, loginWithGoogle } from '../services/auth.service';

export default function LoginPage() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestMagicLink(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="bg-slate-800 p-10 rounded-xl w-80 text-center border border-slate-700">
          <h2 className="text-lg font-semibold mb-2 text-white">Check your email</h2>
          <p className="text-slate-400 text-sm">
            Magic link sent to <strong className="text-slate-200">{email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-10 rounded-xl w-80 border border-slate-700">
        <h1 className="text-2xl font-semibold mb-6 text-white">MultiModal Chat</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm cursor-pointer disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <div className="text-center text-slate-600 text-sm my-4">or</div>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-slate-900 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 rounded-lg py-2.5 text-sm cursor-pointer transition-colors"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
