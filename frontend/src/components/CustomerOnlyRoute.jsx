import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerOnlyRoute = () => {
  const { user } = useAuth();

  if (user?.role === 'OWNER') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default CustomerOnlyRoute;