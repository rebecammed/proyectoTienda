import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../context/authFetch";

function DetallePedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const buttonStyles = {
    secondary: {
      backgroundColor: "#3D0026",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      textDecoration: "none",
      display: "inline-block",
    },
  };

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  const fetchDetalle = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/pedidos/${id}`, {
        method: "GET",
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setPedido(data.pedido);
        setDireccion(data.direccion);
        setLineas(data.lineas);
      } else {
        setError(data.mensaje || "Error al cargar el pedido");
      }
    } catch (error) {
      console.error("Error al cargar detalle:", error);
      setError("Error de conexion con el servidor");
    } finally {
      setLoading(false);
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
        <p style={{ color: "#3D0026" }}>Cargando detalle del pedido...</p>
      </div>
    );
  }

  if (error || !pedido) {
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
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "15px",
          }}
        >
          <p style={{ color: "#9C7C77", marginBottom: "20px" }}>
            {error || "Pedido no encontrado"}
          </p>
          <Link
            to="/mis-pedidos"
            style={{ ...buttonStyles.secondary, padding: "10px 20px" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Volver a mis pedidos
          </Link>
        </div>
      </div>
    );
  }

  const estadoColor = getEstadoColor(pedido.Estado);
  const subtotal = pedido.Importe_total - pedido.Importe_IVA;

  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            paddingBottom: "15px",
            borderBottom: `2px solid #DFD777`,
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h1 style={{ margin: 0, color: "#3D0026" }}>
            Pedido #{pedido.ID_pedido}
          </h1>
          <span
            style={{
              backgroundColor: estadoColor.bg,
              color: estadoColor.text,
              padding: "6px 16px",
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {pedido.Estado}
          </span>
        </div>

        {/* Información del pedido y dirección */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
            marginBottom: "35px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                color: "#3D0026",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "10px",
              }}
            >
              Informacion del pedido
            </h3>
            <p style={{ margin: "8px 0", color: "#3D0026" }}>
              <strong>Fecha:</strong>{" "}
              {new Date(pedido.Fecha_pedido).toLocaleString()}
            </p>
            <p style={{ margin: "8px 0", color: "#3D0026" }}>
              <strong>Subtotal:</strong> {subtotal.toFixed(2)} €
            </p>
            <p style={{ margin: "8px 0", color: "#3D0026" }}>
              <strong>IVA:</strong> {parseFloat(pedido.Importe_IVA).toFixed(2)}{" "}
              €
            </p>
            <p
              style={{
                margin: "8px 0",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#3D0026",
              }}
            >
              <strong>Total:</strong>{" "}
              {parseFloat(pedido.Importe_total).toFixed(2)} €
            </p>
          </div>

          {direccion && (
            <div>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  color: "#3D0026",
                  borderLeft: `3px solid #DFD777`,
                  paddingLeft: "10px",
                }}
              >
                Direccion de envio
              </h3>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                {direccion.Direccion}
              </p>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                {direccion.Ciudad}, {direccion.CP}
              </p>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                {direccion.Provincia}
              </p>
            </div>
          )}
        </div>

        {/* Tabla de productos */}
        <h3 style={{ color: "#3D0026", marginBottom: "15px" }}>Productos</h3>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#3D0026", color: "white" }}>
                <th
                  style={{
                    padding: "12px 15px",
                    textAlign: "center",
                    width: "80px",
                  }}
                >
                  Cantidad
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Producto
                </th>
                <th
                  style={{
                    padding: "12px 15px",
                    textAlign: "right",
                    width: "130px",
                  }}
                >
                  Precio unitario
                </th>
                <th
                  style={{
                    padding: "12px 15px",
                    textAlign: "right",
                    width: "130px",
                  }}
                >
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((linea, idx) => (
                <tr
                  key={linea.ID_linea}
                  style={{
                    borderBottom:
                      idx === lineas.length - 1 ? "none" : `1px solid #E5DDE2`,
                  }}
                >
                  <td
                    style={{
                      padding: "12px 15px",
                      textAlign: "center",
                      color: "#3D0026",
                    }}
                  >
                    {linea.Cantidad}x
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      color: "#3D0026",
                      fontWeight: "500",
                    }}
                  >
                    {linea.Nombre}
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      textAlign: "right",
                      color: "#7C6406",
                    }}
                  >
                    {(
                      linea.Precio_con_iva ||
                      (linea.Precio * (1 + linea.IVA / 100)).toFixed(2)
                    ).toFixed(2)}{" "}
                    €
                  </td>
                  <td
                    style={{
                      padding: "12px 15px",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#3D0026",
                    }}
                  >
                    {(
                      linea.Subtotal ||
                      (
                        linea.Cantidad *
                        linea.Precio *
                        (1 + linea.IVA / 100)
                      ).toFixed(2)
                    ).toFixed(2)}{" "}
                    €
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: "#DFD777" }}>
                <td
                  colSpan="3"
                  style={{
                    padding: "15px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#3D0026",
                    fontSize: "16px",
                  }}
                >
                  TOTAL:
                </td>
                <td
                  style={{
                    padding: "15px",
                    textAlign: "right",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#3D0026",
                  }}
                >
                  {parseFloat(pedido.Importe_total).toFixed(2)} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Botón volver */}
        <div style={{ marginTop: "35px", textAlign: "center" }}>
          <Link
            to="/mis-pedidos"
            style={{ ...buttonStyles.secondary, padding: "12px 28px" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            ← Volver a mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DetallePedido;
