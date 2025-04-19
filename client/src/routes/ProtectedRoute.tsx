import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Checking auth…</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}
