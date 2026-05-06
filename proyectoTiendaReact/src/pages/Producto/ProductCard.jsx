import { useNavigate } from "react-router-dom";

function ProductCard({ producto, addProd, isLoggedIn }) {
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
      padding: "5px 0",
      width: "100%",
    },
    accent: {
      backgroundColor: "#7C6406",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      width: "100%",
      padding: "5px 0",
    },
  };

  const handleCardClick = (e) => {
    if (e.target.tagName !== "BUTTON") {
      navigate(`/productos/${producto.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      if (
        window.confirm(
          "Debes iniciar sesion para añadir productos al carrito. ¿Quieres ir al login?",
        )
      ) {
        navigate("/login");
      }
      return;
    }
    addProd(producto);
  };

  const precioConIva =
    producto.precioConIva ||
    (producto.precio * (1 + producto.iva / 100)).toFixed(2);

  return (
    <div
      onClick={handleCardClick}
      style={{
        border: "none",
        borderRadius: "15px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      {/* Imagen */}
      <div
        style={{
          backgroundColor: "#E5DDE2",
          borderRadius: "12px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "15px",
          overflow: "hidden",
        }}
      >
        {producto.url_imagenes ? (
          <img
            src={producto.url_imagenes}
            alt={producto.nombre}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/180?text=Producto";
            }}
          />
        ) : (
          <span style={{ fontSize: "40px", color: "#9C7C77" }}>Sin imagen</span>
        )}
      </div>

      {/* Título */}
      <h3
        style={{
          margin: "10px 0",
          fontSize: "18px",
          color: "#3D0026",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        {producto.nombre}
      </h3>

      {/* Descripción */}
      <p
        style={{
          color: "#9C7C77",
          fontSize: "13px",
          margin: "10px 0",
          minHeight: "40px",
          lineHeight: "1.4",
        }}
      >
        {producto.descripcion?.substring(0, 60)}
        {producto.descripcion?.length > 60 && "..."}
      </p>

      {/* Precio */}
      <p
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#3D0026",
          margin: "10px 0",
        }}
      >
        {parseFloat(precioConIva).toFixed(2)} €
      </p>

      {/* Stock */}
      <p style={{ fontSize: "12px", color: "#7C6406", margin: "5px 0" }}>
        Stock: {producto.stock} unidades
      </p>

      {/* Botón */}
      <button
        onClick={handleAddToCart}
        style={isLoggedIn ? buttonStyles.primary : buttonStyles.accent}
        onMouseEnter={(e) => {
          if (isLoggedIn) {
            e.currentTarget.style.backgroundColor = "#C9BE5E";
          } else {
            e.currentTarget.style.backgroundColor = "#6B5505";
          }
        }}
        onMouseLeave={(e) => {
          if (isLoggedIn) {
            e.currentTarget.style.backgroundColor = "#DFD777";
          } else {
            e.currentTarget.style.backgroundColor = "#7C6406";
          }
        }}
      >
        {isLoggedIn ? "Añadir al carrito" : "Iniciar sesion"}
      </button>
    </div>
  );
}

export default ProductCard;
