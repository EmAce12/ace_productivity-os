import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // ← NEW IMPORT
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Plus, Sparkles, MoreVertical, Clock, CheckSquare, Square, 
  GripVertical, Trash2, Edit, X, Save
} from 'lucide-react';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null); // NEW: store button coords

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to load todos', err);
    }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/todos', {
        title: newTitle.trim(),
        timeEstimate: newTime.trim() || ''
      });
      setTodos([res.data, ...todos]);
      setNewTitle('');
      setNewTime('');
    } catch (err) {
      console.error('Failed to add todo', err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/todos/${id}`, {
        completed: !completed
      });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
      setOpenMenuId(null);
      setMenuPosition(null);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleMenuOpen = (e, todoId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX - 192 // align right edge (192 = w-48)
    });
    setOpenMenuId(todoId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">To-Dos</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all text-sm font-medium">
          <Sparkles size={16} />
          Suggest
        </button>
      </div>

      {/* Add new todo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 bg-[#1a1a1e] border border-white/10 rounded-xl p-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new to-do..."
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-base"
        />
        <div className="flex items-center gap-2 sm:border-l sm:border-white/10 sm:pl-4">
          <Clock size={16} className="text-gray-400" />
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="Min"
            className="w-16 bg-transparent outline-none text-gray-400 text-right placeholder-gray-500"
          />
        </div>
        <button
          onClick={addTodo}
          className="p-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors self-end sm:self-auto"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Todo list */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {todos.map((todo, index) => (
                <Draggable 
                  key={todo._id} 
                  draggableId={todo._id.toString()} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`group relative flex items-start gap-4 p-4 rounded-xl bg-[#1a1a1e] border border-white/10 transition-all overflow-hidden ${
                        snapshot.isDragging 
                          ? 'shadow-2xl border-blue-500/50 ring-2 ring-blue-500/30 z-50' 
                          : 'hover:border-white/20 hover:shadow-md'
                      } ${todo.completed ? 'opacity-80' : ''}`}
                    >
                      {/* Drag handle + checkbox */}
                      <div className="flex items-start gap-3">
                        <div 
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                        >
                          <GripVertical size={20} />
                        </div>

                        <button
                          onClick={() => toggleComplete(todo._id, todo.completed)}
                          className="mt-1 text-gray-400 hover:text-blue-400 transition-colors pointer-events-auto"
                        >
                          {todo.completed ? (
                            <CheckSquare size={24} className="text-blue-500" fill="currentColor" />
                          ) : (
                            <Square size={24} />
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pointer-events-none">
                        <p
                          className={`font-medium text-base ${
                            todo.completed ? 'line-through text-gray-300' : 'text-white'
                          }`}
                        >
                          {todo.title}
                        </p>
                        {todo.timeEstimate && (
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock size={14} className="mr-1" />
                            {todo.timeEstimate}
                          </p>
                        )}
                      </div>

                      {/* Three dots trigger */}
                      <div className="relative pointer-events-auto">
                        <button
                          onClick={(e) => handleMenuOpen(e, todo._id)}
                          className="text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Portal-based dropdown menu */}
      {openMenuId && menuPosition && createPortal(
        <div 
          className="fixed bg-[#1f1f23] border border-white/10 rounded-lg shadow-2xl py-2 z-[9999] overflow-visible min-w-[192px]"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const todo = todos.find(t => t._id === openMenuId);
              if (todo) startEdit(todo);
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center gap-2 text-sm text-gray-300"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => deleteTodo(openMenuId)}
            className="w-full text-left px-4 py-2.5 hover:bg-red-900/30 flex items-center gap-2 text-sm text-red-400"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button
            onClick={closeMenu}
            className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center gap-2 text-sm text-gray-400 border-t border-white/5 mt-1"
          >
            <X size={16} />
            Close
          </button>
        </div>,
        document.body
      )}

      {todos.length === 0 && (
        <div className="text-center py-12 text-gray-500 mt-8">
          No tasks yet — add one above!
        </div>
      )}
    </div>
  );
};

export default Todo;