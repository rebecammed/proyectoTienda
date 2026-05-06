import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

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
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/pedidos", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPedidos(data.pedidos);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoTexto = (estado) => {
    const estados = {
      pendiente: "Pendiente",
      confirmado: "Confirmado",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return estados[estado] || estado;
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
        <p style={{ color: "#3D0026" }}>Cargando tus pedidos...</p>
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <Link
            to="/perfil"
            style={{
              textDecoration: "none",
              fontSize: "28px",
              color: "#7C6406",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
          >
            ←
          </Link>
          <h1 style={{ color: "#3D0026", margin: 0 }}>Mis Pedidos</h1>
        </div>

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
            <p
              style={{
                marginBottom: "20px",
                color: "#9C7C77",
                fontSize: "16px",
              }}
            >
              No has realizado ningun pedido aun.
            </p>
            <Link
              to="/productos"
              style={{
                ...buttonStyles.primary,
                display: "inline-block",
                padding: "12px 28px",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#C9BE5E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#DFD777")
              }
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {pedidos.map((pedido) => {
              const estadoColor = getEstadoColor(pedido.Estado);
              return (
                <Link
                  key={pedido.ID_pedido}
                  to={`/pedido/${pedido.ID_pedido}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      border: "1px solid #E5DDE2",
                      borderRadius: "12px",
                      padding: "20px",
                      backgroundColor: "white",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong
                          style={{ fontSize: "1.1rem", color: "#3D0026" }}
                        >
                          Pedido #{pedido.ID_pedido}
                        </strong>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backgroundColor: estadoColor.bg,
                            color: estadoColor.text,
                          }}
                        >
                          {getEstadoTexto(pedido.Estado)}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                            color: "#3D0026",
                          }}
                        >
                          {parseFloat(pedido.Importe_total).toFixed(2)} €
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#9C7C77" }}>
                          {new Date(pedido.Fecha_pedido).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisPedidos;
