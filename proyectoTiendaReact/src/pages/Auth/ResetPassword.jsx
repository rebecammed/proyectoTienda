import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const buttonStyles = {
    primary: {
      backgroundColor: "#DFD777",
      color: "#3D0026",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      width: "100%",
      padding: "12px",
      fontSize: "16px",
    },
    disabled: {
      backgroundColor: "#9C7C77",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "not-allowed",
      opacity: 0.6,
      width: "100%",
      padding: "12px",
      fontSize: "16px",
    },
  };

  useEffect(() => {
    if (!token || !email) {
      setError("Enlace invalido");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const response = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMensaje(data.mensaje);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.mensaje);
      }
    } catch (err) {
      setError("Error de conexion");
    } finally {
      setCargando(false);
    }
  };

  if (error && !token) {
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
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            borderTop: `5px solid #DFD777`,
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h2 style={{ color: "#3D0026", marginBottom: "20px" }}>
            Enlace invalido
          </h2>
          <Link
            to="/forgot-password"
            style={{
              color: "#7C6406",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

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
              Nueva contraseña
            </h2>
            <p style={{ color: "#9C7C77", fontSize: "14px" }}>
              Ingresa tu nueva contraseña
            </p>
          </div>

          {mensaje && (
            <div
              style={{
                backgroundColor: "#DFD777",
                color: "#3D0026",
                padding: "12px 15px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {mensaje}
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: "#9C7C77",
                color: "white",
                padding: "12px 15px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#3D0026",
                  fontSize: "14px",
                }}
              >
                Nueva contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={cargando}
              style={cargando ? buttonStyles.disabled : buttonStyles.primary}
              onMouseEnter={(e) => {
                if (!cargando)
                  e.currentTarget.style.backgroundColor = "#C9BE5E";
              }}
              onMouseLeave={(e) => {
                if (!cargando)
                  e.currentTarget.style.backgroundColor = "#DFD777";
              }}
            >
              {cargando ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <Link
              to="/login"
              style={{
                color: "#7C6406",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
            >
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
