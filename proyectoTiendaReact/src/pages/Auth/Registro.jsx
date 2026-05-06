import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombre_completo, setNombreCompleto] = useState("");
  const [aceptaPolitica, setAceptaPolitica] = useState(false);

  const [errores, setErrores] = useState({
    email: "",
    contrasena: "",
    nombre: "",
    politica: "",
  });

  const navigate = useNavigate();

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
      padding: "14px",
      fontSize: "16px",
    },
    disabled: {
      backgroundColor: "#9C7C77",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "not-allowed",
      fontWeight: "bold",
      opacity: 0.6,
      width: "100%",
      padding: "14px",
      fontSize: "16px",
    },
  };

  const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validarContrasena = (pass) => {
    const tieneMin8 = pass.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(pass);
    const tieneNumero = /\d/.test(pass);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    return {
      valida: tieneMin8 && tieneMayuscula && tieneNumero && tieneEspecial,
      tieneMin8,
      tieneMayuscula,
      tieneNumero,
      tieneEspecial,
    };
  };

  const validarNombre = (nombre) => {
    return nombre.trim().length > 0;
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUsuario(email);

    if (email && !validarEmail(email)) {
      setErrores((prev) => ({
        ...prev,
        email: "Formato de email invalido (ej: usuario@dominio.com)",
      }));
    } else {
      setErrores((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleContrasenaChange = (e) => {
    const pass = e.target.value;
    setContrasena(pass);

    if (pass) {
      const validacion = validarContrasena(pass);
      if (!validacion.valida) {
        let mensaje = "La contrasena debe tener: ";
        const requisitos = [];
        if (!validacion.tieneMin8) requisitos.push("minimo 8 caracteres");
        if (!validacion.tieneMayuscula) requisitos.push("1 mayuscula");
        if (!validacion.tieneNumero) requisitos.push("1 numero");
        if (!validacion.tieneEspecial)
          requisitos.push("1 caracter especial (!@#$%^&*)");
        setErrores((prev) => ({
          ...prev,
          contrasena: mensaje + requisitos.join(", "),
        }));
      } else {
        setErrores((prev) => ({ ...prev, contrasena: "" }));
      }
    } else {
      setErrores((prev) => ({ ...prev, contrasena: "" }));
    }
  };

  const handleNombreChange = (e) => {
    const nombre = e.target.value;
    setNombreCompleto(nombre);

    if (nombre && !validarNombre(nombre)) {
      setErrores((prev) => ({
        ...prev,
        nombre: "El nombre completo es obligatorio",
      }));
    } else {
      setErrores((prev) => ({ ...prev, nombre: "" }));
    }
  };

  const handlePoliticaChange = (e) => {
    const acepta = e.target.checked;
    setAceptaPolitica(acepta);

    if (acepta) {
      setErrores((prev) => ({ ...prev, politica: "" }));
    }
  };

  const esFormularioValido = () => {
    return (
      validarEmail(usuario) &&
      validarContrasena(contrasena).valida &&
      validarNombre(nombre_completo) &&
      aceptaPolitica
    );
  };

  const registro = async (e) => {
    e.preventDefault();

    if (!esFormularioValido()) {
      if (!aceptaPolitica) {
        setErrores((prev) => ({
          ...prev,
          politica: "Debes aceptar la politica de privacidad",
        }));
      }
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario,
          contrasena,
          nombre_completo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.mensaje || "Error");
        return;
      }
      if (data.success) {
        alert("Usuario creado exitosamente");
        navigate("/login");
      }
    } catch (err) {
      console.error("ERROR REAL:", err);
      alert("Error al crear el usuario");
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
      <div style={{ maxWidth: "500px", width: "100%", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px 35px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            borderTop: "5px solid #DFD777",
          }}
        >
          <h2
            style={{
              color: "#3D0026",
              textAlign: "center",
              marginBottom: "10px",
              fontSize: "28px",
            }}
          >
            Registro de usuarios
          </h2>
          <p
            style={{
              color: "#9C7C77",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "14px",
            }}
          >
            Completa el formulario para crear tu cuenta
          </p>

          <form onSubmit={registro}>
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
                Email
              </label>
              <input
                type="email"
                value={usuario}
                onChange={handleEmailChange}
                placeholder="usuario@ejemplo.com"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: `2px solid ${errores.email ? "#9C7C77" : "#E5DDE2"}`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!errores.email)
                    e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  if (!errores.email)
                    e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errores.email && (
                <span
                  style={{
                    color: "#9C7C77",
                    fontSize: "12px",
                    marginTop: "5px",
                    display: "block",
                  }}
                >
                  {errores.email}
                </span>
              )}
            </div>

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
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={handleContrasenaChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: `2px solid ${errores.contrasena ? "#9C7C77" : "#E5DDE2"}`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!errores.contrasena)
                    e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  if (!errores.contrasena)
                    e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errores.contrasena && (
                <span
                  style={{
                    color: "#9C7C77",
                    fontSize: "12px",
                    marginTop: "5px",
                    display: "block",
                  }}
                >
                  {errores.contrasena}
                </span>
              )}
            </div>

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
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre_completo}
                onChange={handleNombreChange}
                placeholder="Tu nombre completo"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: `2px solid ${errores.nombre ? "#9C7C77" : "#E5DDE2"}`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!errores.nombre)
                    e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  if (!errores.nombre)
                    e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errores.nombre && (
                <span
                  style={{
                    color: "#9C7C77",
                    fontSize: "12px",
                    marginTop: "5px",
                    display: "block",
                  }}
                >
                  {errores.nombre}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={aceptaPolitica}
                  onChange={handlePoliticaChange}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                    cursor: "pointer",
                    accentColor: "#DFD777",
                  }}
                />
                <span style={{ color: "#3D0026", fontSize: "14px" }}>
                  Acepto la{" "}
                  <a
                    href="/politica-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#7C6406", textDecoration: "none" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#3D0026")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#7C6406")
                    }
                  >
                    Politica de Privacidad
                  </a>
                </span>
              </label>
              {errores.politica && (
                <div
                  style={{
                    color: "#9C7C77",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errores.politica}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!esFormularioValido()}
              style={
                esFormularioValido()
                  ? buttonStyles.primary
                  : buttonStyles.disabled
              }
              onMouseEnter={(e) => {
                if (esFormularioValido())
                  e.currentTarget.style.backgroundColor = "#C9BE5E";
              }}
              onMouseLeave={(e) => {
                if (esFormularioValido())
                  e.currentTarget.style.backgroundColor = "#DFD777";
              }}
            >
              Registrarse
            </button>
          </form>

          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
              paddingTop: "20px",
              borderTop: "1px solid #E5DDE2",
            }}
          >
            <p
              style={{ color: "#9C7C77", marginBottom: "0", fontSize: "14px" }}
            >
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                style={{
                  color: "#7C6406",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Inicia sesion aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
