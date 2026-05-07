import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoEmpresa from "/Tienda_logo.png";

import { authFetch } from "../authFetch";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [precioSinIva, setPrecioSinIva] = useState(0);
  const [ivaTotal, setIvaTotal] = useState(0);
  const [precioConIva, setPrecioConIva] = useState(0);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [cargandoDirecciones, setCargandoDirecciones] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const { isLoggedIn, loading: authLoading, esAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Estilos unificados
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
    success: {
      backgroundColor: "#DFD777",
      color: "#3D0026",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
  };

  // Cargar datos cuando el usuario está logueado
  useEffect(() => {
    if (isLoggedIn) {
      cargarCarrito();
      cargarDirecciones();
    }
    setCargandoInicial(false);
  }, [isLoggedIn]);

  const cargarCarrito = async () => {
    try {
      const res = await authFetch("/carrito", {
        method: "GET",
      });
      const data = await res.json();
      if (data.success !== false) {
        setCarrito(data.carrito || []);
        setPrecioConIva(data.precioConIva || 0);
        setPrecioTotal(data.precioTotal || 0);
        setPrecioSinIva(data.precioSinIva || 0);
        setIvaTotal(data.ivaTotal || 0);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    }
  };

  const cargarDirecciones = async () => {
    setCargandoDirecciones(true);
    try {
      const res = await authFetch("/direcciones", {
        method: "GET",
      });

      const data = await res.json();
      if (data.success && data.direcciones) {
        setDirecciones(data.direcciones);
        if (data.direcciones.length > 0) {
          setDireccionSeleccionada(data.direcciones[0].id.toString());
        }
      }
    } catch (error) {
      console.error("Error al cargar direcciones:", error);
    } finally {
      setCargandoDirecciones(false);
    }
  };

  const añadirAlCarrito = async (id, cantidad = 1) => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para modificar el carrito");
      navigate("/login");
      return;
    }
    setActualizando(true);
    try {
      await authFetch("/carrito/add", {
        method: "POST",
        body: JSON.stringify({ id: id, cantidad: cantidad }),
      });

      await cargarCarrito();
    } catch (error) {
      console.error("Error al añadir producto:", error);
    } finally {
      setActualizando(false);
    }
  };

  const eliminarDelCarrito = async (id) => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para modificar el carrito");
      navigate("/login");
      return;
    }
    setActualizando(true);
    try {
      await authFetch("/carrito/remove", {
        method: "POST",
        body: JSON.stringify({ id: id }),
      });

      await cargarCarrito();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    } finally {
      setActualizando(false);
    }
  };

  const clearCarrito = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para vaciar el carrito");
      navigate("/login");
      return;
    }
    if (!window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      return;
    }
    await authFetch("/carrito/clear", {
      method: "POST",
    });
    setCarrito([]);
    setPrecioTotal(0);
    navigate("/productos");
  };

  const confirmarPedido = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para confirmar el pedido");
      navigate("/login");
      return;
    }
    if (!direccionSeleccionada) {
      alert("Por favor, selecciona una dirección de envío");
      return;
    }

    setActualizando(true);
    try {
      const res = await authFetch("/pedido/confirmar", {
        method: "POST",
        body: JSON.stringify({
          direccion_id: direccionSeleccionada,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("¡Pedido confirmado con éxito!");
        cargarCarrito();
        navigate(`/pedido/${data.pedido_id}`);
      } else {
        alert(data.mensaje || "Error al confirmar el pedido");
      }
    } catch (error) {
      console.error("Error al confirmar pedido:", error);
      alert("Error al confirmar el pedido");
    } finally {
      setActualizando(false);
    }
  };

  const handleLogout = async () => {
    await fetch("https://proyectotienda-m8um.onrender.com/api/logout", {
      method: "POST",
      credentials: "include",
    });
    logout();
    setCarrito([]);
    setPrecioTotal(0);
    navigate("/login");
  };

  const volver = () => {
    navigate("/productos");
  };

  // Mostrar carga mientras se verifica auth
  if (cargandoInicial || authLoading) {
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
        <p style={{ color: "#3D0026", fontSize: "18px" }}>Cargando...</p>
      </div>
    );
  }

  // Si no está logueado, mostrar mensaje
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#E5DDE2", minHeight: "100vh" }}>
        {/* Header para usuarios no logueados */}
        <div
          style={{
            backgroundColor: "white",
            padding: "15px 30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderBottom: `2px solid #DFD777`,
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
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                to="/productos"
                style={{
                  ...buttonStyles.accent,
                  padding: "8px 20px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Productos
              </Link>
              <Link
                to="/login"
                style={{
                  ...buttonStyles.accent,
                  padding: "8px 20px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
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
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "500px",
            margin: "100px auto",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFF8E1",
              color: "#7C6406",
              padding: "30px",
              borderRadius: "15px",
              border: `2px solid #DFD777`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#3D0026" }}>🔒 Acceso restringido</h2>
            <p style={{ marginTop: "10px" }}>
              Debes iniciar sesión para ver y gestionar tu carrito.
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "30px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/login")}
                style={{ ...buttonStyles.accent, padding: "10px 20px" }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate("/registro")}
                style={{ ...buttonStyles.secondary, padding: "10px 20px" }}
              >
                Registrarse
              </button>
              <button
                onClick={() => navigate("/productos")}
                style={{ ...buttonStyles.danger, padding: "10px 20px" }}
              >
                Ver productos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (actualizando) {
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
        <p style={{ color: "#3D0026", fontSize: "18px" }}>
          Actualizando carrito...
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#E5DDE2", minHeight: "100vh" }}>
      {/* HEADER con logo y navegación */}
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
              style={{ fontWeight: "bold", fontSize: "20px", color: "#3D0026" }}
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
            >
              Productos
            </Link>
            <Link
              to="/carrito"
              style={{
                ...buttonStyles.primary,
                padding: "8px 20px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Carrito
            </Link>
            {esAdmin && (
              <Link
                to="/admin"
                style={{
                  ...buttonStyles.secondary,
                  padding: "8px 20px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
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
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1
            style={{
              color: "#3D0026",
              borderBottom: `3px solid #DFD777`,
              display: "inline-block",
              paddingBottom: "10px",
              marginBottom: "30px",
            }}
          >
            Mi Carrito
          </h1>

          {carrito.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 40px",
                backgroundColor: "white",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ fontSize: "18px", color: "#7C6406" }}>
                El carrito está vacío
              </p>
              <button
                onClick={volver}
                style={{
                  ...buttonStyles.primary,
                  padding: "12px 30px",
                  marginTop: "20px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#C9BE5E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#DFD777")
                }
              >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              {/* Tabla de productos */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#3D0026", color: "white" }}>
                      <th style={{ padding: "15px", textAlign: "left" }}>
                        Producto
                      </th>
                      <th style={{ padding: "15px", textAlign: "center" }}>
                        Cantidad
                      </th>
                      <th style={{ padding: "15px", textAlign: "right" }}>
                        Precio unitario
                      </th>
                      <th style={{ padding: "15px", textAlign: "right" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: `1px solid #E5DDE2` }}
                      >
                        <td style={{ padding: "15px" }}>
                          <strong style={{ color: "#3D0026" }}>
                            {item.nombre}
                          </strong>
                          {item.descripcion && (
                            <div style={{ fontSize: "12px", color: "#9C7C77" }}>
                              {item.descripcion.substring(0, 60)}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "10px",
                            }}
                          >
                            <button
                              onClick={() => eliminarDelCarrito(item.id)}
                              style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "#9C7C77",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "18px",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#8B6B66")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#9C7C77")
                              }
                            >
                              -
                            </button>
                            <span
                              style={{
                                minWidth: "40px",
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#3D0026",
                              }}
                            >
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => añadirAlCarrito(item.id)}
                              disabled={item.cantidad >= item.stock}
                              style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "#DFD777",
                                color: "#3D0026",
                                border: "none",
                                borderRadius: "6px",
                                cursor:
                                  item.cantidad >= item.stock
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize: "18px",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                                opacity: item.cantidad >= item.stock ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) => {
                                if (item.cantidad < item.stock)
                                  e.currentTarget.style.backgroundColor =
                                    "#C9BE5E";
                              }}
                              onMouseLeave={(e) => {
                                if (item.cantidad < item.stock)
                                  e.currentTarget.style.backgroundColor =
                                    "#DFD777";
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            textAlign: "right",
                            color: "#7C6406",
                          }}
                        >
                          {parseFloat(item.precio_con_iva).toFixed(2)} €
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            textAlign: "right",
                            fontWeight: "bold",
                            color: "#3D0026",
                          }}
                        >
                          {(
                            parseFloat(item.precio_con_iva) * item.cantidad
                          ).toFixed(2)}{" "}
                          €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: "#F5F0F3" }}>
                      <td
                        colSpan="3"
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "#7C6406",
                        }}
                      >
                        TOTAL SIN IVA:
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#3D0026",
                        }}
                      >
                        {parseFloat(precioSinIva).toFixed(2)} €
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#F5F0F3" }}>
                      <td
                        colSpan="3"
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontWeight: "bold",
                          color: "#7C6406",
                        }}
                      >
                        TOTAL IVA (21%):
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#3D0026",
                        }}
                      >
                        {parseFloat(ivaTotal).toFixed(2)} €
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#DFD777" }}>
                      <td
                        colSpan="3"
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#3D0026",
                        }}
                      >
                        TOTAL CON IVA:
                      </td>
                      <td
                        style={{
                          padding: "15px",
                          textAlign: "right",
                          fontSize: "22px",
                          fontWeight: "bold",
                          color: "#3D0026",
                        }}
                      >
                        {parseFloat(precioTotal).toFixed(2)} €
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Selector de direcciones */}
              <div
                style={{
                  marginTop: "30px",
                  padding: "25px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ color: "#3D0026", marginBottom: "15px" }}>
                  Dirección de envío
                </h3>
                {cargandoDirecciones ? (
                  <p style={{ color: "#9C7C77" }}>Cargando direcciones...</p>
                ) : direcciones.length === 0 ? (
                  <div>
                    <p style={{ color: "#7C6406" }}>
                      No tienes direcciones guardadas.
                    </p>
                    <button
                      onClick={() => navigate("/perfil")}
                      style={{
                        ...buttonStyles.accent,
                        padding: "10px 20px",
                        marginTop: "10px",
                      }}
                    >
                      Añadir dirección
                    </button>
                  </div>
                ) : (
                  <select
                    value={direccionSeleccionada}
                    onChange={(e) => setDireccionSeleccionada(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `2px solid #E5DDE2`,
                      fontSize: "14px",
                      backgroundColor: "white",
                      color: "#3D0026",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#DFD777")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5DDE2")
                    }
                  >
                    {direcciones.map((dir) => (
                      <option key={dir.id} value={dir.id}>
                        {dir.direccion}, {dir.ciudad}, {dir.codigoPostal}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Botones */}
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "30px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={confirmarPedido}
                  disabled={direcciones.length === 0}
                  style={{
                    ...buttonStyles.success,
                    padding: "12px 28px",
                    fontSize: "16px",
                    opacity: direcciones.length === 0 ? 0.5 : 1,
                    cursor:
                      direcciones.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {direcciones.length === 0
                    ? "Añade una dirección primero"
                    : "Confirmar compra"}
                </button>
                <button
                  onClick={clearCarrito}
                  style={{
                    ...buttonStyles.danger,
                    padding: "12px 28px",
                    fontSize: "16px",
                  }}
                >
                  Vaciar carrito
                </button>
                <button
                  onClick={volver}
                  style={{
                    ...buttonStyles.accent,
                    padding: "12px 28px",
                    fontSize: "16px",
                  }}
                >
                  Seguir comprando
                </button>
              </div>

              {carrito.some((item) => item.cantidad >= item.stock) && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "12px 20px",
                    backgroundColor: "#FFF8E1",
                    color: "#7C6406",
                    borderRadius: "8px",
                    fontSize: "14px",
                    borderLeft: `4px solid #DFD777`,
                  }}
                >
                  Algunos productos han alcanzado el límite de stock disponible.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrito;
