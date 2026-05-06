<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Carrito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'contrasena' => 'required|string'
        ]);

        $usuario = $request->input('usuario');
        $contrasena = $request->input('contrasena');

        $user = Usuario::login($usuario, $contrasena);

        if (!$user) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Usuario o contraseña incorrectos'
            ], 401);
        }
        session()->put('usuario_id', $user['ID_usuario']);
        session()->put('usuario', $user['Nombre_completo']);
        session()->put('rol', $user['Rol'] ?? 'USER');
        session()->put('carrito', new Carrito());
        session()->save();

        return response()->json([
            'success' => true,
            'usuario' => $user['Nombre_completo'],
            'rol' => $user['Rol'] ?? 'USER'
        ]);
    }

    public function registro(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string|max:30',
            'contrasena' => 'required|string|max:30',
            'nombre_completo' => 'required|string'
        ]);

        $usuario = $request->input('usuario');
        $contrasena = $request->input('contrasena');
        $nombre_completo = $request->input('nombre_completo');

        if (Usuario::existeUsuario($usuario)) {
            return response()->json([
                'success' => false,
                'mensaje' => 'El usuario ya existe'
            ], 409);
        }

        $ok = Usuario::crearUsuario($usuario, $contrasena, $nombre_completo);

        return response()->json([
            'success' => $ok
        ]);
    }

    public function logout()
    {
        // No verificar autenticación, simplemente limpiar sesión si existe
        if (session()->has('usuario_id')) {
            session()->flush();
        }

        return response()->json([
            'success' => true
        ]);
    }

    public function obtenerPerfil()
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $user_id = session()->get('usuario_id');
        $usuario = Usuario::getById($user_id);

        if ($usuario) {
            return response()->json([
                'success' => true,
                'usuario' => [
                    'id' => $usuario->getId(),
                    'nombre' => $usuario->getNombre(),
                    'email' => $usuario->getEmail(),
                    'activo' => $usuario->isActivo(),
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'mensaje' => 'Usuario no encontrado'
        ], 404);
    }

    public function actualizarPerfil(Request $request)
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $request->validate([
            'nombre' => 'required|string',
            'email' => 'required|email'
        ]);

        $user_id = session()->get('usuario_id');
        $usuario = Usuario::getById($user_id);

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Usuario no encontrado'
            ], 404);
        }

        $usuario->setNombre($request->input('nombre'));
        $usuario->setEmail($request->input('email'));

        if (Usuario::actualizar($usuario)) {
            return response()->json([
                'success' => true,
                'mensaje' => 'Perfil actualizado correctamente'
            ]);
        }

        return response()->json([
            'success' => false,
            'mensaje' => 'Error al actualizar'
        ], 500);
    }
    public function eliminarCuenta()
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado'
            ], 401);
        }

        $userId = session()->get('usuario_id');

        // Usar el método del modelo que anonimiza
        Usuario::eliminarCuenta($userId);

        // Cerrar sesión
        session()->flush();

        return response()->json([
            'success' => true,
            'mensaje' => 'Cuenta eliminada correctamente. Tus datos han sido anonimizados según el RGPD.'
        ]);
    }

    /**
     * Solicitar recuperación de contraseña
     * POST /api/forgot-password
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');

        // Buscar usuario por email
        $usuario = DB::table('usuarios')
            ->where('Email', $email)
            ->where('Activo', 1)
            ->first();

        if (!$usuario) {
            // Por seguridad, no revelamos si el email existe
            return response()->json([
                'success' => true,
                'mensaje' => 'Si el email existe, recibirás un enlace de recuperación'
            ]);
        }

        // Generar token único
        $token = bin2hex(random_bytes(32));
        $expira = now()->addHours(2);

        // Actualizar el usuario con el token
        DB::table('usuarios')
            ->where('Email', $email)
            ->update([
                'Reset_token' => $token,
                'Reset_expira' => $expira
            ]);

        // Enlace de recuperación (para desarrollo, lo devolvemos en la respuesta)
        $resetLink = "http://localhost:5173/reset-password?token={$token}&email=" . urlencode($email);

        return response()->json([
            'success' => true,
            'mensaje' => 'Se ha enviado un enlace de recuperación a tu email',
            'reset_link' => $resetLink // Solo para pruebas, quitar en producción
        ]);
    }

    /**
     * Restablecer contraseña
     * POST /api/reset-password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]);

        $email = $request->input('email');
        $token = $request->input('token');
        $newPassword = $request->input('password');

        // Buscar usuario con token válido y no expirado
        $usuario = DB::table('usuarios')
            ->where('Email', $email)
            ->where('Reset_token', $token)
            ->where('Reset_expira', '>', now())
            ->first();

        if (!$usuario) {
            return response()->json([
                'success' => false,
                'mensaje' => 'El enlace es inválido o ha expirado'
            ], 400);
        }

        // Actualizar contraseña y limpiar token
        DB::table('usuarios')
            ->where('Email', $email)
            ->update([
                'Password_hash' => Hash::make($newPassword),
                'Reset_token' => null,
                'Reset_expira' => null
            ]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Contraseña actualizada correctamente'
        ]);
    }
}
