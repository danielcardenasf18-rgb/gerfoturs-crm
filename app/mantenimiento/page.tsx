"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Wrench, 
  Calendar, 
  Car,
  Filter,
  Building
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import MaintenanceModal from "@/components/MaintenanceModal";
import PageHeader from "@/components/ui/PageHeader";

export default function MantenimientoPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<any>(null);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMaintenances = async () => {
    try {
      const response = await fetch("/api/mantenimiento");
      const data = await response.json();
      if (Array.isArray(data)) {
        setMaintenances(data);
      } else {
        setMaintenances([]);
      }
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      setMaintenances([]);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const handleAddMaintenance = async (formData: any) => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const response = await fetch("/api/mantenimiento", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchMaintenances();
        setOpenModal(false);
        setEditingMaintenance(null);
      }
    } catch (error) {
      console.error("Error saving maintenance:", error);
    }
  };

  const deleteMaintenance = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
      await fetch("/api/mantenimiento", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchMaintenances();
    } catch (error) {
      console.error("Error deleting maintenance:", error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completado':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'en proceso':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pendiente':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredMaintenances = Array.isArray(maintenances) ? maintenances.filter(m => 
    m.vehicle?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.taller?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const fmtDate = (d: any) => d ? new Date(d).toLocaleDateString("es-CO", { day: '2-digit', month: 'short', year: 'numeric' }) : "—";
  const fmtMoney = (val: number) => `$${Number(val).toLocaleString("es-CO")}`;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Mantenimiento"
          subtitle="Control técnico y reparaciones preventivas"
          action={
            <button
              onClick={() => {
                setEditingMaintenance(null);
                setOpenModal(true);
              }}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Plus size={20} />
              Registrar Mantenimiento
            </button>
          }
        />

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por placa, tipo o taller..."
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
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehículo</th>
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo / Fecha</th>
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taller / Costo</th>
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Próximo</th>
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="text-right px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMaintenances.length > 0 ? (
                  filteredMaintenances.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                            <Car size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{m.vehicle?.placa}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{m.vehicle?.marca}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-slate-700">{m.tipo}</span>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                             <Calendar size={10} /> {fmtDate(m.fecha)}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                             <Building size={12} /> {m.taller || "No especificado"}
                          </div>
                          <span className="text-xs font-black text-blue-600">{fmtMoney(m.costo)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {m.proximo ? (
                          <div className="flex items-center gap-2">
                             <Calendar size={12} className="text-amber-500" />
                             <span className="text-xs font-bold text-slate-700">{fmtDate(m.proximo)}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 italic">No programado</span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(m.estado)}`}>
                          {m.estado}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingMaintenance(m);
                              setOpenModal(true);
                            }}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => deleteMaintenance(m.id)}
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
                          <Wrench size={32} />
                        </div>
                        <p className="text-slate-500 font-bold">No hay registros de mantenimiento</p>
                        <p className="text-slate-400 text-xs mt-1 font-medium">Registra el mantenimiento preventivo de tus vehículos.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openModal && (
        <MaintenanceModal
          onClose={() => {
            setOpenModal(false);
            setEditingMaintenance(null);
          }}
          initialData={editingMaintenance}
          onAddMaintenance={handleAddMaintenance}
        />
      )}
    </MainLayout>
  );
}