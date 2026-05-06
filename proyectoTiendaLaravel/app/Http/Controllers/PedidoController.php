<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\LineaPedido;
use App\Models\Direccion;
use Illuminate\Http\Request;

class PedidoController extends Controller
{

    public function confirmarPedido(Request $request)
    {
        // Verificar autenticación
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Debes iniciar sesión para realizar un pedido'
            ], 401);
        }

        // Validar que tiene dirección seleccionada
        $request->validate([
            'direccion_id' => 'required|integer|exists:direcciones,ID_direccion'
        ]);

        $userId = session()->get('usuario_id');
        $direccionId = $request->input('direccion_id');

        // Verificar que la dirección pertenece al usuario
        $direccion = Direccion::getById($direccionId, $userId);
        if (!$direccion) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Dirección no válida'
            ], 400);
        }

        // Obtener carrito
        if (!session()->has('carrito')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'El carrito está vacío'
            ], 400);
        }

        $carrito = session()->get('carrito');
        $productos = $carrito->getCarrito();

        if (empty($productos)) {
            return response()->json([
                'success' => false,
                'mensaje' => 'El carrito está vacío'
            ], 400);
        }

        // Verificar stock disponible
        foreach ($productos as $item) {
            $stockActual = \Illuminate\Support\Facades\DB::table('productos')
                ->where('ID_producto', $item['id'])
                ->value('Stock');

            if ($stockActual < $item['cantidad']) {
                return response()->json([
                    'success' => false,
                    'mensaje' => "Stock insuficiente para {$item['nombre']}. Disponible: $stockActual"
                ], 400);
            }
        }

        // Calcular totales
        $subtotal = $carrito->precioSinIva();
        $importeIVA = $carrito->ivaTotal();
        $importeTotal = $carrito->precioTotal();

        // Crear pedido
        $pedidoId = Pedido::crearPedido(
            $userId,
            $direccionId,
            $importeTotal,
            $importeIVA
        );

        // Crear líneas de pedido y actualizar stock
        LineaPedido::crearLineas($pedidoId, $carrito);

        // Vaciar carrito
        $carrito->vaciar();
        session()->put('carrito', $carrito);

        return response()->json([
            'success' => true,
            'mensaje' => 'Pedido confirmado correctamente',
            'pedido_id' => $pedidoId
        ]);
    }

    public function misPedidos()
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $userId = session()->get('usuario_id');
        $pedidos = Pedido::getByUser($userId);

        return response()->json([
            'success' => true,
            'pedidos' => $pedidos
        ]);
    }

    public function detallePedido($id)
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $userId = session()->get('usuario_id');
        $rol = session()->get('rol');

        // Admin puede ver cualquier pedido, usuario solo los suyos
        $pedido = ($rol === 'ADMIN')
            ? Pedido::getById($id)
            : Pedido::getById($id, $userId);

        if (!$pedido) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Pedido no encontrado'
            ], 404);
        }
        $direccion = Direccion::getById($pedido->ID_direccion, $userId);

        $lineas = LineaPedido::getByPedido($id);

        return response()->json([
            'success' => true,
            'pedido' => $pedido,
            'direccion' => $direccion,
            'lineas' => $lineas
        ]);
    }
}
