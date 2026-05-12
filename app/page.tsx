"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import MainLayout from "@/components/layout/MainLayout";

const data = [

  {
    name: "Activos",
    cantidad: 12,
  },

  {
    name: "Mantenimiento",
    cantidad: 4,
  },

  {
    name: "Inactivos",
    cantidad: 2,
  },
];

export default function DashboardPage() {

  return (

    <MainLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Resumen general del CRM
        </p>

      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-gray-500">
            Vehículos
          </h2>

          <p className="text-4xl font-bold mt-4">
            18
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-gray-500">
            Conductores
          </h2>

          <p className="text-4xl font-bold mt-4">
            7
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-gray-500">
            Servicios
          </h2>

          <p className="text-4xl font-bold mt-4">
            32
          </p>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-6 h-[400px]">

        <h2 className="text-2xl font-bold mb-6">
          Estado Vehículos
        </h2>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="cantidad" />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </MainLayout>
  );
}