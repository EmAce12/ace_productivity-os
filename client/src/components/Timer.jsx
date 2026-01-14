import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Play, Pause, RotateCcw, Target, Clock, 
  Tag as TagIcon, Plus, Info, Battery, 
  Rocket, Coffee, MessageSquare, X, Send, CheckCircle2
} from 'lucide-react';

const Timer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [goal, setGoal] = useState('');
  const [activeAnim, setActiveAnim] = useState('Coffee');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState(null);
  const [recentGoals, setRecentGoals] = useState([]);

  // ─── NEW: Pomodoro cycle tracking ───
  const [sessionCount, setSessionCount] = useState(0); // completed focus sessions
  const [currentCycle, setCurrentCycle] = useState(1); // 1–4, resets after long break

  // Sound
  const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg'));

  // Animation Options
  const animations = [
    { id: 'Coffee', label: 'Coffee Cup', icon: Coffee, color: 'text-blue-400' },
    { id: 'Battery', label: 'Battery', icon: Battery, color: 'text-green-400' },
    { id: 'Rocket', label: 'Rocket', icon: Rocket, color: 'text-orange-400' },
  ];

  // ─── Timer durations ───
  const FOCUS_MINUTES = 25;
  const SHORT_BREAK_MINUTES = 5;
  const LONG_BREAK_MINUTES = 15;
  const CYCLES_BEFORE_LONG_BREAK = 4;

  const totalSeconds = isBreak 
    ? (currentCycle % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK_MINUTES : SHORT_BREAK_MINUTES) * 60 
    : FOCUS_MINUTES * 60;

  const remainingSeconds = minutes * 60 + seconds;
  const fillLevel = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  const isRunning = isActive && (minutes > 0 || seconds > 0);

  // Fetch recent goals when setup screen is visible
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/goals');
        setRecentGoals(res.data);
      } catch (err) {
        console.log("Could not load recent goals (backend may be off?)", err);
      }
    };

    if (!isRunning) {
      fetchHistory();
    }
  }, [isRunning]);

  // Main timer logic
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
    } else if (minutes === 0 && seconds === 0 && isActive) {
      audioRef.current.play().catch(err => console.log("Audio play blocked", err));

      if (!isBreak) {
        // Focus session just ended
        if (currentGoalId) {
          axios.patch(`http://localhost:5000/api/goals/${currentGoalId}`, { status: 'completed' })
            .catch(err => console.error("Error updating goal status:", err));
        }

        const newSessionCount = sessionCount + 1;
        setSessionCount(newSessionCount);

        const nextCycle = (currentCycle % CYCLES_BEFORE_LONG_BREAK) + 1;
        setCurrentCycle(nextCycle);

        // Auto-start break
        setIsBreak(true);
        setMinutes(nextCycle === 1 ? LONG_BREAK_MINUTES : SHORT_BREAK_MINUTES); // after 4th → long
        setSeconds(0);
        setIsActive(true); // auto-resume for break
        setGoal(''); // clear goal for break phase
      } else {
        // Break just ended → back to focus setup
        setIsBreak(false);
        setIsActive(false);
        setMinutes(FOCUS_MINUTES);
        setSeconds(0);
        setCurrentGoalId(null);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, currentGoalId, sessionCount, currentCycle]);

  const handleStartFocus = async () => {
    try {
      if (goal) {
        const response = await axios.post('http://localhost:5000/api/goals', {
          title: goal,
          duration: minutes
        });
        setCurrentGoalId(response.data._id);
      }
      setIsActive(true);
      setIsBreak(false); // ensure we start in focus mode
    } catch (err) {
      console.error("Backend connection failed, starting locally:", err);
      setIsActive(true);
      setIsBreak(false);
    }
  };

  const handleRestart = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(FOCUS_MINUTES);
    setSeconds(0);
    setCurrentGoalId(null);
    setGoal('');
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setSessionCount(0);
    setCurrentCycle(1);
  };

  const handleSkipBreak = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(FOCUS_MINUTES);
    setSeconds(0);
    setGoal('');
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col items-center justify-center relative w-full">

      {/* ─── SETUP / FOCUS INPUT SCREEN ─── */}
      {!isRunning && !isBreak && (
        <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-10 px-4 py-12">
          
          {/* Visualizer */}
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

          {/* Recent Focus History */}
          <div className="w-full space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center">
              <Clock size={12} className="mr-2" /> Recent Sessions
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {recentGoals.length > 0 ? (
                recentGoals.map((g) => (
                  <div
                    key={g._id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex justify-between items-center text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{g.title || 'Untitled focus'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {g.duration} min • {new Date(g.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {g.status === 'completed' ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-600 text-sm">
                  No sessions yet. Start your first focus!
                </div>
              )}
            </div>
          </div>

          {/* START BUTTON */}
          <button 
            onClick={handleStartFocus}
            className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-4 mt-6"
          >
            <Play size={28} fill="currentColor" />
            <span className="font-black uppercase tracking-[0.25em] text-xl">Start Focus</span>
          </button>
        </div>
      )}

      {/* ─── FOCUS / BREAK RUNNING SCREEN ─── */}
      {isRunning && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0c] px-6">
          
          {/* Big Visualizer – same for focus & break */}
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
          <div className="text-7xl font-mono font-bold tracking-widest mb-6">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          {/* Status text */}
          <div className="text-xl font-semibold mb-2">
            {isBreak ? "Break Time" : "Focus Mode"}
          </div>

          <p className="text-gray-400 text-base mb-10 max-w-md text-center">
            {isBreak 
              ? (currentCycle % CYCLES_BEFORE_LONG_BREAK === 0 
                  ? "Long break – relax, stretch, hydrate" 
                  : "Short break – take it easy for a moment")
              : goal || "Stay focused on your goal"}
          </p>

          {/* Cycle indicator */}
          {!isBreak && (
            <p className="text-sm text-gray-500 mb-8">
              Session {currentCycle} of {CYCLES_BEFORE_LONG_BREAK}
              {currentCycle === CYCLES_BEFORE_LONG_BREAK && " – next is long break"}
            </p>
          )}

          {/* Controls */}
          <div className="flex gap-6">
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex items-center gap-3 px-10 py-5 bg-gray-800 hover:bg-gray-700 rounded-2xl text-lg font-semibold transition-colors"
            >
              {isActive ? <Pause size={28} /> : <Play size={28} />} 
              {isActive ? 'Pause' : 'Resume'}
            </button>

            <button
              onClick={isBreak ? handleSkipBreak : handleRestart}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-semibold transition-colors ${
                isBreak 
                  ? 'bg-blue-900/60 hover:bg-blue-900/80 border border-blue-700/40' 
                  : 'bg-red-900/60 hover:bg-red-900/80 border border-red-700/40'
              }`}
            >
              <RotateCcw size={28} />
              {isBreak ? 'Skip Break' : 'Restart'}
            </button>
          </div>
        </div>
      )}

      {/* Chat overlay – unchanged */}
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
                <p className="text-sm">Hey! I'm Ace. I see you're {isBreak ? 'on a break' : 'focusing on'} <b>{goal || 'your task'}</b>. How can I help?</p>
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

      {/* Floating chat button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-xl shadow-blue-900/40 transition-all active:scale-95"
        aria-label="Open Ace chat"
      >
        <MessageSquare size={24} />
      </button>

    </div>
  );
};

export default Timer;