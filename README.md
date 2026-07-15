# Accesorios Hechos a Mano

Accesorios Hechos a Mano es una aplicación web full stack de comercio electrónico desarrollada para la gestión de una tienda online especializada en productos artesanales como bolsos, pendientes y charms.

La aplicación permite a los usuarios explorar productos, gestionar un carrito de compra, realizar pedidos y editar su perfil. Además, incorpora un panel de administración para la gestión de usuarios, productos y pedidos.

🔗 **Demo online:** [proyecto-tienda-sigma.vercel.app](https://proyecto-tienda-sigma.vercel.app/)

---

## Funcionalidades principales

### Usuario

- Registro e inicio de sesión de usuarios.
- Gestión del perfil personal.
- Edición de datos personales.
- Cambio de contraseña.
- Gestión de direcciones de envío y facturación.
- Visualización del catálogo de productos.
- Filtrado de productos por categorías.
- Consulta del detalle de cada producto.
- Gestión del carrito de compra.
- Realización de pedidos.
- Consulta del historial de pedidos.
- Eliminación de cuenta conforme al RGPD mediante anonimización de datos.

### Administración

- Panel de administración con estadísticas generales.
- Gestión de usuarios.
- Activación y desactivación de cuentas.
- Gestión completa de productos (crear, editar y eliminar).
- Gestión de pedidos.
- Filtrado de pedidos por estado, usuario y fecha.
- Actualización del estado de los pedidos.

---

## Capturas de pantalla

### Listado de productos y filtros

Catálogo con tarjetas de producto mostrando imagen, nombre, descripción, precio y stock.

![Productos](image-2.png)

---

### Carrito de compra

Gestión de los productos seleccionados antes de completar el pedido.

![Carrito](image.png)

---

### Panel de administración

Dashboard con estadísticas y accesos a las diferentes áreas de gestión.

![Panel admin](image-1.png)


## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React, JavaScript, HTML5, CSS3 |
| Backend | Laravel |
| Base de datos | MySQL |
| Entorno local | XAMPP |
| Despliegue | Vercel, Render, Aiven |
| Control de versiones | GitHub |

---

## Desarrollo del proyecto

Este proyecto fue desarrollado íntegramente por mí durante el periodo de prácticas, encargándome de todas las fases del desarrollo: análisis, diseño, implementación, pruebas y despliegue.

Durante su construcción trabajé en una arquitectura full stack completa, desarrollando:

- Backend con Laravel, implementando la lógica de negocio, gestión de usuarios, productos, pedidos y comunicación con la base de datos.
- Frontend con React, creando interfaces dinámicas para la tienda, carrito, perfil de usuario y panel administrativo.
- Diseño e implementación de la base de datos MySQL, definiendo entidades, relaciones y consultas necesarias para el funcionamiento de la aplicación.
- Sistema de autenticación con gestión de roles diferenciando usuarios estándar y administradores.
- Gestión del proceso completo de compra, desde la selección de productos hasta la creación y consulta de pedidos.
- Implementación de funcionalidades relacionadas con privacidad y RGPD, como la eliminación de cuentas mediante anonimización.
- Configuración y despliegue de la aplicación en un entorno online.

### Aprendizajes y retos

Tras la experiencia adquirida en el desarrollo de NoVerifactu, este proyecto me permitió aplicar y consolidar conocimientos de desarrollo full stack en una aplicación orientada a un caso de uso real de comercio electrónico.

Los principales retos fueron modelar correctamente las relaciones entre usuarios, productos y pedidos, implementar el flujo completo de compra, gestionar los diferentes permisos según roles y organizar una aplicación con distintas áreas funcionales para usuarios y administradores.

Este proyecto me permitió mejorar la estructura y organización del desarrollo, trabajar con una mayor autonomía y reforzar mi capacidad para transformar requisitos funcionales en soluciones técnicas mantenibles.
---

## Estructura del proyecto
proyecto-tienda
│

├── backend # API y lógica del servidor Laravel

├── frontend # Aplicación React

├── database

│ └── database.sql

└── README.md


---

## Puesta en marcha

### Requisitos previos

- PHP
- Composer
- Node.js
- MySQL
- Git

### Instalación

```bash
git clone https://github.com/usuario/proyecto-tienda
```
### Backend
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Autora 
Desarrollado por **Rebeca Martínez Medina** como proyecto del Ciclo Superior de Desarrollo de Aplicaciones Web (DAW). 
[LinkedIn](https://www.linkedin.com/in/rebeca-mart%C3%ADnez-medina/) · [GitHub](https://github.com/rebecammed)
