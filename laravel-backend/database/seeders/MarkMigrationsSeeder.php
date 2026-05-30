<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarkMigrationsSeeder extends Seeder
{
    public function run()
    {
        $pending = [
            '2026_05_29_100815_create_personal_access_tokens_table',
            '2026_05_29_220727_create_personal_access_tokens_table',
        ];

        $max = DB::table('migrations')->max('batch');
        $batch = ($max === null) ? 1 : $max + 1;

        foreach ($pending as $migration) {
            $exists = DB::table('migrations')->where('migration', $migration)->exists();
            if (! $exists) {
                DB::table('migrations')->insert([
                    'migration' => $migration,
                    'batch' => $batch,
                ]);
            }
        }
    }
}
