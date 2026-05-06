import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estilos unificados
  const buttonStyles = {
    primary: {
      backgroundColor: "#DFD777",
      color: "#3D0026",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
    secondary: {
      backgroundColor: "#3D0026",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // Limpiar localStorage antes de intentar login
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");

    try {
      const response = await fetch(
        "https://proyectotienda-m8um.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario: usuario,
            contrasena: contrasena,
          }),
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        const nombreUsuario = data.usuario;
        const rolUsuario = data.rol || "USER";

        // Guardar en contexto y localStorage
        login(nombreUsuario, rolUsuario);

        // Redirigir según el rol
        if (rolUsuario === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/productos");
        }
      } else {
        setError(data.mensaje || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error en el fetch:", err);
      setError("Error de conexión con el servidor. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px 35px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            borderTop: `5px solid #DFD777`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2
              style={{
                color: "#3D0026",
                marginBottom: "10px",
                fontSize: "28px",
              }}
            >
              Bienvenido a accesorios hechos a mano
            </h2>
            <p style={{ color: "#9C7C77", fontSize: "14px" }}>
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#3D0026",
                  fontSize: "14px",
                }}
              >
                Usuario o Email
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: `2px solid #E5DDE2`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#3D0026",
                  fontSize: "14px",
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: `2px solid #E5DDE2`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "25px", textAlign: "right" }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "13px",
                  color: "#7C6406",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: "#9C7C77",
                  color: "white",
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontSize: "14px",
                  borderLeft: `4px solid #3D0026`,
                }}
              >
                Error: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              style={{
                ...buttonStyles.primary,
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                cursor: cargando ? "not-allowed" : "pointer",
                opacity: cargando ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!cargando)
                  e.currentTarget.style.backgroundColor = "#C9BE5E";
              }}
              onMouseLeave={(e) => {
                if (!cargando)
                  e.currentTarget.style.backgroundColor = "#DFD777";
              }}
            >
              {cargando ? (
                <span>Iniciando sesión...</span>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              paddingTop: "20px",
              borderTop: `1px solid #E5DDE2`,
            }}
          >
            <p style={{ color: "#9C7C77", marginBottom: "0" }}>
              ¿No tienes cuenta?{" "}
              <Link
                to="/registro"
                style={{
                  color: "#7C6406",
                  fontWeight: "bold",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
