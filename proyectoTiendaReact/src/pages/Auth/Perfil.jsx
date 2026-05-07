import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoEmpresa from "/Tienda_logo.png";
import { authFetch } from "../../context/authFetch";
export default function Perfil() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    activo: false,
    twofa: false,
  });
  const [direcciones, setDirecciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarFormDireccion, setMostrarFormDireccion] = useState(false);
  const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const [passwordData, setPasswordData] = useState({
    password_actual: "",
    password_nueva: "",
    password_nueva_confirmation: "",
  });
  const [nuevaDireccion, setNuevaDireccion] = useState({
    direccion: "",
    codigoPostal: "",
    ciudad: "",
    provincia: "",
    facturacion: false,
  });
  const navigate = useNavigate();
  const { isLoggedIn, esAdmin, logout } = useAuth();

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
    danger: {
      backgroundColor: "#9C7C77",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    accent: {
      backgroundColor: "#7C6406",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    success: {
      backgroundColor: "#DFD777",
      color: "#3D0026",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
    warning: {
      backgroundColor: "#DFD777",
      color: "#3D0026",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
    info: {
      backgroundColor: "#7C6406",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  };

  useEffect(() => {
    fetchUsuario();
    fetchDirecciones();
  }, []);

  const handleLogout = async () => {
    await fetch("https://proyectotienda-m8um.onrender.com/api/logout", {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/login");
  };

  const fetchUsuario = async () => {
    const res = await authFetch("/perfil", {
      method: "GET",
    });

    const data = await res.json();
    console.log(data);
    if (data.success) {
      setUsuario(data.usuario);
      console.log(data.usuario);
    } else setMensaje(data.mensaje);
  };

  const fetchDirecciones = async () => {
    const res = await authFetch("/direcciones", {
      method: "GET",
    });

    const data = await res.json();
    if (data.success) {
      setDirecciones(data.direcciones);
    }
  };

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await authFetch("/perfil", {
      method: "PUT",
      body: JSON.stringify({
        nombre: usuario.nombre,
        email: usuario.email,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMensaje(data.mensaje);
      setModoEdicion(false);
      setTimeout(() => setMensaje(""), 3000);
    } else {
      setError(data.mensaje);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (
      passwordData.password_nueva !== passwordData.password_nueva_confirmation
    ) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordData.password_nueva.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    const res = await authFetch("/cambiar-password", {
      method: "POST",
      body: JSON.stringify({
        password_actual: passwordData.password_actual,
        password_nueva: passwordData.password_nueva,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMensaje(data.mensaje);
      setMostrarCambioPassword(false);
      setPasswordData({
        password_actual: "",
        password_nueva: "",
        password_nueva_confirmation: "",
      });
      setTimeout(() => setMensaje(""), 3000);
    } else {
      setError(data.mensaje);
    }
  };

  const handleDireccionChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setNuevaDireccion({
      ...nuevaDireccion,
      [e.target.name]: value,
    });
  };

  const handleEditarDireccion = (direccion) => {
    setDireccionEditando(direccion);
    setNuevaDireccion({
      id: direccion.id,
      direccion: direccion.direccion,
      codigoPostal: direccion.codigoPostal,
      ciudad: direccion.ciudad,
      provincia: direccion.provincia,
      facturacion:
        direccion.facturacion === 1 || direccion.facturacion === true,
    });
    setMostrarFormDireccion(true);
  };

  const guardarDireccion = async (e) => {
    e.preventDefault();
    setError("");
    const bodyData = direccionEditando
      ? { id: direccionEditando.id, ...nuevaDireccion }
      : nuevaDireccion;
    const method = direccionEditando ? "PUT" : "POST";
    const res = await authFetch("/direcciones", {
      method: method,
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();
    if (data.success) {
      setMensaje(data.mensaje);
      setMostrarFormDireccion(false);
      setDireccionEditando(null);
      setNuevaDireccion({
        direccion: "",
        codigoPostal: "",
        ciudad: "",
        provincia: "",
        facturacion: false,
      });
      fetchDirecciones();
      setTimeout(() => setMensaje(""), 3000);
    } else {
      setError(data.mensaje);
    }
  };

  const eliminarDireccion = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;
    const res = await authFetch(`/direcciones/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) {
      setMensaje(data.mensaje);
      fetchDirecciones();
      setTimeout(() => setMensaje(""), 3000);
    } else {
      setError(data.mensaje);
    }
  };

  const direccionFacturacion = direcciones.find(
    (d) => d.facturacion === 1 || d.facturacion === true,
  );
  const otrasDirecciones = direcciones.filter(
    (d) => !(d.facturacion === 1 || d.facturacion === true),
  );

  const eliminarMiCuenta = async () => {
    const confirmar = confirm(
      "¿Estás seguro de eliminar tu cuenta?\n\n" +
        "Esta acción es irreversible según el RGPD.\n" +
        "Todos tus datos personales serán anonimizados.\n" +
        "Tus pedidos se conservarán con fines estadísticos pero no podrán asociarse a ti.",
    );

    if (!confirmar) return;

    try {
      const res = await authFetch("/perfil", {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert(data.mensaje);
        navigate("/login");
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert("Error al eliminar la cuenta");
    }
  };

  const volver = () => {
    navigate("/productos");
  };

  const irMisPedidos = () => {
    navigate("/mis-pedidos");
  };

  return (
    <div style={{ backgroundColor: "#E5DDE2", minHeight: "100vh" }}>
      {/* HEADER con logo y navegación */}
      <div
        style={{
          backgroundColor: "white",
          padding: "15px 30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderBottom: `2px solid #DFD777`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          {/* Logo y nombre */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src={logoEmpresa}
              alt="Logo Tienda"
              style={{ height: "45px", width: "auto", marginRight: "12px" }}
            />
            <span
              style={{ fontWeight: "bold", fontSize: "20px", color: "#3D0026" }}
            >
              Accesorios hechos a mano
            </span>
          </Link>

          {/* Botones de navegación */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to="/productos"
              style={{
                ...buttonStyles.accent,
                padding: "8px 20px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Productos
            </Link>
            <Link
              to="/carrito"
              style={{
                ...buttonStyles.accent,
                padding: "8px 20px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Carrito
            </Link>
            {esAdmin && (
              <Link
                to="/admin"
                style={{
                  ...buttonStyles.secondary,
                  padding: "8px 20px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Panel Admin
              </Link>
            )}
            <Link
              to="/perfil"
              style={{
                ...buttonStyles.primary,
                padding: "8px 20px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Mi Perfil
            </Link>
            <button
              onClick={handleLogout}
              style={{
                ...buttonStyles.danger,
                padding: "8px 20px",
                fontSize: "14px",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
              paddingBottom: "15px",
              borderBottom: `3px solid #DFD777`,
            }}
          >
            <h1 style={{ color: "#3D0026" }}>Mi Perfil</h1>
            <button
              onClick={irMisPedidos}
              style={{
                ...buttonStyles.info,
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B5505")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C6406")
              }
            >
              Mis pedidos
            </button>
          </div>

          {/* Mensajes */}
          {mensaje && (
            <div
              style={{
                backgroundColor: "#DFD777",
                color: "#3D0026",
                padding: "12px 20px",
                borderRadius: "10px",
                marginBottom: "20px",
                borderLeft: `4px solid #3D0026`,
                fontWeight: "500",
              }}
            >
              ¡Éxito! {mensaje}
            </div>
          )}
          {error && (
            <div
              style={{
                backgroundColor: "#9C7C77",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
                marginBottom: "20px",
                borderLeft: `4px solid #3D0026`,
              }}
            >
              Error: {error}
            </div>
          )}

          {/* Datos personales */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "25px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                paddingBottom: "10px",
                borderBottom: `2px solid #E5DDE2`,
                color: "#3D0026",
              }}
            >
              Datos personales
            </h3>

            {!modoEdicion ? (
              <div>
                <p style={{ margin: "10px 0", color: "#3D0026" }}>
                  <strong>Nombre:</strong> {usuario.nombre}
                </p>
                <p style={{ margin: "10px 0", color: "#3D0026" }}>
                  <strong>Email:</strong> {usuario.email}
                </p>
                <button
                  onClick={() => setModoEdicion(true)}
                  style={{
                    ...buttonStyles.warning,
                    padding: "8px 20px",
                    marginTop: "10px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#C9BE5E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#DFD777")
                  }
                >
                  Editar perfil
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={usuario.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{ ...buttonStyles.primary, padding: "10px 20px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#C9BE5E")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#DFD777")
                    }
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoEdicion(false)}
                    style={{ ...buttonStyles.danger, padding: "10px 20px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#8B6B66")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#9C7C77")
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Cambiar contraseña */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "25px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                paddingBottom: "10px",
                borderBottom: `2px solid #E5DDE2`,
                color: "#3D0026",
              }}
            >
              Cambiar contraseña
            </h3>

            {!mostrarCambioPassword ? (
              <button
                onClick={() => setMostrarCambioPassword(true)}
                style={{ ...buttonStyles.info, padding: "10px 20px" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6B5505")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7C6406")
                }
              >
                Cambiar contraseña
              </button>
            ) : (
              <form onSubmit={handleCambiarPassword}>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Contraseña actual:
                  </label>
                  <input
                    type="password"
                    name="password_actual"
                    value={passwordData.password_actual}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Nueva contraseña:
                  </label>
                  <input
                    type="password"
                    name="password_nueva"
                    value={passwordData.password_nueva}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                  <small style={{ color: "#9C7C77" }}>
                    Mínimo 6 caracteres
                  </small>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Confirmar nueva contraseña:
                  </label>
                  <input
                    type="password"
                    name="password_nueva_confirmation"
                    value={passwordData.password_nueva_confirmation}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{ ...buttonStyles.primary, padding: "10px 20px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#C9BE5E")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#DFD777")
                    }
                  >
                    Cambiar contraseña
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarCambioPassword(false);
                      setPasswordData({
                        password_actual: "",
                        password_nueva: "",
                        password_nueva_confirmation: "",
                      });
                    }}
                    style={{ ...buttonStyles.danger, padding: "10px 20px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#8B6B66")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#9C7C77")
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Dirección de facturación */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "25px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                paddingBottom: "10px",
                borderBottom: `2px solid #E5DDE2`,
                color: "#3D0026",
              }}
            >
              Dirección de facturación
            </h3>

            {direccionFacturacion ? (
              <div>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Dirección:</strong> {direccionFacturacion.direccion}
                </p>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Código Postal:</strong>{" "}
                  {direccionFacturacion.codigoPostal}
                </p>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Ciudad:</strong> {direccionFacturacion.ciudad}
                </p>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Provincia:</strong> {direccionFacturacion.provincia}
                </p>
                <button
                  onClick={() => handleEditarDireccion(direccionFacturacion)}
                  style={{
                    ...buttonStyles.warning,
                    padding: "8px 20px",
                    marginTop: "10px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#C9BE5E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#DFD777")
                  }
                >
                  Editar
                </button>
              </div>
            ) : (
              <p style={{ color: "#9C7C77" }}>
                No hay dirección de facturación configurada.
              </p>
            )}
          </div>

          {/* Otras direcciones */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "25px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                paddingBottom: "10px",
                borderBottom: `2px solid #E5DDE2`,
                color: "#3D0026",
              }}
            >
              Otras direcciones de envío
            </h3>

            {otrasDirecciones.length === 0 ? (
              <p style={{ color: "#9C7C77" }}>
                No hay otras direcciones guardadas.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {otrasDirecciones.map((dir) => (
                  <div
                    key={dir.id}
                    style={{
                      border: `1px solid #E5DDE2`,
                      borderRadius: "10px",
                      padding: "15px",
                      backgroundColor: "#FAFAFA",
                    }}
                  >
                    <p style={{ margin: "5px 0", color: "#3D0026" }}>
                      <strong>Dirección:</strong> {dir.direccion}
                    </p>
                    <p style={{ margin: "5px 0", color: "#3D0026" }}>
                      <strong>Código Postal:</strong> {dir.codigoPostal}
                    </p>
                    <p style={{ margin: "5px 0", color: "#3D0026" }}>
                      <strong>Ciudad:</strong> {dir.ciudad}
                    </p>
                    <p style={{ margin: "5px 0", color: "#3D0026" }}>
                      <strong>Provincia:</strong> {dir.provincia}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        onClick={() => handleEditarDireccion(dir)}
                        style={{
                          ...buttonStyles.warning,
                          padding: "6px 12px",
                          fontSize: "13px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#C9BE5E")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#DFD777")
                        }
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarDireccion(dir.id)}
                        style={{
                          ...buttonStyles.danger,
                          padding: "6px 12px",
                          fontSize: "13px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#8B6B66")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#9C7C77")
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Añadir nueva dirección */}
          {!mostrarFormDireccion && (
            <button
              onClick={() => setMostrarFormDireccion(true)}
              style={{
                ...buttonStyles.primary,
                padding: "12px 24px",
                marginBottom: "30px",
                width: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#C9BE5E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#DFD777")
              }
            >
              Añadir nueva dirección
            </button>
          )}

          {/* Formulario de dirección */}
          {mostrarFormDireccion && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "25px",
                marginBottom: "30px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "0 0 20px 0", color: "#3D0026" }}>
                {direccionEditando ? "Editar dirección" : "Nueva dirección"}
              </h3>
              <form onSubmit={guardarDireccion}>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Dirección:
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={nuevaDireccion.direccion}
                    onChange={handleDireccionChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Código Postal:
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={nuevaDireccion.codigoPostal}
                    onChange={handleDireccionChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Ciudad:
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={nuevaDireccion.ciudad}
                    onChange={handleDireccionChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    Provincia:
                  </label>
                  <input
                    type="text"
                    name="provincia"
                    value={nuevaDireccion.provincia}
                    onChange={handleDireccionChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid #E5DDE2`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ color: "#3D0026", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      name="facturacion"
                      checked={nuevaDireccion.facturacion}
                      onChange={handleDireccionChange}
                      style={{ marginRight: "8px", cursor: "pointer" }}
                    />
                    Usar como dirección de facturación
                  </label>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{ ...buttonStyles.primary, padding: "10px 20px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#C9BE5E")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#DFD777")
                    }
                  >
                    Guardar dirección
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormDireccion(false);
                      setDireccionEditando(null);
                      setNuevaDireccion({
                        direccion: "",
                        codigoPostal: "",
                        ciudad: "",
                        provincia: "",
                        facturacion: false,
                      });
                    }}
                    style={{ ...buttonStyles.danger, padding: "10px 20px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#8B6B66")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#9C7C77")
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Botones de acción finales */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: `2px solid #DFD777`,
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <button
              onClick={volver}
              style={{
                ...buttonStyles.accent,
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B5505")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C6406")
              }
            >
              ← Volver a productos
            </button>

            <button
              onClick={eliminarMiCuenta}
              style={{
                ...buttonStyles.danger,
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#8B6B66")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#9C7C77")
              }
            >
              Eliminar mi cuenta (RGPD)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
