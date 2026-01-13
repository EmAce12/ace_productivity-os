import React, { useState } from 'react';
import { Coffee, CheckSquare, Calendar, Target, Rocket, MessageSquare } from 'lucide-react';
import Timer from './components/Timer';
import Todo from './components/Todo';
import Habits from './components/Habits';

const App = () => {
  const [activeTab, setActiveTab] = useState('Focus');

  const tabs = [
    { id: 'Focus', icon: Coffee },
    { id: 'To-Dos', icon: CheckSquare },
    { id: 'Habits', icon: Calendar },
    { id: 'Goals', icon: Target },
    { id: 'Boost', icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      {/* Top Navigation Shell */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-center">
        <div className="glass-card flex p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-6 py-2 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-accent/20 text-accent shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{tab.id}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex justify-center w-full">
        <div className="w-full max-w-xl">
          {activeTab === 'Focus' && <Timer />}
          {activeTab === 'To-Dos' && <Todo />}
          {activeTab === 'Habits' && <Habits />}
          
          {['Goals', 'Boost'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center mt-32 space-y-4 opacity-20">
              <div className="p-8 border-4 border-dashed border-white/20 rounded-full">
                 {activeTab === 'Goals' ? <Target size={48} /> : <Rocket size={48} />}
              </div>
              <h2 className="text-xl font-black uppercase tracking-[0.3em] italic">
                {activeTab} Coming Soon
              </h2>
            </div>
          )}
        </div>
      </main>

      {/* Jake.0 Floating Button (FAB) */}
      <button className="fixed bottom-8 right-8 bg-slate-custom p-5 rounded-full shadow-2xl border border-white/10 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-40 group">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/40 transition-all"></div>
        <MessageSquare size={26} className="text-accent relative z-10" />
      </button>
    </div>
  );
};

export default App;