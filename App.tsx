
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles,
  MapPin,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CalendarDays
} from 'lucide-react';
import { MONTHS } from './constants';
import { EventType, CalendarEvent, CustomEvent } from './types';
import { getAllEventsForYear } from './services/holidayService';
import { fetchEventDetails } from './services/geminiService';

const App: React.FC = () => {
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [aiDetails, setAiDetails] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const currentYear = baseDate.getFullYear();
  const startMonth = baseDate.getMonth();

  const [customEvents, setCustomEvents] = useState<CustomEvent[]>(() => {
    const saved = localStorage.getItem('custom_holidays_campinas');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('custom_holidays_campinas', JSON.stringify(customEvents));
  }, [customEvents]);

  const allEventsCurrentYear = useMemo(() => getAllEventsForYear(currentYear, customEvents), [currentYear, customEvents]);
  const allEventsNextYear = useMemo(() => getAllEventsForYear(currentYear + 1, customEvents), [currentYear, customEvents]);

  const visibleMonths = useMemo(() => {
    const months = [];
    for (let i = 0; i < 4; i++) {
      const monthIdx = (startMonth + i) % 12;
      const yearOffset = Math.floor((startMonth + i) / 12);
      const targetYear = currentYear + yearOffset;
      const events = targetYear === currentYear ? allEventsCurrentYear : allEventsNextYear;
      
      months.push({
        index: monthIdx,
        year: targetYear,
        name: MONTHS[monthIdx],
        events: events.filter(e => e.date.getMonth() === monthIdx && e.date.getFullYear() === targetYear)
      });
    }
    return months;
  }, [startMonth, currentYear, allEventsCurrentYear, allEventsNextYear]);

  const shiftMonths = (direction: number) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(baseDate.getMonth() + direction);
    setBaseDate(newDate);
  };

  const handleFetchAiDetails = async (event: CalendarEvent) => {
    setSelectedEvent(event);
    setAiDetails(null);
    setLoadingAi(true);
    const dateStr = `${event.date.getDate()} de ${MONTHS[event.date.getMonth()]}`;
    const details = await fetchEventDetails(event.name, dateStr);
    setAiDetails(details);
    setLoadingAi(false);
  };

  const handleAddCustomEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEvent: CustomEvent = {
      id: Math.random().toString(36).substr(2, 9),
      name: (formData.get('name') as string).toUpperCase(),
      month: parseInt(formData.get('month') as string),
      day: parseInt(formData.get('day') as string),
      description: 'Evento personalizado.'
    };
    setCustomEvents([...customEvents, newEvent]);
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomEvents(customEvents.filter(ev => ev.id !== id));
  };

  const getCardStyle = (type: EventType) => {
    switch (type) {
      case EventType.NATIONAL_HOLIDAY: 
        return 'bg-rose-950/60 border-rose-500/50 text-rose-50 shadow-[0_0_25px_rgba(244,63,94,0.1)]';
      case EventType.STATE_HOLIDAY: 
        return 'bg-sky-950/60 border-sky-500/50 text-sky-50 shadow-[0_0_25px_rgba(14,165,233,0.1)]';
      case EventType.MUNICIPAL_HOLIDAY: 
        return 'bg-emerald-950/60 border-emerald-500/50 text-emerald-50 shadow-[0_0_25px_rgba(16,185,129,0.1)]';
      case EventType.CULTURAL_DATE: 
        return 'bg-purple-950/60 border-purple-500/50 text-purple-50 shadow-[0_0_25px_rgba(168,85,247,0.1)]';
      case EventType.CUSTOM_EVENT: 
        return 'bg-amber-950/60 border-amber-500/50 text-amber-50 shadow-[0_0_25px_rgba(245,158,11,0.1)]';
      default: 
        return 'bg-slate-800 border-slate-700 text-slate-50';
    }
  };

  const getBadgeStyle = (type: EventType) => {
    switch (type) {
      case EventType.NATIONAL_HOLIDAY: return 'bg-rose-600 border-rose-400';
      case EventType.STATE_HOLIDAY: return 'bg-sky-600 border-sky-400';
      case EventType.MUNICIPAL_HOLIDAY: return 'bg-emerald-600 border-emerald-400';
      case EventType.CULTURAL_DATE: return 'bg-purple-600 border-purple-400';
      case EventType.CUSTOM_EVENT: return 'bg-amber-600 border-amber-400';
      default: return 'bg-slate-600 border-slate-400';
    }
  };

  return (
    <div className="h-screen w-full bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-sans selection:bg-blue-500/30">
      <header className="flex-none bg-slate-900/80 border-b border-slate-800/50 p-6 md:px-12 flex items-center justify-between backdrop-blur-2xl">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl ring-1 ring-white/10">
            <CalendarIcon className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white leading-none tracking-tight">Agenda Regional</h1>
            <p className="text-[10px] text-blue-500 uppercase tracking-[0.4em] mt-2 font-black">Campinas • RMC • Brasil</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center bg-slate-800/50 rounded-2xl p-1 border border-slate-700 shadow-inner">
            <button onClick={() => shiftMonths(-1)} className="p-2.5 hover:text-white transition-all"><ChevronLeft size={28} /></button>
            <div className="px-8 flex flex-col items-center min-w-[150px]">
              <span className="font-black text-xl text-white leading-none uppercase tracking-tight">{MONTHS[startMonth]}</span>
              <span className="text-[11px] text-slate-500 font-bold mt-1 tracking-widest">{currentYear}</span>
            </div>
            <button onClick={() => shiftMonths(1)} className="p-2.5 hover:text-white transition-all"><ChevronRight size={28} /></button>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 hover:bg-blue-50 rounded-2xl font-black transition-all shadow-xl"
          >
            <Plus size={22} strokeWidth={3} /> NOVO
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden bg-[#020617]">
        {visibleMonths.map((month, idx) => (
          <section 
            key={`${month.name}-${month.year}`} 
            className="bg-slate-900/40 border-2 border-slate-800 rounded-[3rem] p-10 flex flex-col min-h-0 relative animate-in fade-in duration-700"
          >
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{month.name}</h2>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-blue-500 tracking-widest">{month.year}</span>
                <span className="text-[10px] text-slate-600 font-bold">{month.events.length} DATAS</span>
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-custom">
              {month.events.length > 0 ? (
                month.events.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleFetchAiDetails(event)}
                    className={`w-full text-left p-6 border-2 rounded-[2.5rem] flex items-center gap-6 relative group transition-all ${getCardStyle(event.type)}`}
                  >
                    <div className={`text-3xl font-black min-w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl border-2 ${getBadgeStyle(event.type)}`}>
                      {event.date.getDate().toString().padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1.5">
                        <h3 className="text-lg font-black leading-tight tracking-tight truncate">{event.name}</h3>
                        {event.type === EventType.CUSTOM_EVENT && (
                          <button onClick={(e) => handleDeleteEvent(event.id, e)} className="p-2 text-white/50 hover:text-white transition-all"><Trash2 size={18} /></button>
                        )}
                      </div>
                      <p className="text-sm font-medium opacity-70 leading-snug">{event.description}</p>
                    </div>
                    <Sparkles size={18} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </button>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                  <CalendarDays size={80} strokeWidth={1} />
                  <span className="text-sm font-black uppercase tracking-widest">Vazio</span>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      <footer className="flex-none p-8 border-t border-slate-800/80 bg-slate-950 flex flex-wrap justify-center gap-x-12 gap-y-6">
        {[
          { color: 'bg-rose-500', label: 'Nacional' },
          { color: 'bg-sky-500', label: 'Estadual (SP)' },
          { color: 'bg-emerald-500', label: 'RMC / Campinas' },
          { color: 'bg-purple-500', label: 'Especial' },
          { color: 'bg-amber-500', label: 'Customizado' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${item.color} ring-2 ring-white/10`} />
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
          </div>
        ))}
      </footer>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-12 border-b border-white/5 flex justify-between items-start">
              <div>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white ring-1 ring-white/20 mb-4 inline-block">
                  {selectedEvent.type.replace('_', ' ')}
                </span>
                <h3 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">{selectedEvent.name}</h3>
                <p className="text-xl text-white/60 font-black uppercase tracking-[0.15em]">
                  {selectedEvent.date.getDate()} DE {MONTHS[selectedEvent.date.getMonth()]} • {selectedEvent.date.getFullYear()}
                </p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"><X size={32} /></button>
            </div>
            <div className="p-12">
              <div className="bg-black/40 p-10 rounded-[3rem] border border-white/10">
                <div className="flex items-center gap-4 mb-8 text-white">
                  <Sparkles size={32} className="animate-pulse" /> 
                  <span className="text-sm font-black uppercase tracking-[0.4em]">Insights da IA</span>
                </div>
                {loadingAi ? (
                  <div className="flex flex-col items-center py-20 gap-8"><div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" /></div>
                ) : (
                  <p className="text-2xl text-white leading-relaxed font-medium tracking-tight">{aiDetails}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl">
          <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="p-12 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
              <h3 className="text-4xl font-black text-white tracking-tighter italic">NOVA DATA</h3>
              <button onClick={() => setShowAddForm(false)} className="p-3 text-slate-500 hover:text-white transition-all"><X size={36} /></button>
            </div>
            <form onSubmit={handleAddCustomEvent} className="p-12 space-y-10">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Título do Evento</label>
                <input required name="name" type="text" autoFocus className="w-full bg-slate-800 border-2 border-slate-700 rounded-3xl px-8 py-6 text-2xl font-bold focus:outline-none focus:border-white text-white shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Mês</label>
                  <select name="month" className="w-full bg-slate-800 border-2 border-slate-700 rounded-3xl px-6 py-6 text-xl font-bold text-white focus:outline-none appearance-none cursor-pointer">
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Dia</label>
                  <input required name="day" type="number" min="1" max="31" defaultValue="1" className="w-full bg-slate-800 border-2 border-slate-700 rounded-3xl px-8 py-6 text-xl font-bold text-white focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-8 bg-white text-slate-900 font-black rounded-[2.5rem] mt-8 text-2xl shadow-2xl uppercase">SALVAR</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-custom::-webkit-scrollbar { width: 8px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 20px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 20px; }
        body { background-color: #020617; }
      `}</style>
    </div>
  );
};

export default App;
