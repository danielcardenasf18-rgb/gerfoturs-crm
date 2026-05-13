"use client";

import { useState } from "react";
import { X, Car, Hash, Activity, Calendar, Shield, User, FileText, Info } from "lucide-react";

interface VehicleData {
  placa: string;
  marca: string;
  modelo: string;
  anio?: string;
  color?: string;
  pasajeros?: string;
  tipo: string;
  estado: string;
  motor?: string;
  chasis?: string;
  soatVencimiento?: string;
  soatAseguradora?: string;
  polizaVencimiento?: string;
  polizaAseguradora?: string;
  tarjetaOperacionVencimiento?: string;
  rtmVencimiento?: string;
  propietario?: string;
  tarjetaPropiedad?: string;
  observaciones?: string;
}

interface Props {
  onClose: () => void;
  onAddVehicle: (vehicle: VehicleData) => void;
  initialData?: any;
}

export default function VehicleModal({
  onClose,
  onAddVehicle,
  initialData,
}: Props) {
  // Helper to format date for input
  const formatDate = (date: any) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<VehicleData>({
    placa: initialData?.placa || "",
    marca: initialData?.marca || "",
    modelo: initialData?.modelo || "",
    anio: initialData?.anio?.toString() || "",
    color: initialData?.color || "",
    pasajeros: initialData?.pasajeros?.toString() || "",
    tipo: initialData?.tipo || "Buseta",
    estado: initialData?.estado || "Operativo",
    motor: initialData?.motor || "",
    chasis: initialData?.chasis || "",
    soatVencimiento: formatDate(initialData?.soatVencimiento),
    soatAseguradora: initialData?.soatAseguradora || "",
    polizaVencimiento: formatDate(initialData?.polizaVencimiento),
    polizaAseguradora: initialData?.polizaAseguradora || "",
    tarjetaOperacionVencimiento: formatDate(initialData?.tarjetaOperacionVencimiento),
    rtmVencimiento: formatDate(initialData?.rtmVencimiento),
    propietario: initialData?.propietario || "",
    tarjetaPropiedad: initialData?.tarjetaPropiedad || "",
    observaciones: initialData?.observaciones || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | React.SelectHTMLAttributes<HTMLSelectElement> | any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.placa || !formData.marca || !formData.modelo) {
      return alert("Por favor completa los campos obligatorios (*)");
    }
    onAddVehicle(formData);
    onClose();
  };

  const inputClass = "w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-sm";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0a1128]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
        {/* Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Car size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-condensed">
                {initialData ? "Editar Vehículo" : "Registrar Vehículo"}
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Completa la información técnica y legal de la unidad.</p>
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
        <div className="p-10 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Section 1: Info General */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                  Información General
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}><Hash size={12} /> Placa *</label>
                    <input
                      name="placa"
                      type="text"
                      placeholder="ABC-123"
                      value={formData.placa}
                      onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                      className={inputClass}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}><Shield size={12} /> Marca *</label>
                    <input
                      name="marca"
                      type="text"
                      placeholder="Ej: Mercedes-Benz"
                      value={formData.marca}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}><Car size={12} /> Modelo *</label>
                    <input
                      name="modelo"
                      type="text"
                      placeholder="Ej: Sprinter 515"
                      value={formData.modelo}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}><Calendar size={12} /> Año</label>
                    <input
                      name="anio"
                      type="number"
                      placeholder="2024"
                      value={formData.anio}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}><Activity size={12} /> Color</label>
                    <input
                      name="color"
                      type="text"
                      placeholder="Blanco"
                      value={formData.color}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}><User size={12} /> N° Pasajeros</label>
                    <input
                      name="pasajeros"
                      type="number"
                      placeholder="19"
                      value={formData.pasajeros}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}><Car size={12} /> Tipo</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Buseta">Buseta</option>
                      <option value="Bus">Bus</option>
                      <option value="Microbus">Microbus</option>
                      <option value="Van">Van</option>
                      <option value="Chiva">Chiva</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}><Activity size={12} /> Estado</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Operativo", "Mantenimiento", "Inactivo"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setFormData({...formData, estado: st})}
                          className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                            formData.estado === st
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                              : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>N° Motor</label>
                    <input
                      name="motor"
                      type="text"
                      placeholder="Motor #"
                      value={formData.motor}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>N° Chasis</label>
                    <input
                      name="chasis"
                      type="text"
                      placeholder="Chasis #"
                      value={formData.chasis}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Documentación */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                  Documentación y Legales
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}><Calendar size={12} /> SOAT Vigencia</label>
                    <input
                      name="soatVencimiento"
                      type="date"
                      value={formData.soatVencimiento}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}><Shield size={12} /> SOAT Aseguradora</label>
                    <input
                      name="soatAseguradora"
                      type="text"
                      placeholder="Sura, Positiva..."
                      value={formData.soatAseguradora}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}><Calendar size={12} /> Póliza Vigencia</label>
                    <input
                      name="polizaVencimiento"
                      type="date"
                      value={formData.polizaVencimiento}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}><Shield size={12} /> Póliza Aseguradora</label>
                    <input
                      name="polizaAseguradora"
                      type="text"
                      placeholder="Mapfre, Liberty..."
                      value={formData.polizaAseguradora}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}><Calendar size={12} /> Tarjeta Operación</label>
                    <input
                      name="tarjetaOperacionVencimiento"
                      type="date"
                      value={formData.tarjetaOperacionVencimiento}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}><Calendar size={12} /> Revisión Técnica</label>
                    <input
                      name="rtmVencimiento"
                      type="date"
                      value={formData.rtmVencimiento}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}><User size={12} /> Propietario</label>
                    <input
                      name="propietario"
                      type="text"
                      placeholder="Nombre del propietario"
                      value={formData.propietario}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}><FileText size={12} /> N° Tarjeta Propiedad</label>
                    <input
                      name="tarjetaPropiedad"
                      type="text"
                      placeholder="TP-XXXXXXXX"
                      value={formData.tarjetaPropiedad}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}><Info size={12} /> Observaciones</label>
                    <input
                      name="observaciones"
                      type="text"
                      placeholder="Notas adicionales..."
                      value={formData.observaciones}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50/50 flex gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-[1.5rem] border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            {initialData ? "Guardar Cambios" : "Crear Vehículo"}
          </button>
        </div>
      </div>
    </div>
  );
}