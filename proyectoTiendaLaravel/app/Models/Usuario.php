<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'ID_usuario';
    public $timestamps = false;

    protected $fillable = [
        'Email',
        'Password_hash',
        'Nombre_completo',
        'Rol',
        'Activo',
        'Fecha_creacion',
        'Fecha_baja',
        'Reset_token',
        'Reset_expira'
    ];

    protected $hidden = [
        'Password_hash',
        'Reset_token'
    ];

    private $id;
    public $email;
    public $nombre;
    public $activo;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        if (!empty($attributes)) {
            $this->id = $attributes['ID_usuario'] ?? null;
            $this->email = $attributes['Email'] ?? null;
            $this->nombre = $attributes['Nombre_completo'] ?? null;
            $this->activo = $attributes['Activo'] ?? null;
        }
    }

    public function getId()
    {
        return $this->id;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function isActivo()
    {
        return $this->activo;
    }


    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function desactivar()
    {
        $this->activo = false;
    }



    public static function getById($id)
    {
        $result = DB::table('usuarios')
            ->select('ID_usuario', 'Email', 'Nombre_completo', 'Activo')
            ->where('ID_usuario', $id)
            ->first();

        if (!$result) {
            return null;
        }

        return new Usuario((array) $result);
    }

    public static function actualizar($usuario)
    {
        return DB::table('usuarios')
            ->where('ID_usuario', $usuario->getId())
            ->update([
                'Email' => $usuario->getEmail(),
                'Nombre_completo' => $usuario->getNombre(),
                'Activo' => $usuario->isActivo()
            ]);
    }

    public static function login($usuario, $contrasena)
    {
        $user = DB::table('usuarios')
            ->select('ID_usuario', 'Nombre_completo', 'Password_hash', 'Rol')
            ->where('Email', $usuario)
            ->first();

        if ($user && Hash::check($contrasena, $user->Password_hash)) {
            return (array) $user;
        }

        return false;
    }

    public static function existeUsuario($usuario)
    {
        return DB::table('usuarios')
            ->where('Email', $usuario)
            ->exists();
    }

    public static function crearUsuario($usuario, $contrasena, $nombre_completo)
    {
        return DB::table('usuarios')->insert([
            'Email' => $usuario,
            'Password_hash' => Hash::make($contrasena),
            'Nombre_completo' => $nombre_completo,
            'Fecha_creacion' => now(),
            'Rol' => 'USER',
            'Activo' => 1
        ]);
    }

    public static function eliminarCuenta($userId)
    {
        // Anonimizar datos personales del usuario
        DB::table('usuarios')
            ->where('ID_usuario', $userId)
            ->update([
                'Nombre_completo' => null,
                'Email' => null,
                'Password_hash' => null,
                'Fecha_baja' => now(),
                'Activo' => 0,
                'Reset_token' => null,
                'Reset_expira' => null,
            ]);

        // Anonimizar direcciones asociadas
        DB::table('direcciones')
            ->where('ID_usuario', $userId)
            ->update([
                'Direccion' => null,
                'CP' => null,
                'Ciudad' => null,
                'Provincia' => null,
                'Facturacion' => 0
            ]);

        return true;
    }
}
