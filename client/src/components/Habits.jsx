import React from 'react';
import { Flame, Plus, Check } from 'lucide-react';

const Habits = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const habits = [
    { id: 1, name: 'Weight Lifting', streak: 5, history: [1, 1, 1, 0, 1, 0, 0] },
    { id: 2, name: 'Post IG Reel', streak: 12, history: [1, 1, 1, 1, 1, 1, 1] },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 mt-6 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Habit Tracker</h2>
        <div className="flex items-center space-x-2 bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-full border border-orange-500/20">
          <Flame size={16} fill="currentColor" />
          <span className="text-xs font-black uppercase">17 Day Streak</span>
        </div>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-[#1a1a1e] border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm tracking-wide">{habit.name}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase">{habit.streak} Day Streak</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <span className="text-[9px] text-gray-600 font-bold uppercase">{day}</span>
                  <button 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      habit.history[i] 
                        ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                        : 'bg-white/5 border border-white/5'
                    }`}
                  >
                    {habit.history[i] && <Check size={18} strokeWidth={4} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button className="w-full py-5 rounded-3xl border-2 border-dashed border-white/5 text-gray-600 hover:text-white hover:border-white/10 transition-all flex items-center justify-center space-x-2">
          <Plus size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Add New Habit</span>
        </button>
      </div>
    </div>
  );
};

export default Habits;