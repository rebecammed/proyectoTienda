<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\LineaPedido;
use App\Models\Direccion;
use App\Models\Carrito;
use App\Models\Producto;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class PedidoController extends Controller
{
    private function getUserIdAndRole()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return [
                'id' => $user ? $user->ID_usuario : null,
                'rol' => $user ? $user->Rol : null
            ];
        } catch (\Exception $e) {
            return ['id' => null, 'rol' => null];
        }
    }

    public function confirmarPedido(Request $request)
    {
        $auth = $this->getUserIdAndRole();
        if (!$auth['id']) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Debes iniciar sesión para realizar un pedido'
            ], 401);
        }

        $request->validate([
            'direccion_id' => 'required|integer|exists:direcciones,ID_direccion'
        ]);

        $userId = $auth['id'];
        $direccionId = $request->input('direccion_id');

        // Verificar que la dirección pertenece al usuario
        $direccion = Direccion::getById($direccionId, $userId);
        if (!$direccion) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Dirección no válida'
            ], 400);
        }

        // Obtener carrito de la BD
        $productosCarrito = Carrito::getByUser($userId);

        if (empty($productosCarrito)) {
            return response()->json([
                'success' => false,
                'mensaje' => 'El carrito está vacío'
            ], 400);
        }

        // Verificar stock disponible
        foreach ($productosCarrito as $item) {
            $producto = Producto::getById($item->id);
            if (!$producto || $producto->getStock() < $item->cantidad) {
                return response()->json([
                    'success' => false,
                    'mensaje' => "Stock insuficiente para {$item->nombre}"
                ], 400);
            }
        }

        // Calcular totales
        $subtotal = Carrito::precioSinIva($userId);
        $importeIVA = Carrito::ivaTotal($userId);
        $importeTotal = Carrito::precioTotal($userId);

        // Crear pedido
        $pedidoId = Pedido::crearPedido($userId, $direccionId, $importeTotal, $importeIVA);

        // Crear líneas de pedido y actualizar stock
        LineaPedido::crearLineasDesdeCarrito($pedidoId, $productosCarrito);

        // Vaciar carrito
        Carrito::clear($userId);

        return response()->json([
            'success' => true,
            'mensaje' => 'Pedido confirmado correctamente',
            'pedido_id' => $pedidoId
        ]);
    }

    public function misPedidos()
    {
        $auth = $this->getUserIdAndRole();
        if (!$auth['id']) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $pedidos = Pedido::getByUser($auth['id']);

        return response()->json([
            'success' => true,
            'pedidos' => $pedidos
        ]);
    }

    public function detallePedido($id)
    {
        $auth = $this->getUserIdAndRole();
        if (!$auth['id']) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        // Admin puede ver cualquier pedido, usuario solo los suyos
        $pedido = ($auth['rol'] === 'ADMIN')
            ? Pedido::getById($id)
            : Pedido::getById($id, $auth['id']);

        if (!$pedido) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Pedido no encontrado'
            ], 404);
        }

        $direccion = Direccion::getById($pedido->ID_direccion, $pedido->ID_usuario);
        $lineas = LineaPedido::getByPedido($id);

        return response()->json([
            'success' => true,
            'pedido' => $pedido,
            'direccion' => $direccion,
            'lineas' => $lineas
        ]);
    }
}
