import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserList from "./UserList";
import ProductList from "./ProductList";
import logoEmpresa from "../../assets/Tienda_logo.png";

const AdminPanel = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalProductos: 0,
    productosStockBajo: 0,
    pedidosPendientes: 0,
    pedidosTotales: 0,
    ventasTotales: 0,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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
    info: {
      backgroundColor: "#7C6406",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
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
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    setCargando(true);
    setError("");

    try {
      const response = await fetch(
        "https://proyectotienda-m8um.onrender.com/api/admin/stats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.mensaje || "Error al cargar estadisticas");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setCargando(false);
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

  const Dashboard = () => {
    if (cargando) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ color: "#3D0026" }}>Cargando estadisticas...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            backgroundColor: "#9C7C77",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
          <button
            onClick={cargarEstadisticas}
            style={{
              marginLeft: "10px",
              padding: "6px 14px",
              backgroundColor: "#DFD777",
              color: "#3D0026",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* Tarjetas de estadísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Tarjeta de Usuarios */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderLeft: `4px solid #3D0026`,
            }}
          >
            <div>
              <h3 style={{ margin: "0", fontSize: "32px", color: "#3D0026" }}>
                {stats.totalUsuarios}
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#9C7C77",
                  fontSize: "14px",
                }}
              >
                Usuarios registrados
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#7C6406",
                  margin: "8px 0 0",
                }}
              >
                Activos: {stats.usuariosActivos}
              </p>
            </div>
          </div>

          {/* Tarjeta de Productos */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderLeft: `4px solid #7C6406`,
            }}
          >
            <div>
              <h3 style={{ margin: "0", fontSize: "32px", color: "#3D0026" }}>
                {stats.totalProductos}
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#9C7C77",
                  fontSize: "14px",
                }}
              >
                Productos en tienda
              </p>
              {stats.productosStockBajo > 0 && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#9C7C77",
                    margin: "8px 0 0",
                  }}
                >
                  {stats.productosStockBajo} con stock bajo
                </p>
              )}
            </div>
          </div>

          {/* Tarjeta de Pedidos Pendientes */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderLeft: `4px solid #DFD777`,
            }}
          >
            <div>
              <h3 style={{ margin: "0", fontSize: "32px", color: "#3D0026" }}>
                {stats.pedidosPendientes}
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#9C7C77",
                  fontSize: "14px",
                }}
              >
                Pedidos pendientes
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#7C6406",
                  margin: "8px 0 0",
                }}
              >
                Total: {stats.pedidosTotales}
              </p>
            </div>
          </div>

          {/* Tarjeta de Ventas */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderLeft: `4px solid #3D0026`,
            }}
          >
            <div>
              <h3 style={{ margin: "0", fontSize: "32px", color: "#3D0026" }}>
                {stats.ventasTotales.toFixed(2)} €
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#9C7C77",
                  fontSize: "14px",
                }}
              >
                Ventas totales
              </p>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              color: "#3D0026",
              borderLeft: `3px solid #DFD777`,
              paddingLeft: "12px",
            }}
          >
            Accesos rapidos
          </h3>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Link
              to="/admin/usuarios"
              style={{
                ...buttonStyles.secondary,
                padding: "12px 24px",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Gestionar Usuarios
            </Link>
            <Link
              to="/admin/productos"
              style={{
                ...buttonStyles.primary,
                padding: "12px 24px",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#C9BE5E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#DFD777")
              }
            >
              Gestionar Productos
            </Link>
            <Link
              to="/admin/pedidos"
              style={{
                ...buttonStyles.info,
                padding: "12px 24px",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B5505")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C6406")
              }
            >
              Gestionar Pedidos
            </Link>
          </div>
        </div>

        {/* Resumen */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              color: "#3D0026",
              borderLeft: `3px solid #DFD777`,
              paddingLeft: "12px",
            }}
          >
            Resumen
          </h3>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#3D0026" }}>
            <li style={{ marginBottom: "8px" }}>
              Total de usuarios registrados: {stats.totalUsuarios}
            </li>
            <li style={{ marginBottom: "8px" }}>
              Usuarios activos: {stats.usuariosActivos}
            </li>
            <li style={{ marginBottom: "8px" }}>
              Productos en catalogo: {stats.totalProductos}
            </li>
            <li style={{ marginBottom: "8px" }}>
              Pedidos pendientes: {stats.pedidosPendientes}
            </li>
            <li style={{ marginBottom: "8px" }}>
              Volumen de ventas: {stats.ventasTotales.toFixed(2)} €
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
      }}
    >
      {/* HEADER con logo, productos y cerrar sesión */}
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
            maxWidth: "1400px",
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
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#3D0026",
              }}
            >
              Panel de Administración
            </span>
          </Link>

          {/* Botones de acción */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span
              style={{
                color: "#7C6406",
                fontSize: "14px",
                marginRight: "5px",
              }}
            >
              Hola, {usuario || "Admin"}
            </span>
            <Link
              to="/productos"
              style={{
                ...buttonStyles.info,
                padding: "8px 20px",
                textDecoration: "none",
                fontSize: "14px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B5505")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C6406")
              }
            >
              Ver tienda
            </Link>
            <button
              onClick={handleLogout}
              style={{
                ...buttonStyles.danger,
                padding: "8px 20px",
                fontSize: "14px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#8B6B66")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#9C7C77")
              }
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ padding: "30px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="usuarios/*" element={<UserList />} />
            <Route path="productos/*" element={<ProductList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
