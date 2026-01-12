
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  User,
  Briefcase,
  LogOut,
  Mail,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';
import { MONTHS } from './constants';
import { EventType, CalendarEvent, CustomEvent, AuthUser } from './types';
import { getAllEventsForYear } from './services/holidayService';

const App: React.FC = () => {
  const [baseDate, setBaseDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Estados de Autenticação
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('rmc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem('rmc_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  const currentYear = baseDate.getFullYear();
  const startMonth = baseDate.getMonth();

  const [customEvents, setCustomEvents] = useState<CustomEvent[]>(() => {
    const saved = localStorage.getItem('custom_events_rmc_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistência
  useEffect(() => {
    localStorage.setItem('custom_events_rmc_v2', JSON.stringify(customEvents));
  }, [customEvents]);

  useEffect(() => {
    localStorage.setItem('rmc_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rmc_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rmc_current_user');
    }
  }, [currentUser]);

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (authMode === 'signup') {
      if (registeredUsers.find(u => u.email === email)) {
        alert('Este e-mail já está cadastrado!');
        return;
      }
      const newUser: AuthUser = { id: Math.random().toString(36).substr(2, 9), name, email, password };
      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      setShowAuthModal(false);
    } else {
      const user = registeredUsers.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        setShowAuthModal(false);
      } else {
        alert('E-mail ou senha incorretos!');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleDeleteEvent = (id: string, creatorId: string) => {
    if (!currentUser || currentUser.id !== creatorId) {
      alert('Apenas o criador deste evento pode excluí-lo.');
      return;
    }
    if (confirm('Deseja realmente excluir este evento personalizado?')) {
      setCustomEvents(customEvents.filter(ev => ev.id !== id));
    }
  };

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

  const getEventColors = (type: EventType) => {
    switch (type) {
      case EventType.NATIONAL_HOLIDAY: return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500' };
      case EventType.STATE_HOLIDAY: return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500' };
      case EventType.CAMPINAS_HOLIDAY: return { bg: 'bg-violet-600/20', border: 'border-violet-500/40', text: 'text-violet-300', badge: 'bg-violet-600' };
      case EventType.MUNICIPAL_HOLIDAY: return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500' };
      case EventType.CUSTOM_EVENT: return { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', badge: 'bg-amber-500' };
      default: return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', badge: 'bg-slate-500' };
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col selection:bg-indigo-500/30">
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CalendarIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight italic uppercase">RMC Agenda</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Painel de Eventos RMC & Brasil</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-white/5 rounded-full p-1 border border-white/10 mr-4">
            <button onClick={() => setBaseDate(new Date(baseDate.setMonth(baseDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-sm min-w-[100px] text-center">{currentYear}</span>
            <button onClick={() => setBaseDate(new Date(baseDate.setMonth(baseDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <ChevronRight size={20} />
            </button>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-black text-white uppercase">{currentUser.name}</span>
                <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">Usuário Ativo</span>
              </div>
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-indigo-600/20"
              >
                <Plus size={18} /> Novo
              </button>
              <button onClick={handleLogout} className="p-2.5 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-full transition-all border border-white/10">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all border border-white/10"
            >
              <User size={18} /> Entrar / Criar Conta
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {visibleMonths.map((month, mIdx) => (
          <div key={`${month.name}-${month.year}`} className="animate-fade-in" style={{ animationDelay: `${mIdx * 100}ms` }}>
            <div className="flex items-baseline justify-between mb-6 border-b border-white/5 pb-2">
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{month.name}</h2>
              <span className="text-xs font-bold text-slate-500">{month.year}</span>
            </div>
            
            <div className="space-y-4">
              {month.events.map(event => {
                const colors = getEventColors(event.type);
                const isCustom = event.type === EventType.CUSTOM_EVENT;

                return (
                  <div
                    key={event.id}
                    className={`group p-5 rounded-[2rem] border ${colors.border} ${colors.bg} transition-all duration-300 relative overflow-hidden`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 shrink-0 rounded-2xl ${colors.badge} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                        {event.date.getDate()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg leading-tight mb-1 ${colors.text}`}>{event.name}</h3>
                        
                        {isCustom ? (
                          <div className="space-y-2 mt-3">
                            <div className="flex items-center gap-2 text-indigo-300">
                              <Briefcase size={14} />
                              <span className="text-xs font-black uppercase tracking-wider line-clamp-1">Cliente: {event.clientName}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-white/10 pl-3">
                              {event.description}
                            </p>
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-slate-500 overflow-hidden">
                                <User size={12} className="shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">Por: {event.creatorName}</span>
                              </div>
                              {currentUser?.id === event.creatorId && (
                                <button 
                                  onClick={() => handleDeleteEvent(event.id, event.creatorId!)}
                                  className="p-1.5 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                  title="Excluir evento"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {month.events.length === 0 && (
                <div className="h-24 border-2 border-dashed border-white/5 rounded-[2rem] flex items-center justify-center opacity-30">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sem compromissos</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      <footer className="p-8 bg-black/40 border-t border-white/5 flex flex-wrap justify-center gap-8">
        {[
          { color: 'bg-rose-500', label: 'Nacional' },
          { color: 'bg-blue-500', label: 'Estadual (SP)' },
          { color: 'bg-violet-600', label: 'Campinas (Sede)' },
          { color: 'bg-emerald-500', label: 'RMC' },
          { color: 'bg-amber-500', label: 'Personalizado' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
          </div>
        ))}
      </footer>

      {/* Modal de Autenticação */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase">{authMode === 'login' ? 'Acessar Conta' : 'Criar Perfil'}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Painel RMC Agenda</p>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAuth} className="p-8 space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Seu Nome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input required name="name" type="text" placeholder="Nome Completo" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-indigo-500 outline-none transition-all font-bold" />
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input required name="email" type="email" placeholder="seu@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-indigo-500 outline-none transition-all font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input required name="password" type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-indigo-500 outline-none transition-all font-bold" />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-4">
                {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                {authMode === 'login' ? 'Entrar Agora' : 'Finalizar Cadastro'}
              </button>

              <div className="text-center pt-4">
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest"
                >
                  {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulário Novo Evento */}
      {showAddForm && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase leading-none">Novo Evento</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Identificado como: {currentUser.name}</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newEv: CustomEvent = {
                id: Math.random().toString(36).substr(2, 9),
                name: (formData.get('name') as string).toUpperCase(),
                month: parseInt(formData.get('month') as string),
                day: parseInt(formData.get('day') as string),
                description: formData.get('description') as string,
                clientName: formData.get('clientName') as string,
                creatorName: currentUser.name,
                creatorId: currentUser.id
              };
              setCustomEvents([...customEvents, newEv]);
              setShowAddForm(false);
            }} className="p-8 space-y-5">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Título do Evento</label>
                <input required name="name" type="text" placeholder="EX: REUNIÃO DE ESTRATÉGIA" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 outline-none transition-all font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mês</label>
                  <select name="month" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white font-bold outline-none appearance-none">
                    {MONTHS.map((m, i) => <option key={m} value={i} className="bg-slate-900">{m}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Dia</label>
                  <input required name="day" type="number" min="1" max="31" defaultValue="1" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome do Cliente</label>
                <input required name="clientName" type="text" placeholder="EX: GOOGLE BRASIL" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:border-amber-500 outline-none transition-all font-bold" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Descrição</label>
                <textarea required name="description" rows={3} placeholder="Descreva os objetivos desta data..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all font-medium resize-none" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 uppercase tracking-widest text-sm mt-4">Agendar Evento</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
