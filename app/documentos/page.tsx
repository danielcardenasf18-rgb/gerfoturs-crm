"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Plus, Search, Edit2, Trash2, FileText, 
  CheckCircle2, Clock, AlertTriangle, ExternalLink, Link2
} from "lucide-react";
import DocumentModal from "@/components/DocumentModal";
import PageHeader from "@/components/ui/PageHeader";

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/documentos");
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSaveDocument = async (docData: any) => {
    const method = docData.id ? "PUT" : "POST";
    try {
      const response = await fetch("/api/documentos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docData),
      });

      const data = await response.json();
      if (response.ok) {
        fetchDocuments();
        setIsModalOpen(false);
        setSelectedDoc(null);
      } else {
        alert("Error: " + (data.error || "No se pudo guardar el documento."));
        console.error("API error:", data);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Error de red al guardar el documento.");
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este documento?")) return;

    try {
      const response = await fetch("/api/documentos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.entidad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date: string) => {
    if (!date) return false;
    const diffTime = new Date(date).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Documentos"
          subtitle="Repositorio de archivos y vigencias legales"
          action={
            <button
              onClick={() => {
                setSelectedDoc(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Plus size={20} />
              Subir Documento
            </button>
          }
        />

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vigentes</p>
              <p className="text-2xl font-black text-slate-900">
                {documents.filter(d => d.fechaVencimiento && !isExpired(d.fechaVencimiento) && !isExpiringSoon(d.fechaVencimiento)).length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Por Vencer (30d)</p>
              <p className="text-2xl font-black text-slate-900">
                {documents.filter(d => isExpiringSoon(d.fechaVencimiento)).length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vencidos</p>
              <p className="text-2xl font-black text-slate-900">
                {documents.filter(d => isExpired(d.fechaVencimiento)).length}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, tipo o entidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2rem]" />
            ))
          ) : filteredDocs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              No se encontraron documentos.
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-blue-500/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${
                    isExpired(doc.fechaVencimiento) ? 'bg-red-50 text-red-600' : 
                    isExpiringSoon(doc.fechaVencimiento) ? 'bg-amber-50 text-amber-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{doc.nombre}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {doc.tipo}
                      </span>
                      {doc.relacionadoCon !== 'General' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                          <Link2 size={10} /> {doc.relacionadoCon}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Entidad:</span>
                      <span className="text-slate-700 font-bold">{doc.entidad || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Vencimiento:</span>
                      <span className={`font-bold ${
                        isExpired(doc.fechaVencimiento) ? 'text-red-600' : 
                        isExpiringSoon(doc.fechaVencimiento) ? 'text-amber-600' : 
                        'text-slate-700'
                      }`}>
                        {formatDate(doc.fechaVencimiento)}
                      </span>
                    </div>
                  </div>

                  <a
                    href={doc.archivoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 py-3 rounded-xl font-bold text-xs transition-all"
                  >
                    <ExternalLink size={14} />
                    Ver Documento
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <DocumentModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDoc(null);
          }}
          onSave={handleSaveDocument}
          initialData={selectedDoc}
        />
      )}
    </MainLayout>
  );
}