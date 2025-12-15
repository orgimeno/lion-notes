<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Healthcheck básico.
     * solo comprobamos DB.
     */
    public function __invoke(): JsonResponse
    {
        try {
            // Intento simple de conexión a la DB.
            DB::connection()->getPdo();

            return response()->json([
                'data' => ['db' => 'ok'],
                'message' => null,
                'errors' => null,
            ]);
        } catch (\Throwable $e) {
            // Si la DB no responde, el servicio no está sano.
            return response()->json([
                'data' => null,
                'message' => null,
                'errors' => ['db' => [$e->getMessage()]],
            ], 500);
        }
    }
}
