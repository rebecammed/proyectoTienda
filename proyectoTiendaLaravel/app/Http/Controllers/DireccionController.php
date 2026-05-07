<?php

namespace App\Http\Controllers;

use App\Models\Direccion;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class DireccionController extends Controller
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

    public function getByUser()
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $direcciones = Direccion::getByUser($userId);

        if (empty($direcciones)) {
            return response()->json([
                'success' => true,
                'direcciones' => []
            ]);
        }

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

    public function actualizarDireccion(Request $request, $id)
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $request->validate([
            'direccion' => 'required|string',
            'codigoPostal' => 'required|string',
            'ciudad' => 'required|string',
            'provincia' => 'required|string',
            'facturacion' => 'required|boolean'
        ]);



        $direccion = Direccion::getById($id, $userId);

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

        if ($request->input('facturacion')) {
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
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $request->validate([
            'direccion' => 'required|string',
            'codigoPostal' => 'required|string',
            'ciudad' => 'required|string',
            'provincia' => 'required|string',
            'facturacion' => 'boolean'
        ]);

        $id = Direccion::crear($userId, [
            'direccion' => $request->input('direccion'),
            'codigoPostal' => $request->input('codigoPostal'),
            'ciudad' => $request->input('ciudad'),
            'provincia' => $request->input('provincia'),
            'facturacion' => $request->input('facturacion', false)
        ]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Dirección creada correctamente',
            'id' => $id
        ]);
    }

    public function eliminarDireccion($id)
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $deleted = Direccion::eliminar($id, $userId);

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
