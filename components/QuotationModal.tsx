"use client";

import { useState } from "react";
import { X, User, Hash, Calendar, Car, MapPin, Shield, Info, DollarSign, Users } from "lucide-react";

interface Props {
  onClose: () => void;
  onAddQuotation: (data: any) => void;
}

export default function QuotationModal({ onClose, onAddQuotation }: Props) {
  const [formData, setFormData] = useState({
    cliente: "",
    nit: "",
    contacto: "",
    fechaVenc: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tipoVehiculo: "Buseta",
    capacidad: "19 Pasajeros",
    equipamiento: "",
    ruta: "",
    tiempoEstimado: "",
    fechaServicio: "",
    horaSalida: "",
    horaRegreso: "",
    cantidad: 1,
    incluyePeajes: true,
    incluyeConductor: true,
    seguroContractual: true,
    seguroExtra: true,
    observaciones: "",
    condiciones: "",
    valorTotal: 0,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.cliente || !formData.ruta || !formData.valorTotal) return alert("Completa los campos obligatorios");
    onAddQuotation(formData);
  };

  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2";
  const inputClass = "w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a1128]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-condensed uppercase tracking-tight">Nueva Cotización Premium</h2>
            <p className="text-xs text-slate-400 font-medium">Genera propuestas comerciales de alto impacto.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cliente */}
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase text-blue-600 tracking-tighter border-b pb-2">Información del Cliente</h3>
             <div>
                <label className={labelClass}><User size={12}/> Cliente / Empresa *</label>
                <input name="cliente" value={formData.cliente} onChange={handleChange} className={inputClass} placeholder="Nombre o Razón Social" />
             </div>
             <div>
                <label className={labelClass}><Hash size={12}/> NIT / CC</label>
                <input name="nit" value={formData.nit} onChange={handleChange} className={inputClass} placeholder="900.XXX.XXX-X" />
             </div>
             <div>
                <label className={labelClass}><Calendar size={12}/> Vencimiento Oferta</label>
                <input type="date" name="fechaVenc" value={formData.fechaVenc} onChange={handleChange} className={inputClass} />
             </div>
          </div>

          {/* Servicio */}
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase text-emerald-600 tracking-tighter border-b pb-2">Detalles del Servicio</h3>
             <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}><Car size={12}/> Vehículo</label>
                  <input name="tipoVehiculo" value={formData.tipoVehiculo} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Users size={12}/> Capacidad</label>
                  <input name="capacidad" value={formData.capacidad} onChange={handleChange} className={inputClass} />
                </div>
             </div>
             <div>
                <label className={labelClass}><MapPin size={12}/> Ruta / Trayecto *</label>
                <input name="ruta" value={formData.ruta} onChange={handleChange} className={inputClass} placeholder="Ej: Bogotá - Villa de Leyva" />
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Fecha</label>
                  <input type="date" name="fechaServicio" value={formData.fechaServicio} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Hora Salida</label>
                  <input type="time" name="horaSalida" value={formData.horaSalida} onChange={handleChange} className={inputClass} />
                </div>
             </div>
          </div>

          {/* Valores y Extras */}
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase text-indigo-600 tracking-tighter border-b pb-2">Inclusiones y Valor</h3>
             <div className="grid grid-cols-2 gap-2">
                {[
                  { n: 'incluyePeajes', l: 'Incluye Peajes' },
                  { n: 'incluyeConductor', l: 'Conductor' },
                  { n: 'seguroContractual', l: 'Seg. Contractual' },
                  { n: 'seguroExtra', l: 'Seg. Extra' },
                ].map(item => (
                  <label key={item.n} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer">
                    <input type="checkbox" name={item.n} checked={(formData as any)[item.n]} onChange={handleChange} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{item.l}</span>
                  </label>
                ))}
             </div>
             <div>
                <label className={labelClass}><DollarSign size={12}/> Valor Total (COP) *</label>
                <input type="number" name="valorTotal" value={formData.valorTotal} onChange={handleChange} className="w-full bg-blue-50 border border-blue-100 p-4 rounded-xl text-xl font-black text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
             </div>
             <div>
                <label className={labelClass}><Info size={12}/> Observaciones</label>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className={inputClass} rows={2} />
             </div>
          </div>

          <div className="md:col-span-3 p-6 bg-slate-50 rounded-[1.5rem] flex gap-4">
             <button type="button" onClick={onClose} className="px-8 py-4 rounded-xl border font-bold text-slate-500 hover:bg-white transition-all">Cancelar</button>
             <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.01] transition-all">Generar Cotización</button>
          </div>
        </form>
      </div>
    </div>
  );
}
