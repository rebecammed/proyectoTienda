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
        // Asegurar que el carrito existe en sesión
        if (!session()->has('carrito')) {
            session()->put('carrito', new Carrito());
        }

        $carrito = session()->get('carrito');
        $productos = $carrito->getCarrito();

        // Preparar los productos con precios calculados
        $productosConPrecios = [];
        foreach ($productos as $producto) {
            $precioBase = isset($producto['precio']) ? (float)$producto['precio'] : 0;
            $iva = isset($producto['iva']) ? (float)$producto['iva'] : 21;
            $cantidad = isset($producto['cantidad']) ? (int)$producto['cantidad'] : 0;

            $precioConIva = $precioBase * (1 + $iva / 100);
            $totalProducto = $precioConIva * $cantidad;

            $productosConPrecios[] = [
                'id' => $producto['id'],
                'nombre' => $producto['nombre'],
                'descripcion' => $producto['desc'] ?? '',
                'cantidad' => $cantidad,
                'precio_base' => $precioBase,
                'iva_porcentaje' => $iva,
                'precio_con_iva' => round($precioConIva, 2),
                'total_producto' => round($totalProducto, 2),
                'stock' => $producto['stock'] ?? 0
            ];
        }

        return response()->json([
            'success' => true,
            'carrito' => $productosConPrecios,
            'precioSinIva' => round($carrito->precioSinIva(), 2),
            'ivaTotal' => round($carrito->ivaTotal(), 2),
            'precioTotal' => round($carrito->precioTotal(), 2)
        ]);
    }

    public function addProducto(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|integer|exists:productos,ID_producto'
            ]);

            // Verificar autenticación con JWT
            $userId = $this->getUserId();
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'mensaje' => 'Debes iniciar sesión'
                ], 401);
            }

            // Inicializar carrito si no existe
            if (!session()->has('carrito')) {
                $carrito = new Carrito();
                session()->put('carrito', $carrito);
            } else {
                $carrito = session()->get('carrito');
                if (!($carrito instanceof Carrito)) {
                    $carrito = new Carrito();
                    session()->put('carrito', $carrito);
                }
            }

            // Obtener el producto de la base de datos
            $producto = Producto::getById($request->input('id'));

            if (!$producto) {
                return response()->json([
                    'success' => false,
                    'mensaje' => 'Producto no encontrado'
                ], 404);
            }

            $carrito = session()->get('carrito');
            try {
                $carrito->addProd($producto);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'mensaje' => $e->getMessage()
                ], 400);
            }

            session()->put('carrito', $carrito);

            return response()->json([
                'success' => true,
                'mensaje' => 'Producto añadido al carrito'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }

    public function quitarProducto(Request $request)
    {
        $request->validate([
            'id' => 'required|integer'
        ]);

        if (!session()->has('carrito')) {
            return response()->json([
                'success' => true,
                'carrito' => [],
                'total' => 0
            ]);
        }

        $carrito = session()->get('carrito');
        $carrito->delProd($request->input('id'));
        session()->put('carrito', $carrito);

        return response()->json([
            'success' => true,
            'mensaje' => 'Producto eliminado del carrito'
        ]);
    }

    public function clearCarrito()
    {
        if (session()->has('carrito')) {
            $carrito = session()->get('carrito');
            $carrito->vaciar();
            session()->put('carrito', $carrito);
        }

        return response()->json([
            'success' => true,
            'mensaje' => 'Carrito vaciado'
        ]);
    }
}
