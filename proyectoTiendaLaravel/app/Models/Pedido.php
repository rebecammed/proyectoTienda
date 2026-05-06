<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Pedido extends Model
{
    protected $table = 'pedidos';
    protected $primaryKey = 'ID_pedido';
    public $timestamps = false;

    protected $fillable = [
        'ID_usuario',
        'ID_direccion',
        'Fecha_pedido',
        'Importe_total',
        'Importe_IVA',
        'Estado'
    ];

    public static function crearPedido($userId, $direccionId, $importeTotal, $importeIVA)
    {

        $id = DB::table('pedidos')->insertGetId([
            'ID_usuario' => $userId,
            'ID_direccion' => $direccionId,
            'Fecha_pedido' => now(),
            'Importe_total' => $importeTotal,
            'Importe_IVA' => $importeIVA,
            'Estado' => 'pendiente'
        ]);

        return $id;
    }

    public static function getByUser($userId)
    {
        return DB::table('pedidos')
            ->where('ID_usuario', $userId)
            ->orderBy('Fecha_pedido', 'desc')
            ->get();
    }

    public static function getById($pedidoId, $userId = null)
    {
        $query = DB::table('pedidos')->where('ID_pedido', $pedidoId);

        if ($userId) {
            $query->where('ID_usuario', $userId);
        }

        return $query->first();
    }

    public static function getAll()
    {
        return DB::table('pedidos')
            ->orderBy('Fecha_pedido', 'desc')
            ->get();
    }
}
