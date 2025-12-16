<?php

return [

    // Solo API (evita tocar rutas web)
    'paths' => ['api/*'],

    // Permitimos todos los métodos necesarios
    'allowed_methods' => ['*'],

    // Permitimos el origen del frontend (Vite)
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    // Headers típicos
    'allowed_headers' => ['*'],

    // No usamos cookies/auth, así que false
    'supports_credentials' => false,

    // Opcional
    'exposed_headers' => [],
    'max_age' => 0,
];
