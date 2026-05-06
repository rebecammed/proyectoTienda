<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS para rutas API
        $middleware->append(HandleCors::class);
        // Asegurar que las sesiones funcionan en las rutas API
        $middleware->api(append: [
            \Illuminate\Session\Middleware\StartSession::class,
        ]);
        // Trust hosts
        $middleware->trustHosts(at: ['localhost:8000', 'localhost:5173']);

        // Middleware personalizados (alias)
        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        // Middleware global (se ejecuta en todas las peticiones)
        $middleware->append(\App\Http\Middleware\Cors::class);
    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
