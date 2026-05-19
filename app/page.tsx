"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
  Car, 
  Users2, 
  ClipboardList, 
  Banknote,
  ArrowUpRight,
  Plus,
  FileText,
  Upload,
  Package,
  FileSignature
} from "lucide-react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import VehicleModal from "@/components/VehicleModal";
import QuotationModal from "@/components/QuotationModal";

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const STATUS_COLORS: Record<string, string> = {
  Pendiente: "bg-amber-50 text-amber-600 border-amber-100",
  "En Ruta": "bg-blue-50 text-blue-600 border-blue-100",
  Finalizado: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Cancelado: "bg-red-50 text-red-600 border-red-100",
};

function timeAgo(date: string | Date) {
  const now = Date.now();
  const past = new Date(date).getTime();
  const diff = Math.max(0, now - past);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? "s" : ""}`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `Hace ${days} día${days > 1 ? "s" : ""}`;
  return new Date(date).toLocaleDateString("es-CO");
}

export default function DashboardPage() {
  const router = useRouter();
  const [openVehicleModal, setOpenVehicleModal] = useState(false);
  const [openQuotationModal, setOpenQuotationModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    vehiculos: 0,
    conductores: 0,
    servicios: 0,
    ingresosMes: 0,
    completadosHoy: 0,
    vehiculosNuevos: 0,
    ingresosHoy: 0,
    serviciosActivos: 0,
  });
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ name: string; ingresos: number }[]>([]);

  useEffect(() => {
    setIsClient(true);
    fetchAll();
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const [vehicles, drivers, services, quotations] = await Promise.all([
        fetch("/api/vehiculos").then((r) => r.json()),
        fetch("/api/conductores").then((r) => r.json()),
        fetch("/api/servicios").then((r) => r.json()),
        fetch("/api/cotizaciones").then((r) => r.json()),
      ]);

      const vArr = Array.isArray(vehicles) ? vehicles : [];
      const dArr = Array.isArray(drivers) ? drivers : [];
      const sArr = Array.isArray(services) ? services : [];
      const qArr = Array.isArray(quotations) ? quotations : [];

      // --- Stats ---
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const thisMonthServices = sArr.filter((s: any) => s.createdAt && new Date(s.createdAt) >= thisMonthStart);
      const lastMonthServices = sArr.filter((s: any) => s.createdAt && new Date(s.createdAt) >= lastMonthStart && new Date(s.createdAt) < thisMonthStart);
      const todayServices = sArr.filter((s: any) => s.createdAt && new Date(s.createdAt) >= todayStart);

      const ingresosMes = thisMonthServices.reduce((acc: number, s: any) => acc + (s.valor || 0), 0);
      const ingresosHoy = todayServices.reduce((acc: number, s: any) => acc + (s.valor || 0), 0);
      const serviciosActivos = sArr.filter((s: any) => s.estado === "Pendiente" || s.estado === "En Ruta").length;
      const completadosHoy = todayServices.filter((s: any) => s.estado === "Finalizado").length;

      const newThisMonth = vArr.filter((v: any) => v.createdAt && new Date(v.createdAt) >= thisMonthStart).length;
      const newLastMonth = vArr.filter((v: any) => v.createdAt && new Date(v.createdAt) >= lastMonthStart && new Date(v.createdAt) < thisMonthStart).length;

      setStats({
        vehiculos: vArr.length,
        conductores: dArr.length,
        servicios: sArr.length,
        ingresosMes,
        completadosHoy,
        vehiculosNuevos: newThisMonth,
        ingresosHoy,
        serviciosActivos,
      });

      // --- Recent Services (top 5) ---
      setRecentServices(sArr.slice(0, 5));

      // --- Activity feed (combine services, vehicles, quotations sorted by createdAt) ---
      const raw: any[] = [
        ...sArr.map((s: any) => ({ ...s, _type: "service", _label: `Servicio ${s.codigo || ""} - ${s.cliente}`, _color: "bg-blue-500" })),
        ...vArr.map((v: any) => ({ ...v, _type: "vehicle", _label: `Vehículo ${v.placa} registrado`, _color: "bg-emerald-500" })),
        ...qArr.map((q: any) => ({ ...q, _type: "quotation", _label: `Cotización ${q.codigo} - ${q.cliente}`, _color: "bg-indigo-500" })),
      ];
      raw.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActivities(raw.slice(0, 8));

      // --- Chart: group service income by month (last 6 months) ---
      const monthsMap: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        monthsMap[key] = 0;
      }
      sArr.forEach((s: any) => {
        if (!s.fecha) return;
        const d = new Date(s.fecha);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (key in monthsMap) monthsMap[key] += s.valor || 0;
      });
      setChartData(
        Object.entries(monthsMap).map(([key, val]) => {
          const m = parseInt(key.split("-")[1]);
          return { name: MONTHS[m], ingresos: val };
        })
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, []);

  const trendText = (label: string) => {
    if (label === "vehiculos") {
      const v = stats.vehiculosNuevos;
      return v > 0 ? `+${v} este mes` : "Sin cambios";
    }
    if (label === "conductores") {
      return `${stats.conductores} registrados`;
    }
    if (label === "servicios") {
      const a = stats.serviciosActivos;
      return a > 0 ? `${a} activos` : "Ninguno activo";
    }
    if (label === "ingresos") {
      return `+$${stats.ingresosHoy.toLocaleString()} hoy`;
    }
    return "";
  };

  const statusBadge = (estado: string) => {
    const cls = STATUS_COLORS[estado] || "bg-slate-50 text-slate-600 border-slate-100";
    return (
      <span className={`px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold border uppercase tracking-wider ${cls}`}>
        {estado}
      </span>
    );
  };

  const cards = [
    {
      title: "Vehículos Activos",
      value: stats.vehiculos,
      icon: <Car className="text-emerald-500" size={24} strokeWidth={1.5} />,
      bg: "bg-emerald-50",
      trend: trendText("vehiculos"),
      link: "/vehiculos"
    },
    {
      title: "Conductores",
      value: stats.conductores,
      icon: <Users2 className="text-blue-500" size={24} strokeWidth={1.5} />,
      bg: "bg-blue-50",
      trend: trendText("conductores"),
      link: "/conductores"
    },
    {
      title: "Servicios en Curso",
      value: stats.serviciosActivos,
      icon: <ClipboardList className="text-indigo-500" size={24} strokeWidth={1.5} />,
      bg: "bg-indigo-50",
      trend: trendText("servicios"),
      link: "/servicios"
    },
    {
      title: "Ingresos del Mes",
      value: `$${stats.ingresosMes.toLocaleString()}`,
      icon: <Banknote className="text-navy" size={24} strokeWidth={1.5} />,
      bg: "bg-slate-100",
      trend: trendText("ingresos"),
      link: "/servicios"
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-10">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-2">
          <button 
            onClick={() => setOpenVehicleModal(true)}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
              <Car size={20} />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Nuevo Vehículo</span>
          </button>
          <button 
            onClick={() => router.push("/servicios")}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Nuevo Servicio</span>
          </button>
          <button 
            onClick={() => setOpenQuotationModal(true)}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Cotización</span>
          </button>
          <button 
            onClick={() => router.push("/documentos")}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Subir Documento</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-blue-500/5 transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className={`${card.bg} p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:rotate-6 transition-transform shadow-sm`}>
                  {card.icon}
                </div>
                <button 
                  onClick={() => router.push(card.link)}
                  className="text-slate-300 hover:text-blue-500 transition-colors"
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>
              <div>
                <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{card.title}</p>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 font-condensed tracking-tight">{card.value}</h3>
                <div className="mt-3 md:mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{card.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Services */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 md:gap-3 italic">
                <div className="w-1.5 h-5 md:h-6 bg-emerald-500 rounded-full" />
                Servicios Recientes
              </h2>
              <button 
                onClick={() => router.push("/servicios")}
                className="text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline"
              >
                Ver todos
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Código</th>
                    <th className="text-left px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                    <th className="text-left px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                    <th className="text-right px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
                  {recentServices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 md:px-8 py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        No hay servicios registrados
                      </td>
                    </tr>
                  )}
                  {recentServices.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 md:px-8 py-4 md:py-5 font-bold text-slate-700">{s.codigo || `SV-${String(s.id).padStart(4,"0")}`}</td>
                      <td className="px-6 md:px-8 py-4 md:py-5 text-slate-600 font-medium">{s.cliente}</td>
                      <td className="px-6 md:px-8 py-4 md:py-5">{statusBadge(s.estado)}</td>
                      <td className="px-6 md:px-8 py-4 md:py-5 text-right font-bold text-slate-700">${(s.valor || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8 md:mb-10">
              <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 md:gap-3 italic">
                <div className="w-1.5 h-5 md:h-6 bg-blue-500 rounded-full" />
                Actividad Global
              </h2>
            </div>
            <div className="space-y-6 md:space-y-8 flex-1">
              {activities.length === 0 && (
                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest py-8">
                  Sin actividad reciente
                </p>
              )}
              {activities.slice(0, 6).map((item: any, i: number) => (
                <div key={`${item._type}-${item.id}`} className="flex gap-4 md:gap-6 items-start">
                  <div className="relative">
                    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full ${item._color} shadow-lg mt-1`} />
                    {i < 5 && <div className="absolute top-6 left-[5.5px] md:left-[6.5px] w-[1px] h-10 bg-slate-100" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-bold text-slate-800 leading-tight truncate">{item._label}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{timeAgo(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Rendimiento Financiero</h2>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 md:mt-2">Ingresos por Servicios · Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4 md:gap-6 bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-navy shadow-sm" />
                <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Ingresos</span>
              </div>
            </div>
          </div>
          
          <div className="h-[250px] md:h-[350px] w-full overflow-hidden">
            {isClient && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                      padding: '12px',
                      fontWeight: 'bold'
                    }}
                    formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, "Ingresos"]}
                  />
                  <Bar dataKey="ingresos" fill="#1a2e5a" radius={[6, 6, 6, 6]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {openVehicleModal && (
        <VehicleModal
          onClose={() => setOpenVehicleModal(false)}
          onAddVehicle={async (vehicle) => {
            await fetch("/api/vehiculos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(vehicle),
            });
            fetchAll();
            setOpenVehicleModal(false);
          }}
        />
      )}

      {openQuotationModal && (
        <QuotationModal
          onClose={() => setOpenQuotationModal(false)}
          onAddQuotation={async (data) => {
            await fetch("/api/cotizaciones", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            setOpenQuotationModal(false);
          }}
        />
      )}
    </MainLayout>
  );
}
