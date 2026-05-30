<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require '/home/snsolut1/laravel-backend/vendor/autoload.php';

$app = require_once '/home/snsolut1/laravel-backend/bootstrap/app.php';

$app->handleRequest(Request::capture());
