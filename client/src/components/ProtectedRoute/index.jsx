import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = useSelector((state) => state.auth.role);

  /* redirect to login if not authenticated */
  if (!role) {
    return <Navigate to="/" replace />; // redirect to login if not authenticated
  }

  /* redirect if role not allowed */
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired /* valid React element */,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
    .isRequired /* array of string for allowed roles */,
};

export default ProtectedRoute;
