<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'mensaje' => 'Usuario no encontrado'
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Token inválido o ausente'
            ], 401);
        }

        return $next($request);
    }
}
