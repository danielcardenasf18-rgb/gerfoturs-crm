"use client";

import { useState, useEffect } from "react";
import { X, User, MapPin, Calendar, Clock, Users, DollarSign, Info, ClipboardList, Car, UserCheck, Activity } from "lucide-react";

interface Props {
  onClose: () => void;
  onAddService: (service: any) => void;
  initialData?: any;
}

export default function ServiceModal({
  onClose,
  onAddService,
  initialData,
}: Props) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/vehiculos").then(res => res.json()).then(data => setVehicles(data));
    fetch("/api/conductores").then(res => res.json()).then(data => setDrivers(data));
  }, []);

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    cliente: initialData?.cliente || "",
    origen: initialData?.origen || "",
    destino: initialData?.destino || "",
    fecha: formatDate(initialData?.fecha),
    hora: initialData?.hora || "",
    pasajeros: initialData?.pasajeros || 1,
    valor: initialData?.valor || 0,
    estado: initialData?.estado || "Pendiente",
    observaciones: initialData?.observaciones || "",
    vehicleId: initialData?.vehicleId || "",
    driverId: initialData?.driverId || "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.cliente || !formData.origen || !formData.destino || !formData.valor) {
      return alert("Por favor completa los campos obligatorios (*)");
    }
    onAddService(formData);
    onClose();
  };

  const inputClass = "w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-sm";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a1128]/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-condensed">
                {initialData ? "Editar Servicio" : "Programar Servicio"}
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Gestión operativa de rutas y transporte especial.</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Section 1: Cliente y Ruta */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                  Detalles del Cliente y Ruta
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}><User size={12} /> Cliente / Empresa *</label>
                    <input name="cliente" value={formData.cliente} onChange={handleChange} className={inputClass} placeholder="Ej: Ecopetrol" />
                  </div>
                  
                  <div>
                    <label className={labelClass}><MapPin size={12} /> Origen *</label>
                    <input name="origen" value={formData.origen} onChange={handleChange} className={inputClass} placeholder="Ciudad / Punto" />
                  </div>
                  
                  <div>
                    <label className={labelClass}><MapPin size={12} /> Destino *</label>
                    <input name="destino" value={formData.destino} onChange={handleChange} className={inputClass} placeholder="Ciudad / Punto" />
                  </div>

                  <div>
                    <label className={labelClass}><Calendar size={12} /> Fecha</label>
                    <input name="fecha" type="date" value={formData.fecha} onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}><Clock size={12} /> Hora</label>
                    <input name="hora" type="time" value={formData.hora} onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}><Users size={12} /> N° Pasajeros</label>
                    <input name="pasajeros" type="number" value={formData.pasajeros} onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}><DollarSign size={12} /> Valor del Servicio *</label>
                    <input name="valor" type="number" value={formData.valor} onChange={handleChange} className="w-full bg-blue-50 border border-blue-100 p-3 rounded-2xl text-blue-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Operación */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                  Asignación Técnica
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}><Car size={12} /> Vehículo Asignado</label>
                    <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar vehículo...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}><UserCheck size={12} /> Conductor</label>
                    <select name="driverId" value={formData.driverId} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar conductor...</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}><Activity size={12} /> Estado del Servicio</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Pendiente", "En Ruta", "Finalizado", "Cancelado"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setFormData({...formData, estado: st})}
                          className={`py-2.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
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

                  <div>
                    <label className={labelClass}><Info size={12} /> Observaciones</label>
                    <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className={inputClass} rows={3} placeholder="Instrucciones adicionales para el servicio..." />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50/50 flex gap-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all shadow-sm">
            Cancelar
          </button>
          <button type="button" onClick={handleSave} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">
            {initialData ? "Actualizar Servicio" : "Programar Servicio"}
          </button>
        </div>
      </div>
    </div>
  );
}
