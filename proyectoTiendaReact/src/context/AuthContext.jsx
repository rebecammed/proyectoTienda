import { createContext, useContext, useState, useEffect } from "react";
const API_URL = "https://proyectotienda-m8um.onrender.com/api";

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
  // Cargar usuario de localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedRol = localStorage.getItem("rol");

    console.log("AuthProvider - Cargando de localStorage:", {
      storedUser,
      storedRol,
    });

    if (
      storedUser &&
      storedRol &&
      storedUser !== "undefined" &&
      storedRol !== "undefined"
    ) {
      setUsuario(storedUser);
      setRol(storedRol);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: email, contrasena: password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", data.usuario);
      localStorage.setItem("rol", data.rol);
      setUsuario(data.usuario);
      setRol(data.rol);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    setUsuario(null);
    setRol(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        isLoggedIn,
        loading,
        login,
        logout,
        esAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
