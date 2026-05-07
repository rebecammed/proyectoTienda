<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Carrito extends Model
{
    protected $table = 'carrito';
    public $timestamps = false;

    protected $fillable = [
        'ID_usuario',
        'ID_producto',
        'Cantidad'
    ];

    // Obtener el carrito completo de un usuario
    public static function getByUser($userId)
    {
        return DB::table('carrito as c')
            ->join('productos as p', 'c.ID_producto', '=', 'p.ID_producto')
            ->select(
                'c.ID_producto as id',
                'p.Nombre as nombre',
                'p.Descripcion_producto as desc',
                'c.Cantidad as cantidad',
                'p.Precio as precio',
                'p.IVA as iva',
                'p.Stock as stock'
            )
            ->where('c.ID_usuario', $userId)
            ->get()
            ->toArray();
    }

    // Añadir producto al carrito
    public static function addProducto($userId, $productoId, $cantidad = 1)
    {
        $existing = DB::table('carrito')
            ->where('ID_usuario', $userId)
            ->where('ID_producto', $productoId)
            ->first();

        if ($existing) {
            DB::table('carrito')
                ->where('ID_usuario', $userId)
                ->where('ID_producto', $productoId)
                ->update(['Cantidad' => $existing->Cantidad + $cantidad]);
        } else {
            DB::table('carrito')->insert([
                'ID_usuario' => $userId,
                'ID_producto' => $productoId,
                'Cantidad' => $cantidad
            ]);
        }
    }

    // Eliminar una unidad de un producto
    public static function removeProducto($userId, $productoId)
    {
        $existing = DB::table('carrito')
            ->where('ID_usuario', $userId)
            ->where('ID_producto', $productoId)
            ->first();

        if ($existing) {
            if ($existing->Cantidad > 1) {
                DB::table('carrito')
                    ->where('ID_usuario', $userId)
                    ->where('ID_producto', $productoId)
                    ->update(['Cantidad' => $existing->Cantidad - 1]);
            } else {
                DB::table('carrito')
                    ->where('ID_usuario', $userId)
                    ->where('ID_producto', $productoId)
                    ->delete();
            }
        }
    }

    // Vaciar carrito
    public static function clear($userId)
    {
        DB::table('carrito')
            ->where('ID_usuario', $userId)
            ->delete();
    }

    // Calcular precio sin IVA
    public static function precioSinIva($userId)
    {
        return DB::table('carrito as c')
            ->join('productos as p', 'c.ID_producto', '=', 'p.ID_producto')
            ->where('c.ID_usuario', $userId)
            ->sum(DB::raw('c.Cantidad * p.Precio'));
    }

    // Calcular IVA total
    public static function ivaTotal($userId)
    {
        $items = DB::table('carrito as c')
            ->join('productos as p', 'c.ID_producto', '=', 'p.ID_producto')
            ->where('c.ID_usuario', $userId)
            ->get();

        $total = 0;
        foreach ($items as $item) {
            $total += $item->Cantidad * ($item->Precio * ($item->IVA / 100));
        }
        return $total;
    }

    // Calcular precio total con IVA
    public static function precioTotal($userId)
    {
        return self::precioSinIva($userId) + self::ivaTotal($userId);
    }
}
