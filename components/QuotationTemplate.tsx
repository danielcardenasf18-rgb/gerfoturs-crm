"use client";

import React from "react";
import { 
  Building2, 
  User, 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  CreditCard,
  Mail,
  Phone,
  Globe
} from "lucide-react";

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
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        color: "#1e293b",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      {/* MARCA DE AGUA SUTIL */}
      <div style={{ 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        opacity: 0.03, 
        pointerEvents: "none",
        zIndex: 0
      }}>
        <img src="/LOGOBLANCO.png" alt="watermark" style={{ width: "500px" }} />
      </div>

      {/* HEADER: LOGO Y TÍTULO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", zIndex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <img src="/LOGOBLANCO.png" alt="Gerfoturs" style={{ width: "220px" }} />
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1.5px", marginLeft: "2px" }}>
            Logística Integral de Transporte
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h1 style={{ fontSize: "14px", fontWeight: "900", color: "#1a2e5a", textTransform: "uppercase", letterSpacing: "3px", margin: 0 }}>
            Cotización
          </h1>
          <p style={{ fontSize: "28px", fontWeight: "900", color: "#2eab3f", margin: "5px 0 0 0", fontStyle: "italic" }}>
            {data.codigo}
          </p>
        </div>
      </div>

      {/* INFO EMPRESA Y FECHAS */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px", marginBottom: "40px", zIndex: 1 }}>
        <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.6" }}>
          <p style={{ fontWeight: "800", color: "#1a2e5a", fontSize: "13px", marginBottom: "4px" }}>LOGÍSTICA EMPRESARIAL GERFOTURS</p>
          <p>NIT: 17.341.261-0</p>
          <p>Calle 40 #24 A 39, Villavicencio - Meta</p>
          <p>Cel: +57 313 287 2871 | gerfoturs@hotmail.com</p>
        </div>
        <div style={{ backgroundColor: "#f8fafc", padding: "15px 25px", borderRadius: "15px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "9px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "5px" }}>Emisión</p>
            <p style={{ fontSize: "12px", fontWeight: "700" }}>{fmtDate(new Date())}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "9px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "5px" }}>Vencimiento</p>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444" }}>{fmtDate(data.fechaVenc)}</p>
          </div>
        </div>
      </div>

      {/* DESTINATARIO */}
      <div style={{ marginBottom: "40px", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ width: "25px", height: "1px", backgroundColor: "#2eab3f" }} />
          <span style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#1a2e5a", letterSpacing: "1px" }}>Preparado para:</span>
        </div>
        <p style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{data.cliente}</p>
        {data.nit && <p style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", marginTop: "5px" }}>ID/NIT: {data.nit}</p>}
      </div>

      {/* CUERPO: DESCRIPCIÓN Y DETALLES */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", flex: 1, zIndex: 1 }}>
        
        {/* Lado Izquierdo: Quienes somos / Descripción */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "900", textTransform: "uppercase", color: "#1a2e5a", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
            Perfil Corporativo
          </h3>
          <div style={{ fontSize: "13px", lineHeight: "1.7", color: "#334155", textAlign: "justify" }}>
            <p style={{ marginBottom: "15px" }}>“Somos una empresa llanera especializada en transporte especial para rutas empresariales, turismo nacional y servicio escolar.</p>
            <p style={{ marginBottom: "15px" }}>Brindamos un servicio seguro, confiable y de alta calidad, destacándonos por nuestra seriedad y compromiso con el bienestar de usuarios y colaboradores.</p>
            <p>Contamos con un parque automotor en óptimas condiciones y conductores formados en manejo defensivo y seguridad vial.”</p>
          </div>

          <div style={{ marginTop: "40px", backgroundColor: "#f0fdf4", padding: "20px", borderRadius: "15px", border: "1px solid #dcfce7" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
               <ShieldCheck size={18} className="text-[#2eab3f]" />
               <span style={{ fontSize: "11px", fontWeight: "800", color: "#166534", textTransform: "uppercase" }}>Garantía de Servicio</span>
             </div>
             <p style={{ fontSize: "11px", color: "#166534", lineHeight: "1.5" }}>
               Cumplimos con todos los requisitos de ley, incluyendo seguros contractuales y extracontractuales para su total tranquilidad.
             </p>
          </div>
        </div>

        {/* Lado Derecho: Lo que se cotiza */}
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: "900", textTransform: "uppercase", color: "#1a2e5a", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
            Detalles del Servicio
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {[
              { label: "Vehículo", value: data.tipoVehiculo, icon: <Bus size={14} /> },
              { label: "Ruta / Trayecto", value: data.ruta, icon: <MapPin size={14} /> },
              { label: "Fecha del Servicio", value: fmtDate(data.fechaServicio), icon: <Calendar size={14} /> },
              { label: "Hora de Salida", value: data.horaSalida || "A convenir", icon: <Clock size={14} /> },
              { label: "Cant. Unidades", value: data.cantidad, icon: <CheckCircle2 size={14} /> },
            ].map((item, i) => (
              <div key={i} style={{ 
                display: "flex", 
                flexDirection: "column",
                gap: "4px",
                paddingBottom: "12px", 
                borderBottom: "1px solid #f1f5f9" 
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ color: "#2eab3f" }}>{item.icon}</div>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", paddingLeft: "22px" }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "30px" }}>
            <p style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Equipamiento incluido:</p>
            <p style={{ fontSize: "11px", fontStyle: "italic", color: "#64748b", lineHeight: "1.4" }}>
              {data.equipamiento || "Aire acondicionado, sillas reclinables, sistema multimedia, GPS, cinturones de seguridad, botiquín y extintor."}
            </p>
          </div>
        </div>
      </div>

      {/* ÁREA FINAL: TOTAL Y CONDICIONES */}
      <div style={{ marginTop: "50px", borderTop: "2px solid #f1f5f9", paddingTop: "30px", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          
          {/* Condiciones y Firma */}
          <div style={{ flex: 1 }}>
             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <CreditCard size={16} className="text-[#1a2e5a]" />
                <span style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#1a2e5a" }}>Condiciones de Pago</span>
             </div>
             <p style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.5", maxWidth: "300px" }}>
               50% para reserva y 50% al finalizar el servicio. Sujeto a disponibilidad en el momento de la confirmación.
             </p>
             
             <div style={{ marginTop: "40px" }}>
                <div style={{ width: "180px", height: "1px", backgroundColor: "#1e293b", marginBottom: "10px" }} />
                <p style={{ fontSize: "12px", fontWeight: "900", margin: 0 }}>GERENCIA COMERCIAL</p>
                <p style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "600" }}>Logística Empresarial Gerfoturs</p>
             </div>
          </div>

          {/* TOTAL DESTACADO */}
          <div style={{ textAlign: "right" }}>
            <div style={{ backgroundColor: "#f0fdf4", padding: "20px 40px", borderRadius: "20px", border: "1px solid #dcfce7" }}>
              <p style={{ fontSize: "11px", fontWeight: "900", color: "#166534", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "5px" }}>
                Inversión Total
              </p>
              <p style={{ fontSize: "48px", fontWeight: "900", color: "#2eab3f", margin: 0, lineHeight: 1 }}>
                {fmt(data.valorTotal)}
              </p>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", marginTop: "10px", textTransform: "uppercase" }}>
                IVA Incluido (Según Normativa Vigente)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CORPORATIVO */}
      <div style={{ 
        marginTop: "50px", 
        paddingTop: "20px",
        borderTop: "1px solid #f1f5f9",
        display: "flex", 
        justifyContent: "center", 
        gap: "40px",
        zIndex: 1
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "9px", fontWeight: "700", color: "#94a3b8" }}>
          <Phone size={12} className="text-[#2eab3f]" /> <span>+57 313 287 2871</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "9px", fontWeight: "700", color: "#94a3b8" }}>
          <Mail size={12} className="text-[#2eab3f]" /> <span>gerfoturs@hotmail.com</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "9px", fontWeight: "700", color: "#94a3b8" }}>
          <Globe size={12} className="text-[#2eab3f]" /> <span>www.gerfoturs.com</span>
        </div>
      </div>
    </div>
  );
});

QuotationTemplate.displayName = "QuotationTemplate";
export default QuotationTemplate;
