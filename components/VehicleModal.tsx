"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;

  onAddVehicle: (vehicle: {
    placa: string;
    modelo: string;
    estado: string;
  }) => void;

  initialData?: {
    placa: string;
    modelo: string;
    estado: string;
  };
}

export default function VehicleModal({
  onClose,
  onAddVehicle,
  initialData,
}: Props){

 const [placa, setPlaca] =
  useState(initialData?.placa || "");

const [modelo, setModelo] =
  useState(initialData?.modelo || "");

const [estado, setEstado] =
  useState(initialData?.estado || "Activo");

  const handleSave = () => {

    onAddVehicle({
      placa,
      modelo,
      estado,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white w-[500px] rounded-2xl p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Nuevo Vehículo
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            ×
          </button>

        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full border p-3 rounded-xl"
          >
            <option>
              Activo
            </option>

            <option>
              Mantenimiento
            </option>
          </select>

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Guardar
          </button>

        </div>

      </div>

    </div>
  );
}