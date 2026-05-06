<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Direccion extends Model
{
    protected $table = 'direcciones';
    protected $primaryKey = 'ID_direccion';
    public $timestamps = false;

    protected $fillable = [
        'ID_usuario',
        'Direccion',
        'CP',
        'Ciudad',
        'Provincia',
        'Facturacion'
    ];

    private $id;
    private $idUser;
    public $direccion;
    public $codigoPostal;
    public $ciudad;
    public $provincia;
    public $facturacion;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        if (!empty($attributes)) {
            $this->id = $attributes['ID_direccion'] ?? null;
            $this->idUser = $attributes['ID_usuario'] ?? null;
            $this->direccion = $attributes['Direccion'] ?? null;
            $this->codigoPostal = $attributes['CP'] ?? null;
            $this->ciudad = $attributes['Ciudad'] ?? null;
            $this->provincia = $attributes['Provincia'] ?? null;
            $this->facturacion = $attributes['Facturacion'] ?? null;
        }
    }

    public function getId()
    {
        return $this->id;
    }

    public function getIdUser()
    {
        return $this->idUser;
    }

    public function getDireccion()
    {
        return $this->direccion;
    }

    public function getCp()
    {
        return $this->codigoPostal;
    }

    public function getCiudad()
    {
        return $this->ciudad;
    }

    public function getProvincia()
    {
        return $this->provincia;
    }

    public function getFacturacion()
    {
        return $this->facturacion;
    }

    public function setDireccion($direccion)
    {
        $this->direccion = $direccion;
    }

    public function setCp($cp)
    {
        $this->codigoPostal = $cp;
    }

    public function setCiudad($ciudad)
    {
        $this->ciudad = $ciudad;
    }

    public function setProvincia($provincia)
    {
        $this->provincia = $provincia;
    }

    public function setFacturacion()
    {
        $this->facturacion = true;
    }

    public function unsetFacturacion()
    {
        $this->facturacion = false;
    }

    public static function getByUser($userId)
    {
        $results = DB::table('direcciones')
            ->select('ID_direccion', 'Direccion', 'CP', 'Ciudad', 'Provincia', 'Facturacion')
            ->where('ID_usuario', $userId)
            ->get();

        $direcciones = [];

        foreach ($results as $fila) {
            $direccion = new Direccion((array) $fila);
            $direcciones[] = $direccion;
        }

        return $direcciones;
    }

    public static function getById($dirId, $userId)
    {
        $result = DB::table('direcciones')
            ->select('Direccion', 'CP', 'Ciudad', 'Provincia', 'Facturacion')
            ->where('ID_usuario', $userId)
            ->where('ID_direccion', $dirId)
            ->first();

        if (!$result) {
            return null;
        }

        $data = (array) $result;
        $data['ID_direccion'] = $dirId;
        $data['ID_usuario'] = $userId;

        return new Direccion($data);
    }

    public static function actualizar($direccion, $userId)
    {
        return DB::table('direcciones')
            ->where('ID_direccion', $direccion->getId())
            ->where('ID_usuario', $userId)
            ->update([
                'Direccion' => $direccion->getDireccion(),
                'CP' => $direccion->getCp(),
                'Ciudad' => $direccion->getCiudad(),
                'Provincia' => $direccion->getProvincia(),
                'Facturacion' => $direccion->getFacturacion()
            ]);
    }

    public static function crear($userId, $datos)
    {
        // Si esta dirección es de facturación, quitar facturación de otras
        if ($datos['facturacion']) {
            DB::table('direcciones')
                ->where('ID_usuario', $userId)
                ->update(['Facturacion' => false]);
        }

        $id = DB::table('direcciones')->insertGetId([
            'ID_usuario' => $userId,
            'Direccion' => $datos['direccion'],
            'CP' => $datos['codigoPostal'],
            'Ciudad' => $datos['ciudad'],
            'Provincia' => $datos['provincia'],
            'Facturacion' => $datos['facturacion']
        ]);

        return $id;
    }

    public static function eliminar($direccionId, $userId)
    {
        return DB::table('direcciones')
            ->where('ID_direccion', $direccionId)
            ->where('ID_usuario', $userId)
            ->delete();
    }
}
