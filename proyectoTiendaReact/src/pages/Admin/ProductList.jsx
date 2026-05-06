import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
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
    success: {
      backgroundColor: "#DFD777",
      color: "#3D0026",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/productos", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setProductos(data.data || []);
      } else {
        setError(data.mensaje || "Error al cargar productos");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id, nombre) => {
    const confirmacion = window.confirm(
      `¿Estas seguro de que quieres eliminar el producto "${nombre}"?\n\n` +
        `Esta accion es irreversible y eliminara el producto de la base de datos.`,
    );

    if (!confirmacion) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/productos/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setMensajeExito(`Producto "${nombre}" eliminado correctamente`);
        cargarProductos();
        setTimeout(() => setMensajeExito(""), 3000);
      } else {
        setError(data.mensaje || "Error al eliminar el producto");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/login");
  };

  const productosFiltrados =
    filtroCategoria === "TODOS"
      ? productos
      : productos.filter((p) => p.categoria === filtroCategoria);

  const categorias = [
    "TODOS",
    ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
  ];

  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ color: "#3D0026" }}>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#E5DDE2" }}>
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
                  color: "#3D0026",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#DFD777",
                  fontWeight: "bold",
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
            Gestion de Productos
          </h2>
          <button
            onClick={() => navigate("/admin/productos/nuevo")}
            style={{ ...buttonStyles.success, padding: "10px 20px" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#C9BE5E")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#DFD777")
            }
          >
            Nuevo Producto
          </button>
        </div>

        {/* Filtro por categoría */}
        {categorias.length > 1 && (
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#3D0026" }}>
              Filtrar por categoria:
            </span>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                style={{
                  padding: "6px 16px",
                  cursor: "pointer",
                  backgroundColor:
                    filtroCategoria === cat ? "#DFD777" : "white",
                  color: filtroCategoria === cat ? "#3D0026" : "#7C6406",
                  border:
                    filtroCategoria === cat ? "none" : `1px solid #E5DDE2`,
                  borderRadius: "20px",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
              >
                {cat === "TODOS" ? "Todos" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Mensajes */}
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

        {/* Tabla de productos */}
        {productosFiltrados.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "15px",
            }}
          >
            <p style={{ color: "#9C7C77" }}>
              No hay productos disponibles
              {filtroCategoria !== "TODOS"
                ? ` en la categoria ${filtroCategoria}`
                : ""}
            </p>
            {filtroCategoria !== "TODOS" && (
              <button
                onClick={() => setFiltroCategoria("TODOS")}
                style={{
                  ...buttonStyles.primary,
                  padding: "8px 16px",
                  marginTop: "10px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#C9BE5E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#DFD777")
                }
              >
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: "800px",
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
                      Imagen
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Nombre
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Categoria
                    </th>
                    <th style={{ padding: "12px", textAlign: "right" }}>
                      Precio
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Stock
                    </th>
                    <th style={{ padding: "12px", textAlign: "right" }}>IVA</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto, index) => (
                    <tr
                      key={producto.id}
                      style={{
                        borderBottom: `1px solid #E5DDE2`,
                        backgroundColor: index % 2 === 0 ? "white" : "#F5F0F3",
                      }}
                    >
                      <td style={{ padding: "10px", color: "#3D0026" }}>
                        {producto.id}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {producto.url_imagenes ? (
                          <img
                            src={producto.url_imagenes}
                            alt={producto.nombre}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/50?text=No+image";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: "#E5DDE2",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              color: "#9C7C77",
                            }}
                          >
                            Sin img
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <strong style={{ color: "#3D0026" }}>
                          {producto.nombre}
                        </strong>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#9C7C77",
                            marginTop: "4px",
                            maxWidth: "200px",
                          }}
                        >
                          {producto.descripcion?.substring(0, 50)}
                          {producto.descripcion?.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span
                          style={{
                            backgroundColor: "#DFD777",
                            color: "#3D0026",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {producto.categoria || "—"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "#3D0026",
                        }}
                      >
                        {parseFloat(
                          producto.precio * (1 + producto.iva / 100),
                        ).toFixed(2)}{" "}
                        €
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <span
                          style={{
                            backgroundColor:
                              producto.stock > 10
                                ? "#DFD777"
                                : producto.stock > 0
                                  ? "#7C6406"
                                  : "#9C7C77",
                            color: producto.stock > 10 ? "#3D0026" : "white",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {producto.stock}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "right",
                          color: "#7C6406",
                        }}
                      >
                        {producto.iva}%
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          onClick={() => navigate(`/productos/${producto.id}`)}
                          style={{
                            ...buttonStyles.secondary,
                            padding: "6px 10px",
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                          title="Ver en tienda"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/productos/editar/${producto.id}`)
                          }
                          style={{
                            ...buttonStyles.warning,
                            padding: "6px 10px",
                            fontSize: "11px",
                            marginRight: "5px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#6B5505")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#7C6406")
                          }
                          title="Editar producto"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            eliminarProducto(producto.id, producto.nombre)
                          }
                          style={{
                            ...buttonStyles.danger,
                            padding: "6px 10px",
                            fontSize: "11px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#8B6B66")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#9C7C77")
                          }
                          title="Eliminar producto"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "20px", fontSize: "14px" }}>
              <p style={{ color: "#3D0026" }}>
                Mostrando {productosFiltrados.length} de {productos.length}{" "}
                productos
                {filtroCategoria !== "TODOS" &&
                  ` en categoria "${filtroCategoria}"`}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
