import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const context = useContext(AuthContext);

  if (!context?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
