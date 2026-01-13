import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Target, Clock, 
  Tag as TagIcon, Plus, Info, Battery, 
  Rocket, Coffee, MessageSquare, X, Send 
} from 'lucide-react';

const Timer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [goal, setGoal] = useState('');
  const [activeAnim, setActiveAnim] = useState('Coffee');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Animation Options
  const animations = [
    { id: 'Coffee', label: 'Coffee Cup', icon: Coffee, color: 'text-blue-400' },
    { id: 'Battery', label: 'Battery', icon: Battery, color: 'text-green-400' },
    { id: 'Rocket', label: 'Rocket', icon: Rocket, color: 'text-orange-400' },
  ];

  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const fillLevel = (remainingSeconds / totalSeconds) * 100;

  useEffect(() => {
    let interval = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleRestart = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    // optionally reset goal / animation too if you want
  };

  const isRunning = isActive && (minutes > 0 || seconds > 0);

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col items-center justify-center relative">

      {/* ─── SETUP SCREEN ─── */}
      {!isRunning && (
        <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-10 px-4 py-12">
          
          {/* Visualizer (small version in setup) */}
          <div className="relative w-64 h-64 flex items-center justify-center transition-all duration-500">
            {activeAnim === 'Coffee' ? (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.08)]" style={{ imageRendering: 'pixelated' }}>
                <mask id="cup-mask"><path d="M22 22 h46 v44 q0 12 -12 12 h-22 q-12 0 -12 -12 Z" fill="white" /></mask>
                <path d="M68 32 h8 v4 h4 v4 h2 v24 h-2 v4 h-4 v4 h-8 v-6 h6 v-2 h2 v-22 h-2 v-2 h-6 Z" fill="white" />
                <path d="M18 18 h54 v48 q0 16 -16 16 h-22 q-16 0 -16 -16 Z" fill="white" />
                <path d="M22 22 h46 v44 q0 12 -12 12 h-22 q-12 0 -12 -12 Z" fill="#121214" />
                <rect x="22" y={22 + (56 * (1 - fillLevel/100))} width="46" height={56 * (fillLevel/100)} fill="#80563d" mask="url(#cup-mask)" className="transition-all duration-1000 ease-linear" />
              </svg>
            ) : (
              <div className="flex flex-col items-center text-gray-700">
                <div className="p-10 border-4 border-dashed border-gray-800 rounded-full animate-pulse">
                  {activeAnim === 'Battery' ? <Battery size={80} /> : <Rocket size={80} />}
                </div>
                <p className="mt-4 text-xs font-mono uppercase tracking-widest">Visualizer Coming Soon</p>
              </div>
            )}
          </div>

          {/* Goal + Minutes */}
          <div className="w-full grid grid-cols-12 gap-4">
            <div className="col-span-9 space-y-2 text-left">
              <label className="flex items-center text-[11px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                <Target size={14} className="mr-2 text-blue-500" /> Focus Goal
              </label>
              <input 
                type="text" 
                placeholder="Enter a focus goal" 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)} 
                className="w-full bg-[#1a1a1e] border border-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
              />
            </div>
            <div className="col-span-3 space-y-2 text-left">
              <label className="flex items-center text-[11px] uppercase tracking-widest text-gray-500 font-bold ml-1">
                <Clock size={14} className="mr-2 text-blue-500" /> Mins
              </label>
              <input 
                type="number" 
                value={minutes} 
                onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 0))} 
                className="w-full bg-[#1a1a1e] border border-white/5 rounded-xl px-2 py-4 text-center text-lg font-bold focus:outline-none" 
              />
            </div>
          </div>

          {/* Animation Selector */}
          <div className="w-full space-y-4 text-left">
            <label className="flex items-center text-[11px] uppercase tracking-widest text-gray-500 font-bold ml-1">
              <Plus size={14} className="mr-2 text-blue-500" /> Choose Animation
            </label>
            <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
              {animations.map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => setActiveAnim(anim.id)}
                  className={`min-w-[110px] h-28 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                    activeAnim === anim.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-[#1a1a1e]'
                  }`}
                >
                  <anim.icon size={24} className={`mb-2 ${activeAnim === anim.id ? anim.color : 'text-gray-500'}`} />
                  <span className={`text-[10px] font-bold uppercase ${activeAnim === anim.id ? 'text-white' : 'text-gray-500'}`}>{anim.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* START BUTTON */}
          <button 
            onClick={() => setIsActive(true)}
            className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-4 mt-6"
          >
            <Play size={28} fill="currentColor" />
            <span className="font-black uppercase tracking-[0.25em] text-xl">Start Focus</span>
          </button>
        </div>
      )}

      {/* ─── RUNNING / COUNTDOWN SCREEN ─── */}
      {isRunning && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0c] px-6">
          
          {/* Big Visualizer */}
          <div className="relative w-80 h-80 mb-12">
            {activeAnim === 'Coffee' ? (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_60px_rgba(128,86,61,0.4)]" style={{ imageRendering: 'pixelated' }}>
                <mask id="cup-mask"><path d="M22 22 h46 v44 q0 12 -12 12 h-22 q-12 0 -12 -12 Z" fill="white" /></mask>
                <path d="M68 32 h8 v4 h4 v4 h2 v24 h-2 v4 h-4 v4 h-8 v-6 h6 v-2 h2 v-22 h-2 v-2 h-6 Z" fill="white" />
                <path d="M18 18 h54 v48 q0 16 -16 16 h-22 q-16 0 -16 -16 Z" fill="white" />
                <path d="M22 22 h46 v44 q0 12 -12 12 h-22 q-12 0 -12 -12 Z" fill="#121214" />
                <rect 
                  x="22" 
                  y={22 + (56 * (1 - fillLevel/100))} 
                  width="46" 
                  height={56 * (fillLevel/100)} 
                  fill="#80563d" 
                  mask="url(#cup-mask)" 
                  className="transition-all duration-1000 ease-linear" 
                />
              </svg>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 animate-pulse">
                {activeAnim === 'Battery' ? <Battery size={140} /> : <Rocket size={140} />}
              </div>
            )}
          </div>

          {/* Big Timer */}
          <div className="text-7xl font-mono font-bold tracking-widest mb-10">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          {/* Goal display */}
          {goal && (
            <p className="text-gray-400 text-lg mb-12 max-w-md text-center">
              {goal}
            </p>
          )}

          {/* Controls */}
          <div className="flex gap-6">
            <button
              onClick={() => setIsActive(false)}
              className="flex items-center gap-3 px-10 py-5 bg-gray-800 hover:bg-gray-700 rounded-2xl text-lg font-semibold transition-colors"
            >
              <Pause size={28} /> Pause
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center gap-3 px-10 py-5 bg-red-900/60 hover:bg-red-900/80 rounded-2xl text-lg font-semibold transition-colors border border-red-700/40"
            >
              <RotateCcw size={28} /> Restart
            </button>
          </div>
        </div>
      )}

      {/* Chat overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" 
            onClick={() => setIsChatOpen(false)} 
          />
          <div className="relative w-full max-w-sm bg-[#111113] h-full border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 pointer-events-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Ace</h3>
                <p className="text-[10px] text-green-500 uppercase font-black">Online / Goal Aware</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-lg"><X size={20}/></button>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                <p className="text-sm">Hey! I'm Ace. I see you're focusing on <b>{goal || 'your task'}</b>. How can I help you crush this session?</p>
              </div>
            </div>
            <div className="p-4 border-t border-white/5 flex space-x-2">
              <input 
                type="text" 
                placeholder="Ask Ace anything..." 
                className="flex-1 bg-background border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50" 
              />
              <button className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors">
                <Send size={18}/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating chat button - this was missing */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-xl shadow-blue-900/40 transition-all active:scale-95"
        aria-label="Open Jake.0 chat"
      >
        <MessageSquare size={24} />
      </button>

    </div>
  );
};

export default Timer;