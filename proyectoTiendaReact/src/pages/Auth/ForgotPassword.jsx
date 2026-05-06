import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();
      setMensaje(data.mensaje);

      if (data.reset_link) {
        console.log("Enlace de recuperacion:", data.reset_link);
      }
    } catch (err) {
      setError("Error de conexion");
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
              ¿Olvidaste tu contraseña?
            </h2>
            <p style={{ color: "#9C7C77", fontSize: "14px" }}>
              Ingresa tu email y te enviaremos un enlace para recuperarla
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
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {cargando ? "Enviando..." : "Enviar enlace"}
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

export default ForgotPassword;
