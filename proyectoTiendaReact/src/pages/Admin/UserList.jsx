import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../context/authFetch";
const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const buttonStyles = {
    primary: {
      backgroundColor: "#DFD777",
      color: "#3D0026",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
    secondary: {
      backgroundColor: "#3D0026",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    danger: {
      backgroundColor: "#9C7C77",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    warning: {
      backgroundColor: "#7C6406",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    info: {
      backgroundColor: "#7C6406",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    setError("");

    try {
      const response = await authFetch("/admin/usuarios", {
        method: "GET",
      });

      const data = await response.json();

      if (data.success) {
        setUsuarios(data.usuarios);
      } else {
        setError(data.mensaje || "Error al cargar usuarios");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstadoUsuario = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? "activar" : "desactivar";

    if (
      !window.confirm(`¿Estas seguro de que quieres ${accion} este usuario?`)
    ) {
      return;
    }

    try {
      const response = await authFetch(`/admin/usuarios/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      const data = await response.json();

      if (data.success) {
        setMensajeExito(`Usuario ${accion}do correctamente`);
        cargarUsuarios();
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        setError(data.mensaje || "Error al cambiar estado");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
      setTimeout(() => setError(""), 3000);
    }
  };

  const eliminarCuenta = async (id, nombreUsuario) => {
    const confirmacion = window.confirm(
      `¡ATENCION! Vas a eliminar la cuenta de "${nombreUsuario}".\n\n` +
        `Esta accion:\n` +
        `- Anonimizara todos sus datos personales\n` +
        `- No podra volver a iniciar sesion\n` +
        `- Sus pedidos se conservaran para fines contables\n\n` +
        `¿Estas seguro de que quieres continuar?`,
    );

    if (!confirmacion) return;

    try {
      const response = await authFetch(`/admin/usuarios/${id}/eliminar`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setMensajeExito(`Cuenta de usuario eliminada correctamente`);
        cargarUsuarios();
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        setError(data.mensaje || "Error al eliminar la cuenta");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = async () => {
    await fetch("https://proyectotienda-m8um.onrender.com/api/logout", {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/login");
  };

  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ color: "#3D0026" }}>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          backgroundColor: "#3D0026",
          color: "white",
          padding: "20px",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 100,
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            fontSize: "20px",
            textAlign: "center",
            color: "#DFD777",
          }}
        >
          Panel Admin
        </h2>
        <p
          style={{
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
            color: "#E5DDE2",
          }}
        >
          {usuario?.nombre || usuario?.usuario || "Admin"}
        </p>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#7C6406",
                }}
              >
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/usuarios"
                style={{
                  color: "#3D0026",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#DFD777",
                  fontWeight: "bold",
                }}
              >
                Usuarios
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/productos"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#7C6406",
                }}
              >
                Productos
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/pedidos"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#7C6406",
                }}
              >
                Pedidos
              </Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            ...buttonStyles.danger,
            marginTop: "30px",
            padding: "10px",
            width: "100%",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#8B6B66")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#9C7C77")
          }
        >
          Cerrar Sesion
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div
        style={{
          marginLeft: "280px",
          padding: "20px",
          minHeight: "100vh",
          overflowX: "auto",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#3D0026",
              borderLeft: `4px solid #DFD777`,
              paddingLeft: "15px",
            }}
          >
            Gestion de Usuarios
          </h2>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#9C7C77",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {mensajeExito && (
          <div
            style={{
              backgroundColor: "#DFD777",
              color: "#3D0026",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {mensajeExito}
          </div>
        )}

        {usuarios.length === 0 ? (
          <p style={{ color: "#9C7C77" }}>No hay usuarios registrados.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#3D0026", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Nombre Completo
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Rol</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Estado</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Fecha Registro
                  </th>
                  <th style={{ padding: "12px", textAlign: "center" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user, index) => (
                  <tr
                    key={user.ID_usuario}
                    style={{
                      borderBottom: `1px solid #E5DDE2`,
                      backgroundColor: index % 2 === 0 ? "white" : "#F5F0F3",
                      opacity: user.Activo === 0 ? 0.7 : 1,
                    }}
                  >
                    <td style={{ padding: "10px", color: "#3D0026" }}>
                      {user.ID_usuario}
                    </td>
                    <td style={{ padding: "10px", color: "#3D0026" }}>
                      {user.Nombre_completo || (
                        <span style={{ color: "#9C7C77", fontStyle: "italic" }}>
                          Usuario eliminado
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px", color: "#3D0026" }}>
                      {user.Email || (
                        <span style={{ color: "#9C7C77", fontStyle: "italic" }}>
                          Email eliminado
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          backgroundColor:
                            user.Rol === "ADMIN" ? "#DFD777" : "#3D0026",
                          color: user.Rol === "ADMIN" ? "#3D0026" : "white",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {user.Rol || "USER"}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          backgroundColor:
                            user.Activo === 1 ? "#DFD777" : "#9C7C77",
                          color: user.Activo === 1 ? "#3D0026" : "white",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {user.Activo === 1 ? "Activo" : "Inactivo"}
                      </span>
                      {user.Fecha_baja && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "10px",
                            color: "#9C7C77",
                            marginTop: "4px",
                          }}
                        >
                          Baja: {new Date(user.Fecha_baja).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px", color: "#7C6406" }}>
                      {user.Fecha_creacion
                        ? new Date(user.Fecha_creacion).toLocaleDateString()
                        : "—"}
                    </td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <button
                        onClick={() =>
                          cambiarEstadoUsuario(user.ID_usuario, user.Activo)
                        }
                        style={{
                          ...(user.Activo === 1
                            ? buttonStyles.warning
                            : buttonStyles.primary),
                          padding: "6px 12px",
                          fontSize: "12px",
                          marginRight: "8px",
                        }}
                        onMouseEnter={(e) => {
                          if (user.Activo === 1)
                            e.currentTarget.style.backgroundColor = "#6B5505";
                          else
                            e.currentTarget.style.backgroundColor = "#C9BE5E";
                        }}
                        onMouseLeave={(e) => {
                          if (user.Activo === 1)
                            e.currentTarget.style.backgroundColor = "#7C6406";
                          else
                            e.currentTarget.style.backgroundColor = "#DFD777";
                        }}
                        title={
                          user.Activo === 1
                            ? "Desactivar usuario"
                            : "Activar usuario"
                        }
                      >
                        {user.Activo === 1 ? "Desactivar" : "Activar"}
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/admin/usuarios/${user.ID_usuario}/pedidos`)
                        }
                        style={{
                          ...buttonStyles.info,
                          padding: "6px 12px",
                          fontSize: "12px",
                          marginRight: "8px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#6B5505")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#7C6406")
                        }
                        title="Ver pedidos del usuario"
                      >
                        Pedidos
                      </button>

                      {user.Nombre_completo && (
                        <button
                          onClick={() =>
                            eliminarCuenta(
                              user.ID_usuario,
                              user.Nombre_completo,
                            )
                          }
                          style={{
                            ...buttonStyles.danger,
                            padding: "6px 12px",
                            fontSize: "12px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#8B6B66")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#9C7C77")
                          }
                          title="Eliminar cuenta definitivamente"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          <p style={{ color: "#3D0026" }}>
            Total de usuarios: {usuarios.length}
          </p>
          <p style={{ fontSize: "12px", marginTop: "5px", color: "#9C7C77" }}>
            Los usuarios con nombre "Usuario eliminado" ya no pueden acceder al
            sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserList;
