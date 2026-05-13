"use client";

import { useState } from "react";
import { X, DollarSign, Calendar, Tag, FileText, Hash, Paperclip, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface TransactionData {
  id?: number;
  tipo: string;
  fecha: string;
  concepto: string;
  categoria: string;
  monto: string;
  referencia: string;
  notas: string;
  documentoUrl?: string;
}

interface Props {
  onClose: () => void;
  onSave: (transaction: any) => void;
  initialData?: any;
}

const CATEGORIES = [
  "Servicios de transporte",
  "Combustible",
  "Mantenimiento",
  "Nómina",
  "Seguros",
  "Impuestos",
  "Peajes",
  "Oficina",
  "Otros"
];

export default function TransactionModal({
  onClose,
  onSave,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<TransactionData>({
    tipo: initialData?.tipo || "Ingreso",
    fecha: initialData?.fecha ? new Date(initialData.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    concepto: initialData?.concepto || "",
    categoria: initialData?.categoria || "Servicios de transporte",
    monto: initialData?.monto?.toString() || "",
    referencia: initialData?.referencia || "",
    notas: initialData?.notas || "",
    documentoUrl: initialData?.documentoUrl || "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulating file upload - in a real app, you'd send to S3 or a local API
    setTimeout(() => {
      setFormData(prev => ({ ...prev, documentoUrl: `/uploads/${file.name}` }));
      setUploading(false);
    }, 1000);
  };

  const handleSave = () => {
    if (!formData.concepto || !formData.monto || !formData.fecha) {
      return alert("Por favor completa los campos obligatorios (*)");
    }
    onSave(initialData ? { ...formData, id: initialData.id } : formData);
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
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.tipo === 'Ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <DollarSign size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-condensed">
                {initialData ? "Editar Movimiento" : "Nuevo Movimiento"}
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Registra ingresos o egresos de la caja.</p>
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
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Tipo de Movimiento *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, tipo: 'Ingreso'})}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    formData.tipo === 'Ingreso'
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <ArrowUpCircle size={16} />
                  Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, tipo: 'Egreso'})}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    formData.tipo === 'Egreso'
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <ArrowDownCircle size={16} />
                  Egreso
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}><Calendar size={12} /> Fecha *</label>
                <input
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}><DollarSign size={12} /> Monto (COP) *</label>
                <input
                  name="monto"
                  type="number"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}><FileText size={12} /> Concepto *</label>
              <input
                name="concepto"
                type="text"
                placeholder="Ej: Pago servicio Ruta Escolar"
                value={formData.concepto}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><Tag size={12} /> Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={inputClass}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}><Hash size={12} /> Referencia / N° Doc</label>
                <input
                  name="referencia"
                  type="text"
                  placeholder="REC-001"
                  value={formData.referencia}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}><Paperclip size={12} /> Cargar Documento</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.documentoUrl 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600" 
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <Paperclip size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {uploading ? "Cargando..." : formData.documentoUrl ? "Cargado" : "Adjuntar"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Notas</label>
              <textarea
                name="notas"
                rows={3}
                placeholder="Observaciones adicionales..."
                value={formData.notas}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
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
            className={`flex-[1.5] text-white px-6 py-3 rounded-[1.5rem] font-bold text-sm shadow-xl transition-all active:scale-[0.98] ${
              formData.tipo === 'Ingreso' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
            }`}
          >
            {initialData ? "Guardar Cambios" : "Registrar Movimiento"}
          </button>
        </div>
      </div>
    </div>
  );
}