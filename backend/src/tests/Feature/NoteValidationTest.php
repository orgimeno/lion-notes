<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NoteValidationTest extends TestCase
{
    use RefreshDatabase; //Limpia db por test

    #[Test]
    public function it_returns_422_when_title_is_missing(): void
    {
        // Hacemos post de una nota sin title
        $response = $this->postJson('/api/notes', [
            'content' => 'sin titulo',
        ]);

        // Status
        $response->assertStatus(422);

        // Envelope simple
        $response->assertJson([
            'data' => null,
            'message' => null,
        ]);

        // Errors shape: errors.title = [ ... ]
        $response->assertJsonStructure([
            'errors' => ['title'],
        ]);
    }

}
