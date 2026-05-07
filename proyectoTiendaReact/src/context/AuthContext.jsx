import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const esAdmin = rol === "ADMIN";

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedRol = localStorage.getItem("rol");
    const token = localStorage.getItem("token");

    if (token && storedUser && storedRol) {
      setUsuario(storedUser);
      setRol(storedRol);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    setUsuario(null);
    setRol(null);
    setIsLoggedIn(false);
  };

  // Función para actualizar el estado después del login (la llama Login.jsx)
  const login = (nombreUsuario, rolUsuario) => {
    setUsuario(nombreUsuario);
    setRol(rolUsuario);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        isLoggedIn,
        loading,
        logout,
        esAdmin,
        login, // ← nueva función solo para actualizar estado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
