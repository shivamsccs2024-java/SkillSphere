
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAppContext();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Checking authentication...</h4>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
