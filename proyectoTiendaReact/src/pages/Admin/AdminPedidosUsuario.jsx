import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { authFetch } from "../authFetch";
function AdminPedidosUsuario() {
  const { id } = useParams();
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    cargarPedidosUsuario();
  }, [id]);

  const cargarPedidosUsuario = async () => {
    setLoading(true);
    setError("");

    try {
      const resUsuario = await authFetch(`/admin/usuarios/${id}`, {
        method: "GET",
      });

      const dataUsuario = await resUsuario.json();

      if (dataUsuario.success) {
        setUsuario(dataUsuario.usuario);
      }

      const resPedidos = await authFetch(`/admin/pedidos/usuario/${id}`, {
        method: "GET",
      });

      const data = await resPedidos.json();

      if (data.success) {
        setPedidos(data.pedidos);
      } else {
        setError(data.mensaje || "Error al cargar los pedidos");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const verDetallePedido = (pedidoId) => {
    navigate(`/admin/pedidos/${pedidoId}`);
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

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#E5DDE2",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#3D0026" }}>Cargando pedidos del usuario...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "25px" }}>
          <Link
            to="/admin/usuarios"
            style={{
              color: "#7C6406",
              textDecoration: "none",
              fontSize: "16px",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
          >
            ← Volver a Usuarios
          </Link>
        </div>

        {/* Información del usuario */}
        {usuario && (
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderTop: `4px solid #DFD777`,
            }}
          >
            <h2 style={{ margin: "0 0 15px 0", color: "#3D0026" }}>
              Pedidos de: {usuario.Nombre_completo || "Usuario"}
            </h2>
            <p style={{ margin: "8px 0", color: "#3D0026" }}>
              <strong>Email:</strong> {usuario.Email || "—"}
            </p>
            <p style={{ margin: "8px 0", color: "#3D0026" }}>
              <strong>Rol:</strong>{" "}
              <span
                style={{
                  backgroundColor:
                    usuario.Rol === "ADMIN" ? "#DFD777" : "#3D0026",
                  color: usuario.Rol === "ADMIN" ? "#3D0026" : "white",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {usuario.Rol || "USER"}
              </span>
            </p>
            <p style={{ margin: "8px 0", color: "#3D0026" }}>
              <strong>Estado:</strong>{" "}
              <span
                style={{
                  backgroundColor: usuario.Activo === 1 ? "#DFD777" : "#9C7C77",
                  color: usuario.Activo === 1 ? "#3D0026" : "white",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {usuario.Activo === 1 ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>
        )}

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

        {pedidos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 40px",
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ color: "#9C7C77", margin: 0 }}>
              Este usuario no ha realizado ningun pedido aun.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#3D0026", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    ID Pedido
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
                {pedidos.map((pedido, index) => {
                  const estadoColor = getEstadoColor(pedido.Estado);
                  return (
                    <tr
                      key={pedido.ID_pedido}
                      style={{
                        borderBottom: `1px solid #E5DDE2`,
                        backgroundColor: index % 2 === 0 ? "white" : "#F5F0F3",
                      }}
                    >
                      <td style={{ padding: "12px", color: "#3D0026" }}>
                        #{pedido.ID_pedido}
                      </td>
                      <td style={{ padding: "12px", color: "#3D0026" }}>
                        {new Date(pedido.Fecha_pedido).toLocaleDateString()}
                        <div style={{ fontSize: "11px", color: "#9C7C77" }}>
                          {new Date(pedido.Fecha_pedido).toLocaleTimeString()}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "#3D0026",
                        }}
                      >
                        {parseFloat(pedido.Importe_total).toFixed(2)} €
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            backgroundColor: estadoColor.bg,
                            color: estadoColor.text,
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {pedido.Estado}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => verDetallePedido(pedido.ID_pedido)}
                          style={{
                            ...buttonStyles.info,
                            padding: "6px 14px",
                            fontSize: "12px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#6B5505")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#7C6406")
                          }
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPedidosUsuario;
