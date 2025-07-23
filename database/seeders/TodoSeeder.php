<?php

namespace Database\Seeders;

use App\Models\Todo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample todos
        Todo::factory()->create([
            'title' => 'Welcome to your Todo App!',
            'description' => 'This is a sample todo item. You can add, complete, and delete todos.',
            'completed' => false,
        ]);

        Todo::factory()->create([
            'title' => 'Learn Laravel',
            'description' => 'Explore the Laravel framework and build amazing applications.',
            'completed' => false,
        ]);

        Todo::factory()->create([
            'title' => 'Set up development environment',
            'description' => 'Install all necessary tools and dependencies for development.',
            'completed' => true,
        ]);

        Todo::factory()->create([
            'title' => 'Plan project architecture',
            'description' => 'Design the overall structure and components of the application.',
            'completed' => true,
        ]);

        // Create additional random todos
        Todo::factory(6)->create();
    }
}