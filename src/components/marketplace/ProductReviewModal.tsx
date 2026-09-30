import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Order } from "../../types";
import { Star, X, Check, Camera, ShieldCheck, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface ProductReviewModalProps {
  order: Order;
  onClose: () => void;
}

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({ order, onClose }) => {
  const { submitReview, products } = useHomeli();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Target first item in order
  const item = order.items[0];
  const targetProduct = products.find((p) => p.id === item?.productId || p.title === item?.title) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    submitReview(targetProduct.id, order.id, rating, comment, photoUrl.trim() || undefined);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-5 text-slate-900 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Calificar tu Compra</h3>
              <p className="text-[11px] text-slate-500">Comprador Verificado • {order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-black text-base text-slate-900">¡Gracias por tu opinión!</h4>
            <p className="text-xs text-slate-500">
              Tu reseña verificada ayuda a otros compradores y fortalece la reputación del vendedor.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Product summary card */}
            <div className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={item?.image || targetProduct.image}
                alt={item?.title}
                className="w-14 h-14 object-cover rounded-xl border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-amber-600 font-bold uppercase">{order.merchantName}</span>
                <div className="font-bold text-slate-900 truncate">{item?.title || targetProduct.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">${item?.price || targetProduct.price} MXN</div>
              </div>
            </div>

            {/* Interactive 5-star rating */}
            <div className="text-center space-y-1.5 py-1">
              <label className="font-bold text-slate-800 text-xs block">
                ¿Qué tal fue tu experiencia con el producto?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-bold text-amber-700">
                {rating === 5 && "⭐⭐⭐⭐⭐ ¡Excelente! Lo recomiendo totalmente"}
                {rating === 4 && "⭐⭐⭐⭐ Muy bueno"}
                {rating === 3 && "⭐⭐⭐ Bueno, cumple"}
                {rating === 2 && "⭐⭐ Regular"}
                {rating === 1 && "⭐ Malo, no lo recomiendo"}
              </span>
            </div>

            {/* Review text */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Escribe tu opinión honesta <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Qué te gustó del empaque, efectividad del producto y calidad?..."
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Optional Photo URL */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Foto del producto recibido (Opcional)</span>
                <span className="text-[10px] text-slate-400">URL de imagen</span>
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Esta reseña se publicará con el distintivo de <strong>Comprador Verificado</strong>.</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publicar Calificación</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
