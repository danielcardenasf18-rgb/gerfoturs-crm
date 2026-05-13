"use client";

import { useState } from "react";
import { X, User, CreditCard, Phone, FileText, Activity } from "lucide-react";

interface DriverData {
  id?: number;
  nombre: string;
  cedula: string;
  telefono: string;
  licencia: string;
  estado: string;
}

interface Props {
  onClose: () => void;
  onSave: (driver: DriverData) => void;
  initialData?: any;
}

export default function DriverModal({
  onClose,
  onSave,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<DriverData>({
    nombre: initialData?.nombre || "",
    cedula: initialData?.cedula || "",
    telefono: initialData?.telefono || "",
    licencia: initialData?.licencia || "",
    estado: initialData?.estado || "Activo",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.cedula || !formData.telefono) {
      return alert("Por favor completa los campos obligatorios (*)");
    }
    onSave(initialData ? { ...formData, id: initialData.id } : formData);
    onClose();
  };

  const inputClass = "w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0a1128]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-condensed">
                {initialData ? "Editar Conductor" : "Registrar Conductor"}
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Información personal y de contacto.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className={labelClass}><User size={12} /> Nombre Completo *</label>
              <input
                name="nombre"
                type="text"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><CreditCard size={12} /> Cédula *</label>
              <input
                name="cedula"
                type="text"
                placeholder="1.234.567.890"
                value={formData.cedula}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><Phone size={12} /> Teléfono *</label>
              <input
                name="telefono"
                type="text"
                placeholder="300 123 4567"
                value={formData.telefono}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><FileText size={12} /> Licencia de Conducción</label>
              <input
                name="licencia"
                type="text"
                placeholder="Categ. C2 / C3"
                value={formData.licencia}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><Activity size={12} /> Estado</label>
              <div className="grid grid-cols-2 gap-2">
                {["Activo", "Inactivo"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormData({...formData, estado: st})}
                    className={`py-3 px-1 rounded-xl text-xs font-bold border transition-all ${
                      formData.estado === st
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/50 flex gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-[1.5rem] border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[1.5rem] font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            {initialData ? "Guardar Cambios" : "Crear Conductor"}
          </button>
        </div>
      </div>
    </div>
  );
}