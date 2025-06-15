
import React, { useState } from "react";
import { Trash2, Edit, Plus } from "lucide-react";

type Todo = {
  label: string;
  done: boolean;
};

export default function PixelTodo() {
  const [todos, setTodos] = useState<Todo[]>([
    { label: "Create a new project", done: false },
    { label: "Explore LLM capabilities", done: false },
    { label: "Collaborate with team", done: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTask, setEditTask] = useState("");

  const toggleTodo = (idx: number) => {
    setTodos((prev) =>
      prev.map((todo, i) => (i === idx ? { ...todo, done: !todo.done } : todo))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const task = newTask.trim();
    if (!task) return;
    setTodos(prev => [...prev, { label: task, done: false }]);
    setNewTask("");
  };

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditTask(todos[idx].label);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx === null) return;
    setTodos(prev =>
      prev.map((todo, i) =>
        i === editIdx ? { ...todo, label: editTask } : todo
      )
    );
    setEditIdx(null);
    setEditTask("");
  };

  const handleDelete = (idx: number) => {
    setTodos(prev => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  return (
    <div className="pixel-outline bg-[#fffde8] rounded-lg p-4 mb-2 shadow-lg">
      <div className="pixel-title pixel-font tracking-wide text-[14px] text-[#233f24] mb-3 flex justify-between items-center">
        TO-DO
        <form onSubmit={handleAdd} className="flex gap-2 items-center">
          <input
            type="text"
            className="pixel-font text-sm px-2 py-1 rounded border border-[#badc5b] bg-[#f9ffe6]"
            placeholder="Add task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            maxLength={60}
          />
          <button
            type="submit"
            className="bg-[#badc5b] hover:bg-[#d3e8a6] text-[#233f24] px-2 py-1 rounded pixel-font flex items-center"
            title="Add"
          >
            <Plus size={14} />
          </button>
        </form>
      </div>
      <ul className="flex flex-col gap-2">
        {todos.map((todo, idx) => (
          <li key={todo.label + idx} className="flex items-center gap-3">
            <button
              type="button"
              className="pixel-outline no-radius flex items-center justify-center w-5 h-5 mr-1"
              style={{
                background: "#e6fadf",
                borderColor: "#badc5b",
                boxShadow: "inset 0px 2px #fff",
              }}
              aria-label="Toggle To-do"
              onClick={() => toggleTodo(idx)}
            >
              {todo.done ? (
                <svg width="13" height="13" viewBox="0 0 13 13">
                  <rect x="2" y="6" width="2" height="3" fill="#233f24"/>
                  <rect x="3" y="7" width="5" height="2" fill="#233f24"/>
                  <rect x="7" y="3" width="2" height="6" fill="#233f24"/>
                </svg>
              ) : null}
            </button>
            {editIdx === idx ? (
              <form onSubmit={handleUpdate} className="flex flex-1 gap-2 items-center">
                <input
                  autoFocus
                  className="pixel-font text-sm px-2 py-1 border border-[#badc5b] bg-[#fffbe8] rounded"
                  value={editTask}
                  onChange={e => setEditTask(e.target.value)}
                  maxLength={60}
                />
                <button className="text-green-700" type="submit" title="Save">
                  <Edit size={15} />
                </button>
                <button
                  className="text-red-400"
                  type="button"
                  onClick={() => setEditIdx(null)}
                  title="Cancel"
                >
                  X
                </button>
              </form>
            ) : (
              <>
                <span
                  className={`pixel-font text-[12px] text-[#233f24] flex-1 ${todo.done ? "line-through opacity-60" : ""}`}
                  style={{cursor: "pointer"}}
                  onDoubleClick={() => handleEdit(idx)}
                >
                  {todo.label}
                </span>
                <button
                  onClick={() => handleEdit(idx)}
                  className="text-blue-600 hover:underline"
                  type="button"
                  title="Edit"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-red-500 hover:underline"
                  type="button"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
