<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\DireccionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PedidoController;


// Rutas públicas
// Producto
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);
// Auth
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/registro', [AuthController::class, 'registro']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Rutas con login
Route::middleware('jwt')->group(function () {
    // Auth

    Route::get('/perfil', [AuthController::class, 'obtenerPerfil']);
    Route::put('/perfil', [AuthController::class, 'actualizarPerfil']);
    Route::delete('/perfil', [AuthController::class, 'eliminarCuenta']);

    // Carrito
    Route::get('/carrito', [CarritoController::class, 'getCarrito']);
    Route::post('/carrito/add', [CarritoController::class, 'addProducto']);
    Route::post('/carrito/remove', [CarritoController::class, 'quitarProducto']);
    Route::post('/carrito/clear', [CarritoController::class, 'clearCarrito']);

    // Dirección
    Route::get('/direcciones', [DireccionController::class, 'getByUser']);
    Route::put('/direcciones', [DireccionController::class, 'actualizarDireccion']);
    Route::post('/direcciones', [DireccionController::class, 'crearDireccion']);
    Route::delete('/direcciones/{id}', [DireccionController::class, 'eliminarDireccion']);

    // Pedido   
    Route::post('/pedido/confirmar', [PedidoController::class, 'confirmarPedido']);
    Route::get('/pedidos', [PedidoController::class, 'misPedidos']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'detallePedido']);
});

// Rutas admin
Route::middleware(['jwt', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);

    // Usuarios
    Route::get('/usuarios', [AdminController::class, 'getUsuarios']);
    Route::get('/usuarios/{id}', [AdminController::class, 'getUsuario']);
    Route::put('/usuarios/{id}/estado', [AdminController::class, 'toggleUsuarioEstado']);
    Route::delete('/usuarios/{id}/eliminar', [AdminController::class, 'eliminarCuentaAdmin']);

    // Productos
    Route::post('/productos', [AdminController::class, 'createProducto']);
    Route::put('/productos/{id}', [AdminController::class, 'updateProducto']);
    Route::delete('/productos/{id}', [AdminController::class, 'deleteProducto']);
    Route::put('/productos/{id}/stock', [ProductoController::class, 'updateStock']);


    // Pedidos
    Route::get('/pedidos', [AdminController::class, 'getPedidos']);
    Route::get('/pedidos/{id}', [AdminController::class, 'detallePedido']);
    Route::put('/pedidos/{id}/estado', [AdminController::class, 'actualizarEstado']);
    Route::get('/pedidos/usuario/{id}', [AdminController::class, 'getPedidosByUser']);
});
