import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { usuario, esAdmin, loading } = useAuth();

  console.log("ProtectedRoute - Estado:", { usuario, requireAdmin, loading });

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!usuario) {
    console.log("No hay usuario, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // Si requiere rol admin y el usuario no es admin, redirigir a productos
  if (requireAdmin && !esAdmin) {
    console.log("Requiere admin pero no lo es, redirigiendo a /productos");
    return <Navigate to="/productos" replace />;
  }

  // Si todo está bien, mostrar el componente hijo
  console.log("Acceso permitido");
  return children;
};

export default ProtectedRoute;
