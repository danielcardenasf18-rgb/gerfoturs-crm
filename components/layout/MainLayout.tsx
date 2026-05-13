"use client";

import { useState } from "react";
import Sidebar from "../Sidebar";
import { Menu } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0a1128]/60 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Persistent Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-10 py-4 md:py-6 flex justify-between items-center z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] leading-none">
                  Logística Empresarial
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <h1 className="text-xl md:text-2xl font-[1000] text-slate-900 tracking-tight font-condensed uppercase italic leading-none">
                  Gerfoturs
                </h1>
                <div className="h-4 w-[1px] bg-slate-200 hidden xs:block" />
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-0.5 hidden xs:block">
                  Sistema CRM
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex flex-col items-end hidden md:flex text-right">
              <p className="text-xs font-bold text-slate-900 leading-none">Administrador</p>
              <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">Gerencia General</p>
            </div>
            <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20 ring-2 ring-white transition-transform active:scale-95 cursor-pointer">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50 relative">
          <div className="max-w-7xl mx-auto p-4 md:p-10 w-full">
            {children}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </main>
  );
}