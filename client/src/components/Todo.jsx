import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';

const Todo = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Brainstorm marketing reels', time: '30m', completed: false },
    { id: 2, text: 'Fix navigation bug', time: '1h', completed: true },
  ]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 mt-6 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Daily Tasks</h2>
        <button className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-all">
          <Sparkles size={14} />
          <span>AI Suggest</span>
        </button>
      </div>

      {/* Add Todo Input */}
      <div className="relative group">
        <input 
          type="text" 
          placeholder="What needs to be done?"
          className="w-full bg-[#1a1a1e] border border-white/5 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-xl text-white">
          <Plus size={20} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {todos.map((todo) => (
          <div 
            key={todo.id} 
            className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
              todo.completed ? 'bg-white/5 border-transparent opacity-50' : 'bg-[#1a1a1e] border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-blue-500 transition-colors">
                {todo.completed ? <CheckCircle2 className="text-blue-500" /> : <Circle />}
              </button>
              <span className={`text-sm font-medium ${todo.completed ? 'line-through' : ''}`}>
                {todo.text}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 font-mono text-xs">
              <Clock size={12} />
              <span>{todo.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;