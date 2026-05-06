<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\Producto;
use Illuminate\Http\Request;


class CarritoController extends Controller
{
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
            // Calcular precio con IVA para cada producto
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
            'carrito' => $productosConPrecios,  // Productos con precios calculados
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

            // Verificar autenticación
            if (!session()->has('usuario_id')) {
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
                // Verificar que es una instancia de Carrito
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
                    'mensaje' => $e->getMessage() // "No hay suficiente stock..."
                ], 400);
            }

            // Guardar carrito actualizado en sesión
            session()->put('carrito', $carrito);

            return response()->json([
                'success' => true,
                'carrito' => $carrito->getCarrito(),
                'total' => $carrito->precioTotal()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'mensaje' => $e->getMessage(),
                'linea' => $e->getLine(),
                'archivo' => $e->getFile()
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
                'carrito' => [],
                'total' => 0
            ]);
        }

        $carrito = session()->get('carrito');
        $carrito->delProd($request->input('id'));

        // Guardar carrito actualizado
        session()->put('carrito', $carrito);

        return response()->json([
            'success' => true,
            'carrito' => $carrito->getCarrito(),
            'total' => $carrito->precioTotal()
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
            'carrito' => [],
            'total' => 0
        ]);
    }
}
