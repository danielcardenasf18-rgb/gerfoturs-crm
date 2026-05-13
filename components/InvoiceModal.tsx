"use client";

import { useState, useEffect } from "react";
import { X, FileText, Calendar, User, CreditCard, DollarSign, Tag, Paperclip, Hash, Briefcase } from "lucide-react";

interface InvoiceData {
  id?: number;
  numeroFactura: string;
  fecha: string;
  cliente: string;
  identificacion: string;
  serviceId: string;
  valor: string;
  estadoPago: string;
  fechaVencimiento: string;
  notas: string;
  archivoUrl?: string;
}

interface Props {
  onClose: () => void;
  onSave: (invoice: any) => void;
  initialData?: any;
  nextInvoiceNumber?: string;
}

export default function InvoiceModal({
  onClose,
  onSave,
  initialData,
  nextInvoiceNumber,
}: Props) {
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState<InvoiceData>({
    numeroFactura: initialData?.numeroFactura || nextInvoiceNumber || "FAC-0001",
    fecha: initialData?.fecha ? new Date(initialData.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    cliente: initialData?.cliente || "",
    identificacion: initialData?.identificacion || "",
    serviceId: initialData?.serviceId?.toString() || "",
    valor: initialData?.valor?.toString() || "",
    estadoPago: initialData?.estadoPago || "Pendiente",
    fechaVencimiento: initialData?.fechaVencimiento ? new Date(initialData.fechaVencimiento).toISOString().split('T')[0] : "",
    notas: initialData?.notas || "",
    archivoUrl: initialData?.archivoUrl || "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/servicios")
      .then(res => res.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching services:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Simulating file upload
    setTimeout(() => {
      setFormData(prev => ({ ...prev, archivoUrl: `/uploads/invoices/${file.name}` }));
      setUploading(false);
    }, 1000);
  };

  const handleSave = () => {
    if (!formData.cliente || !formData.valor || !formData.numeroFactura) {
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
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-condensed">
                {initialData ? "Editar Factura" : "Nueva Factura"}
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Gestión de cobros y facturación legal.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}><Hash size={12} /> N° Factura *</label>
              <input
                name="numeroFactura"
                type="text"
                placeholder="FAC-0001"
                value={formData.numeroFactura}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><Calendar size={12} /> Fecha</label>
              <input
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}><User size={12} /> Cliente *</label>
              <input
                name="cliente"
                type="text"
                placeholder="Nombre o Razón Social"
                value={formData.cliente}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><CreditCard size={12} /> NIT / CC Cliente</label>
              <input
                name="identificacion"
                type="text"
                placeholder="900.123.456-7"
                value={formData.identificacion}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><Briefcase size={12} /> Servicio Asociado</label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.codigo || s.id} - {s.cliente} ({s.origen} - {s.destino})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}><DollarSign size={12} /> Valor (COP) *</label>
              <input
                name="valor"
                type="number"
                placeholder="0"
                value={formData.valor}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><Tag size={12} /> Estado de Pago</label>
              <select
                name="estadoPago"
                value={formData.estadoPago}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Anulado">Anulado</option>
              </select>
            </div>

            <div>
              <label className={labelClass}><Calendar size={12} /> Fecha Vencimiento</label>
              <input
                name="fechaVencimiento"
                type="date"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}><Paperclip size={12} /> Adjuntar Factura / Soporte</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="invoice-file"
                />
                <label
                  htmlFor="invoice-file"
                  className={`w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.archivoUrl 
                      ? "border-blue-500 bg-blue-50 text-blue-600" 
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <Paperclip size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {uploading ? "Cargando..." : formData.archivoUrl ? "Archivo Cargado" : "Elegir Archivo"}
                  </span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Notas</label>
              <textarea
                name="notas"
                rows={3}
                placeholder="Observaciones de la factura..."
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
            className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[1.5rem] font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            {initialData ? "Guardar Cambios" : "Guardar Factura"}
          </button>
        </div>
      </div>
    </div>
  );
}