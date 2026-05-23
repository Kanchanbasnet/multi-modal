import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
