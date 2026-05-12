import MainLayout from "@/components/layout/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Vehículos
          </h2>

          <p className="text-4xl font-bold mt-4">
            24
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Conductores
          </h2>

          <p className="text-4xl font-bold mt-4">
            12
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Documentos
          </h2>

          <p className="text-4xl font-bold mt-4">
            48
          </p>
        </div>

      </div>

    </MainLayout>
  );
}