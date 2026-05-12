import Sidebar from "../Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex">

      <Sidebar />

      <section className="flex-1 bg-gray-100 min-h-screen">

        <header className="bg-white shadow px-10 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              GERFOTURS CRM
            </h1>

            <p className="text-gray-500">
              Sistema empresarial
            </p>
          </div>

          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Admin
          </div>

        </header>

        <div className="p-10">
          {children}
        </div>

      </section>

    </main>
  );
}