"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {

    const response =
      await fetch("/api/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

    const data =
      await response.json();

    if (data.success) {

      document.cookie =
        `token=${data.token}; path=/`;

      router.push("/vehiculos");

    } else {

      alert("Credenciales incorrectas");
    }
  };

  return (

    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center p-6">

      <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md">

        <div className="text-center mb-10">

          <h1 className="text-5xl font-black text-slate-900 uppercase italic">
            GERFOTURS
          </h1>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-4">
            Sistema Empresarial CRM
          </p>

        </div>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
          >
            Iniciar sesión
          </button>

        </div>

      </div>

    </div>
  );
}