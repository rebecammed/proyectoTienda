<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class Carrito
{
    private $productos = [];

    public function __construct()
    {
        // Asegurar que la sesión está iniciada
        if (!session()->isStarted()) {
            session()->start();
        }

        $this->productos = session()->get('carrito_productos', []);
    }

    public function getCarrito()
    {
        return $this->productos;
    }

    public function addProd($p)
    {
        if (!$p) {
            throw new \Exception("Producto inválido: es null");
        }

        if (is_array($p)) {
            throw new \Exception("Producto es un array, debería ser un objeto Producto");
        }

        if (!method_exists($p, 'getIva')) {
            throw new \Exception("El objeto no tiene método getIva. Clase: " . get_class($p));
        }

        $iva = $p->getIva();
        if ($iva === null) {
            Log::warning('IVA es null para producto ID: ' . $p->getId());
            $iva = 21;
        }

        $stockMaximo = $p->getStock();
        $encontrado = false;

        for ($i = 0; $i < count($this->productos); $i++) {
            if ($this->productos[$i]['id'] == $p->getId()) {
                $encontrado = true;
                if ($this->productos[$i]['cantidad'] < $stockMaximo) {
                    $this->productos[$i]['cantidad'] += 1;
                } else {
                    throw new \Exception("No hay suficiente stock. Stock disponible: {$stockMaximo}");
                }
                break;
            }
        }

        if (!$encontrado) {
            if ($stockMaximo >= 1) {
                $this->productos[] = [
                    'id' => $p->getId(),
                    'nombre' => $p->getNombre(),
                    'desc' => $p->getDesc(),
                    'precio' => $p->getPrecio(),
                    'iva' => $p->getIva(),
                    'cantidad' => 1,
                    'stock' => $stockMaximo
                ];
            } else {
                throw new \Exception("Producto sin stock disponible");
            }
        }

        session()->put('carrito_productos', $this->productos);
    }

    public function delProd($id)
    {
        for ($i = 0; $i < count($this->productos); $i++) {
            if ($this->productos[$i]['id'] == $id) {
                if ($this->productos[$i]['cantidad'] > 1) {
                    $this->productos[$i]['cantidad'] -= 1;
                } else {
                    unset($this->productos[$i]);
                    $this->productos = array_values($this->productos);
                }
                break;
            }
        }

        session()->put('carrito_productos', $this->productos);
    }

    public function precioSinIva()
    {
        $suma = 0;
        foreach ($this->productos as $producto) {
            $cantidad = isset($producto['cantidad']) ? (int)$producto['cantidad'] : 0;
            $precio = isset($producto['precio']) ? (float)$producto['precio'] : 0;
            $suma += $cantidad * $precio;
        }
        return $suma;
    }

    public function ivaTotal()
    {
        $suma = 0;
        foreach ($this->productos as $producto) {
            if (!isset($producto['iva'])) {
                $producto['iva'] = 21;
            }

            $cantidad = isset($producto['cantidad']) ? (int)$producto['cantidad'] : 0;
            $precio = isset($producto['precio']) ? (float)$producto['precio'] : 0;
            $iva = (float)$producto['iva'];

            $suma += $cantidad * ($precio * ($iva / 100));
        }
        return $suma;
    }

    public function precioTotal()
    {
        $suma = 0;
        foreach ($this->productos as $producto) {
            if (!isset($producto['iva'])) {
                $producto['iva'] = 21;
            }

            $cantidad = isset($producto['cantidad']) ? (int)$producto['cantidad'] : 0;
            $precio = isset($producto['precio']) ? (float)$producto['precio'] : 0;
            $iva = (float)$producto['iva'];

            $suma += ($precio * (1 + $iva / 100)) * $cantidad;
        }
        return $suma;
    }

    public function vaciar()
    {
        $this->productos = [];
        session()->forget('carrito_productos');
    }
}
