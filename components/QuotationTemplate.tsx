"use client";

import React from "react";

const QuotationTemplate = React.forwardRef<HTMLDivElement, { data: any }>(({ data }, ref) => {
  if (!data) return null;

  const fmt = (val: number) => `$${Number(val).toLocaleString("es-CO")}`;
  const fmtDate = (d: any) => d ? new Date(d).toLocaleDateString("es-CO", { day: '2-digit', month: 'long', year: 'numeric' }) : "—";

  return (
    <div
      ref={ref}
      style={{
        width: "794px",
        minHeight: "1123px",
        backgroundColor: "#FFFFFF",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        color: "#1e293b",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      {/* TOP BAR - COLOR */}
      <div style={{
        height: "8px",
        background: "linear-gradient(90deg, #0a1628 0%, #1a2e5a 50%, #2eab3f 100%)",
      }} />

      {/* MAIN CONTENT */}
      <div style={{ padding: "45px 50px 35px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ===== HEADER ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "35px" }}>
          <div>
            <img src="/LOGOBLANCO.png" alt="Gerfoturs" style={{ width: "200px", marginBottom: "4px" }} />
            <p style={{ fontSize: "9px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>
              Logística Integral de Transporte
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "3px", margin: "0 0 4px 0" }}>
              Cotización
            </p>
            <p style={{ fontSize: "26px", fontWeight: "900", color: "#1a2e5a", margin: 0, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
              {data.codigo}
            </p>
          </div>
        </div>

        {/* ===== COMPANY INFO + DATES ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "35px", padding: "18px 22px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e9edf2" }}>
          <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.7" }}>
            <p style={{ fontWeight: "800", color: "#0a1628", fontSize: "12px", margin: "0 0 3px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Logística Empresarial Gerfoturs
            </p>
            <p style={{ margin: "0", fontWeight: "500" }}>NIT: 17.341.261-0 &nbsp;|&nbsp; Calle 40 #24 A 39, Villavicencio - Meta</p>
            <p style={{ margin: "0", fontWeight: "500" }}>Cel: +57 313 287 2871 &nbsp;|&nbsp; gerfoturs@hotmail.com</p>
          </div>
          <div style={{ textAlign: "right", display: "flex", gap: "30px" }}>
            <div>
              <p style={{ fontSize: "8px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 4px 0" }}>Emisión</p>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", margin: 0 }}>{fmtDate(new Date())}</p>
            </div>
            <div>
              <p style={{ fontSize: "8px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 4px 0" }}>Vencimiento</p>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#dc2626", margin: 0 }}>{fmtDate(data.fechaVenc)}</p>
            </div>
          </div>
        </div>

        {/* ===== CLIENT ===== */}
        <div style={{ marginBottom: "35px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "9px", fontWeight: "800", textTransform: "uppercase", color: "#64748b", letterSpacing: "1.5px" }}>Preparado para</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e9edf2" }} />
          </div>
          <p style={{ fontSize: "22px", fontWeight: "800", color: "#0a1628", margin: 0, letterSpacing: "-0.3px" }}>{data.cliente}</p>
          {data.nit && <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", margin: "3px 0 0 0" }}>NIT / ID: {data.nit}</p>}
        </div>

        {/* ===== BODY: 2 COLUMNS ===== */}
        <div style={{ display: "flex", gap: "45px", flex: 1 }}>

          {/* LEFT - CORPORATE PROFILE */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "18px" }}>
              <p style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#0a1628", margin: "0 0 2px 0", letterSpacing: "0.5px" }}>Perfil Corporativo</p>
              <div style={{ width: "30px", height: "3px", backgroundColor: "#2eab3f", borderRadius: "2px" }} />
            </div>

            <div style={{ fontSize: "12px", lineHeight: "1.8", color: "#475569", textAlign: "justify" }}>
              <p style={{ margin: "0 0 10px 0" }}>Somos una empresa llanera especializada en transporte especial para rutas empresariales, turismo nacional y servicio escolar.</p>
              <p style={{ margin: "0 0 10px 0" }}>Brindamos un servicio seguro, confiable y de alta calidad, destacándonos por nuestra seriedad y compromiso con el bienestar de usuarios y colaboradores.</p>
              <p style={{ margin: 0 }}>Contamos con un parque automotor en óptimas condiciones y conductores formados en manejo defensivo y seguridad vial.</p>
            </div>

            <div style={{ marginTop: "auto", padding: "18px", backgroundColor: "#f0fdf4", borderRadius: "12px", border: "1px solid #d1fae5" }}>
              <p style={{ fontSize: "10px", fontWeight: "800", color: "#166534", textTransform: "uppercase", margin: "0 0 6px 0", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px" }}>✓</span> Garantía de Servicio
              </p>
              <p style={{ fontSize: "11px", color: "#166534", margin: 0, lineHeight: "1.5" }}>
                Cumplimos con todos los requisitos de ley, incluyendo seguros contractuales y extracontractuales para su total tranquilidad.
              </p>
            </div>
          </div>

          {/* RIGHT - SERVICE DETAILS */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "18px" }}>
              <p style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#0a1628", margin: "0 0 2px 0", letterSpacing: "0.5px" }}>Detalles del Servicio</p>
              <div style={{ width: "30px", height: "3px", backgroundColor: "#1a2e5a", borderRadius: "2px" }} />
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  { label: "Vehículo", value: data.tipoVehiculo },
                  { label: "Capacidad", value: data.capacidad },
                  { label: "Ruta / Trayecto", value: data.ruta },
                  { label: "Tiempo Estimado", value: data.tiempoEstimado || "A convenir" },
                  { label: "Fecha del Servicio", value: fmtDate(data.fechaServicio) },
                  { label: "Hora de Salida", value: data.horaSalida || "A convenir" },
                  { label: "Hora de Regreso", value: data.horaRegreso || "A convenir" },
                  { label: "Cantidad de Unidades", value: data.cantidad },
                ].map((item, i) => (
                  <tr key={i}>
                    <td style={{
                      padding: "8px 12px 8px 0",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      borderBottom: "1px solid #f1f5f9",
                      width: "45%",
                      verticalAlign: "top"
                    }}>
                      {item.label}
                    </td>
                    <td style={{
                      padding: "8px 0",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#1e293b",
                      borderBottom: "1px solid #f1f5f9",
                      verticalAlign: "top"
                    }}>
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "20px", padding: "14px 16px", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e9edf2" }}>
              <p style={{ fontSize: "9px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 5px 0" }}>Equipamiento Incluido</p>
              <p style={{ fontSize: "11px", color: "#475569", margin: 0, lineHeight: "1.5", fontStyle: "italic" }}>
                {data.equipamiento || "Aire acondicionado, sillas reclinables, sistema multimedia, GPS, cinturones de seguridad, botiquín y extintor."}
              </p>
            </div>

            {data.observaciones && (
              <div style={{ marginTop: "14px", padding: "14px 16px", backgroundColor: "#fffbeb", borderRadius: "10px", border: "1px solid #fef3c7" }}>
                <p style={{ fontSize: "9px", fontWeight: "800", color: "#92400e", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 5px 0" }}>Observaciones</p>
                <p style={{ fontSize: "11px", color: "#78350f", margin: 0, lineHeight: "1.5" }}>{data.observaciones}</p>
              </div>
            )}
          </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div style={{ margin: "35px 0", borderTop: "2px solid #e9edf2" }} />

        {/* ===== BOTTOM: PAYMENT + TOTAL ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>

          {/* PAYMENT TERMS */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", color: "#0a1628", margin: "0 0 8px 0", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px" }}>📋</span> Condiciones de Pago
            </p>
            <p style={{ fontSize: "11px", color: "#475569", lineHeight: "1.6", margin: 0, maxWidth: "320px" }}>
              50% para reserva y 50% al finalizar el servicio. Sujeto a disponibilidad en el momento de la confirmación.
            </p>
            {data.condiciones && (
              <p style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5", margin: "8px 0 0 0", fontStyle: "italic" }}>
                {data.condiciones}
              </p>
            )}
            <div style={{ marginTop: "30px" }}>
              <div style={{ width: "160px", height: "2px", backgroundColor: "#0a1628", marginBottom: "8px" }} />
              <p style={{ fontSize: "11px", fontWeight: "900", color: "#0a1628", margin: 0, textTransform: "uppercase" }}>Gerencia Comercial</p>
              <p style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "600", margin: "2px 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Logística Empresarial Gerfoturs
              </p>
            </div>
          </div>

          {/* TOTAL BOX */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              backgroundColor: "#0a1628",
              padding: "22px 36px",
              borderRadius: "14px",
              border: "1px solid #1a2e5a"
            }}>
              <p style={{ fontSize: "9px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 4px 0" }}>
                Inversión Total
              </p>
              <p style={{ fontSize: "42px", fontWeight: "900", color: "#FFFFFF", margin: 0, lineHeight: 1 }}>
                {fmt(data.valorTotal)}
              </p>
              <p style={{ fontSize: "9px", fontWeight: "600", color: "#64748b", margin: "8px 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                IVA incluido según normativa vigente
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        padding: "16px 50px",
        borderTop: "1px solid #e9edf2",
        backgroundColor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        gap: "40px"
      }}>
        {[
          { icon: "📞", label: "+57 313 287 2871" },
          { icon: "✉️", label: "gerfoturs@hotmail.com" },
          { icon: "🌐", label: "www.gerfoturs.com" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9px", fontWeight: "700", color: "#64748b" }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        height: "4px",
        background: "linear-gradient(90deg, #2eab3f 0%, #1a2e5a 50%, #0a1628 100%)",
      }} />
    </div>
  );
});

QuotationTemplate.displayName = "QuotationTemplate";
export default QuotationTemplate;
