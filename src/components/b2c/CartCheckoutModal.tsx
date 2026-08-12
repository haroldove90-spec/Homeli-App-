import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { ShoppingBag, X, Trash2, Tag, Check, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, createOrder, user } = useHomeli();
  const [couponCode, setCouponCode] = useState("HOMELI20");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [invoiceType, setInvoiceType] = useState<"Boleta" | "Factura">("Factura");
  const [taxIdInput, setTaxIdInput] = useState("VARM851208XX1");
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | "cash">("wallet");

  if (!isOpen) return null;

  const merchantIds = Object.keys(cart);
  const totalSubtotal = merchantIds.reduce((acc, mId) => {
    return acc + cart[mId].items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, 0);

  const deliveryFeeTotal = merchantIds.length * 120;
  const grandTotal = Math.max(0, totalSubtotal + deliveryFeeTotal - appliedDiscount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "HOMELI20") {
      setAppliedDiscount(Math.floor(totalSubtotal * 0.2));
    }
  };

  const handleCheckout = () => {
    if (merchantIds.length === 0) return;

    let firstCreatedOrderId = "";
    merchantIds.forEach((merchantId) => {
      const created = createOrder(merchantId, cart[merchantId].items, invoiceType, taxIdInput);
      if (!firstCreatedOrderId) firstCreatedOrderId = created.id;
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    clearCart();
    onClose();
    onOrderPlaced(firstCreatedOrderId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-900 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            Carrito Multi-Negocio ({merchantIds.length} Comercios)
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-200 text-slate-600 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          
          {merchantIds.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-500">Tu carrito está vacío.</p>
            </div>
          ) : (
            merchantIds.map((mId) => {
              const group = cart[mId];
              return (
                <div key={mId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="font-bold text-sm text-amber-700 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>🏢 {group.merchantName}</span>
                    <span className="text-[10px] text-slate-500">Envío $120 MXN</span>
                  </div>

                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 truncate">{item.product.title}</div>
                          <div className="text-amber-600 font-semibold">${item.product.price.toLocaleString()} MXN</div>
                        </div>

                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200">
                          <button
                            onClick={() => updateQuantity(mId, item.product.id, -1)}
                            className="text-slate-500 hover:text-slate-900 font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(mId, item.product.id, 1)}
                            className="text-slate-500 hover:text-slate-900 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(mId, item.product.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {merchantIds.length > 0 && (
            <>
              {/* Coupon Applicator */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código de cupón (ej: HOMELI20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 rounded-xl bg-amber-100 text-amber-800 font-bold border border-amber-200 hover:bg-amber-200"
                >
                  Aplicar
                </button>
              </div>

              {/* Invoice Section */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Comprobante de Pago / Facturación</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setInvoiceType("Boleta")}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      invoiceType === "Boleta" ? "bg-violet-600 text-white border-violet-600" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    Boleta Simple
                  </button>
                  <button
                    onClick={() => setInvoiceType("Factura")}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      invoiceType === "Factura" ? "bg-violet-600 text-white border-violet-600" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    Factura Fiscal (RFC)
                  </button>
                </div>

                {invoiceType === "Factura" && (
                  <input
                    type="text"
                    placeholder="RFC / Tax ID Fiscal"
                    value={taxIdInput}
                    onChange={(e) => setTaxIdInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900"
                  />
                )}
              </div>

              {/* Totals Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Productos:</span>
                  <span>${totalSubtotal.toLocaleString()} MXN</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Gastos de Envío:</span>
                  <span>${deliveryFeeTotal} MXN</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Descuento Cupón 20%:</span>
                    <span>-${appliedDiscount.toLocaleString()} MXN</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-amber-700 pt-2 border-t border-slate-200">
                  <span>Total a Pagar:</span>
                  <span>${grandTotal.toLocaleString()} MXN</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Checkout Button */}
        {merchantIds.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Confirmar y Pagar ${grandTotal.toLocaleString()} MXN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
