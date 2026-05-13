"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Trash2, Download, Filter } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import QuotationModal from "@/components/QuotationModal";
import QuotationTemplate from "@/components/QuotationTemplate";
import PageHeader from "@/components/ui/PageHeader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CotizacionesPage() {
  const [openModal, setOpenModal] = useState(false);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await fetch("/api/cotizaciones");
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuotations(data);
      } else {
        console.error("Data received is not an array:", data);
        setQuotations([]);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setQuotations([]);
    }
  };

  const handleAddQuotation = async (formData: any) => {
    try {
      const res = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchQuotations();
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error adding quote:", error);
    }
  };

  const deleteQuote = async (id: number) => {
    if (!confirm("¿Eliminar esta cotización?")) return;
    try {
      await fetch("/api/cotizaciones", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchQuotations();
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  };

  const generatePDF = async (quote: any) => {
    try {
      setSelectedQuote(quote);
      setIsGenerating(true);
      
      // Wait for the template to render
      setTimeout(async () => {
        try {
          if (printRef.current) {
            const canvas = await html2canvas(printRef.current, { 
              scale: 3, // Increased scale for HD nitidez
              useCORS: true,
              logging: false,
              allowTaint: true,
              backgroundColor: "#FFFFFF"
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "pt", "letter");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Cotizacion_${quote.codigo}_${quote.cliente}.pdf`);
          }
        } catch (innerError) {
          console.error("html2canvas error:", innerError);
          alert("Error al procesar la imagen del PDF. Por favor intenta de nuevo.");
        } finally {
          setIsGenerating(false);
          setSelectedQuote(null);
        }
      }, 800);
    } catch (error) {
      console.error("PDF Generation error:", error);
      setIsGenerating(false);
      alert("No se pudo generar el PDF.");
    }
  };

  const filtered = Array.isArray(quotations) ? quotations.filter(q => 
    q.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Cotizaciones"
          subtitle="Propuestas comerciales y exportación PDF"
          action={
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center justify-center gap-3 bg-[#2E4E8C] hover:bg-[#253f71] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Plus size={20} />
              Nueva Cotización
            </button>
          }
        />

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por código o cliente..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Filter size={14} /> Filtrar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Código</th>
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor Total</th>
                  <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                  <th className="text-right px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-black text-blue-600 font-condensed tracking-tighter">{quote.codigo}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900">{quote.cliente}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{quote.ruta}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-sm font-black text-emerald-600">${quote.valorTotal.toLocaleString("es-CO")}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-wider">{quote.estado}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => generatePDF(quote)}
                          disabled={isGenerating}
                          className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Descargar PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => deleteQuote(quote.id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openModal && (
        <QuotationModal onClose={() => setOpenModal(false)} onAddQuotation={handleAddQuotation} />
      )}

      <div className="fixed left-[-9999px] top-0 overflow-hidden">
        {selectedQuote && <QuotationTemplate data={selectedQuote} ref={printRef} />}
      </div>

      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-bold text-slate-900 uppercase tracking-[3px] text-xs">Generando PDF HD...</p>
           </div>
        </div>
      )}
    </MainLayout>
  );
}