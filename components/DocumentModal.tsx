"use client";

import { useState, useEffect } from "react";
import { X, FileText, Calendar, Shield, Link2, Building, Paperclip, Info, Trash2, FilePlus } from "lucide-react";

interface DocumentData {
  id?: number;
  nombre: string;
  tipo: string;
  relacionadoCon: string;
  relacionadoId: string;
  entidad: string;
  fechaDocumento: string;
  fechaVencimiento: string;
  archivoUrl: string;
  notas: string;
}

interface Props {
  onClose: () => void;
  onSave: (doc: any) => void;
  initialData?: any;
}

const DOC_TYPES = ["SOAT", "RTM", "Tarjeta de Operación", "Licencia", "Póliza Contractual", "Póliza Extracontractual", "Cédula", "Contrato", "Otro"];
const RELATIONS = ["General", "Vehículo", "Conductor"];
const ENTITIES = ["Seguros Sura", "Aseguradora Solidaria", "Previsora Seguros", "Mapfre", "Positiva", "Liberty Seguros", "Ministerio de Transporte", "RUNT", "Otros"];

export default function DocumentModal({
  onClose,
  onSave,
  initialData,
}: Props) {
  const toDateInput = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [formData, setFormData] = useState<DocumentData>({
    nombre: initialData?.nombre || "",
    tipo: initialData?.tipo || "SOAT",
    relacionadoCon: initialData?.relacionadoCon || "General",
    relacionadoId: initialData?.relacionadoId?.toString() || "",
    entidad: initialData?.entidad || "",
    fechaDocumento: toDateInput(initialData?.fechaDocumento) || toDateInput(new Date()),
    fechaVencimiento: toDateInput(initialData?.fechaVencimiento),
    archivoUrl: initialData?.archivoUrl || "",
    notas: initialData?.notas || "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      return alert("El archivo supera los 10 MB permitidos.");
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setFormData(prev => ({ 
          ...prev, 
          archivoUrl: data.url, 
          nombre: prev.nombre || file.name.split('.')[0] 
        }));
      } else {
        alert("Error al subir el archivo: " + (data.error || "Desconocido") + (data.details ? " (" + data.details + ")" : ""));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error de red al intentar subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.tipo || !formData.archivoUrl) {
      return alert("Por favor completa los campos obligatorios (*) y adjunta un archivo.");
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
      
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FilePlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-condensed">
                {initialData ? "Editar Documento" : "Subir Documento"}
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Almacenamiento y control de vigencias.</p>
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
              <label className={labelClass}><FileText size={12} /> Nombre del Documento *</label>
              <input
                name="nombre"
                type="text"
                placeholder="Ej: SOAT Buseta ABC-123"
                value={formData.nombre}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}><Shield size={12} /> Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}><Link2 size={12} /> Relacionado con</label>
                <select
                  name="relacionadoCon"
                  value={formData.relacionadoCon}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}><Building size={12} /> Entidad / Emisor</label>
              <select
                name="entidad"
                value={formData.entidad}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                {ENTITIES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}><Calendar size={12} /> Fecha Emisión</label>
                <input
                  name="fechaDocumento"
                  type="date"
                  value={formData.fechaDocumento}
                  onChange={handleChange}
                  className={inputClass}
                />
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
            </div>

            <div>
              <label className={labelClass}><Paperclip size={12} /> Archivo (PDF, IMG, DOCX, XLSX)</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="doc-file"
                  accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                />
                <label
                  htmlFor="doc-file"
                  className={`w-full py-4 px-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.archivoUrl 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600" 
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {uploading ? (
                    <span className="text-xs font-bold animate-pulse">CARGANDO...</span>
                  ) : (
                    <>
                      <Paperclip size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider text-center">
                        {formData.archivoUrl ? "Archivo seleccionado correctamente" : "Haz clic para seleccionar archivo"}
                      </span>
                      <span className="text-[10px] font-medium opacity-60">Formatos: PDF, imágenes, Word, Excel. Máx. 10 MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className={labelClass}><Info size={12} /> Notas</label>
              <textarea
                name="notas"
                rows={3}
                placeholder="Detalles adicionales del documento..."
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
            {initialData ? "Guardar Cambios" : "Subir Documento"}
          </button>
        </div>
      </div>
    </div>
  );
}