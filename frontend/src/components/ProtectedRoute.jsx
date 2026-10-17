import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/portal" replace />;
  }
  return children;
}
