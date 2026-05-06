import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "BOLSOS",
    iva: "21",
    url_imagenes: "",
  });

  const [cargando, setCargando] = useState(false);
  const [cargandoProducto, setCargandoProducto] = useState(esEdicion);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

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
    if (esEdicion) {
      cargarProducto();
    }
  }, [id]);

  const cargarProducto = async () => {
    setCargandoProducto(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/productos/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        const producto = data.data || data.producto;

        if (producto) {
          setFormData({
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            precio: producto.precio || "",
            stock: producto.stock || "",
            categoria: producto.categoria || "BOLSOS",
            iva: producto.iva || "21",
            url_imagenes: producto.url_imagenes || "",
          });
        } else {
          setError("No se encontraron datos del producto");
        }
      } else {
        setError(data.mensaje || "Error al cargar el producto");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setCargandoProducto(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setMensajeExito("");

    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      setCargando(false);
      return;
    }
    if (!formData.descripcion.trim()) {
      setError("La descripcion es obligatoria");
      setCargando(false);
      return;
    }
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      setError("El precio debe ser mayor que 0");
      setCargando(false);
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError("El stock no puede ser negativo");
      setCargando(false);
      return;
    }

    try {
      const url = esEdicion
        ? `http://localhost:8000/api/admin/productos/${id}`
        : "http://localhost:8000/api/admin/productos";

      const method = esEdicion ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
          categoria: formData.categoria,
          iva: parseInt(formData.iva),
          url_imagenes: formData.url_imagenes || null,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setMensajeExito(
          esEdicion
            ? "Producto actualizado correctamente"
            : "Producto creado correctamente",
        );

        setTimeout(() => {
          navigate("/admin/productos");
        }, 1500);
      } else {
        setError(
          data.mensaje ||
            `Error al ${esEdicion ? "actualizar" : "crear"} el producto`,
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setCargando(false);
    }
  };

  if (cargandoProducto) {
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

  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link
            to="/admin/productos"
            style={{
              color: "#7C6406",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
          >
            ← Volver a productos
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "35px",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderTop: `5px solid #DFD777`,
          }}
        >
          <h2 style={{ marginBottom: "25px", color: "#3D0026" }}>
            {esEdicion ? "Editar Producto" : "Nuevo Producto"}
          </h2>

          {error && (
            <div
              style={{
                backgroundColor: "#9C7C77",
                color: "white",
                padding: "12px 15px",
                borderRadius: "10px",
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
                padding: "12px 15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {mensajeExito}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#3D0026",
                }}
              >
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `2px solid #E5DDE2`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#3D0026",
                }}
              >
                Descripcion *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `2px solid #E5DDE2`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  resize: "vertical",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    color: "#3D0026",
                  }}
                >
                  Precio (€) *
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `2px solid #E5DDE2`,
                    borderRadius: "10px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#DFD777";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(223, 215, 119, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5DDE2";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    color: "#3D0026",
                  }}
                >
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `2px solid #E5DDE2`,
                    borderRadius: "10px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#DFD777";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(223, 215, 119, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5DDE2";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    color: "#3D0026",
                  }}
                >
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `2px solid #E5DDE2`,
                    borderRadius: "10px",
                    fontSize: "15px",
                    backgroundColor: "white",
                    color: "#3D0026",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#DFD777";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(223, 215, 119, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5DDE2";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="BOLSOS">Bolsos</option>
                  <option value="PENDIENTES">Pendientes</option>
                  <option value="CHARMS">Charms</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    color: "#3D0026",
                  }}
                >
                  IVA (%) *
                </label>
                <select
                  name="iva"
                  value={formData.iva}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `2px solid #E5DDE2`,
                    borderRadius: "10px",
                    fontSize: "15px",
                    backgroundColor: "white",
                    color: "#3D0026",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#DFD777";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(223, 215, 119, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5DDE2";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="21">21% (General)</option>
                  <option value="10">10% (Reducido)</option>
                  <option value="4">4% (Superreducido)</option>
                  <option value="0">0%</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#3D0026",
                }}
              >
                URL de la imagen
              </label>
              <input
                type="url"
                name="url_imagenes"
                value={formData.url_imagenes}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `2px solid #E5DDE2`,
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#DFD777";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(223, 215, 119, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5DDE2";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {formData.url_imagenes && (
                <div style={{ marginTop: "12px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9C7C77",
                      marginBottom: "5px",
                    }}
                  >
                    Vista previa:
                  </p>
                  <img
                    src={formData.url_imagenes}
                    alt="Vista previa"
                    style={{
                      maxWidth: "120px",
                      maxHeight: "120px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: `2px solid #E5DDE2`,
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
              <button
                type="submit"
                disabled={cargando}
                style={{
                  ...buttonStyles.primary,
                  padding: "12px 28px",
                  fontSize: "16px",
                  opacity: cargando ? 0.7 : 1,
                  cursor: cargando ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!cargando)
                    e.currentTarget.style.backgroundColor = "#C9BE5E";
                }}
                onMouseLeave={(e) => {
                  if (!cargando)
                    e.currentTarget.style.backgroundColor = "#DFD777";
                }}
              >
                {cargando
                  ? "Guardando..."
                  : esEdicion
                    ? "Actualizar Producto"
                    : "Crear Producto"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/productos")}
                style={{
                  ...buttonStyles.danger,
                  padding: "12px 28px",
                  fontSize: "16px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8B6B66")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#9C7C77")
                }
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {esEdicion && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px 20px",
              backgroundColor: "#DFD777",
              borderRadius: "10px",
              fontSize: "14px",
              color: "#3D0026",
            }}
          >
            Informacion: Estas editando el producto ID: {id}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
