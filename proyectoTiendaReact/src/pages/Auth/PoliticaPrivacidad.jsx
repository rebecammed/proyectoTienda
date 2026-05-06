import { Link } from "react-router-dom";

function PoliticaPrivacidad() {
  return (
    <div
      style={{
        backgroundColor: "#E5DDE2",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Enlace volver */}
        <div style={{ marginBottom: "25px" }}>
          <Link
            to="/registro"
            style={{
              color: "#7C6406",
              textDecoration: "none",
              fontSize: "14px",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3D0026")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7C6406")}
          >
            ← Volver al registro
          </Link>
        </div>

        {/* Contenido principal */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderTop: `5px solid #DFD777`,
          }}
        >
          <h1
            style={{ color: "#3D0026", marginBottom: "15px", fontSize: "32px" }}
          >
            Politica de Privacidad
          </h1>

          <p
            style={{ color: "#9C7C77", marginBottom: "25px", fontSize: "14px" }}
          >
            Ultima actualizacion: 03/03/2026 – Version 1.0
          </p>

          <hr
            style={{
              border: "none",
              borderTop: `2px solid #E5DDE2`,
              marginBottom: "30px",
            }}
          />

          {/* Sección 1 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              1. Responsable del tratamiento
            </h3>
            <p style={{ color: "#3D0026", lineHeight: "1.6", margin: 0 }}>
              Titular: Rebeca Martinez Medina <br />
              NIF/CIF: 71902382N <br />
              Domicilio: Oviedo, Asturias <br />
              Email de contacto: rebecamm2495@gmail.com
            </p>
          </div>

          {/* Sección 2 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              2. Datos que recopilamos
            </h3>
            <p style={{ color: "#3D0026", marginBottom: "10px" }}>
              Recogemos los siguientes datos personales:
            </p>
            <ul
              style={{
                color: "#3D0026",
                paddingLeft: "25px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              <li>Nombre y apellidos o razon social.</li>
              <li>Correo electronico.</li>
              <li>Datos fiscales necesarios para la emision de facturas.</li>
              <li>
                Informacion tecnica necesaria para el funcionamiento del
                servicio.
              </li>
            </ul>
          </div>

          {/* Sección 3 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              3. Finalidad del tratamiento
            </h3>
            <p style={{ color: "#3D0026", marginBottom: "10px" }}>
              Los datos se tratan con las siguientes finalidades:
            </p>
            <ul
              style={{
                color: "#3D0026",
                paddingLeft: "25px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              <li>Gestionar el registro de usuarios.</li>
              <li>Permitir la emision y gestion de facturas.</li>
              <li>Cumplir obligaciones legales y fiscales.</li>
              <li>Garantizar la seguridad del servicio.</li>
            </ul>
          </div>

          {/* Sección 4 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              4. Base juridica
            </h3>
            <p style={{ color: "#3D0026", marginBottom: "10px" }}>
              La base legal para el tratamiento es:
            </p>
            <ul
              style={{
                color: "#3D0026",
                paddingLeft: "25px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              <li>
                La ejecucion del contrato al registrarse en la plataforma.
              </li>
              <li>El cumplimiento de obligaciones legales aplicables.</li>
              <li>El consentimiento del usuario.</li>
            </ul>
          </div>

          {/* Sección 5 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              5. Conservacion de los datos
            </h3>
            <p style={{ color: "#3D0026", lineHeight: "1.6", margin: 0 }}>
              Los datos se conservaran mientras exista relacion contractual y
              posteriormente durante los plazos legalmente exigidos en materia
              fiscal y mercantil.
            </p>
          </div>

          {/* Sección 6 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              6. Destinatarios
            </h3>
            <p style={{ color: "#3D0026", lineHeight: "1.6", margin: 0 }}>
              No se cederan datos a terceros salvo obligacion legal o cuando sea
              necesario para la prestacion del servicio (por ejemplo,
              proveedores de hosting).
            </p>
          </div>

          {/* Sección 7 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              7. Derechos del usuario
            </h3>
            <p style={{ color: "#3D0026", marginBottom: "10px" }}>
              El usuario puede ejercer los siguientes derechos:
            </p>
            <ul
              style={{
                color: "#3D0026",
                paddingLeft: "25px",
                marginBottom: "15px",
                lineHeight: "1.6",
              }}
            >
              <li>Acceso</li>
              <li>Rectificacion</li>
              <li>Supresion</li>
              <li>Oposicion</li>
              <li>Limitacion del tratamiento</li>
              <li>Portabilidad</li>
            </ul>
            <p
              style={{
                color: "#3D0026",
                marginBottom: "10px",
                lineHeight: "1.6",
              }}
            >
              Para ejercerlos puede enviar una solicitud a:
              rebecamm2495@gmail.com
            </p>
            <p style={{ color: "#3D0026", lineHeight: "1.6", margin: 0 }}>
              Asimismo, puede presentar reclamacion ante la Agencia Española de
              Proteccion de Datos (www.aepd.es).
            </p>
          </div>

          {/* Sección 8 */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              8. Seguridad
            </h3>
            <p style={{ color: "#3D0026", lineHeight: "1.6", margin: 0 }}>
              Aplicamos medidas tecnicas y organizativas adecuadas para
              garantizar la seguridad de los datos personales.
            </p>
          </div>

          {/* Sección 9 */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                color: "#3D0026",
                marginBottom: "12px",
                borderLeft: `3px solid #DFD777`,
                paddingLeft: "12px",
              }}
            >
              9. Cambios en la politica
            </h3>
            <p style={{ color: "#3D0026", lineHeight: "1.6", margin: 0 }}>
              Nos reservamos el derecho a modificar la presente politica para
              adaptarla a novedades legislativas o cambios en el servicio. En
              caso de cambios relevantes, se notificara a los usuarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliticaPrivacidad;
