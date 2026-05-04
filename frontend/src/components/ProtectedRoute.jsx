import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on their role if they try to access unauthorized area
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
    if (user.role === 'teacher') return <Navigate to="/teacher-dashboard" />;
    return <Navigate to="/student-dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
