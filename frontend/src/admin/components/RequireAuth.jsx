import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/Spinner';

// Shows a quiet loading state while the session is checked, then sends signed-out visitors to the login page.
// The real protection is on the API; this only avoids flashing an empty admin.
export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted" role="status">
        <Spinner className="size-6" label="Checking your session" />
      </div>
    );
  }
  if (status !== 'signed-in') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
