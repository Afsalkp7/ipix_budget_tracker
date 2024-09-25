import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../../../../utils/authMiddleware.js';

const PublicRoute = ({ children }) => {
  const isAuthenticated = isTokenValid();

  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;