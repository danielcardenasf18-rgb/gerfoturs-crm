"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Car, 
  Filter
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import VehicleModal from "@/components/VehicleModal";
import PageHeader from "@/components/ui/PageHeader";

export default function VehiculosPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<number | null>(null);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehiculos");
      const data = await response.json();
      setVehiculos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const filteredVehicles = vehiculos.filter(v => 
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operativo':
      case 'activo':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'mantenimiento':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'inactivo':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Vehículos"
        subtitle="Flota y Unidades"
        action={
          <button
            onClick={() => {
              setEditingVehicle(null);
              setOpenModal(true);
            }}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 font-bold text-xs md:text-sm uppercase tracking-widest active:scale-[0.98]"
          >
            <Plus size={18} />
            <span className="hidden xs:inline">Registrar unidad</span>
            <span className="xs:hidden">Nuevo</span>
          </button>
        }
      />

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar vehículo..."
              className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
            <Filter size={14} />
            Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehículo</th>
                <th className="text-left px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detalles</th>
                <th className="text-left px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="text-right px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehiculo) => (
                  <tr key={vehiculo.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <Car size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm md:text-base">{vehiculo.placa}</p>
                          <p className="text-[10px] md:text-xs text-slate-500 font-medium">{vehiculo.marca} {vehiculo.modelo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                       <p className="text-xs md:text-sm font-bold text-slate-700">{vehiculo.tipo || "N/A"}</p>
                       <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{vehiculo.anio ? `Año ${vehiculo.anio}` : 'Sin año'}</p>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <span className={`px-2.5 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(vehiculo.estado)}`}>
                        {vehiculo.estado}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <button
                          onClick={() => {
                            setEditingVehicle(vehiculos.findIndex(v => v.id === vehiculo.id));
                            setOpenModal(true);
                          }}
                          className="p-2 md:p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg md:rounded-xl transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={async () => {
                            if(confirm("¿Eliminar vehículo?")) {
                              await fetch("/api/vehiculos", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: vehiculo.id }),
                              });
                              await fetchVehicles();
                            }
                          }}
                          className="p-2 md:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg md:rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium text-sm italic">
                    No se encontraron unidades
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <VehicleModal
          onClose={() => {
            setOpenModal(false);
            setEditingVehicle(null);
          }}
          initialData={
            editingVehicle !== null
              ? vehiculos[editingVehicle]
              : undefined
          }
          onAddVehicle={async (vehicle) => {
            const method = editingVehicle !== null ? "PUT" : "POST";
            const body = editingVehicle !== null 
              ? { id: vehiculos[editingVehicle].id, ...vehicle }
              : vehicle;
              
            await fetch("/api/vehiculos", {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            
            await fetchVehicles();
            setOpenModal(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </MainLayout>
  );
}