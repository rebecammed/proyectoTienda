import { useState } from "react";

import Login from "./pages/Auth/Login";
import Registro from "./pages/Auth/Registro";
import Productos from "./pages/Producto/Productos";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Auth/Perfil";
import MisPedidos from "./pages/Pedido/MisPedidos";
import DetallePedido from "./pages/Pedido/DetallePedido";
import AdminPanel from "./pages/Admin/AdminPanel";
import ProtectedRoute from "./ProtectedRoute";
import UserList from "./pages/Admin/UserList";
import ProductList from "./pages/Admin/ProductList";
import ProductForm from "./pages/Admin/ProductForm";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import PoliticaPrivacidad from "./pages/Auth/PoliticaPrivacidad";
import AdminPedidosUsuario from "./pages/Admin/AdminPedidosUsuario";
import AdminDetallePedido from "./pages/Admin/AdminDetallePedido";
import DetalleProducto from "./pages/Producto/DetalleProducto";
import LandingPage from "./pages/LandingPage";
import AdminPedidos from "./pages/Admin/AdminPedidos";

import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Componente para envolver las rutas protegidas
function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/productos/:id" element={<DetalleProducto />} />
      {/* Rutas protegidas (requieren login) */}

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />
      <Route
        path="/carrito"
        element={
          <ProtectedRoute>
            <Carrito />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-pedidos"
        element={
          <ProtectedRoute>
            <MisPedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedido/:id"
        element={
          <ProtectedRoute>
            <DetallePedido />
          </ProtectedRoute>
        }
      />

      {/* Ruta de admin (requiere rol ADMIN) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute requireAdmin={true}>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute requireAdmin={true}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos/editar/:id"
        element={
          <ProtectedRoute requireAdmin={true}>
            <ProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos/nuevo"
        element={
          <ProtectedRoute requireAdmin={true}>
            <ProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios/:id/pedidos"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPedidosUsuario />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pedidos/:id"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDetallePedido />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pedidos"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPedidos />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
