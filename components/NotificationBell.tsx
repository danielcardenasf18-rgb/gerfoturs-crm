"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellRing, Check, Info, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.leida).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Fetch every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    // Check for services reminders on mount
    fetch("/api/notifications", { method: "POST" }).then(() => fetchNotifications());

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id?: number) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "Recordatorio": return <Clock className="text-amber-500" size={16} />;
      case "Alerta": return <AlertTriangle className="text-red-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) + ' ' + 
           d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all active:scale-95 ${
          isOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
        }`}
      >
        {unreadCount > 0 ? <BellRing size={20} className="animate-pulse" /> : <Bell size={20} />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "+9" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-50 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Notificaciones</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Alertas y Recordatorios</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAsRead()}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
              >
                <Check size={12} /> Marcar todo
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                  <Bell size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400">No tienes notificaciones aún.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 hover:bg-slate-50/80 transition-all group relative ${!n.leida ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        n.tipo === 'Recordatorio' ? 'bg-amber-50' : n.tipo === 'Alerta' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                        {getIcon(n.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-xs font-bold text-slate-900 leading-tight ${!n.leida ? 'pr-6' : ''}`}>
                            {n.titulo}
                          </h4>
                          {!n.leida && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="absolute top-4 right-4 w-5 h-5 rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-100 transition-all opacity-0 group-hover:opacity-100"
                              title="Marcar como leída"
                            >
                              <Check size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {n.mensaje}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Clock size={10} /> {formatTime(n.fecha)}
                          </span>
                          {n.link && (
                            <Link
                              href={n.link}
                              onClick={() => {
                                markAsRead(n.id);
                                setIsOpen(false);
                              }}
                              className="text-[9px] font-black text-blue-600 uppercase tracking-[0.15em] flex items-center gap-1 hover:gap-2 transition-all"
                            >
                              Ver más <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sistema Automatizado Gerfoturs</p>
          </div>
        </div>
      )}
    </div>
  );
}
