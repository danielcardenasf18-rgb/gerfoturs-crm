"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import InvoicePDF from "@/components/InvoicePDF";
import {
  Plus, Search, FileText, DollarSign, CheckCircle2, Clock,
  Loader2, Download, Eye, EyeOff, Trash2, Edit2, X, ArrowLeft,
  Receipt, Building2, MapPin, Truck, Users, Hash, Calendar,
  CreditCard, Phone, Mail, User, Percent, Tag, FileSignature,
  Sunset, Sunrise, ClipboardList, Ban, Printer,
} from "lucide-react";

const TAB_LIST = "list";
const TAB_CREATE = "create";

interface InvoiceForm {
  numeroFactura: string;
  fecha: string;
  cliente: string;
  identificacion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudadOrigen: string;
  ciudadDestino: string;
  tipoServicio: string;
  descripcion: string;
  cantidadPasajeros: string;
  vehiculo: string;
  placa: string;
  conductor: string;
  fechaSalida: string;
  horaSalida: string;
  fechaLlegada: string;
  horaLlegada: string;
  observaciones: string;
  subtotal: string;
  descuento: string;
  iva: string;
  valor: string;
  estadoPago: string;
  notas: string;
}

const emptyForm: InvoiceForm = {
  numeroFactura: "", fecha: "", cliente: "", identificacion: "",
  telefono: "", correo: "", direccion: "", ciudadOrigen: "", ciudadDestino: "",
  tipoServicio: "", descripcion: "", cantidadPasajeros: "", vehiculo: "", placa: "",
  conductor: "", fechaSalida: "", horaSalida: "", fechaLlegada: "", horaLlegada: "",
  observaciones: "", subtotal: "", descuento: "", iva: "", valor: "",
  estadoPago: "Pendiente", notas: "",
};

const fmtCurrency = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" }) : "—";

const statusStyle: Record<string, string> = {
  Pagado: "bg-emerald-100 text-emerald-700",
  Pendiente: "bg-amber-100 text-amber-700",
  Anulado: "bg-slate-100 text-slate-500",
};

export default function FacturacionPage() {
  const [tab, setTab] = useState(TAB_LIST);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState<InvoiceForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/facturacion");
      const d = await r.json();
      setInvoices(Array.isArray(d) ? d : []);
    } catch (e) {
      console.error(e);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const nextInvoiceNumber = invoices.length > 0
    ? `FAC-${(parseInt(invoices[0].numeroFactura.split("-")[1]) + 1).toString().padStart(4, "0")}`
    : "FAC-0001";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === "subtotal" || name === "descuento" || name === "iva") {
        const sub = parseFloat(next.subtotal) || 0;
        const disc = parseFloat(next.descuento) || 0;
        const tax = parseFloat(next.iva) || 0;
        next.valor = (sub - disc + tax).toFixed(0);
      }
      return next;
    });
  };

  const resetForm = () => {
    setForm({ ...emptyForm, numeroFactura: nextInvoiceNumber, fecha: new Date().toISOString().split("T")[0] });
    setEditingId(null);
    setSuccessMsg("");
  };

  const startCreate = () => {
    resetForm();
    setTab(TAB_CREATE);
  };

  const handleEdit = (inv: any) => {
    setForm({
      numeroFactura: inv.numeroFactura,
      fecha: inv.fecha ? new Date(inv.fecha).toISOString().split("T")[0] : "",
      cliente: inv.cliente || "",
      identificacion: inv.identificacion || "",
      telefono: inv.telefono || "",
      correo: inv.correo || "",
      direccion: inv.direccion || "",
      ciudadOrigen: inv.ciudadOrigen || "",
      ciudadDestino: inv.ciudadDestino || "",
      tipoServicio: inv.tipoServicio || "",
      descripcion: inv.descripcion || "",
      cantidadPasajeros: inv.cantidadPasajeros?.toString() || "",
      vehiculo: inv.vehiculo || "",
      placa: inv.placa || "",
      conductor: inv.conductor || "",
      fechaSalida: inv.fechaSalida ? new Date(inv.fechaSalida).toISOString().split("T")[0] : "",
      horaSalida: inv.horaSalida || "",
      fechaLlegada: inv.fechaLlegada ? new Date(inv.fechaLlegada).toISOString().split("T")[0] : "",
      horaLlegada: inv.horaLlegada || "",
      observaciones: inv.observaciones || "",
      subtotal: inv.subtotal?.toString() || "",
      descuento: inv.descuento?.toString() || "",
      iva: inv.iva?.toString() || "",
      valor: inv.valor?.toString() || "0",
      estadoPago: inv.estadoPago || "Pendiente",
      notas: inv.notas || "",
    });
    setEditingId(inv.id);
    setTab(TAB_CREATE);
  };

  const handleSave = async () => {
    if (!form.cliente || !form.valor || !form.numeroFactura) {
      return alert("Completa los campos obligatorios: N° Factura, Cliente y Total.");
    }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/facturacion", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setSuccessMsg(editingId ? "Factura actualizada correctamente!" : "Factura creada correctamente!");
      await fetchInvoices();
      setTimeout(() => { setSuccessMsg(""); resetForm(); setTab(TAB_LIST); }, 1500);
    } catch (e: any) {
      alert("Error: " + (e.message || "No se pudo guardar la factura"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar esta factura?")) return;
    try {
      const res = await fetch("/api/facturacion", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleGeneratePDF = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = 210;
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`${form.numeroFactura || "factura"}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Error generando PDF");
    } finally {
      setGenerating(false);
    }
  };

  const totalFormas = invoices.length;
  const pendientes = invoices.filter(i => i.estadoPago === "Pendiente").length;
  const cobradas = invoices.filter(i => i.estadoPago === "Pagado").length;
  const porCobrar = invoices.filter(i => i.estadoPago === "Pendiente").reduce((a, i) => a + i.valor, 0);

  const filtrados = invoices.filter(inv =>
    inv.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.identificacion || "").includes(searchTerm)
  );

  const inputClass = "w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all";
  const labelClass = "text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5";

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {tab === TAB_CREATE && (
              <button onClick={() => { setTab(TAB_LIST); resetForm(); }} className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {tab === TAB_CREATE ? (editingId ? "Editar Factura" : "Nueva Factura") : "Facturación"}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                {tab === TAB_CREATE ? "Emisión profesional de facturas" : "Gestión de cobros y facturación"}
              </p>
            </div>
          </div>
          {tab === TAB_LIST && (
            <button onClick={startCreate}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#1a2e5a] to-[#0a1628] hover:from-[#0a1628] hover:to-[#1a2e5a] text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95 uppercase tracking-widest text-xs"
            >
              <Plus size={18} />
              Nueva Factura
            </button>
          )}
        </div>

        {/* ===== SUCCESS MESSAGE ===== */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={20} />
            {successMsg}
          </div>
        )}

        {/* ===== STATS STRIP ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Facturas", value: totalFormas, icon: FileText, color: "text-blue-600 bg-blue-100" },
            { label: "Pendientes", value: pendientes, icon: Clock, color: "text-amber-600 bg-amber-100" },
            { label: "Cobradas", value: cobradas, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
            { label: "Por Cobrar", value: fmtCurrency(porCobrar), icon: DollarSign, color: "text-white bg-slate-900" },
          ].map((s, i) => (
            <div key={i} className={`bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-xl shadow-slate-200/40 ${i === 3 ? "bg-slate-900 border-slate-800" : ""}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${i === 3 ? "text-blue-200" : "text-slate-400"}`}>
                  {s.label}
                </p>
              </div>
              <p className={`text-xl font-black ${i === 3 ? "text-white" : "text-slate-900"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ===== TAB: LIST ===== */}
        {tab === TAB_LIST && (
          <>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Buscar factura, cliente o NIT..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm text-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      {["N° Factura", "Fecha", "Cliente", "Valor", "Estado", "Acciones"].map(h => (
                        <th key={h} className={`p-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest ${h === "Valor" || h === "Acciones" ? "text-right" : ""} ${h === "Estado" ? "text-center" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <tr key={i} className="animate-pulse"><td colSpan={6} className="p-5 h-16 bg-slate-50/20" /></tr>
                      ))
                    ) : filtrados.length === 0 ? (
                      <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-medium text-sm">
                        {invoices.length === 0 ? "No hay facturas creadas aún. Haz clic en 'Nueva Factura'." : "No se encontraron resultados."}
                      </td></tr>
                    ) : (
                      filtrados.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5"><span className="font-bold text-slate-900 text-sm">{inv.numeroFactura}</span></td>
                          <td className="p-5"><span className="text-slate-500 text-xs font-semibold">{fmtDate(inv.fecha)}</span></td>
                          <td className="p-5">
                            <p className="font-bold text-slate-900 text-sm">{inv.cliente}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{inv.identificacion || "S.I."}</p>
                          </td>
                          <td className="p-5 text-right font-black text-sm text-slate-900">{fmtCurrency(inv.valor)}</td>
                          <td className="p-5 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusStyle[inv.estadoPago] || "bg-slate-100 text-slate-600"}`}>
                              {inv.estadoPago}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => handleEdit(inv)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(inv.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 size={16} />
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
          </>
        )}

        {/* ===== TAB: CREATE/EDIT ===== */}
        {tab === TAB_CREATE && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* FORM */}
            <div className="xl:col-span-3 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
                  Datos de la Factura
                </h2>
                <button onClick={() => setShowPreview(!showPreview)}
                  className="hidden xl:flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPreview ? "Ocultar Vista" : "Mostrar Vista"}
                </button>
              </div>

              <div className="space-y-6">
                {/* N° Factura + Fecha */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}><Hash size={12} /> N° Factura *</label>
                    <input name="numeroFactura" value={form.numeroFactura} onChange={handleChange} className={inputClass} placeholder="FAC-0001" />
                  </div>
                  <div>
                    <label className={labelClass}><Calendar size={12} /> Fecha</label>
                    <input name="fecha" type="date" value={form.fecha} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                {/* CLIENT SECTION */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Datos del Cliente</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelClass}><User size={12} /> Nombre o Razón Social *</label>
                      <input name="cliente" value={form.cliente} onChange={handleChange} className={inputClass} placeholder="Ej: Transportes XYZ SAS" />
                    </div>
                    <div>
                      <label className={labelClass}><CreditCard size={12} /> NIT / Cédula</label>
                      <input name="identificacion" value={form.identificacion} onChange={handleChange} className={inputClass} placeholder="900.123.456-7" />
                    </div>
                    <div>
                      <label className={labelClass}><Phone size={12} /> Teléfono</label>
                      <input name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} placeholder="3132872871" />
                    </div>
                    <div>
                      <label className={labelClass}><Mail size={12} /> Correo</label>
                      <input name="correo" value={form.correo} onChange={handleChange} className={inputClass} placeholder="cliente@email.com" />
                    </div>
                    <div>
                      <label className={labelClass}><MapPin size={12} /> Dirección</label>
                      <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} placeholder="Calle 40 #24 A 39" />
                    </div>
                  </div>
                </div>

                {/* SERVICE SECTION */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Truck size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Datos del Servicio</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><MapPin size={12} /> Ciudad Origen</label>
                      <input name="ciudadOrigen" value={form.ciudadOrigen} onChange={handleChange} className={inputClass} placeholder="Villavicencio" />
                    </div>
                    <div>
                      <label className={labelClass}><MapPin size={12} /> Ciudad Destino</label>
                      <input name="ciudadDestino" value={form.ciudadDestino} onChange={handleChange} className={inputClass} placeholder="Bogotá" />
                    </div>
                    <div>
                      <label className={labelClass}><Tag size={12} /> Tipo de Servicio</label>
                      <select name="tipoServicio" value={form.tipoServicio} onChange={handleChange} className={inputClass}>
                        <option value="">Seleccionar...</option>
                        <option value="Transporte Ejecutivo">Transporte Ejecutivo</option>
                        <option value="Transporte Escolar">Transporte Escolar</option>
                        <option value="Transporte Turístico">Transporte Turístico</option>
                        <option value="Transporte Empresarial">Transporte Empresarial</option>
                        <option value="Servicio Especial">Servicio Especial</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}><Users size={12} /> Pasajeros</label>
                      <input name="cantidadPasajeros" type="number" value={form.cantidadPasajeros} onChange={handleChange} className={inputClass} placeholder="15" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}><FileSignature size={12} /> Descripción del Transporte</label>
                      <input name="descripcion" value={form.descripcion} onChange={handleChange} className={inputClass} placeholder="Traslado ejecutivo ida y vuelta" />
                    </div>
                    <div>
                      <label className={labelClass}><Truck size={12} /> Vehículo</label>
                      <input name="vehiculo" value={form.vehiculo} onChange={handleChange} className={inputClass} placeholder="Buseta Mercedes-Benz" />
                    </div>
                    <div>
                      <label className={labelClass}><Tag size={12} /> Placa</label>
                      <input name="placa" value={form.placa} onChange={handleChange} className={inputClass} placeholder="ABC-123" />
                    </div>
                    <div>
                      <label className={labelClass}><User size={12} /> Conductor</label>
                      <input name="conductor" value={form.conductor} onChange={handleChange} className={inputClass} placeholder="Nombre del conductor" />
                    </div>
                    <div />
                    <div>
                      <label className={labelClass}><Sunrise size={12} /> Fecha Salida</label>
                      <input name="fechaSalida" type="date" value={form.fechaSalida} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><Clock size={12} /> Hora Salida</label>
                      <input name="horaSalida" type="time" value={form.horaSalida} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><Sunset size={12} /> Fecha Llegada</label>
                      <input name="fechaLlegada" type="date" value={form.fechaLlegada} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><Clock size={12} /> Hora Llegada</label>
                      <input name="horaLlegada" type="time" value={form.horaLlegada} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}><ClipboardList size={12} /> Observaciones</label>
                      <textarea name="observaciones" rows={2} value={form.observaciones} onChange={handleChange}
                        className={`${inputClass} resize-none`} placeholder="Notas adicionales del servicio..."
                      />
                    </div>
                  </div>
                </div>

                {/* VALUES SECTION */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valores</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className={labelClass}><Percent size={12} /> Subtotal</label>
                      <input name="subtotal" type="number" value={form.subtotal} onChange={handleChange} className={inputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className={labelClass}><Percent size={12} /> Descuento</label>
                      <input name="descuento" type="number" value={form.descuento} onChange={handleChange} className={inputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className={labelClass}><Percent size={12} /> IVA</label>
                      <input name="iva" type="number" value={form.iva} onChange={handleChange} className={inputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className={labelClass}><DollarSign size={12} /> Total *</label>
                      <div className="relative">
                        <input name="valor" type="number" value={form.valor} onChange={handleChange}
                          className="w-full bg-navy text-white p-3 rounded-xl font-black text-sm border border-navy focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOTES + STATE */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}><Ban size={12} /> Estado</label>
                    <select name="estadoPago" value={form.estadoPago} onChange={handleChange} className={inputClass}>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Anulado">Anulado</option>
                    </select>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setTab(TAB_LIST); resetForm(); }}
                    className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-[2] bg-gradient-to-br from-[#1a2e5a] to-[#0a1628] text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                    {saving ? "Guardando..." : editingId ? "Actualizar Factura" : "Guardar Factura"}
                  </button>
                  <button onClick={handleGeneratePDF} disabled={generating}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {generating ? "Generando..." : "PDF"}
                  </button>
                </div>
              </div>
            </div>

            {/* PREVIEW */}
            {showPreview && (
              <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                    Vista Previa
                  </h2>
                  <button onClick={handleGeneratePDF} disabled={generating}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-60"
                  >
                    {generating ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                    {generating ? "Generando..." : "Descargar PDF"}
                  </button>
                </div>
                <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner" style={{ maxHeight: "750px" }}>
                  <div className="scale-[0.6] md:scale-[0.7] origin-top-left" style={{ width: "794px" }}>
                    <InvoicePDF ref={previewRef} data={form} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
