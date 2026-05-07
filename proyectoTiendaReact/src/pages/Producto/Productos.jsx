import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "./ProductCard";

// Importa tu logo
import logoEmpresa from "/Tienda_logo.png";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const { isLoggedIn, esAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriaFromUrl = searchParams.get("categoria");
  const [filtroCategoria, setFiltroCategoria] = useState(
    categoriaFromUrl || "TODOS",
  );
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
    cargarProductos();
  }, []);

  useEffect(() => {
    const categoria = searchParams.get("categoria");
    if (categoria && categoria !== filtroCategoria) {
      setFiltroCategoria(categoria);
    }
  }, [searchParams]);

  useEffect(() => {
    if (filtroCategoria === "TODOS") {
      searchParams.delete("categoria");
    } else {
      searchParams.set("categoria", filtroCategoria);
    }
    setSearchParams(searchParams, { replace: true });
  }, [filtroCategoria]);

  const cargarProductos = async () => {
    try {
      setCargandoProductos(true);
      const res = await fetch(
        "https://proyectotienda-m8um.onrender.com/api/productos",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setProductos(data.data);
      } else if (Array.isArray(data)) {
        setProductos(data);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]);
    } finally {
      setCargandoProductos(false);
    }
  };

  async function addProd(producto) {
    if (!isLoggedIn) {
      if (
        window.confirm(
          "Debes iniciar sesión para añadir productos al carrito. ¿Quieres ir al login?",
        )
      ) {
        navigate("/login");
      }
      return;
    }

    try {
      const res = await authFetch("/carrito/add", {
        method: "POST",
        body: JSON.stringify({ id: producto.id }),
      });

      const data = await res.json();

      if (data.success !== false) {
        alert("Producto añadido al carrito");
      } else {
        alert(data.mensaje || "Error al añadir producto");
      }
    } catch (error) {
      console.error("Error al añadir producto:", error);
      alert("Error al añadir producto al carrito");
    }
  }

  const cerrarSesion = async () => {
    try {
      await fetch("https://proyectotienda-m8um.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate("/login");
    }
  };

  if (cargandoProductos) {
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
        <p style={{ color: "#3D0026" }}>Cargando productos...</p>
      </div>
    );
  }

  const productosFiltrados =
    filtroCategoria === "TODOS"
      ? productos
      : productos.filter((p) => p.categoria === filtroCategoria);

  const categorias = [
    "TODOS",
    ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
  ];

  return (
    <div style={{ backgroundColor: "#E5DDE2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Header con logo y nombre de tienda */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            padding: "15px 20px",
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
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

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/carrito")}
              style={{ ...buttonStyles.info, padding: "10px 20px" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B5505")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C6406")
              }
            >
              Ver carrito
            </button>

            {isLoggedIn ? (
              <>
                {esAdmin && (
                  <button
                    onClick={() => navigate("/admin/")}
                    style={{ ...buttonStyles.secondary, padding: "10px 20px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Panel Admin
                  </button>
                )}
                <button
                  onClick={() => navigate("/perfil")}
                  style={{ ...buttonStyles.primary, padding: "10px 20px" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#C9BE5E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#DFD777")
                  }
                >
                  Mi perfil
                </button>
                <button
                  onClick={cerrarSesion}
                  style={{ ...buttonStyles.danger, padding: "10px 20px" }}
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
                <button
                  onClick={() => navigate("/login")}
                  style={{ ...buttonStyles.accent, padding: "10px 20px" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#6B5505")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#7C6406")
                  }
                >
                  Iniciar sesion
                </button>
                <button
                  onClick={() => navigate("/registro")}
                  style={{ ...buttonStyles.secondary, padding: "10px 20px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>

        {/* Título y filtro de categorías */}
        <div style={{ marginBottom: "25px" }}>
          <h1
            style={{
              color: "#3D0026",
              marginBottom: "20px",
              borderLeft: `4px solid #DFD777`,
              paddingLeft: "15px",
            }}
          >
            Nuestros Productos
          </h1>

          {categorias.length > 1 && (
            <div
              style={{
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
                    padding: "8px 18px",
                    cursor: "pointer",
                    backgroundColor:
                      filtroCategoria === cat ? "#DFD777" : "white",
                    color: filtroCategoria === cat ? "#3D0026" : "#7C6406",
                    border:
                      filtroCategoria === cat ? "none" : "1px solid #E5DDE2",
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: filtroCategoria === cat ? "bold" : "normal",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (filtroCategoria !== cat) {
                      e.currentTarget.style.backgroundColor = "#E5DDE2";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filtroCategoria !== cat) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  {cat === "TODOS" ? "Todos" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lista de productos */}
        {productosFiltrados.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 40px",
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
                  padding: "10px 24px",
                  marginTop: "15px",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "25px",
            }}
          >
            {productosFiltrados.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                addProd={addProd}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;
