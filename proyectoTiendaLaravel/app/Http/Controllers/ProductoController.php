<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Obtener todos los productos
     * GET /api/productos
     */
    public function index()
    {
        $productos = Producto::getAll();
        $productosConIva = [];
        foreach ($productos as $producto) {
            $precioConIva = $producto['precio'] * (1 + $producto['iva'] / 100);

            $productosConIva[] = [
                'id' => $producto['id'],
                'nombre' => $producto['nombre'],
                'descripcion' => $producto['descripcion'],
                'precio' => $producto['precio'],
                'iva' => $producto['iva'],
                'precioConIva' => round($precioConIva, 2), // ← AÑADIR ESTO
                'stock' => $producto['stock'],
                'categoria' => $producto['categoria']
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $productosConIva
        ]);
    }

    /**
     * Obtener un producto específico
     * GET /api/productos/{id}
     */
    public function show($id)
    {
        $producto = Producto::getById($id);


        if (!$producto) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }
        $precioConIva = $producto->getPrecio() * (1 + $producto->getIva() / 100);
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $producto->getId(),
                'nombre' => $producto->getNombre(),
                'descripcion' => $producto->getDesc(),
                'precio' => $producto->getPrecio(),
                'iva' => $producto->getIva(),
                'precioConIva' => $precioConIva,
                'stock' => $producto->getStock(),
                'categoria' => $producto->getCategoria()
            ]
        ]);
    }

    /**
     * Actualizar stock de un producto
     * PUT /api/productos/{id}/stock
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:0'
        ]);

        $producto = Producto::getById($id);

        if (!$producto) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        // Actualizar stock usando DB directo o método de actualización
        \Illuminate\Support\Facades\DB::table('productos')
            ->where('ID_producto', $id)
            ->update(['Stock' => $request->stock]);

        return response()->json([
            'success' => true,
            'message' => 'Stock actualizado correctamente'
        ]);
    }
}
