<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    public function index()
    {
        return request()->user()->tasks()->latest()->get();
    }

    public function store(StoreTaskRequest $request)
    {
        return request()->user()->tasks()->create($request->validated());
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());
        return $task;
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }
}
