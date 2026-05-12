"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import VehicleModal from "@/components/VehicleModal";

export default function VehiculosPage() {

  const [openModal, setOpenModal] =
    useState(false);

  const [editingVehicle, setEditingVehicle] =
    useState<number | null>(null);

  const [vehiculos, setVehiculos] =
    useState<any[]>([]);

  useEffect(() => {

    fetchVehicles();

  }, []);

  const fetchVehicles = async () => {

    const response =
      await fetch("/api/vehiculos");

    const data =
      await response.json();

    setVehiculos(data);
  };

  return (

    <MainLayout>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Vehículos
          </h1>

          <p className="mt-2 text-gray-600">
            Gestión de vehículos
          </p>

        </div>

        <button
          onClick={() => {
            setEditingVehicle(null);
            setOpenModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          + Nuevo vehículo
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Placa
              </th>

              <th className="text-left p-4">
                Modelo
              </th>

              <th className="text-left p-4">
                Estado
              </th>

              <th className="text-left p-4">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {vehiculos.map((vehiculo, index) => (

              <tr
                key={index}
                className="border-t"
              >

                <td className="p-4">
                  {vehiculo.placa}
                </td>

                <td className="p-4">
                  {vehiculo.modelo}
                </td>

                <td className="p-4">
                  {vehiculo.estado}
                </td>

                <td className="p-4">

                  <button
                    onClick={() => {
                      setEditingVehicle(index);
                      setOpenModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Editar
                  </button>

                  <button
                    onClick={async () => {

                      await fetch("/api/vehiculos", {

                        method: "DELETE",

                        headers: {
                          "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                          id: vehiculo.id,
                        }),
                      });

                      await fetchVehicles();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {openModal && (

        <VehicleModal

          onClose={() => {
            setOpenModal(false);
            setEditingVehicle(null);
          }}

          initialData={
            editingVehicle !== null
              ? vehiculos[editingVehicle]
              : undefined
          }

          onAddVehicle={async (vehicle) => {

            if (editingVehicle !== null) {

              await fetch("/api/vehiculos", {

                method: "PUT",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  id: vehiculos[editingVehicle].id,
                  ...vehicle,
                }),
              });

            } else {

              await fetch("/api/vehiculos", {

                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify(vehicle),
              });
            }

            await fetchVehicles();

            setOpenModal(false);

            setEditingVehicle(null);
          }}
        />

      )}

    </MainLayout>
  );
}