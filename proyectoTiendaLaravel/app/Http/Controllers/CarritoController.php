<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\Producto;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CarritoController extends Controller
{
    // Obtener el ID del usuario autenticado con JWT
    private function getUserId()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return $user ? $user->ID_usuario : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getCarrito()
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $productos = Carrito::getByUser($userId);

        return response()->json([
            'success' => true,
            'carrito' => $productos,
            'precioSinIva' => round(Carrito::precioSinIva($userId), 2),
            'ivaTotal' => round(Carrito::ivaTotal($userId), 2),
            'precioTotal' => round(Carrito::precioTotal($userId), 2)
        ]);
    }

    public function addProducto(Request $request)
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Debes iniciar sesión'
            ], 401);
        }

        $request->validate([
            'id' => 'required|integer|exists:productos,ID_producto',
            'cantidad' => 'sometimes|integer|min:1'
        ]);

        $productoId = $request->input('id');
        $cantidad = $request->input('cantidad', 1);

        // Verificar stock
        $producto = Producto::getById($productoId);
        if (!$producto) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Producto no encontrado'
            ], 404);
        }

        if ($producto->Stock < $cantidad) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No hay suficiente stock'
            ], 400);
        }

        Carrito::addProducto($userId, $productoId, $cantidad);

        return response()->json([
            'success' => true,
            'mensaje' => 'Producto añadido al carrito'
        ]);
    }

    public function quitarProducto(Request $request)
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $request->validate([
            'id' => 'required|integer'
        ]);

        $productoId = $request->input('id');
        Carrito::removeProducto($userId, $productoId);

        return response()->json([
            'success' => true,
            'mensaje' => 'Producto eliminado del carrito'
        ]);
    }

    public function clearCarrito()
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        Carrito::clear($userId);

        return response()->json([
            'success' => true,
            'mensaje' => 'Carrito vaciado'
        ]);
    }
}
