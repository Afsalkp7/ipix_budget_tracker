import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../../../../utils/authMiddleware.js';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = isTokenValid();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;