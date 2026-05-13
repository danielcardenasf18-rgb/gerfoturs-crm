"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface Service {
  id: number;
  codigo: string;
  cliente: string;
  origen: string;
  destino: string;
  fecha: string;
  estado: string;
  valor: number;
  vehicle?: { placa: string };
  driver?: { nombre: string };
}

interface Props {
  services: Service[];
  onEditService: (service: Service) => void;
}

export default function ServiceCalendar({ services, onEditService }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[100px] md:min-h-[130px] bg-slate-50/50 border border-slate-100/50" />);
  }

  for (let d = 1; d <= numDays; d++) {
    const dayServices = services.filter(s => {
      const sDate = new Date(s.fecha);
      return (
        sDate.getFullYear() === year && 
        sDate.getMonth() === month && 
        sDate.getDate() === d
      );
    });

    days.push(
      <div key={d} className="min-h-[100px] md:min-h-[130px] bg-white border border-slate-100 p-1 md:p-2 hover:bg-slate-50 transition-colors group">
        <div className="flex justify-between items-start mb-1">
          <span className={`text-xs md:text-sm font-bold ${d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? 'bg-blue-600 text-white w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-md' : 'text-slate-400'}`}>
            {d}
          </span>
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[80px] custom-sidebar-scrollbar">
          {dayServices.map(s => (
            <button
              key={s.id}
              onClick={() => onEditService(s)}
              className={`w-full text-left p-1 rounded-md text-[8px] md:text-[10px] font-bold border transition-all hover:scale-[1.02] active:scale-95 ${
                s.estado === 'Finalizado' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                s.estado === 'En ruta' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                'bg-amber-50 border-amber-100 text-amber-700'
              }`}
            >
              <div className="truncate">{s.codigo}</div>
              <div className="truncate opacity-70 hidden md:block">{s.cliente}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col w-full">
      {/* Header */}
      <div className="p-4 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 font-condensed uppercase italic leading-none">
              {monthNames[month]} {year}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-[10px] md:text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all uppercase tracking-widest"
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[600px] grid grid-cols-7 bg-slate-100">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
            <div key={d} className="py-3 text-center text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white border-b border-slate-100">
              {d}
            </div>
          ))}
          {days}
        </div>
      </div>
    </div>
  );
}