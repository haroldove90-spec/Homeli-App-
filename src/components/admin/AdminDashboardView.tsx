import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { ShieldCheck, Users, FileCheck, AlertTriangle, Settings, TrendingUp, Check, X, DollarSign } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export const AdminDashboardView: React.FC = () => {
  const { kycDocs, updateKycStatus, disputes, systemSettings, updateSystemSettings } = useHomeli();
  const [activeSubTab, setActiveSubTab] = useState<"kyc" | "disputes" | "tariffs" | "analytics">("analytics");

  // Local state for system tariff settings
  const [commMarketplace, setCommMarketplace] = useState(systemSettings.marketplaceCommissionPercent);
  const [commService, setCommService] = useState(systemSettings.serviceCommissionPercent);

  const gmvData = [
    { month: "Ene", gmv: 42000, comisiones: 3570 },
    { month: "Feb", gmv: 68000, comisiones: 5780 },
    { month: "Mar", gmv: 95000, comisiones: 8075 },
    { month: "Abr", gmv: 142000, comisiones: 12070 },
    { month: "May", gmv: 210000, comisiones: 17850 },
  ];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Admin Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-600" />
            Super Admin Control Center
          </h2>
          <p className="text-xs text-slate-500">Supervisión global de usuarios, KYC/KYB, disputas y comisiones</p>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("analytics")}
          className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === "analytics" ? "bg-violet-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Analítica GMV
        </button>
        <button
          onClick={() => setActiveSubTab("kyc")}
          className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === "kyc" ? "bg-violet-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Verificación KYC/KYB ({kycDocs.filter((k) => k.status === "Pendiente").length})
        </button>
        <button
          onClick={() => setActiveSubTab("disputes")}
          className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === "disputes" ? "bg-violet-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Disputas ({disputes.length})
        </button>
        <button
          onClick={() => setActiveSubTab("tariffs")}
          className={`flex-1 py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === "tariffs" ? "bg-violet-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Comisiones
        </button>
      </div>

      {/* SUBTAB 1: FINANCIAL ANALYTICS */}
      {activeSubTab === "analytics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Volumen Ventas (GMV)</span>
              <div className="text-lg font-black text-emerald-600">$210,000 MXN</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Ingreso Comisiones</span>
              <div className="text-lg font-black text-violet-600">$17,850 MXN</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Usuarios Activos</span>
              <div className="text-lg font-black text-amber-600">1,420</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="font-bold text-xs text-slate-700 uppercase">Crecimiento GMV & Comisiones de la Super App</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gmvData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#0f172a" }} />
                  <Area type="monotone" dataKey="gmv" stroke="#059669" fill="#05966922" />
                  <Area type="monotone" dataKey="comisiones" stroke="#7c3aed" fill="#7c3aed22" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: KYC/KYB APPROVAL QUEUE */}
      {activeSubTab === "kyc" && (
        <div className="space-y-3">
          {kycDocs.map((doc) => (
            <div key={doc.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="font-bold text-xs text-slate-900">{doc.applicantName} ({doc.applicantRole})</div>
                  <div className="text-[10px] text-slate-500">{doc.docType} • {doc.docNumber}</div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  doc.status === "Aprobado" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}>
                  {doc.status}
                </span>
              </div>

              <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200">
                <img src={doc.documentFrontUrl} alt="Document photo" className="w-full h-full object-cover" />
              </div>

              {doc.status === "Pendiente" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateKycStatus(doc.id, "Aprobado")}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Aprobar Documento
                  </button>
                  <button
                    onClick={() => updateKycStatus(doc.id, "Rechazado")}
                    className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 border border-rose-200 hover:bg-rose-100"
                  >
                    <X className="w-4 h-4" /> Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: DISPUTES RESOLUTION */}
      {activeSubTab === "disputes" && (
        <div className="space-y-3">
          {disputes.map((dsp) => (
            <div key={dsp.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-sm">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Casos #{dsp.id} • {dsp.customerName} vs {dsp.merchantName}</span>
                <span className="text-amber-600 font-bold">{dsp.status}</span>
              </div>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                Razón: {dsp.reason} (${dsp.amount} MXN)
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: TARIFFS & COMMISSION SETTINGS */}
      {activeSubTab === "tariffs" && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 text-xs shadow-sm">
          <h3 className="font-bold text-sm text-slate-900">Ajustes Globales de Comisiones</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Comisión Marketplace Productos (%)</label>
              <input
                type="number"
                value={commMarketplace}
                onChange={(e) => setCommMarketplace(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Comisión Contratación de Servicios (%)</label>
              <input
                type="number"
                value={commService}
                onChange={(e) => setCommService(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
              />
            </div>
          </div>

          <button
            onClick={() => {
              updateSystemSettings({
                marketplaceCommissionPercent: commMarketplace,
                serviceCommissionPercent: commService,
              });
              alert("¡Tarifas de comisión guardadas correctamente!");
            }}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md"
          >
            Guardar Configuración
          </button>
        </div>
      )}

    </div>
  );
};
