<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class LineaPedido extends Model
{
    protected $table = 'lineas_pedido';
    protected $primaryKey = 'ID_linea';
    public $timestamps = false;

    protected $fillable = [
        'ID_pedido',
        'ID_producto',
        'Cantidad'
    ];

    public static function crearLineas($pedidoId, $productosCarrito)
    {
        foreach ($productosCarrito as $item) {
            DB::table('lineas_pedido')->insert([
                'ID_pedido' => $pedidoId,
                'ID_producto' => $item['id'],
                'Cantidad' => $item['cantidad']
            ]);

            DB::table('productos')
                ->where('ID_producto', $item['id'])
                ->decrement('Stock', $item['cantidad']);
        }

        return true;
    }
    public static function crearLineasDesdeCarrito($pedidoId, $productosCarrito)
    {
        foreach ($productosCarrito as $item) {
            DB::table('lineas_pedido')->insert([
                'ID_pedido' => $pedidoId,
                'ID_producto' => $item->id,
                'Cantidad' => $item->cantidad
            ]);

            DB::table('productos')
                ->where('ID_producto', $item->id)
                ->decrement('Stock', $item->cantidad);
        }

        return true;
    }

    public static function getByPedido($pedidoId)
    {
        $lineas = DB::table('lineas_pedido as lp')
            ->join('productos as p', 'lp.ID_producto', '=', 'p.ID_producto')
            ->select('lp.*', 'p.Nombre', 'p.Precio', 'p.IVA')
            ->where('lp.ID_pedido', $pedidoId)
            ->get();

        foreach ($lineas as $linea) {
            $linea->Precio_con_iva = round($linea->Precio * (1 + $linea->IVA / 100), 2);
            $linea->Subtotal = round($linea->Cantidad * $linea->Precio_con_iva, 2);
        }

        return $lineas;  // ← El return debe ir FUERA del foreach
    }
}
