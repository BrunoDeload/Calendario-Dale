
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles,
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
      description: 'Evento personalizado adicionado.'
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
        return 'bg-rose-950/60 border-rose-500/50 text-rose-50';
      case EventType.STATE_HOLIDAY: 
        return 'bg-sky-950/60 border-sky-500/50 text-sky-50';
      case EventType.MUNICIPAL_HOLIDAY: 
        return 'bg-emerald-950/60 border-emerald-500/50 text-emerald-50';
      case EventType.CULTURAL_DATE: 
        return 'bg-purple-950/60 border-purple-500/50 text-purple-50';
      case EventType.CUSTOM_EVENT: 
        return 'bg-amber-950/60 border-amber-500/50 text-amber-50';
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
    <div className="h-screen w-full bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-sans">
      <header className="flex-none bg-slate-900/90 border-b border-slate-800 p-6 md:px-12 flex items-center justify-between backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
            <CalendarIcon className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-none">Agenda Campinas & RMC</h1>
            <p className="text-[10px] text-blue-400 uppercase tracking-[0.3em] mt-2 font-bold">Brasil • São Paulo • Região Metropolitana</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center bg-slate-800/80 rounded-2xl p-1 border border-slate-700">
            <button onClick={() => shiftMonths(-1)} className="p-2 hover:bg-slate-700 rounded-xl transition-colors"><ChevronLeft size={24} /></button>
            <div className="px-4 md:px-8 flex flex-col items-center min-w-[120px]">
              <span className="font-black text-lg text-white uppercase">{MONTHS[startMonth]}</span>
              <span className="text-[10px] text-slate-500 font-bold">{currentYear}</span>
            </div>
            <button onClick={() => shiftMonths(1)} className="p-2 hover:bg-slate-700 rounded-xl transition-colors"><ChevronRight size={24} /></button>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-blue-50 rounded-xl font-black transition-colors shadow-lg text-sm"
          >
            <Plus size={18} strokeWidth={3} /> NOVO
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-hidden">
        {visibleMonths.map((month) => (
          <section 
            key={`${month.name}-${month.year}`} 
            className="bg-slate-900/50 border-2 border-slate-800/80 rounded-[2.5rem] p-8 flex flex-col min-h-0 relative shadow-inner"
          >
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{month.name}</h2>
              <span className="text-[10px] text-slate-500 font-bold">{month.events.length} DATAS</span>
            </header>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-custom">
              {month.events.length > 0 ? (
                month.events.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleFetchAiDetails(event)}
                    className={`w-full text-left p-5 border-2 rounded-[2rem] flex items-center gap-4 relative group transition-colors ${getCardStyle(event.type)}`}
                  >
                    <div className={`text-2xl font-black min-w-[3rem] h-[3rem] flex items-center justify-center rounded-xl border-2 ${getBadgeStyle(event.type)}`}>
                      {event.date.getDate().toString().padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <h3 className="text-base font-black leading-tight truncate">{event.name}</h3>
                        {event.type === EventType.CUSTOM_EVENT && (
                          <button onClick={(e) => handleDeleteEvent(event.id, e)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Trash2 size={16} /></button>
                        )}
                      </div>
                      <p className="text-xs font-medium opacity-60 line-clamp-2 leading-relaxed">{event.description}</p>
                    </div>
                    <Sparkles size={14} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-white/50" />
                  </button>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                  <CalendarDays size={64} />
                  <span className="text-xs font-black uppercase tracking-widest">Sem eventos</span>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      <footer className="flex-none p-6 border-t border-slate-800 bg-slate-950 flex flex-wrap justify-center gap-x-10 gap-y-4">
        {[
          { color: 'bg-rose-500', label: 'Nacional' },
          { color: 'bg-sky-500', label: 'Estadual (SP)' },
          { color: 'bg-emerald-500', label: 'Campinas / RMC' },
          { color: 'bg-purple-500', label: 'Cultural' },
          { color: 'bg-amber-500', label: 'Custom' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${item.color} ring-2 ring-white/5`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </footer>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl transition-opacity">
          <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-white/5 flex justify-between items-start">
              <div>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/10 text-white mb-4 inline-block">
                  {selectedEvent.type.replace('_', ' ')}
                </span>
                <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">{selectedEvent.name}</h3>
                <p className="text-lg text-white/40 font-bold uppercase tracking-widest">
                  {selectedEvent.date.getDate()} DE {MONTHS[selectedEvent.date.getMonth()]}
                </p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"><X size={28} /></button>
            </div>
            <div className="p-10">
              <div className="bg-black/30 p-8 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-3 mb-6 text-blue-400">
                  <Sparkles size={24} /> 
                  <span className="text-xs font-black uppercase tracking-widest">Insights da IA</span>
                </div>
                {loadingAi ? (
                  <div className="flex flex-col items-center py-12">
                    <div className="w-12 h-12 border-3 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <p className="text-xl text-slate-200 leading-relaxed font-medium">{aiDetails}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-lg rounded-[3rem] shadow-2xl">
            <div className="p-10 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-3xl font-black text-white italic">NOVO EVENTO</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white"><X size={32} /></button>
            </div>
            <form onSubmit={handleAddCustomEvent} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Título</label>
                <input required name="name" type="text" autoFocus className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:border-blue-500 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mês</label>
                  <select name="month" className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 py-4 text-lg font-bold text-white focus:outline-none cursor-pointer">
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Dia</label>
                  <input required name="day" type="number" min="1" max="31" defaultValue="1" className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xl shadow-lg uppercase transition-colors">ADICIONAR</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-custom::-webkit-scrollbar { width: 5px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default App;
