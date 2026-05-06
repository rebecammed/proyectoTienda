<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Usuario;
use App\Models\Pedido;
use App\Models\Direccion;
use App\Models\LineaPedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class AdminController extends Controller
{
    /**
     * Obtener todas las estadísticas
     * GET /api/admin/stats
     */

    public function stats()
    {
        // Total usuarios
        $totalUsuarios = DB::table('usuarios')->count();
        $usuariosActivos = DB::table('usuarios')->where('Activo', 1)->count();

        // Total productos
        $totalProductos = DB::table('productos')->count();
        $productosStockBajo = DB::table('productos')->where('Stock', '<', 5)->count();

        // Pedidos pendientes
        $pedidosPendientes = DB::table('pedidos')->where('Estado', 'pendiente')->count();
        $pedidosTotales = DB::table('pedidos')->count();

        // Ventas totales
        $ventasTotales = DB::table('pedidos')->sum('Importe_total') ?? 0;

        return response()->json([
            'success' => true,
            'stats' => [
                'totalUsuarios' => $totalUsuarios,
                'usuariosActivos' => $usuariosActivos,
                'totalProductos' => $totalProductos,
                'productosStockBajo' => $productosStockBajo,
                'pedidosPendientes' => $pedidosPendientes,
                'pedidosTotales' => $pedidosTotales,
                'ventasTotales' => round($ventasTotales, 2)
            ]
        ]);
    }
    /**
     * Obtener todos los usuarios
     * GET /api/admin/usuarios
     */
    public function getUsuarios()
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $usuarios = DB::table('usuarios')
            ->select('ID_usuario', 'Email', 'Nombre_completo', 'Rol', 'Activo', 'Fecha_creacion', 'Fecha_baja')
            ->get();

        return response()->json([
            'success' => true,
            'usuarios' => $usuarios
        ]);
    }

    /**
     * Crear un nuevo producto
     * POST /api/admin/productos
     */
    public function createProducto(Request $request)
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $request->validate([
            'nombre' => 'required|string|max:50',
            'descripcion' => 'required|string|max:200',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoria' => 'required|string|in:BOLSOS,PENDIENTES,CHARMS',
            'iva' => 'required|integer|min:0|max:100',
            'url_imagenes' => 'nullable|string|max:200'
        ]);

        $id = DB::table('productos')->insertGetId([
            'Nombre' => $request->input('nombre'),
            'Descripcion_producto' => $request->input('descripcion'),
            'Precio' => $request->input('precio'),
            'Stock' => $request->input('stock'),
            'Categoria' => $request->input('categoria'),
            'IVA' => $request->input('iva'),
            'URL_imagenes' => $request->input('url_imagenes')
        ]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Producto creado correctamente',
            'id' => $id
        ]);
    }

    /**
     * Actualizar un producto existente
     * PUT /api/admin/productos/{id}
     */
    public function updateProducto(Request $request, $id)
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $request->validate([
            'nombre' => 'sometimes|string|max:50',
            'descripcion' => 'sometimes|string|max:200',
            'precio' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'categoria' => 'sometimes|string|in:BOLSOS,PENDIENTES,CHARMS',
            'iva' => 'sometimes|integer|min:0|max:100',
            'url_imagenes' => 'nullable|string|max:200'
        ]);

        $producto = Producto::getById($id);

        if (!$producto) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Producto no encontrado'
            ], 404);
        }

        $datos = [];
        if ($request->has('nombre')) $datos['Nombre'] = $request->input('nombre');
        if ($request->has('descripcion')) $datos['Descripcion_producto'] = $request->input('descripcion');
        if ($request->has('precio')) $datos['Precio'] = $request->input('precio');
        if ($request->has('stock')) $datos['Stock'] = $request->input('stock');
        if ($request->has('categoria')) $datos['Categoria'] = $request->input('categoria');
        if ($request->has('iva')) $datos['IVA'] = $request->input('iva');
        if ($request->has('url_imagenes')) $datos['URL_imagenes'] = $request->input('url_imagenes');

        DB::table('productos')
            ->where('ID_producto', $id)
            ->update($datos);

        return response()->json([
            'success' => true,
            'mensaje' => 'Producto actualizado correctamente'
        ]);
    }

    /**
     * Eliminar un producto
     * DELETE /api/admin/productos/{id}
     */
    public function deleteProducto($id)
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $producto = Producto::getById($id);

        if (!$producto) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Producto no encontrado'
            ], 404);
        }

        DB::table('productos')
            ->where('ID_producto', $id)
            ->delete();

        return response()->json([
            'success' => true,
            'mensaje' => 'Producto eliminado correctamente'
        ]);
    }

    /**
     * Obtener todos los pedidos
     * GET /api/admin/pedidos
     */
    public function getPedidos()
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $pedidos = DB::table('pedidos as p')
            ->leftJoin('usuarios as u', 'p.ID_usuario', '=', 'u.ID_usuario')
            ->select(
                'p.ID_pedido',
                'p.ID_usuario',
                'u.Nombre_completo',
                'u.Email',
                'p.Fecha_pedido',
                'p.Importe_total',
                'p.Importe_IVA',
                'p.Estado'
            )
            ->orderBy('p.Fecha_pedido', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'pedidos' => $pedidos
        ]);
    }

    /**
     * Obtener pedidos de un usuario específico
     * GET /api/admin/pedidos/usuario/{id}
     */
    public function getPedidosByUser($id)
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $pedidos = DB::table('pedidos')
            ->where('ID_usuario', $id)
            ->orderBy('Fecha_pedido', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'pedidos' => $pedidos
        ]);
    }
    /**
     * Obtener el detalle de un pedido específico
     * GET /api/admin/pedidos/{id}
     */
    public function detallePedido($id)
    {
        $pedido = Pedido::getById($id);

        if (!$pedido) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Pedido no encontrado'
            ], 404);
        }

        // Obtener la dirección usando el ID_usuario del pedido y el ID_direccion
        $direccion = Direccion::getById($pedido->ID_direccion, $pedido->ID_usuario);
        $lineas = LineaPedido::getByPedido($id);

        return response()->json([
            'success' => true,
            'pedido' => $pedido,
            'direccion' => $direccion,
            'lineas' => $lineas
        ]);
    }
    /**
     * Modificar el estado de un pedido específico
     * PUT /api/admin/pedidos/{id}/estado
     */
    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:PENDIENTE,ENVIADO'
        ]);

        $pedido = Pedido::getById($id);

        if (!$pedido) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Pedido no encontrado'
            ], 404);
        }

        DB::table('pedidos')
            ->where('ID_pedido', $id)
            ->update(['Estado' => $request->estado]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Estado actualizado correctamente',
            'estado' => $request->estado
        ]);
    }
    /**
     * Obtener un usuario específico
     * GET /api/admin/usuarios/{id}
     */
    public function getUsuario($id)
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $usuario = DB::table('usuarios')
            ->select('ID_usuario', 'Email', 'Nombre_completo', 'Rol', 'Activo', 'Fecha_creacion', 'Fecha_baja')
            ->where('ID_usuario', $id)
            ->first();

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Usuario no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'usuario' => $usuario
        ]);
    }

    /**
     * Cambiar el estado de un usuario (activar/desactivar)
     * PUT /api/admin/usuarios/{id}/estado
     */
    public function toggleUsuarioEstado($id, Request $request)
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $request->validate([
            'activo' => 'required|boolean'
        ]);

        $usuario = DB::table('usuarios')
            ->where('ID_usuario', $id)
            ->first();

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Usuario no encontrado'
            ], 404);
        }

        DB::table('usuarios')
            ->where('ID_usuario', $id)
            ->update(['Activo' => $request->input('activo')]);

        $estado = $request->input('activo') == 1 ? 'activado' : 'desactivado';

        return response()->json([
            'success' => true,
            'mensaje' => "Usuario {$estado} correctamente"
        ]);
    }

    /**
     * Eliminar cuenta de usuario (anonimizar) - Solo ADMIN
     * DELETE /api/admin/usuarios/{id}/eliminar
     */
    public function eliminarCuentaAdmin($id)
    {
        if (session()->get('rol') !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado'
            ], 403);
        }

        $usuario = DB::table('usuarios')
            ->where('ID_usuario', $id)
            ->first();

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Usuario no encontrado'
            ], 404);
        }

        // Usar el mismo método que usa el usuario para eliminar su cuenta
        Usuario::eliminarCuenta($id);

        return response()->json([
            'success' => true,
            'mensaje' => 'Cuenta eliminada correctamente'
        ]);
    }
}
