import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Sparkles, TrendingUp, Target, DollarSign, Eye, MousePointer, ShoppingCart, Plus } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export const HomeliAdsView: React.FC = () => {
  const { adsCampaigns, addAdsCampaign } = useHomeli();
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [title, setTitle] = useState("Campaña Kit Limpiador Multiusos Biodegradable 3D");
  const [budget, setBudget] = useState(300);

  const chartData = [
    { day: "Lun", impresiones: 1200, clics: 95 },
    { day: "Mar", impresiones: 1900, clics: 140 },
    { day: "Mié", impresiones: 2400, clics: 210 },
    { day: "Jue", impresiones: 3100, clics: 280 },
    { day: "Vie", impresiones: 4280, clics: 342 },
  ];

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    addAdsCampaign({
      merchantName: "EcoClean Insumos",
      title,
      bannerUrl: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&fit=crop",
      dailyBudget: budget,
      targetAudience: "Puebla - Personas interesadas en insumos de limpieza y desinfección",
    });
    setIsNewCampaignOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span style={{ fontFamily: "'Times New Roman', Times, serif" }}>Homeli Ads & Landing Page PUB</span>
          </h2>
          <p className="text-xs text-slate-500">Creación de anuncios patrocinados y métricas de conversión</p>
        </div>

        <button
          onClick={() => setIsNewCampaignOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Anuncio</span>
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
          <Eye className="w-4 h-4 text-sky-600 mx-auto" />
          <div className="font-extrabold text-sm text-slate-900">4,280</div>
          <div className="text-[10px] text-slate-500">Impresiones</div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
          <MousePointer className="w-4 h-4 text-emerald-600 mx-auto" />
          <div className="font-extrabold text-sm text-slate-900">342</div>
          <div className="text-[10px] text-slate-500">Clics (CTR 8%)</div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
          <ShoppingCart className="w-4 h-4 text-amber-600 mx-auto" />
          <div className="font-extrabold text-sm text-slate-900">28</div>
          <div className="text-[10px] text-slate-500">Ventas 3D AR</div>
        </div>
      </div>

      {/* Performance Chart with Recharts */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
          Rendimiento Semanal de Impresiones & Clics
        </h3>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#0f172a" }} />
              <Bar dataKey="impresiones" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clics" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Campaigns List */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-slate-700">Campañas Activas</h3>

        {adsCampaigns.map((ad) => (
          <div key={ad.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-900">{ad.title}</div>
              <div className="text-[10px] text-slate-500">Presupuesto Diario: ${ad.dailyBudget} MXN • Gastado: ${ad.spent} MXN</div>
              <div className="text-[10px] text-emerald-700 font-semibold">{ad.targetAudience}</div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              {ad.status}
            </span>
          </div>
        ))}
      </div>

      {/* New Campaign Modal */}
      {isNewCampaignOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCampaign} className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 space-y-3 shadow-2xl">
            <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Crear Anuncio Patrocinado PUB
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nombre de la Campaña</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Presupuesto Límite Diario ($ MXN)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewCampaignOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                Lanzar Anuncio
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
