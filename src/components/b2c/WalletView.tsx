import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Wallet, Gift, ArrowUpRight, ArrowDownLeft, CreditCard, Plus, CheckCircle, Sparkles } from "lucide-react";

export const WalletView: React.FC = () => {
  const { user, walletTransactions, topupWallet, redeemPoints } = useHomeli();
  const [topupAmount, setTopupAmount] = useState(500);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [redeemedCoupon, setRedeemedCoupon] = useState("");

  const handleConfirmTopup = () => {
    topupWallet(topupAmount);
    setIsTopupModalOpen(false);
  };

  const handleRedeem = (points: number, coupon: string) => {
    const success = redeemPoints(points, coupon);
    if (success) {
      setRedeemedCoupon(`¡Cupón ${coupon} canjeado con éxito!`);
      setTimeout(() => setRedeemedCoupon(""), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-600" />
          Billetera & Recompensas
        </h2>
        <p className="text-xs text-slate-500">Saldo disponible y acumulación de Puntos Homeli</p>
      </div>

      {/* Main Balance Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-700 to-slate-900 border border-violet-400 text-white shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-100 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Billetera Homeli Pay
          </span>
          <CreditCard className="w-5 h-5 text-purple-200" />
        </div>

        <div>
          <div className="text-xs text-purple-200">Saldo Disponible</div>
          <div className="text-3xl font-black text-white tracking-tight">${user.walletBalance.toLocaleString()} MXN</div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-purple-500/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-purple-200 font-medium">Puntos Homeli</div>
              <div className="font-bold text-xs text-amber-300">{user.homeliPoints} pts acumulados</div>
            </div>
          </div>

          <button
            onClick={() => setIsTopupModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Recargar Saldo
          </button>
        </div>
      </div>

      {/* Redeemed Coupon Notification */}
      {redeemedCoupon && (
        <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {redeemedCoupon}
        </div>
      )}

      {/* Homeli Points Rewards Catalog */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Gift className="w-4 h-4 text-amber-600" />
          Canje de Puntos Homeli
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-slate-900">Cupón 15% OFF Servicios</div>
            <div className="text-[11px] text-amber-600 font-bold">150 Puntos</div>
            <button
              onClick={() => handleRedeem(150, "SERVICIOS15")}
              className="w-full py-1.5 rounded-lg bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 hover:bg-amber-200"
            >
              Canjear
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-slate-900">Envío Gratis Marketplace</div>
            <div className="text-[11px] text-amber-600 font-bold">200 Puntos</div>
            <button
              onClick={() => handleRedeem(200, "ENVIOFREE")}
              className="w-full py-1.5 rounded-lg bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 hover:bg-amber-200"
            >
              Canjear
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900">Historial de Transacciones</h3>

        <div className="space-y-2">
          {walletTransactions.map((tx) => (
            <div key={tx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tx.amount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{tx.title}</div>
                  <div className="text-[10px] text-slate-500">{tx.date}</div>
                </div>
              </div>

              <div className={`font-black ${tx.amount > 0 ? "text-emerald-700" : "text-slate-800"}`}>
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount} MXN
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topup Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900">Recargar Billetera Homeli</h3>
            
            <div className="space-y-2 text-xs">
              <label className="block text-slate-600 font-medium">Monto a Recargar</label>
              <div className="grid grid-cols-3 gap-2">
                {[200, 500, 1000].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTopupAmount(m)}
                    className={`p-2.5 rounded-xl font-bold border transition-colors ${
                      topupAmount === m
                        ? "bg-amber-500 text-slate-950 border-amber-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    ${m} MXN
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmTopup}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
            >
              Confirmar Recarga de ${topupAmount} MXN
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
