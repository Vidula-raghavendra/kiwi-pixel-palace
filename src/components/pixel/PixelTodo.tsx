
import React, { useState } from "react";

const initialTodos = [
  { label: "Create a new project", done: false },
  { label: "Explore LLM capabilities", done: false },
  { label: "Collaborate with team", done: false },
];

export default function PixelTodo() {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo = (idx: number) => {
    setTodos((prev) =>
      prev.map((todo, i) => (i === idx ? { ...todo, done: !todo.done } : todo))
    );
  };

  return (
    <div className="pixel-outline bg-[#fffde8] rounded-lg p-4 mb-2 shadow-lg">
      <div className="pixel-title pixel-font tracking-wide text-[14px] text-[#233f24] mb-3">
        TO-DO
      </div>
      <ul className="flex flex-col gap-2">
        {todos.map((todo, idx) => (
          <li key={todo.label} className="flex items-center gap-3">
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
            <span className="pixel-font text-[12px] text-[#233f24]">{todo.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
