import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroUsuario, setFiltroUsuario] = useState("TODOS");
  const [filtroFecha, setFiltroFecha] = useState("");

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
    cargarPedidos();
    cargarUsuarios();
  }, []);

  const cargarPedidos = async () => {
    setCargando(true);
    setError("");

    try {
      const response = await fetch(
        "https://proyectotienda-m8um.onrender.com/api/admin/pedidos",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setPedidos(data.pedidos);
      } else {
        setError(data.mensaje || "Error al cargar pedidos");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch(
        "https://proyectotienda-m8um.onrender.com/api/admin/usuarios",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setUsuarios(data.usuarios);
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    const confirmacion = window.confirm(
      `¿Estas seguro de que quieres cambiar el estado del pedido #${pedidoId} a "${nuevoEstado}"?`,
    );

    if (!confirmacion) return;

    try {
      const response = await fetch(
        `https://proyectotienda-m8um.onrender.com/api/admin/pedidos/${pedidoId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
          credentials: "include",
        },
      );

      if (response.status === 401) {
        alert("Sesion expirada. Por favor, inicia sesion nuevamente.");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMensajeExito(`Pedido #${pedidoId} actualizado a ${nuevoEstado}`);
        cargarPedidos();
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        setError(data.mensaje || "Error al actualizar estado");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      PENDIENTE: { bg: "#7C6406", text: "white" },
      CONFIRMADO: { bg: "#DFD777", text: "#3D0026" },
      ENVIADO: { bg: "#3D0026", text: "white" },
      ENTREGADO: { bg: "#DFD777", text: "#3D0026" },
      CANCELADO: { bg: "#9C7C77", text: "white" },
    };
    return colores[estado] || { bg: "#9C7C77", text: "white" };
  };

  const handleLogout = async () => {
    await fetch("https://proyectotienda-m8um.onrender.com/api/logout", {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/login");
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    let cumpleFiltro = true;

    const estadoPedido = pedido.Estado?.trim().toUpperCase();
    const estadoFiltro = filtroEstado?.trim().toUpperCase();

    if (filtroEstado !== "TODOS" && estadoPedido !== estadoFiltro) {
      cumpleFiltro = false;
    }

    if (
      filtroUsuario !== "TODOS" &&
      pedido.ID_usuario !== parseInt(filtroUsuario)
    ) {
      cumpleFiltro = false;
    }

    if (filtroFecha) {
      const fechaPedido = new Date(pedido.Fecha_pedido).toDateString();
      const fechaFiltro = new Date(filtroFecha).toDateString();
      if (fechaPedido !== fechaFiltro) {
        cumpleFiltro = false;
      }
    }

    return cumpleFiltro;
  });

  const estadosDisponibles = [
    "TODOS",
    "PENDIENTE",
    "CONFIRMADO",
    "ENVIADO",
    "ENTREGADO",
    "CANCELADO",
  ];

  if (cargando) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
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
                    color: "white",
                    textDecoration: "none",
                    display: "block",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#7C6406",
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
                    color: "#3D0026",
                    textDecoration: "none",
                    display: "block",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#DFD777",
                    fontWeight: "bold",
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
          >
            Cerrar Sesion
          </button>
        </div>
        <div
          style={{
            marginLeft: "260px",
            padding: "20px",
            minHeight: "100vh",
            backgroundColor: "#E5DDE2",
            width: "100%",
          }}
        >
          <p style={{ color: "#3D0026" }}>Cargando pedidos...</p>
        </div>
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
                  color: "white",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#7C6406",
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
                  color: "#3D0026",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#DFD777",
                  fontWeight: "bold",
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
          backgroundColor: "#E5DDE2",
          width: "calc(100% - 280px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#3D0026",
              borderLeft: `4px solid #DFD777`,
              paddingLeft: "15px",
            }}
          >
            Gestion de Pedidos
          </h2>
        </div>

        {/* FILTROS */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            alignItems: "flex-end",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label
              style={{ fontSize: "12px", fontWeight: "bold", color: "#3D0026" }}
            >
              Estado:
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: `2px solid #E5DDE2`,
                backgroundColor: "white",
                color: "#3D0026",
                outline: "none",
              }}
            >
              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado === "TODOS" ? "Todos" : estado}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label
              style={{ fontSize: "12px", fontWeight: "bold", color: "#3D0026" }}
            >
              Usuario:
            </label>
            <select
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: `2px solid #E5DDE2`,
                backgroundColor: "white",
                color: "#3D0026",
                minWidth: "180px",
                outline: "none",
              }}
            >
              <option value="TODOS">Todos los usuarios</option>
              {usuarios.map((user) => (
                <option key={user.ID_usuario} value={user.ID_usuario}>
                  #{user.ID_usuario} - {user.Nombre_completo || "Usuario"}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label
              style={{ fontSize: "12px", fontWeight: "bold", color: "#3D0026" }}
            >
              Fecha:
            </label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: `2px solid #E5DDE2`,
                backgroundColor: "white",
                color: "#3D0026",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={() => {
              setFiltroEstado("TODOS");
              setFiltroUsuario("TODOS");
              setFiltroFecha("");
            }}
            style={{ ...buttonStyles.warning, padding: "8px 20px" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#6B5505")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#7C6406")
            }
          >
            Limpiar filtros
          </button>
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

        {pedidosFiltrados.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "15px",
            }}
          >
            <p style={{ color: "#9C7C77" }}>
              No hay pedidos que coincidan con los filtros seleccionados.
            </p>
          </div>
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
                    Usuario
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Fecha</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Total</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>
                    Estado
                  </th>
                  <th style={{ padding: "12px", textAlign: "center" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido, index) => {
                  const usuarioPedido = usuarios.find(
                    (u) => u.ID_usuario === pedido.ID_usuario,
                  );
                  const estadoColor = getEstadoColor(pedido.Estado);
                  return (
                    <tr
                      key={pedido.ID_pedido}
                      style={{
                        borderBottom: `1px solid #E5DDE2`,
                        backgroundColor: index % 2 === 0 ? "white" : "#F5F0F3",
                      }}
                    >
                      <td style={{ padding: "10px", color: "#3D0026" }}>
                        #{pedido.ID_pedido}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ color: "#3D0026" }}>
                          {usuarioPedido?.Nombre_completo ||
                            `Usuario #${pedido.ID_usuario}`}
                        </span>
                        <div style={{ fontSize: "11px", color: "#9C7C77" }}>
                          ID: {pedido.ID_usuario}
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ color: "#3D0026" }}>
                          {new Date(pedido.Fecha_pedido).toLocaleDateString()}
                        </span>
                        <div style={{ fontSize: "11px", color: "#9C7C77" }}>
                          {new Date(pedido.Fecha_pedido).toLocaleTimeString()}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "#3D0026",
                        }}
                      >
                        {parseFloat(pedido.Importe_total).toFixed(2)} €
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <select
                          value={pedido.Estado}
                          onChange={(e) =>
                            actualizarEstado(pedido.ID_pedido, e.target.value)
                          }
                          style={{
                            backgroundColor: estadoColor.bg,
                            color: estadoColor.text,
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                            outline: "none",
                          }}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="CONFIRMADO">Confirmado</option>
                          <option value="ENVIADO">Enviado</option>
                          <option value="ENTREGADO">Entregado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <Link
                          to={`/admin/pedidos/${pedido.ID_pedido}`}
                          style={{
                            ...buttonStyles.info,
                            padding: "6px 14px",
                            fontSize: "12px",
                            textDecoration: "none",
                            display: "inline-block",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#6B5505")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#7C6406")
                          }
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          <p style={{ color: "#3D0026" }}>
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPedidos;
