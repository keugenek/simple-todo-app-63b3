import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    todos: Todo[];
    [key: string]: unknown;
}

export default function Welcome({ todos }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!title.trim()) return;

        router.post(route('todos.store'), {
            title: title.trim(),
            description: description.trim() || null,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setTitle('');
                setDescription('');
            }
        });
    };

    const handleToggleComplete = (todo: Todo) => {
        router.patch(route('todos.update', todo.id), {
            completed: !todo.completed,
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDeleteTodo = (todo: Todo) => {
        router.delete(route('todos.destroy', todo.id), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const completedTodos = todos.filter(todo => todo.completed);
    const pendingTodos = todos.filter(todo => !todo.completed);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
                    <p className="text-gray-600">Keep track of your tasks and stay organized</p>
                </div>

                {/* Add Todo Form */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Add New Todo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddTodo} className="space-y-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Textarea
                                    placeholder="Add a description (optional)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Todo
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Todo Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
                            <div className="text-sm text-gray-600">Total Tasks</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-orange-600">{pendingTodos.length}</div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">{completedTodos.length}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Todos */}
                {pendingTodos.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Pending Tasks ({pendingTodos.length})
                        </h2>
                        <div className="space-y-3">
                            {pendingTodos.map((todo) => (
                                <Card key={todo.id} className="border-l-4 border-l-orange-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={todo.completed}
                                                onCheckedChange={() => handleToggleComplete(todo)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{todo.title}</h3>
                                                {todo.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Created {new Date(todo.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteTodo(todo)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Todos */}
                {completedTodos.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Completed Tasks ({completedTodos.length})
                        </h2>
                        <div className="space-y-3">
                            {completedTodos.map((todo) => (
                                <Card key={todo.id} className="border-l-4 border-l-green-500 opacity-75">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={todo.completed}
                                                onCheckedChange={() => handleToggleComplete(todo)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 line-through">{todo.title}</h3>
                                                {todo.description && (
                                                    <p className="text-sm text-gray-600 mt-1 line-through">{todo.description}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Completed {new Date(todo.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteTodo(todo)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {todos.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="text-gray-400 mb-4">
                                <Plus className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
                            <p className="text-gray-600">Get started by adding your first task above!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}