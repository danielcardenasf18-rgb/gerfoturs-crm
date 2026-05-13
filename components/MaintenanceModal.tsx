"use client";

import { useState, useEffect } from "react";
import { X, Wrench, Calendar, DollarSign, Info, Car, Building } from "lucide-react";

interface Props {
  onClose: () => void;
  onAddMaintenance: (data: any) => void;
  initialData?: any;
}

export default function MaintenanceModal({
  onClose,
  onAddMaintenance,
  initialData,
}: Props) {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/vehiculos").then(res => res.json()).then(data => setVehicles(data));
  }, []);

  const formatDate = (date: any) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    vehicleId: initialData?.vehicleId || "",
    tipo: initialData?.tipo || "Preventivo",
    fecha: formatDate(initialData?.fecha || new Date()),
    proximo: formatDate(initialData?.proximo),
    costo: initialData?.costo || 0,
    taller: initialData?.taller || "",
    estado: initialData?.estado || "Pendiente",
    descripcion: initialData?.descripcion || "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.vehicleId || !formData.fecha || !formData.costo) {
      return alert("Por favor completa los campos obligatorios (*)");
    }
    onAddMaintenance(formData);
    onClose();
  };

  const inputClass = "w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a1128]/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-condensed">
                {initialData ? "Editar Mantenimiento" : "Registrar Mantenimiento"}
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Control preventivo y correctivo de la flota.</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="col-span-2">
              <label className={labelClass}><Car size={12} /> Vehículo *</label>
              <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} className={inputClass}>
                <option value="">Seleccionar vehículo...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}><Wrench size={12} /> Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className={inputClass}>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Aceite">Cambio de Aceite</option>
                <option value="Llantas">Llantas</option>
                <option value="Frenos">Frenos</option>
                <option value="Eléctrico">Sistema Eléctrico</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className={labelClass}><Calendar size={12} /> Fecha *</label>
              <input name="fecha" type="date" value={formData.fecha} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}><Calendar size={12} /> Próximo Mantenimiento</label>
              <input name="proximo" type="date" value={formData.proximo} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}><DollarSign size={12} /> Costo (COP) *</label>
              <input name="costo" type="number" value={formData.costo} onChange={handleChange} className={inputClass} />
            </div>

            <div className="col-span-2">
              <label className={labelClass}><Building size={12} /> Taller / Proveedor</label>
              <input name="taller" value={formData.taller} onChange={handleChange} className={inputClass} placeholder="Nombre del taller o mecánico" />
            </div>

            <div className="col-span-2">
              <label className={labelClass}><Info size={12} /> Estado</label>
              <div className="grid grid-cols-3 gap-2">
                {["Pendiente", "En Proceso", "Completado"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormData({...formData, estado: st})}
                    className={`py-2.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                      formData.estado === st
                        ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-500/20"
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClass}><Info size={12} /> Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className={inputClass} rows={3} placeholder="Detalles de los trabajos realizados..." />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50/50 flex gap-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all shadow-sm">
            Cancelar
          </button>
          <button type="button" onClick={handleSave} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">
            {initialData ? "Actualizar Registro" : "Guardar Mantenimiento"}
          </button>
        </div>
      </div>
    </div>
  );
}
