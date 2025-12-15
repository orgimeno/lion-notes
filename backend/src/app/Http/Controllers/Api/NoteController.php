<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Standar API response.
     * Nos ayuda a mantener consistencia con el frontend
     * { data: ..., message: ..., errors: ... }
     */
    private function respond(
        mixed $data = null,
        ?string $message = null,
        mixed $errors = null,
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'data' => $data,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * GET /api/notes?q=
     * - Paginación: 10 por página
     * - Filtro: title (si viene)
     * - Orden: created_at desc
     */
    public function index(Request $request): JsonResponse
    {
        // Nota: tratamos q como string opcional; si viene vacío, no filtramos.
        $q = trim((string) $request->query('q', ''));

        $paginator = Note::query()
            // Cuando q no está vacío, aplicamos filtro en title.
            ->when($q !== '', fn ($query) => $query->where('title', 'like', "%{$q}%"))
            // Orden descendente por fecha de creación.
            ->orderByDesc('created_at')
            // Paginación fija a 10.
            ->paginate(10);

        /**
         * Importante:
         * - El enunciado pide "lista paginada (10 por página)" y estructura simple.
         * - Devolvemos items + meta reducido para evitar el payload completo del paginator.
         */
        return $this->respond([
            'items' => NoteResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /**
     * POST /api/notes
     * Body: { title: string, content?: string }
     */
    public function store(StoreNoteRequest $request): JsonResponse
    {
        // FormRequest ya validó; aquí usamos solo datos validados.
        $note = Note::create($request->validated());

        return $this->respond(
            data: new NoteResource($note),
            message: null,
            errors: null,
            status: 201
        );
    }

    /**
     * GET /api/notes/{id}
     * Usamos Route Model Binding: Note por id auto.
     */
    public function show(Note $note): JsonResponse
    {
        return $this->respond(new NoteResource($note));
    }

    /**
     * PUT /api/notes/{id}
     * Body igual al POST.
     */
    public function update(UpdateNoteRequest $request, Note $note): JsonResponse
    {
        $note->update($request->validated());

        return $this->respond(new NoteResource($note));
    }

    /**
     * DELETE /api/notes/{id}
     */
    public function destroy(Note $note): JsonResponse
    {
        $note->delete();

        return $this->respond(null);
    }
}
