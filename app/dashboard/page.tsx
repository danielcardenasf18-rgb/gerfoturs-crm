"use client";
export const dynamic = "force-dynamic";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Car, Users2, FileText, TrendingUp, Calendar, Clock } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Vehículos", value: "24", icon: Car, color: "bg-blue-500" },
    { label: "Conductores", value: "12", icon: Users2, color: "bg-emerald-500" },
    { label: "Documentos", value: "48", icon: FileText, color: "bg-amber-500" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Logística Empresarial Gerfoturs"
          subtitle="Sistema Empresarial CRM — Gestión Estratégica"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-blue-500/5 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                  <stat.icon size={28} />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp size={14} /> +12%
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
             <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-blue-500" size={20} />
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Actividad Reciente</h3>
             </div>
             <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4 items-start border-l-2 border-slate-50 pl-4 relative">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Actualización de SOAT</p>
                      <p className="text-xs text-slate-400 font-medium">Vehículo ABC-123 • Hace 2 horas</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 text-white">
             <div className="flex items-center gap-3 mb-6">
                <Clock className="text-emerald-400" size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm text-emerald-400">Próximos Vencimientos</h3>
             </div>
             <div className="space-y-4">
                {[
                  { label: "Revisión Técnica", unit: "BUS-987", days: "5 días" },
                  { label: "Seguro Contractual", unit: "VAN-456", days: "12 días" },
                  { label: "Licencia de Conducción", unit: "Juan Pérez", days: "Vence hoy" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{item.unit}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-400 px-3 py-1 bg-emerald-400/10 rounded-full">{item.days}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}