import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow both admin and team members to access admin dashboard
  if (user?.role !== 'admin' && user?.role !== 'team') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
