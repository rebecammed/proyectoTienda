<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Producto extends Model
{
    // Configuración para usar tu tabla existente
    protected $table = 'productos';
    protected $primaryKey = 'ID_producto';
    public $timestamps = false;

    // Propiedades públicas (como en tu clase original)
    public $nombre;
    public $descripcion;
    public $precio;
    public $iva;
    public $stock;
    public $categoria;
    public $url_imagenes;

    // Constructor (adaptado a Laravel)
    public function __construct($id = null, $nombre = null, $descripcion = null, $precio = null, $iva = null, $stock = null, $categoria = null, $url_imagenes = null)
    {
        parent::__construct();

        $this->id = $id;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->precio = $precio;
        $this->iva = $iva !== null ? (float)$iva : 21;
        $this->stock = $stock;
        $this->categoria = $categoria;
        $this->url_imagenes = $url_imagenes;
    }

    // Getters
    public function getId()
    {
        return $this->id;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getDesc()
    {
        return $this->descripcion;
    }

    public function getPrecio()
    {
        return $this->precio;
    }

    public function getIva()
    {
        // Asegurar que siempre devuelva un número
        if ($this->iva === null || $this->iva === '') {
            // Intentar cargar desde la base de datos si es necesario
            if ($this->id && !$this->iva) {
                $producto = DB::select("SELECT IVA FROM productos WHERE ID_producto = ?", [$this->id]);
                if (!empty($producto)) {
                    $this->iva = $producto[0]->IVA;
                }
            }

            // Si sigue siendo null, poner valor por defecto
            if ($this->iva === null) {
                $this->iva = 21;
            }
        }

        return (float)$this->iva;
    }

    public function getStock()
    {
        return $this->stock;
    }

    public function getCategoria()
    {
        return $this->categoria;
    }

    public function getImagenes()
    {
        return $this->url_imagenes;
    }
    // Setters
    public function setStock($s)
    {
        $this->stock = $s;
    }

    public function aumentarStock()
    {
        $this->stock += 1;
    }

    public function disminuirStock()
    {
        if ($this->stock > 0) {
            $this->stock -= 1;
        }
    }

    // Métodos estáticos adaptados a Laravel
    public static function getAll()
    {
        $sql = "SELECT ID_producto as id, Nombre as nombre, Descripcion_producto as descripcion, Precio as precio, IVA as iva,Categoria as categoria, Stock as stock, URL_imagenes as url_imagenes FROM productos";

        $result = DB::select($sql);

        if (empty($result)) {
            return [];
        }

        $productos = [];

        foreach ($result as $fila) {
            $productos[] = (array) $fila;
        }

        return $productos;
    }

    public static function getById($id)
    {
        $sql = "SELECT 
            ID_producto as id,
            Nombre as nombre, 
            Descripcion_producto as descripcion, 
            Precio as precio, 
            IVA as iva,
            Categoria as categoria, 
            Stock as stock 
            URL_imagenes as url_imagenes
            FROM productos
            WHERE ID_producto = ?";

        $result = DB::select($sql, [$id]);

        if (empty($result)) {
            return null;
        }

        $data = $result[0];
        // Verificar que el IVA existe
        if (!isset($data->iva) || $data->iva === null) {
            Log::warning("Producto {$id} no tiene IVA definido");
            // Asignar valor por defecto temporal
            $data->iva = 21;
        }

        $p = new Producto(
            $data->id,
            $data->nombre,
            $data->descripcion,
            $data->precio,
            $data->iva,
            $data->stock,
            $data->categoria,
            $data->url_imagenes
        );

        return $p;
    }
}
