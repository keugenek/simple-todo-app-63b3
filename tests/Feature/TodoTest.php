<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_todos_on_home_page(): void
    {
        $todo = Todo::factory()->create([
            'title' => 'Test Todo',
            'description' => 'Test Description',
            'completed' => false,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
                ->has('todos', 1)
                ->where('todos.0.title', 'Test Todo')
                ->where('todos.0.description', 'Test Description')
                ->where('todos.0.completed', false)
        );
    }

    public function test_can_create_todo(): void
    {
        $response = $this->post('/todos', [
            'title' => 'New Todo',
            'description' => 'New Description',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'title' => 'New Todo',
            'description' => 'New Description',
            'completed' => false,
        ]);
    }

    public function test_can_update_todo(): void
    {
        $todo = Todo::factory()->create([
            'title' => 'Original Title',
            'completed' => false,
        ]);

        $response = $this->patch("/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'title' => 'Original Title',
            'completed' => true,
        ]);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->delete("/todos/{$todo->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('todos', [
            'id' => $todo->id,
        ]);
    }

    public function test_title_is_required_when_creating_todo(): void
    {
        $response = $this->post('/todos', [
            'description' => 'Description without title',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('title');
    }

    public function test_can_create_todo_without_description(): void
    {
        $response = $this->post('/todos', [
            'title' => 'Todo without description',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'title' => 'Todo without description',
            'description' => null,
            'completed' => false,
        ]);
    }

    public function test_can_toggle_todo_completion(): void
    {
        $todo = Todo::factory()->create(['completed' => false]);

        // Mark as completed
        $response = $this->patch("/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'completed' => true,
        ]);

        // Mark as incomplete
        $response = $this->patch("/todos/{$todo->id}", [
            'completed' => false,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'completed' => false,
        ]);
    }
}