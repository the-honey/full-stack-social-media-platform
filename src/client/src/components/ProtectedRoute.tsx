import { Navigate } from 'react-router-dom';
import useAuth from '@/context/authContext';

export const ProtectedRoute = ({ children }: any) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};
