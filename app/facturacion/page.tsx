"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Plus, Search, Edit2, Trash2, Calendar, FileText, 
  DollarSign, CheckCircle2, Clock, Paperclip, Filter
} from "lucide-react";
import InvoiceModal from "@/components/InvoiceModal";
import PageHeader from "@/components/ui/PageHeader";

export default function FacturacionPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/facturacion");
      const data = await response.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSaveInvoice = async (invoiceData: any) => {
    const method = invoiceData.id ? "PUT" : "POST";
    try {
      const response = await fetch("/api/facturacion", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        fetchInvoices();
        setIsModalOpen(false);
        setSelectedInvoice(null);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta factura?")) return;

    try {
      const response = await fetch("/api/facturacion", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.identificacion?.includes(searchTerm)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pagado': return 'bg-emerald-100 text-emerald-700';
      case 'Pendiente': return 'bg-amber-100 text-amber-700';
      case 'Anulado': return 'bg-slate-100 text-slate-500';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const nextInvoiceNumber = invoices.length > 0 
    ? `FAC-${(parseInt(invoices[0].numeroFactura.split('-')[1]) + 1).toString().padStart(4, '0')}`
    : "FAC-0001";

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Facturación"
          subtitle="Emisión y seguimiento de cobros legales"
          action={
            <button
              onClick={() => {
                setSelectedInvoice(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Plus size={20} />
              Nueva Factura
            </button>
          }
        />

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Facturas</p>
            </div>
            <p className="text-2xl font-black text-slate-900">{invoices.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pendientes</p>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {invoices.filter(i => i.estadoPago === 'Pendiente').length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cobradas</p>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {invoices.filter(i => i.estadoPago === 'Pagado').length}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Por Cobrar</p>
            </div>
            <p className="text-2xl font-black text-white">
              {formatCurrency(invoices.filter(i => i.estadoPago === 'Pendiente').reduce((acc, i) => acc + i.valor, 0))}
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Buscar por N° Factura, cliente o NIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <button className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">N° Factura</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
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
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                      No se encontraron facturas.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <span className="font-bold text-slate-900 text-sm">{inv.numeroFactura}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="font-semibold text-xs">{formatDate(inv.fecha)}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{inv.cliente}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inv.identificacion || "S.I."}</p>
                        </div>
                      </td>
                      <td className="p-6 text-right font-black text-sm text-slate-900">
                        {formatCurrency(inv.valor)}
                      </td>
                      <td className="p-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(inv.estadoPago)}`}>
                          {inv.estadoPago}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          {inv.archivoUrl && (
                            <a href={inv.archivoUrl} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Paperclip size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
        <InvoiceModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInvoice(null);
          }}
          onSave={handleSaveInvoice}
          initialData={selectedInvoice}
          nextInvoiceNumber={nextInvoiceNumber}
        />
      )}
    </MainLayout>
  );
}