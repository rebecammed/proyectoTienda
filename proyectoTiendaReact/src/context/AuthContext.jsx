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

  const login = (nombreUsuario, rolUsuario) => {
    setUsuario(nombreUsuario);
    setRol(rolUsuario);
    setIsLoggedIn(true);
    localStorage.setItem("usuario", nombreUsuario);
    localStorage.setItem("rol", rolUsuario);
  };

  const logout = () => {
    setUsuario(null);
    setRol(null);
    setIsLoggedIn(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
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
