import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoEmpresa from "../../assets/Tienda_logo.png";

// Importa las fotos por defecto para cada categoría
import fotoBolsos from "../../assets/bolso.png";
import fotoPendientes from "../../assets/pendientes.jpg";
import fotoCharms from "../../assets/charm.jpg";

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [mensajeCarrito, setMensajeCarrito] = useState("");
  const { isLoggedIn, esAdmin, logout } = useAuth();
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
    disabled: {
      backgroundColor: "#9C7C77",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "not-allowed",
      fontWeight: "bold",
      opacity: 0.6,
    },
  };

  // Función para obtener la imagen por defecto según categoría
  const getImagenPorCategoria = (categoria) => {
    switch (categoria?.toUpperCase()) {
      case "BOLSOS":
        return fotoBolsos;
      case "PENDIENTES":
        return fotoPendientes;
      case "CHARMS":
        return fotoCharms;
      default:
        return fotoBolsos;
    }
  };

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    setCargando(true);
    setError("");

    try {
      const res = await fetch(
        `https://proyectotienda-m8um.onrender.com/api/productos/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await res.json();

      if (data.success) {
        setProducto(data.data || data.producto);
      } else {
        setError(data.mensaje || data.message || "Producto no encontrado");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const añadirAlCarrito = async () => {
    if (!isLoggedIn) {
      if (
        window.confirm(
          "Debes iniciar sesion para anadir al carrito. ¿Quieres ir al login?",
        )
      ) {
        navigate("/login");
      }
      return;
    }

    try {
      const res = await fetch(
        "https://proyectotienda-m8um.onrender.com/api/carrito/add",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: producto.id, cantidad: cantidad }),
        },
      );

      const data = await res.json();

      if (data.success !== false) {
        setMensajeCarrito("Producto añadido al carrito");
        setTimeout(() => setMensajeCarrito(""), 3000);
      } else {
        alert(data.mensaje || "Error al añadir producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al añadir producto al carrito");
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
      <div
        style={{
          backgroundColor: "#E5DDE2",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#3D0026" }}>Cargando producto...</p>
      </div>
    );
  }

  if (error || !producto) {
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
          <h2 style={{ color: "#3D0026" }}>
            {error || "Producto no encontrado"}
          </h2>
          <Link
            to="/productos"
            style={{
              color: "#7C6406",
              textDecoration: "none",
              marginTop: "20px",
              display: "inline-block",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
          >
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const precioConIva = producto.precio * (1 + producto.iva / 100);
  const stockDisponible = producto.stock > 0;
  const imagenProducto =
    producto.url_imagenes || getImagenPorCategoria(producto.categoria);

  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
      }}
    >
      {/* HEADER con logo, navegación y botones */}
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
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#3D0026",
              }}
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B5505")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C6406")
              }
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B5505")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C6406")
              }
            >
              Carrito
            </Link>

            {isLoggedIn ? (
              <>
                {esAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      ...buttonStyles.secondary,
                      padding: "8px 20px",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#C9BE5E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#DFD777")
                  }
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#8B6B66")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#9C7C77")
                  }
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    ...buttonStyles.accent,
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
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  style={{
                    ...buttonStyles.secondary,
                    padding: "8px 20px",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Breadcrumbs */}
          <div style={{ marginBottom: "20px", fontSize: "14px" }}>
            <Link to="/" style={{ color: "#7C6406", textDecoration: "none" }}>
              Inicio
            </Link>
            <span style={{ margin: "0 8px", color: "#9C7C77" }}>/</span>
            <Link
              to="/productos"
              style={{ color: "#7C6406", textDecoration: "none" }}
            >
              Productos
            </Link>
            {producto.categoria && (
              <>
                <span style={{ margin: "0 8px", color: "#9C7C77" }}>/</span>
                <Link
                  to={`/productos?categoria=${encodeURIComponent(producto.categoria)}`}
                  style={{ color: "#7C6406", textDecoration: "none" }}
                >
                  {producto.categoria}
                </Link>
              </>
            )}
            <span style={{ margin: "0 8px", color: "#9C7C77" }}>/</span>
            <span style={{ color: "#3D0026", fontWeight: "500" }}>
              {producto.nombre}
            </span>
          </div>

          {/* Mensaje éxito carrito */}
          {mensajeCarrito && (
            <div
              style={{
                backgroundColor: "#DFD777",
                color: "#3D0026",
                padding: "12px 20px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {mensajeCarrito}
              <Link
                to="/carrito"
                style={{
                  marginLeft: "10px",
                  color: "#3D0026",
                  fontWeight: "bold",
                }}
              >
                Ver carrito
              </Link>
            </div>
          )}

          {/* Contenido principal del producto */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Imagen del producto */}
            <div
              style={{
                backgroundColor: "#E5DDE2",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <img
                src={imagenProducto}
                alt={producto.nombre}
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "10px",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300?text=Producto";
                }}
              />
            </div>

            {/* Información del producto */}
            <div>
              <h1
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "28px",
                  color: "#3D0026",
                }}
              >
                {producto.nombre}
              </h1>

              <div style={{ marginBottom: "15px" }}>
                <Link
                  to={`/productos?categoria=${encodeURIComponent(producto.categoria)}`}
                  style={{
                    backgroundColor: "#DFD777",
                    color: "#3D0026",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  {producto.categoria || "Sin categoria"}
                </Link>
              </div>

              <p
                style={{
                  color: "#3D0026",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                {producto.descripcion}
              </p>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#3D0026",
                  }}
                >
                  {precioConIva.toFixed(2)} €
                </div>
                <div style={{ fontSize: "14px", color: "#9C7C77" }}>
                  IVA {producto.iva}% incluido
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <span
                  style={{
                    backgroundColor: stockDisponible ? "#DFD777" : "#9C7C77",
                    color: stockDisponible ? "#3D0026" : "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {stockDisponible
                    ? `En stock (${producto.stock} unidades)`
                    : "Agotado"}
                </span>
              </div>

              {stockDisponible && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#3D0026" }}>
                    Cantidad:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      style={{
                        width: "35px",
                        height: "35px",
                        fontSize: "20px",
                        backgroundColor: "#E5DDE2",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        color: "#3D0026",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#DFD777")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E5DDE2")
                      }
                    >
                      -
                    </button>
                    <span
                      style={{
                        minWidth: "40px",
                        textAlign: "center",
                        fontSize: "18px",
                        color: "#3D0026",
                      }}
                    >
                      {cantidad}
                    </span>
                    <button
                      onClick={() =>
                        setCantidad(Math.min(producto.stock, cantidad + 1))
                      }
                      style={{
                        width: "35px",
                        height: "35px",
                        fontSize: "20px",
                        backgroundColor: "#E5DDE2",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        color: "#3D0026",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#DFD777")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E5DDE2")
                      }
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: "12px", color: "#9C7C77" }}>
                    Stock disponible: {producto.stock}
                  </span>
                </div>
              )}

              <button
                onClick={añadirAlCarrito}
                disabled={!stockDisponible}
                style={
                  stockDisponible
                    ? {
                        ...buttonStyles.primary,
                        width: "100%",
                        padding: "15px",
                        fontSize: "18px",
                        marginBottom: "15px",
                      }
                    : {
                        ...buttonStyles.disabled,
                        width: "100%",
                        padding: "15px",
                        fontSize: "18px",
                        marginBottom: "15px",
                      }
                }
                onMouseEnter={(e) => {
                  if (stockDisponible)
                    e.currentTarget.style.backgroundColor = "#C9BE5E";
                }}
                onMouseLeave={(e) => {
                  if (stockDisponible)
                    e.currentTarget.style.backgroundColor = "#DFD777";
                }}
              >
                {stockDisponible ? "Añadir al carrito" : "Agotado"}
              </button>

              <Link
                to="/productos"
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "#7C6406",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>

          {/* Enlaces adicionales */}
          <div
            style={{
              marginTop: "40px",
              textAlign: "center",
              fontSize: "12px",
              borderTop: "1px solid #DFD777",
              paddingTop: "20px",
            }}
          >
            <Link
              to="/productos"
              style={{
                color: "#7C6406",
                textDecoration: "none",
                margin: "0 10px",
              }}
            >
              Ver todos los productos
            </Link>
            {producto.categoria && (
              <Link
                to={`/productos?categoria=${encodeURIComponent(producto.categoria)}`}
                style={{
                  color: "#7C6406",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Ver mas de {producto.categoria}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
