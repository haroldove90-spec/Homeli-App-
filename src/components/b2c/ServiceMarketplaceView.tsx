import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { ServiceProvider } from "../../types";
import { Wrench, Star, ShieldCheck, MapPin, Calendar, Clock, Phone, CheckCircle, ArrowRight, X } from "lucide-react";

export const ServiceMarketplaceView: React.FC = () => {
  const { services, createBooking, setActiveTrackBooking, user } = useHomeli();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedService, setSelectedService] = useState<ServiceProvider | null>(null);

  // Modal scheduler state
  const [bookingDate, setBookingDate] = useState("2026-08-12");
  const [bookingTime, setBookingTime] = useState("16:00 PM");
  const [description, setDescription] = useState("Reparación urgente de fuga de agua en tarja de cocina.");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastCreatedBookingId, setLastCreatedBookingId] = useState("");

  const categories = ["Todos", "Plomería", "Limpieza", "Mantenimiento", "Electricidad", "Pintura"];

  const filteredServices = services.filter(
    (s) => selectedCategory === "Todos" || s.category === selectedCategory
  );

  const handleConfirmBooking = () => {
    if (!selectedService) return;
    const newBkg = createBooking(selectedService.id, bookingDate, bookingTime, description);
    setLastCreatedBookingId(newBkg.id);
    setSelectedService(null);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-teal-600" />
          Contratación de Servicios
        </h2>
        <p className="text-xs text-slate-500">Técnicos y especialistas verificados con garantía Homeli</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-teal-600 text-white shadow-sm font-bold"
                : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 transition-all space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <img
                src={srv.avatar}
                alt={srv.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{srv.businessName}</h3>
                  <div className="flex items-center text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    <span>{srv.rating}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium">{srv.name}</div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-teal-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verificado KYC • {srv.completedJobs} Trabajos</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {srv.description}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">Tarifa fija estimada</span>
                <span className="font-black text-sm text-teal-700">${srv.fixedPrice || srv.hourlyRate} MXN</span>
              </div>

              <button
                onClick={() => setSelectedService(srv)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Agendar Cita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Scheduler Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                <Calendar className="w-5 h-5 text-teal-600" />
                Agendar {selectedService.businessName}
              </h3>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Fecha de Visita</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Horario de Preferencia</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                >
                  <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="12:00 PM">12:00 PM - 02:00 PM</option>
                  <option value="16:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Descripción del trabajo / Fuga / Mantenimiento</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800">
                <span className="font-bold">Ubicación de atención:</span> {user.addresses[0]?.addressLine}
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Confirmar Reserva (${selectedService.fixedPrice} MXN)
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 text-center text-slate-900 space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">¡Reserva Confirmada!</h3>
              <p className="text-xs text-slate-500 mt-1">
                El especialista ha recibido tu solicitud. Código: {lastCreatedBookingId}
              </p>
            </div>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
