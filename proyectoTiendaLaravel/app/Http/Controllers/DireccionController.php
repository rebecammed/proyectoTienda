<?php

namespace App\Http\Controllers;

use App\Models\Direccion;
use Illuminate\Http\Request;

class DireccionController extends Controller
{
    public function getByUser()
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $userId = session()->get('usuario_id');
        $direcciones = Direccion::getByUser($userId);

        if (!empty($direcciones)) {
            $result = [];
            foreach ($direcciones as $dir) {
                $result[] = [
                    'id' => $dir->getId(),
                    'idUser' => $userId,
                    'direccion' => $dir->getDireccion(),
                    'codigoPostal' => $dir->getCp(),
                    'ciudad' => $dir->getCiudad(),
                    'provincia' => $dir->getProvincia(),
                    'facturacion' => $dir->getFacturacion()
                ];
            }

            return response()->json([
                'success' => true,
                'direcciones' => $result
            ]);
        }

        return response()->json([
            'success' => false,
            'mensaje' => 'Dirección no disponible para el usuario indicado'
        ], 404);
    }

    public function actualizarDireccion(Request $request)
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $request->validate([
            'id' => 'required|integer',
            'direccion' => 'required|string',
            'codigoPostal' => 'required|string',
            'ciudad' => 'required|string',
            'provincia' => 'required|string',
            'facturacion' => 'required|boolean'
        ]);

        $userId = session()->get('usuario_id');
        $dirId = $request->input('id');

        $direccion = Direccion::getById($dirId, $userId);

        if (!$direccion) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Dirección no disponible para el usuario indicado'
            ], 404);
        }

        $direccion->setDireccion($request->input('direccion'));
        $direccion->setCp($request->input('codigoPostal'));
        $direccion->setCiudad($request->input('ciudad'));
        $direccion->setProvincia($request->input('provincia'));

        if ($request->input('facturacion') === true) {
            $direccion->setFacturacion();
        } else {
            $direccion->unsetFacturacion();
        }

        if (Direccion::actualizar($direccion, $userId)) {
            return response()->json([
                'success' => true,
                'mensaje' => 'Dirección actualizada correctamente'
            ]);
        }

        return response()->json([
            'success' => false,
            'mensaje' => 'Error al actualizar'
        ], 500);
    }

    public function crearDireccion(Request $request)
    {
        if (!session()->has('usuario_id')) {
            return response()->json(['success' => false, 'mensaje' => 'No autenticado'], 401);
        }

        $request->validate([
            'direccion' => 'required|string',
            'codigoPostal' => 'required|string',
            'ciudad' => 'required|string',
            'provincia' => 'required|string',
            'facturacion' => 'boolean'
        ]);

        $userId = session()->get('usuario_id');

        // Si esta dirección es de facturación, quitar facturación de otras
        if ($request->input('facturacion')) {
            \Illuminate\Support\Facades\DB::table('direcciones')
                ->where('ID_usuario', $userId)
                ->update(['Facturacion' => false]);
        }

        $id = \Illuminate\Support\Facades\DB::table('direcciones')->insertGetId([
            'ID_usuario' => $userId,
            'Direccion' => $request->input('direccion'),
            'CP' => $request->input('codigoPostal'),
            'Ciudad' => $request->input('ciudad'),
            'Provincia' => $request->input('provincia'),
            'Facturacion' => $request->input('facturacion', false)
        ]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Dirección creada correctamente',
            'id' => $id
        ]);
    }

    public function eliminarDireccion($id)
    {
        if (!session()->has('usuario_id')) {
            return response()->json(['success' => false, 'mensaje' => 'No autenticado'], 401);
        }

        $userId = session()->get('usuario_id');

        $deleted = \Illuminate\Support\Facades\DB::table('direcciones')
            ->where('ID_direccion', $id)
            ->where('ID_usuario', $userId)
            ->delete();

        if ($deleted) {
            return response()->json([
                'success' => true,
                'mensaje' => 'Dirección eliminada correctamente'
            ]);
        }

        return response()->json([
            'success' => false,
            'mensaje' => 'Dirección no encontrada'
        ], 404);
    }
}
