import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { fetchCurrentUser } from '../store/thunks/authThunks';
import ProtectedRoute from './ProtectedRoutes';
import LoginPage from '../pages/LoginPage';

export default function AppRoutes() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="p-8">Logged in! Chat coming soon.</div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
