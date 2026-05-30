<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class SystemSetting extends Model
{
    use HasApiTokens;

    protected $fillable = [
        'app_name',
        'sms_brand_name',
        'logo',
        'favicon',
        'password',
        'support_phone',
        'support_email',
        'currency',
        'timezone',
        'address'
    ];

    protected $hidden = [
        'password'
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::needsRehash($value)
            ? Hash::make($value)
            : $value;
    }
}