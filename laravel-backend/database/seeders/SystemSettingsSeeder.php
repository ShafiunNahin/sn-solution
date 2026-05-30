<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        SystemSetting::updateOrCreate(
            ['support_email' => env('SUPER_ADMIN_EMAIL', 'admin@admin.com')],
            [
                'app_name' => env('SUPER_ADMIN_APP_NAME', 'SN Solution'),
                'sms_brand_name' => env('SUPER_ADMIN_SMS_BRAND', 'SN SMS'),
                'logo' => null,
                'favicon' => null,
                'password' => Hash::make(env('SUPER_ADMIN_PASSWORD', 'password')),
                'support_phone' => env('SUPER_ADMIN_SUPPORT_PHONE', '+1234567890'),
                'support_email' => env('SUPER_ADMIN_EMAIL', 'admin@admin.com'),
                'currency' => env('SUPER_ADMIN_CURRENCY', 'USD'),
                'timezone' => env('SUPER_ADMIN_TIMEZONE', 'UTC'),
                'address' => env('SUPER_ADMIN_ADDRESS', 'Head Office'),
            ]
        );
    }
}
