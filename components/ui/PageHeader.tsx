"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  // If there's no title and no subtitle, don't render anything
  if (!title && !subtitle && !action) return null;

  const isMainBrand = title?.toLowerCase().includes("gerfoturs");
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 md:mb-16 relative">
      {/* Decorative background element */}
      <div className="absolute -left-12 -top-12 w-32 h-32 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none hidden md:block" />
      
      <div className="space-y-3 relative z-10 w-full md:w-auto overflow-hidden">
        <div className="flex flex-col">
          {title && (
            isMainBrand ? (
              <>
                <span className="text-[8px] md:text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.5em] mb-2 ml-1 animate-in fade-in slide-in-from-left-4 duration-700 leading-none">
                  Logística Empresarial
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-[1000] text-slate-900 tracking-[-0.04em] font-condensed uppercase italic leading-[0.9] break-words">
                  Gerfoturs
                  <span className="inline-block w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded-full ml-2 shadow-lg shadow-blue-500/40 animate-pulse" />
                </h1>
              </>
            ) : (
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-[1000] text-slate-900 tracking-[-0.03em] font-condensed uppercase italic leading-[0.9] break-words">
                {title}
                <span className="text-blue-600 ml-1">.</span>
              </h1>
            )
          )}
        </div>
        
        {subtitle && (
          <div className="flex items-center gap-3 md:gap-4 ml-1 opacity-80 animate-in fade-in duration-1000 delay-300">
            <div className="h-[1px] w-8 md:w-12 bg-slate-300 flex-shrink-0" />
            <p className="text-slate-500 font-bold text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.35em] truncate">
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {action && (
        <div className="w-full md:w-auto pb-1 animate-in fade-in zoom-in duration-500 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}