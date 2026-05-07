<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\Producto;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CarritoController extends Controller
{
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

        // Calcular precios con IVA para cada producto
        $productosConIva = [];
        foreach ($productos as $item) {
            $precioConIva = $item->precio_base * (1 + $item->iva_porcentaje / 100);
            $productosConIva[] = [
                'id' => $item->id,
                'nombre' => $item->nombre,
                'descripcion' => $item->descripcion,
                'cantidad' => $item->cantidad,
                'precio_base' => $item->precio_base,
                'iva_porcentaje' => $item->iva_porcentaje,
                'precio_con_iva' => round($precioConIva, 2),
                'total_producto' => round($precioConIva * $item->cantidad, 2),
                'stock' => $item->stock
            ];
        }

        return response()->json([
            'success' => true,
            'carrito' => $productosConIva,
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
        if (!$producto || $producto->getStock() < $cantidad) {
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

        Carrito::removeProducto($userId, $request->input('id'));

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
