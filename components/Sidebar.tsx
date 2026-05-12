import Link from "next/link";

import {
  FaCar,
  FaUserTie,
  FaFileAlt,
  FaMoneyBill,
  FaChartBar,
  FaHome,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-5">

      <h2 className="text-2xl font-bold mb-10 text-blue-400">
        GERFOTURS
      </h2>

      <nav className="space-y-5">

       <Link
  href="/dashboard"
  className="flex items-center gap-3 hover:text-blue-400"
>
  <FaHome />
  Dashboard
</Link>

      <Link
  href="/vehiculos"
  className="flex items-center gap-3 hover:text-blue-400"
>
  <FaCar />
  Vehículos
</Link>

       <Link
  href="/conductores"
  className="flex items-center gap-3 hover:text-blue-400"
>
  <FaUserTie />
  Conductores
</Link>
        <button className="flex items-center gap-3 hover:text-blue-400">
          <FaFileAlt />
          Documentos
        </button>

        <button className="flex items-center gap-3 hover:text-blue-400">
          <FaMoneyBill />
          Facturación
        </button>

        <button className="flex items-center gap-3 hover:text-blue-400">
          <FaChartBar />
          Contabilidad
        </button>

      </nav>
    </aside>
  );
}