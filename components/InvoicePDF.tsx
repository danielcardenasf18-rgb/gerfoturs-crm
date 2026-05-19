"use client";
import React from "react";

const InvoicePDF = React.forwardRef<HTMLDivElement, { data: any }>(({ data }, ref) => {
  if (!data) return null;

  const fmt = (val: number | string | undefined) =>
    val ? `$${Number(val).toLocaleString("es-CO")}` : "$0";
  const fmtDate = (d: any) =>
    d ? new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  const {
    numeroFactura, fecha, cliente, identificacion, telefono, correo, direccion,
    ciudadOrigen, ciudadDestino, tipoServicio, descripcion, cantidadPasajeros,
    vehiculo, placa, conductor, fechaSalida, horaSalida, fechaLlegada, horaLlegada,
    observaciones, subtotal, descuento, iva, valor,
  } = data;

  const total = valor || 0;
  const sub = subtotal ?? total;
  const disc = descuento ?? 0;
  const tax = iva ?? 0;

  return (
    <div
      ref={ref}
      style={{
        width: "794px",
        minHeight: "1123px",
        backgroundColor: "#FFFFFF",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        color: "#1e293b",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* TOP COLOR BAR */}
      <div style={{ height: "8px", background: "linear-gradient(90deg, #0a1628 0%, #1a2e5a 50%, #2eab3f 100%)" }} />

      <div style={{ padding: "40px 45px 30px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ===== HEADER ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
          <div>
            <img src="/LOGOBLANCO.png" alt="Gerfoturs" style={{ width: "180px", marginBottom: "2px" }} />
            <p style={{ fontSize: "8px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>
              Logística Integral de Transporte
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "9px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "3px", margin: "0 0 3px 0" }}>
              Factura
            </p>
            <p style={{ fontSize: "24px", fontWeight: "900", color: "#1a2e5a", margin: 0, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
              {numeroFactura || "FAC-0001"}
            </p>
          </div>
        </div>

        {/* ===== COMPANY INFO ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", padding: "16px 20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e9edf2" }}>
          <div style={{ fontSize: "10px", color: "#475569", lineHeight: "1.7" }}>
            <p style={{ fontWeight: "800", color: "#0a1628", fontSize: "11px", margin: "0 0 2px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Logística Empresarial Gerfoturs
            </p>
            <p style={{ margin: "0", fontWeight: "500" }}>NIT: 17341251-0</p>
            <p style={{ margin: "0", fontWeight: "500" }}>Cel: 3132872871 - 3102715972</p>
            <p style={{ margin: "0", fontWeight: "500" }}>{`gerfoturs@hotmail.com`}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "8px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 2px 0" }}>Fecha de Emisión</p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", margin: 0 }}>{fmtDate(fecha)}</p>
          </div>
        </div>

        {/* ===== CLIENT SECTION ===== */}
        <div style={{ marginBottom: "28px", padding: "18px 20px", backgroundColor: "#f0fdf4", borderRadius: "12px", border: "1px solid #d1fae5" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{ fontSize: "9px", fontWeight: "800", textTransform: "uppercase", color: "#166534", letterSpacing: "1.5px" }}>Cliente</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#bbf7d0" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 40px", fontSize: "11px", color: "#166534", fontWeight: "500" }}>
            <div><span style={{ fontWeight: "800", color: "#0a1628" }}>{cliente || "—"}</span></div>
            <div>NIT/CC: <strong>{identificacion || "—"}</strong></div>
            {telefono && <div>Tel: <strong>{telefono}</strong></div>}
            {correo && <div>Email: <strong>{correo}</strong></div>}
            {direccion && <div>Dir: <strong>{direccion}</strong></div>}
          </div>
        </div>

        {/* ===== SERVICE DETAILS TABLE ===== */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{ fontSize: "9px", fontWeight: "800", textTransform: "uppercase", color: "#64748b", letterSpacing: "1.5px" }}>Detalles del Servicio</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e9edf2" }} />
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "Ciudad Origen", value: ciudadOrigen },
                { label: "Ciudad Destino", value: ciudadDestino },
                { label: "Tipo de Servicio", value: tipoServicio },
                { label: "Descripción", value: descripcion },
                { label: "Pasajeros", value: cantidadPasajeros },
                { label: "Vehículo", value: vehiculo },
                { label: "Placa", value: placa },
                ...(conductor ? [{ label: "Conductor", value: conductor }] : []),
                { label: "Salida", value: `${fmtDate(fechaSalida)} ${horaSalida || ""}` },
                ...(fechaLlegada ? [{ label: "Llegada", value: `${fmtDate(fechaLlegada)} ${horaLlegada || ""}` }] : []),
              ].filter(i => i.value).map((item, i) => (
                <tr key={i}>
                  <td style={{
                    padding: "6px 10px 6px 0",
                    fontSize: "9px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    borderBottom: "1px solid #f1f5f9",
                    width: "30%",
                    verticalAlign: "top",
                  }}>
                    {item.label}
                  </td>
                  <td style={{
                    padding: "6px 0",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#1e293b",
                    borderBottom: "1px solid #f1f5f9",
                    verticalAlign: "top",
                  }}>
                    {String(item.value || "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== OBSERVATIONS ===== */}
        {observaciones && (
          <div style={{ marginBottom: "20px", padding: "12px 16px", backgroundColor: "#fffbeb", borderRadius: "10px", border: "1px solid #fef3c7" }}>
            <p style={{ fontSize: "8px", fontWeight: "800", color: "#92400e", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>Observaciones</p>
            <p style={{ fontSize: "10px", color: "#78350f", margin: 0, lineHeight: "1.5" }}>{observaciones}</p>
          </div>
        )}

        {/* ===== SPACER ===== */}
        <div style={{ flex: 1 }} />

        {/* ===== DIVIDER ===== */}
        <div style={{ margin: "0 0 20px 0", borderTop: "2px solid #e9edf2" }} />

        {/* ===== TOTALS ===== */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "320px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 16px 6px 0", fontSize: "11px", fontWeight: "600", color: "#64748b", textAlign: "right" }}>Subtotal</td>
                  <td style={{ padding: "6px 0", fontSize: "12px", fontWeight: "700", color: "#1e293b", textAlign: "right" }}>{fmt(sub)}</td>
                </tr>
                {disc > 0 && (
                  <tr>
                    <td style={{ padding: "6px 16px 6px 0", fontSize: "11px", fontWeight: "600", color: "#dc2626", textAlign: "right" }}>Descuento</td>
                    <td style={{ padding: "6px 0", fontSize: "12px", fontWeight: "700", color: "#dc2626", textAlign: "right" }}>-{fmt(disc)}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: "6px 16px 6px 0", fontSize: "11px", fontWeight: "600", color: "#64748b", textAlign: "right" }}>IVA</td>
                  <td style={{ padding: "6px 0", fontSize: "12px", fontWeight: "700", color: "#1e293b", textAlign: "right" }}>{fmt(tax)}</td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ padding: "0", borderTop: "2px solid #0a1628" }} />
                </tr>
                <tr>
                  <td style={{
                    padding: "12px 16px 12px 0",
                    fontSize: "13px",
                    fontWeight: "900",
                    color: "#0a1628",
                    textTransform: "uppercase",
                    textAlign: "right",
                    letterSpacing: "0.5px",
                  }}>
                    Total
                  </td>
                  <td style={{
                    padding: "12px 0",
                    fontSize: "18px",
                    fontWeight: "900",
                    color: "#1a2e5a",
                    textAlign: "right",
                  }}>
                    {fmt(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== PAYMENT INFO ===== */}
        <div style={{ marginTop: "20px", padding: "14px 18px", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e9edf2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "8px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 2px 0" }}>Forma de Pago</p>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Transferencia bancaria / Efectivo</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "8px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 2px 0" }}>Estado</p>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#d97706", margin: 0 }}>Pendiente de Pago</p>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        padding: "14px 45px",
        borderTop: "1px solid #e9edf2",
        backgroundColor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        gap: "36px",
      }}>
        {[
          { icon: "\u260E", label: "3132872871 - 3102715972" },
          { icon: "\u2709", label: "gerfoturs@hotmail.com" },
          { icon: "\u2605", label: "www.gerfoturs.com" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "8px", fontWeight: "700", color: "#64748b" }}>
            <span style={{ fontSize: "10px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #2eab3f 0%, #1a2e5a 50%, #0a1628 100%)" }} />
    </div>
  );
});

InvoicePDF.displayName = "InvoicePDF";
export default InvoicePDF;
