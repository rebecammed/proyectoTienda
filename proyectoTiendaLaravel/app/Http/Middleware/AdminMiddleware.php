<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    public function handle($request, Closure $next)
    {
        Log::info('AdminMiddleware - Headers: ' . json_encode($request->headers->all()));

        try {
            $user = JWTAuth::parseToken()->authenticate();
            Log::info('AdminMiddleware - Usuario autenticado: ' . ($user ? $user->ID_usuario : 'null'));
        } catch (\Exception $e) {
            Log::error('AdminMiddleware - Error JWT: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'mensaje' => 'No autenticado: ' . $e->getMessage()
            ], 401);
        }

        if ($user->Rol !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado. Se requieren permisos de administrador.'
            ], 403);
        }

        return $next($request);
    }
}
