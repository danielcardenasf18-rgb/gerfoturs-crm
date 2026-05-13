"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  ClipboardList, 
  MapPin, 
  User, 
  Car,
  Filter,
  LayoutList,
  Calendar as CalendarIcon
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ServiceModal from "@/components/ServiceModal";
import PageHeader from "@/components/ui/PageHeader";
import ServiceCalendar from "@/components/ServiceCalendar";

export default function ServiciosPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [openModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/servicios");
      const data = await response.json();
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (formData: any) => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const response = await fetch("/api/servicios", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchServices();
        setOpenModal(false);
        setEditingService(null);
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;
    try {
      await fetch("/api/servicios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'finalizado':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'en ruta':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pendiente':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelado':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredServices = Array.isArray(services) ? services.filter(s => 
    s.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destino?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const fmtDate = (d: any) => {
    if (!d) return "—";
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, "0");
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return `${day} ${months[date.getMonth()]}`;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Servicios"
          subtitle="Programación y seguimiento operativo de rutas"
          action={
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LayoutList size={16} />
                  Lista
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "calendar" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <CalendarIcon size={16} />
                  Calendario
                </button>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setOpenModal(true);
                }}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 uppercase tracking-widest text-sm"
              >
                <Plus size={20} />
                Programar Servicio
              </button>
            </div>
          }
        />

        {viewMode === "calendar" ? (
          <ServiceCalendar 
            services={services} 
            onEditService={(service) => {
              setEditingService(service);
              setOpenModal(true);
            }} 
          />
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/30">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por código, cliente o ruta..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
                  <Filter size={14} />
                  Filtrar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servicio</th>
                    <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ruta / Trayecto</th>
                    <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asignación</th>
                    <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor</th>
                    <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                    <th className="text-right px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <span className="text-[9px] font-black leading-none">{fmtDate(service.fecha)}</span>
                            </div>
                            <div>
                              <p className="font-black text-blue-600 font-condensed tracking-tighter text-base leading-none mb-1">{service.codigo}</p>
                              <p className="text-sm font-bold text-slate-900 leading-none">{service.cliente}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={12} className="text-slate-300" />
                            <span className="text-sm font-medium">{service.origen}</span>
                            <span className="text-slate-300">→</span>
                            <span className="text-sm font-bold text-slate-800">{service.destino}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                               <Car size={12} /> {service.vehicle?.placa || "Sin vehículo"}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                               <User size={10} /> {service.driver?.nombre || "Sin conductor"}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-slate-900">
                            ${service.valor?.toLocaleString("es-CO")}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(service.estado)}`}>
                            {service.estado}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingService(service);
                                setOpenModal(true);
                              }}
                              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => deleteService(service.id)}
                              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                            <ClipboardList size={32} />
                          </div>
                          <p className="text-slate-500 font-bold">No hay servicios registrados</p>
                          <p className="text-slate-400 text-xs mt-1 font-medium">Comienza programando tu primer servicio.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {openModal && (
        <ServiceModal
          onClose={() => {
            setOpenModal(false);
            setEditingService(null);
          }}
          initialData={editingService}
          onAddService={handleAddService}
        />
      )}
    </MainLayout>
  );
}
