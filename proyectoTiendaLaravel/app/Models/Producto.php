<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Producto extends Model
{
    protected $table = 'productos';
    protected $primaryKey = 'ID_producto';
    public $timestamps = false;

    // Atributos asignables en masa
    protected $fillable = [
        'Nombre',
        'Descripcion_producto',
        'Precio',
        'IVA',
        'Stock',
        'Categoria',
        'URL_imagenes'
    ];

    // Para mantener compatibilidad con getters existentes
    public function getId()
    {
        return $this->ID_producto;
    }

    public function getNombre()
    {
        return $this->Nombre;
    }

    public function getDesc()
    {
        return $this->Descripcion_producto;
    }

    public function getPrecio()
    {
        return $this->Precio;
    }

    public function getIva()
    {
        return (float)($this->IVA ?? 21);
    }

    public function getStock()
    {
        return $this->Stock;
    }

    public function getCategoria()
    {
        return $this->Categoria;
    }

    public function getImagenes()
    {
        return $this->URL_imagenes;
    }

    public function setStock($stock)
    {
        $this->Stock = $stock;
    }

    // Métodos estáticos
    public static function getAll()
    {
        return self::all()->map(function ($producto) {
            return (object) [
                'id' => $producto->ID_producto,
                'nombre' => $producto->Nombre,
                'descripcion' => $producto->Descripcion_producto,
                'precio' => $producto->Precio,
                'iva' => $producto->IVA ?? 21,
                'categoria' => $producto->Categoria,
                'stock' => $producto->Stock,
                'url_imagenes' => $producto->URL_imagenes
            ];
        })->toArray();
    }

    public static function getById($id)
    {
        $producto = self::find($id);

        if (!$producto) {
            return null;
        }

        return $producto;
    }
    public static function updateStock($id, $stock)
    {
        return DB::table('productos')
            ->where('ID_producto', $id)
            ->update(['Stock' => $stock]);
    }
}
