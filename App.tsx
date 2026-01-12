
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MapPin,
  Flag,
  Info
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
    const saved = localStorage.getItem('custom_events_rmc');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('custom_events_rmc', JSON.stringify(customEvents));
  }, [customEvents]);

  const allEvents = useMemo(() => {
    const events = getAllEventsForYear(currentYear, customEvents);
    const nextYearEvents = getAllEventsForYear(currentYear + 1, customEvents);
    return [...events, ...nextYearEvents];
  }, [currentYear, customEvents]);

  const visibleMonths = useMemo(() => {
    const months = [];
    for (let i = 0; i < 4; i++) {
      const monthIdx = (startMonth + i) % 12;
      const yearOffset = Math.floor((startMonth + i) / 12);
      const targetYear = currentYear + yearOffset;
      
      months.push({
        index: monthIdx,
        year: targetYear,
        name: MONTHS[monthIdx],
        events: allEvents.filter(e => e.date.getMonth() === monthIdx && e.date.getFullYear() === targetYear)
      });
    }
    return months;
  }, [startMonth, currentYear, allEvents]);

  const handleFetchAiDetails = async (event: CalendarEvent) => {
    setSelectedEvent(event);
    setAiDetails(null);
    setLoadingAi(true);
    const dateStr = `${event.date.getDate()} de ${MONTHS[event.date.getMonth()]}`;
    const details = await fetchEventDetails(event.name, dateStr);
    setAiDetails(details);
    setLoadingAi(false);
  };

  const getEventColors = (type: EventType) => {
    switch (type) {
      case EventType.NATIONAL_HOLIDAY: return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500' };
      case EventType.STATE_HOLIDAY: return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500' };
      case EventType.CAMPINAS_HOLIDAY: return { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', badge: 'bg-violet-600' };
      case EventType.MUNICIPAL_HOLIDAY: return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500' };
      case EventType.CUSTOM_EVENT: return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500' };
      default: return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', badge: 'bg-slate-500' };
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CalendarIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">RMC Agenda</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Campinas & Região Metropolitana</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            <button onClick={() => setBaseDate(new Date(baseDate.setMonth(baseDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-sm min-w-[100px] text-center">{currentYear}</span>
            <button onClick={() => setBaseDate(new Date(baseDate.setMonth(baseDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} /> Adicionar Evento
          </button>
        </div>
      </header>

      {/* Grid de Meses */}
      <main className="flex-1 p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {visibleMonths.map((month, mIdx) => (
          <div key={`${month.name}-${month.year}`} className="animate-fade-in" style={{ animationDelay: `${mIdx * 100}ms` }}>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{month.name}</h2>
              <span className="text-xs font-bold text-slate-500">{month.year}</span>
            </div>
            
            <div className="space-y-3">
              {month.events.map(event => {
                const colors = getEventColors(event.type);
                return (
                  <button
                    key={event.id}
                    onClick={() => handleFetchAiDetails(event)}
                    className={`w-full group text-left p-4 rounded-3xl border ${colors.border} ${colors.bg} hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 shrink-0 rounded-2xl ${colors.badge} flex items-center justify-center text-white font-black text-lg shadow-inner`}>
                        {event.date.getDate()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm truncate ${colors.text}`}>{event.name}</h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{event.description}</p>
                      </div>
                      <Sparkles size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                    </div>
                  </button>
                );
              })}
              {month.events.length === 0 && (
                <div className="h-24 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Nenhum evento</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Footer / Legenda Atualizada */}
      <footer className="p-8 bg-black/40 border-t border-white/5 flex flex-wrap justify-center gap-8">
        {[
          { color: 'bg-rose-500', label: 'Nacional' },
          { color: 'bg-blue-500', label: 'Estadual (SP)' },
          { color: 'bg-violet-600', label: 'Campinas (Sede)' },
          { color: 'bg-emerald-500', label: 'Outras da RMC' },
          { color: 'bg-amber-500', label: 'Personalizado' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
          </div>
        ))}
      </footer>

      {/* Modal de Detalhes (AI) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-8 border-b border-white/5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getEventColors(selectedEvent.type).badge}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {selectedEvent.type.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-white leading-tight">{selectedEvent.name}</h3>
                <p className="text-indigo-400 font-bold mt-1 uppercase text-xs tracking-widest">
                  {selectedEvent.date.getDate()} DE {MONTHS[selectedEvent.date.getMonth()].toUpperCase()}
                </p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-8">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl relative">
                <div className="flex items-center gap-2 mb-4 text-indigo-400">
                  <Sparkles size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Insight do Historiador IA</span>
                </div>
                
                {loadingAi ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-white/5 rounded-full animate-pulse w-full" />
                    <div className="h-4 bg-white/5 rounded-full animate-pulse w-3/4" />
                    <div className="h-4 bg-white/5 rounded-full animate-pulse w-1/2" />
                  </div>
                ) : (
                  <p className="text-slate-300 leading-relaxed text-lg italic">"{aiDetails}"</p>
                )}
              </div>
              
              <div className="mt-8 flex gap-4">
                <div className="flex-1 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <MapPin size={20} className="text-slate-500" />
                  <div>
                    <span className="block text-[8px] font-black text-slate-500 uppercase">Localização</span>
                    <span className="text-xs font-bold text-white">
                      {selectedEvent.type === EventType.CAMPINAS_HOLIDAY ? 'Campinas, SP' : 'RMC / Brasil'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Flag size={20} className="text-slate-500" />
                  <div>
                    <span className="block text-[8px] font-black text-slate-500 uppercase">Tipo</span>
                    <span className="text-xs font-bold text-white">Feriado Oficial</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário Novo Evento */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl">
            <div className="p-8 flex justify-between items-center border-b border-white/5">
              <h3 className="text-2xl font-black text-white italic uppercase">Novo Evento</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newEv: CustomEvent = {
                id: Math.random().toString(36).substr(2, 9),
                name: (formData.get('name') as string).toUpperCase(),
                month: parseInt(formData.get('month') as string),
                day: parseInt(formData.get('day') as string),
                description: 'Evento regional personalizado.'
              };
              setCustomEvents([...customEvents, newEv]);
              setShowAddForm(false);
            }} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Título do Evento</label>
                <input required name="name" type="text" placeholder="EX: ANIVERSÁRIO DO CLUBE" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mês</label>
                  <select name="month" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none appearance-none">
                    {MONTHS.map((m, i) => <option key={m} value={i} className="bg-slate-900">{m}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Dia</label>
                  <input required name="day" type="number" min="1" max="31" defaultValue="1" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 uppercase tracking-widest text-sm">Criar Evento</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
