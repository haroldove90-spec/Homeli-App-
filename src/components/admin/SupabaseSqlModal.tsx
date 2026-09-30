import React, { useState } from "react";
import { Database, Copy, Check, X, Shield, Terminal, ArrowUpRight } from "lucide-react";

interface SupabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSqlModal: React.FC<SupabaseSqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- HOMELI SUPER APP - SCRIPT DE PRODUCCIÓN SUPABASE
-- Copia y pega este script en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/_/sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tablas Principales:
-- 1. profiles: usuarios, billetera, puntos y KYC
-- 2. merchants: reputación MercadoLíder, saldo escrow vs disponible, CLABE
-- 3. products: marketplace 3D WebAR, categorías, precios y stock
-- 4. orders: órdenes con tracking_number, escrow_status, pin y firmas
-- 5. order_tracking_events: hitos de la guía de rastreo
-- 6. order_messages: chat post-venta comprador-vendedor
-- 7. product_reviews: calificaciones con estrellas de compradores verificados
-- 8. disputes: módulo de arbitraje y garantía de compra protegida
-- 9. merchant_payouts: solicitudes de retiro a cuenta bancaria
-- 10. wallet_transactions: historial de transferencias y reembolsos
-- 11. Procedimiento confirm_order_delivery_procedure: liberación automática de escrow
-- 12. Políticas RLS de seguridad activas

-- Ver archivo completo en /supabase_schema.sql`;

  const handleCopy = () => {
    // Read raw SQL or copy standard schema
    fetch("/supabase_schema.sql")
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        navigator.clipboard.writeText(sqlCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Script SQL para Supabase Producción</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  PostgreSQL 15+
                </span>
              </div>
              <p className="text-xs text-slate-400">
                15 tablas, triggers de Escrow, reputación de vendedor, chat post-venta y RLS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="px-5 py-3 bg-emerald-950/30 border-b border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Pega este código en <strong>Supabase Dashboard &gt; SQL Editor &gt; New Query</strong> y haz clic en <strong>RUN</strong>.
            </span>
          </div>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 font-bold underline hover:text-emerald-200"
          >
            Ir a Supabase <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Code Viewport */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-emerald-400/90 leading-relaxed border-b border-slate-800">
          <pre className="whitespace-pre-wrap select-all">
{`-- ====================================================================
-- HOMELI SUPER APP - SCHEMA COMPLETO DE PRODUCCIÓN PARA SUPABASE
-- 1. Tablas: profiles, merchants, products, orders, order_messages,
--    product_reviews, disputes, merchant_payouts, wallet_transactions
-- 2. Stored Procedure: confirm_order_delivery_procedure()
-- 3. Row Level Security (RLS) habilitado con políticas permisivas
-- ====================================================================

-- Copiar todo con el botón verde inferior o revisar el archivo /supabase_schema.sql`}
          </pre>
          <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="font-bold text-white">Estructura del Marketplace:</div>
            <div>✓ <strong>merchants</strong>: Soporta niveles (Platinum, Gold, Silver), % a tiempo, saldo escrow y disponible.</div>
            <div>✓ <strong>orders</strong>: Soporta número de guía rastreable, custodia escrow, PIN de entrega y comprobantes.</div>
            <div>✓ <strong>product_reviews</strong>: Calificaciones de 1 a 5 estrellas con insignia de comprador verificado.</div>
            <div>✓ <strong>order_messages</strong>: Mensajería post-venta encriptada para arbitraje.</div>
            <div>✓ <strong>disputes</strong>: Flujo de Compra Protegida con devolución inmediata del 100%.</div>
            <div>✓ <strong>merchant_payouts</strong>: Solicitud de dispersión de fondos a cuenta CLABE bancaria.</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Archivo local: <code className="text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">/supabase_schema.sql</code>
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡SQL Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar SQL Completo</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
