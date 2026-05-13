"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { User, Plus, Search, Edit2, Trash2, Phone, CreditCard, FileText } from "lucide-react";
import DriverModal from "@/components/DriverModal";
import PageHeader from "@/components/ui/PageHeader";

export default function ConductoresPage() {
  const [conductores, setConductores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/conductores");
      const data = await response.json();
      setConductores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSaveDriver = async (driverData: any) => {
    const method = driverData.id ? "PUT" : "POST";
    try {
      const response = await fetch("/api/conductores", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverData),
      });

      if (response.ok) {
        fetchDrivers();
        setIsModalOpen(false);
        setSelectedDriver(null);
      }
    } catch (error) {
      console.error("Error saving driver:", error);
    }
  };

  const handleDeleteDriver = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este conductor?")) return;

    try {
      const response = await fetch("/api/conductores", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchDrivers();
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const filteredDrivers = conductores.filter(d => 
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cedula.includes(searchTerm)
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Conductores"
          subtitle="Gestión de personal operativo y licencias"
          action={
            <button
              onClick={() => {
                setSelectedDriver(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Plus size={20} />
              Nuevo Conductor
            </button>
          }
        />

        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Total Personal</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{conductores.length}</p>
            </div>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conductor</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documento</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Licencia</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="p-6 h-20 bg-slate-50/20" />
                    </tr>
                  ))
                ) : filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                      No se encontraron conductores.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            {driver.nombre.charAt(0)}
                          </div>
                          <p className="font-bold text-slate-900">{driver.nombre}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CreditCard size={14} className="text-slate-400" />
                          <span className="font-medium">{driver.cedula}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          <span className="font-medium">{driver.telefono}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FileText size={14} className="text-slate-400" />
                          <span className="font-medium">{driver.licencia}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          driver.estado === 'Activo' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {driver.estado}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedDriver(driver);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <DriverModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDriver(null);
          }}
          onSave={handleSaveDriver}
          initialData={selectedDriver}
        />
      )}
    </MainLayout>
  );
}