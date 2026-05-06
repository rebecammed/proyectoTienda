import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function AdminDetallePedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actualizando, setActualizando] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
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
    disabled: {
      backgroundColor: "#9C7C77",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "not-allowed",
      opacity: 0.6,
    },
  };

  useEffect(() => {
    cargarDetallePedido();
  }, [id]);

  const cargarDetallePedido = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8000/api/admin/pedidos/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setPedido(data.pedido);
        setDireccion(data.direccion);
        setLineas(data.lineas || []);
        setEstadoSeleccionado(data.pedido.Estado);
      } else {
        setError(data.mensaje || "Error al cargar el pedido");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async () => {
    if (!estadoSeleccionado || estadoSeleccionado === pedido.Estado) {
      return;
    }

    setActualizando(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/pedidos/${id}/estado`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: estadoSeleccionado }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setPedido({ ...pedido, Estado: estadoSeleccionado });
        alert(`Pedido actualizado a estado: ${estadoSeleccionado}`);
      } else {
        setError(data.mensaje || "Error al actualizar el estado");
        setEstadoSeleccionado(pedido.Estado);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
      setEstadoSeleccionado(pedido.Estado);
    } finally {
      setActualizando(false);
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

  const estadosDisponibles = [
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "CONFIRMADO", label: "Confirmado" },
    { value: "ENVIADO", label: "Enviado" },
    { value: "ENTREGADO", label: "Entregado" },
    { value: "CANCELADO", label: "Cancelado" },
  ];

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

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "#E5DDE2",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#9C7C77",
            color: "white",
            padding: "15px 25px",
            borderRadius: "10px",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{ ...buttonStyles.primary, padding: "10px 20px" }}
        >
          Volver
        </button>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div
        style={{
          backgroundColor: "#E5DDE2",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p style={{ color: "#3D0026" }}>Pedido no encontrado</p>
        <button
          onClick={() => navigate(-1)}
          style={{ ...buttonStyles.primary, padding: "10px 20px" }}
        >
          Volver
        </button>
      </div>
    );
  }

  const estadoColor = getEstadoColor(pedido.Estado);

  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link
            to={`/admin/usuarios/${pedido.ID_usuario}/pedidos`}
            style={{
              color: "#7C6406",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
          >
            ← Volver a pedidos del usuario
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderTop: `5px solid #DFD777`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              paddingBottom: "15px",
              borderBottom: `2px solid #E5DDE2`,
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <h1 style={{ margin: 0, color: "#3D0026" }}>
              Pedido #{pedido.ID_pedido}
            </h1>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <select
                value={estadoSeleccionado}
                onChange={(e) => setEstadoSeleccionado(e.target.value)}
                disabled={actualizando}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: `2px solid #E5DDE2`,
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: actualizando ? "not-allowed" : "pointer",
                  backgroundColor: "white",
                  color: "#3D0026",
                  outline: "none",
                }}
              >
                {estadosDisponibles.map((est) => (
                  <option key={est.value} value={est.value}>
                    {est.label}
                  </option>
                ))}
              </select>
              <button
                onClick={cambiarEstado}
                disabled={actualizando || estadoSeleccionado === pedido.Estado}
                style={
                  actualizando || estadoSeleccionado === pedido.Estado
                    ? buttonStyles.disabled
                    : buttonStyles.success
                }
                onMouseEnter={(e) => {
                  if (!actualizando && estadoSeleccionado !== pedido.Estado) {
                    e.currentTarget.style.backgroundColor = "#C9BE5E";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!actualizando && estadoSeleccionado !== pedido.Estado) {
                    e.currentTarget.style.backgroundColor = "#DFD777";
                  }
                }}
              >
                {actualizando ? "Actualizando..." : "Actualizar estado"}
              </button>
            </div>
          </div>

          {/* Estado actual destacado */}
          <div
            style={{
              backgroundColor: "#F5F0F3",
              padding: "12px 18px",
              borderRadius: "12px",
              marginBottom: "25px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <strong style={{ color: "#3D0026" }}>Estado actual:</strong>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "25px",
              marginBottom: "35px",
              padding: "20px",
              backgroundColor: "#F5F0F3",
              borderRadius: "15px",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#3D0026",
                  marginBottom: "15px",
                  borderLeft: `3px solid #DFD777`,
                  paddingLeft: "10px",
                }}
              >
                Informacion del pedido
              </h3>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                <strong>ID Pedido:</strong> #{pedido.ID_pedido}
              </p>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                <strong>ID Usuario:</strong> {pedido.ID_usuario}
              </p>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                <strong>Fecha:</strong>{" "}
                {new Date(pedido.Fecha_pedido).toLocaleString()}
              </p>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                <strong>Subtotal:</strong>{" "}
                {(pedido.Importe_total - pedido.Importe_IVA).toFixed(2)} €
              </p>
              <p style={{ margin: "8px 0", color: "#3D0026" }}>
                <strong>IVA:</strong>{" "}
                {parseFloat(pedido.Importe_IVA).toFixed(2)} €
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
                    color: "#3D0026",
                    marginBottom: "15px",
                    borderLeft: `3px solid #DFD777`,
                    paddingLeft: "10px",
                  }}
                >
                  Direccion de envio
                </h3>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Direccion:</strong> {direccion.Direccion}
                </p>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Codigo Postal:</strong> {direccion.CodigoPostal}
                </p>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Ciudad:</strong> {direccion.Ciudad}
                </p>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Provincia:</strong> {direccion.Provincia}
                </p>
                <p style={{ margin: "8px 0", color: "#3D0026" }}>
                  <strong>Pais:</strong> {direccion.Pais}
                </p>
              </div>
            )}
          </div>

          <h3
            style={{
              color: "#3D0026",
              marginBottom: "15px",
              borderLeft: `3px solid #DFD777`,
              paddingLeft: "10px",
            }}
          >
            Productos
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#3D0026",
                    color: "white",
                    borderRadius: "10px",
                  }}
                >
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Cantidad
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Producto
                  </th>
                  <th style={{ padding: "12px", textAlign: "right" }}>
                    Precio unitario
                  </th>
                  <th style={{ padding: "12px", textAlign: "right" }}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((linea, idx) => {
                  const precioConIva = linea.Precio * (1 + linea.IVA / 100);
                  const subtotal = linea.Cantidad * precioConIva;
                  return (
                    <tr
                      key={linea.ID_linea}
                      style={{
                        borderBottom:
                          idx === lineas.length - 1
                            ? "none"
                            : `1px solid #E5DDE2`,
                      }}
                    >
                      <td style={{ padding: "12px", color: "#3D0026" }}>
                        {linea.Cantidad}x
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#3D0026",
                          fontWeight: "500",
                        }}
                      >
                        {linea.Nombre}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: "#7C6406",
                        }}
                      >
                        {precioConIva.toFixed(2)} €
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "#3D0026",
                        }}
                      >
                        {subtotal.toFixed(2)} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    backgroundColor: "#DFD777",
                    borderTop: `2px solid #DFD777`,
                  }}
                >
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
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#3D0026",
                    }}
                  >
                    {parseFloat(pedido.Importe_total).toFixed(2)} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetallePedido;
