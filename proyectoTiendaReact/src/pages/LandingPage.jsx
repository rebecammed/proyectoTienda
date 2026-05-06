import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Importa tus imágenes
import logoEmpresa from "../../public/Tienda_logo.png";
import fotoBolsos from "../../public/bolso.png";
import fotoPendientes from "../../public/pendientes.jpg";
import fotoCharms from "../../public/charm.jpg";

function LandingPage() {
  const { isLoggedIn, loading: authLoading, logout, esAdmin } = useAuth();
  const navigate = useNavigate();

  const categorias = [
    {
      nombre: "Bolsos",
      descripcion: "Hechos a mano con polipiel",
      imagen: fotoBolsos,
      alt: "Colección de bolsos artesanales",
    },
    {
      nombre: "Pendientes",
      descripcion: "Hechos a partir de arcilla polimérica, únicas y ligeras",
      imagen: fotoPendientes,
      alt: "Pendientes de arcilla polimérica",
    },
    {
      nombre: "Charms",
      descripcion: "Personaliza tus accesorios favoritos",
      imagen: fotoCharms,
      alt: "Charms personalizables",
    },
  ];

  // Estilos unificados para botones (para reutilizar en otros componentes)
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
  };

  if (authLoading)
    return (
      <div
        style={{
          backgroundColor: "#E5DDE2",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#3D0026",
        }}
      >
        Cargando...
      </div>
    );

  return (
    <div style={{ backgroundColor: "#E5DDE2", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          backgroundColor: "#E5DDE2",
          borderBottom: `2px solid #DFD777`,
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
            alt="Logo Tienda Accesorios"
            style={{ height: "50px", width: "auto", marginRight: "10px" }}
          />
          <span
            style={{ fontWeight: "bold", fontSize: "20px", color: "#3D0026" }}
          >
            Accesorios hechos a mano
          </span>
        </Link>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {isLoggedIn ? (
            <>
              {esAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  style={{ ...buttonStyles.secondary, padding: "8px 16px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
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
                onClick={logout}
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
                Iniciar sesión
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

      {/* Hero Section */}
      <div
        style={{
          backgroundColor: "#3D0026",
          padding: "100px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{ fontSize: "48px", marginBottom: "20px", color: "#DFD777" }}
        >
          Accesorios hechos a mano
        </h1>
        <p
          style={{
            fontSize: "20px",
            maxWidth: "600px",
            margin: "0 auto 30px",
            color: "#E5DDE2",
          }}
        >
          Descubre nuestra colección de bolsos, pendientes y charms únicos
        </p>
        <Link
          to="/productos"
          style={{
            ...buttonStyles.primary,
            padding: "12px 30px",
            textDecoration: "none",
            borderRadius: "30px",
            fontSize: "18px",
            display: "inline-block",
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

      {/* Categorías */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "60px auto",
          padding: "0 20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "32px",
            color: "#3D0026",
            borderBottom: `3px solid #DFD777`,
            display: "inline-block",
            width: "auto",
            paddingBottom: "10px",
          }}
        >
          Nuestras categorías
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            marginTop: "40px",
          }}
        >
          {categorias.map((cat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => navigate("/productos")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={cat.imagen}
                alt={cat.alt}
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h3 style={{ marginBottom: "10px", color: "#3D0026" }}>
                  {cat.nombre}
                </h3>
                <p style={{ color: "#7C6406", lineHeight: "1.5" }}>
                  {cat.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#3D0026",
          color: "#E5DDE2",
          textAlign: "center",
          padding: "40px 20px",
          marginTop: "60px",
          borderTop: `3px solid #DFD777`,
        }}
      >
        <p style={{ fontSize: "16px" }}>
          © 2026 - Tienda de accesorios hechos a mano
        </p>
        <p style={{ fontSize: "14px", marginTop: "15px", color: "#9C7C77" }}>
          Hecho con amor para amantes del estilo único
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
