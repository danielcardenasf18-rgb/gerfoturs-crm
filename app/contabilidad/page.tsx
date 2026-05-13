"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Plus, Search, Edit2, Trash2, Calendar, 
  TrendingUp, TrendingDown, Wallet
} from "lucide-react";
import TransactionModal from "@/components/TransactionModal";
import PageHeader from "@/components/ui/PageHeader";

export default function ContabilidadPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contabilidad");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error("Expected array but got:", data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSaveTransaction = async (transactionData: any) => {
    const method = transactionData.id ? "PUT" : "POST";
    try {
      const response = await fetch("/api/contabilidad", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        fetchTransactions();
        setIsModalOpen(false);
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este movimiento?")) return;

    try {
      const response = await fetch("/api/contabilidad", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const filteredTransactions = Array.isArray(transactions) ? transactions.filter(t => 
    t.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.referencia?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const totalIngresos = Array.isArray(transactions) ? transactions.filter(t => t.tipo === 'Ingreso').reduce((acc, t) => acc + (t.monto || 0), 0) : 0;
  const totalEgresos = Array.isArray(transactions) ? transactions.filter(t => t.tipo === 'Egreso').reduce((acc, t) => acc + (t.monto || 0), 0) : 0;
  const balance = totalIngresos - totalEgresos;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Contabilidad"
          subtitle="Control de ingresos, egresos y flujos de caja"
          action={
            <button
              onClick={() => {
                setSelectedTransaction(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/25 active:scale-95 uppercase tracking-widest text-sm"
            >
              <Plus size={20} />
              Nuevo Movimiento
            </button>
          }
        />

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Ingresos</p>
              <p className="text-2xl font-black text-slate-900">{formatCurrency(totalIngresos)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Egresos</p>
              <p className="text-2xl font-black text-slate-900">{formatCurrency(totalEgresos)}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center gap-5 shadow-xl shadow-slate-900/20">
            <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wallet size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Balance General</p>
              <p className={`text-2xl font-black ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por concepto, categoría o referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concepto</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Monto</th>
                  <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="p-6 h-20 bg-slate-50/20" />
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 font-medium">
                      No se encontraron movimientos.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(t.fecha)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{t.concepto}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.categoria}</p>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className={`font-black text-sm ${t.tipo === 'Ingreso' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {t.tipo === 'Ingreso' ? '+' : '-'} {formatCurrency(t.monto)}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedTransaction(t);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
        <TransactionModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSave={handleSaveTransaction}
          initialData={selectedTransaction}
        />
      )}
    </MainLayout>
  );
}