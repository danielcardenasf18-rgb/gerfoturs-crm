"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users2,
  ClipboardList,
  Wrench,
  Calculator,
  Receipt,
  FolderOpen,
  ScrollText,
  X,
  ChevronDown
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Principal": true,
    "Operaciones": true,
    "Finanzas": true,
    "Gestión": true
  });

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuGroups = [
    {
      label: "Principal",
      items: [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Operaciones",
      items: [
        { href: "/vehiculos", label: "Vehículos", icon: Car },
        { href: "/conductores", label: "Conductores", icon: Users2 },
        { href: "/servicios", label: "Servicios", icon: ClipboardList },
        { href: "/mantenimiento", label: "Mantenimiento", icon: Wrench },
      ],
    },
    {
      label: "Finanzas",
      items: [
        { href: "/contabilidad", label: "Contabilidad", icon: Calculator },
        { href: "/facturacion", label: "Facturación", icon: Receipt },
      ],
    },
    {
      label: "Gestión",
      items: [
        { href: "/documentos", label: "Documentos", icon: FolderOpen },
        { href: "/cotizaciones", label: "Cotizaciones", icon: ScrollText },
      ],
    },
  ];

  return (
    <aside className="w-72 lg:w-64 h-full bg-[#0a1128] text-slate-100 border-r border-white/5 flex flex-col overflow-hidden">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/[0.01] flex-shrink-0">
        <img
          src="/LOGOBLANCO.png"
          alt="Logo"
          className="w-40 object-contain hover:scale-105 transition-transform duration-500 cursor-pointer"
        />
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation - Slidable Area */}
      <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar px-4 py-6 space-y-8">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <button 
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-4 mb-3 group/header"
            >
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] group-hover/header:text-blue-400 transition-colors">
                {group.label}
              </p>
              <div className={`text-slate-600 transition-transform duration-300 ${openGroups[group.label] ? 'rotate-0' : '-rotate-90'}`}>
                <ChevronDown size={14} />
              </div>
            </button>
            
            <div className={`space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${openGroups[group.label] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <nav className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group/item overflow-hidden ${
                        isActive
                          ? "bg-blue-600/10 text-white shadow-[inset_0_0_20px_rgba(37,99,235,0.05)] border border-blue-500/20"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent transition-transform duration-500 -translate-x-full group-hover/item:translate-x-0 ${isActive ? 'translate-x-0' : ''}`} />
                      
                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <Icon 
                          size={18} 
                          strokeWidth={isActive ? 2.5 : 1.8} 
                          className={`transition-all duration-300 ${isActive ? "text-blue-400 scale-110" : "group-hover/item:text-blue-400 group-hover/item:scale-110"}`} 
                        />
                        <span className={`text-sm transition-all duration-300 ${isActive ? "font-bold tracking-tight" : "font-medium group-hover/item:translate-x-1"}`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02] flex-shrink-0">
        <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-[10px] font-black text-white shadow-lg group-hover:scale-105 transition-transform">
            AD
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-bold text-white truncate">Admin</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">Administrador</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-sidebar-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
}