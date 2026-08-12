import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Sparkles, X, Send, Bot, User } from "lucide-react";

export const AIAssistantWidget: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen } = useHomeli();
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "¡Hola! Soy Homeli AI 🤖. Puedo ayudarte a cotizar o diagnosticar problemas en tu hogar (plomería, electricidad, fugas), o recomendarte productos e insumos de limpieza en WebAR 3D. ¿Qué necesitas hoy?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isAIAssistantOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, chatHistory }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Te recomiendo agendar una inspección con nuestros plomeros o electricistas certificados en la sección 'Servicios'. También puedes explorar los productos 3D en el Marketplace.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-900 flex flex-col h-[580px]">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Homeli AI Assistant</h3>
              <p className="text-[10px] text-emerald-700 font-semibold">En línea • Inteligencia Artificial</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "user" ? "bg-amber-500 text-slate-950" : "bg-violet-600 text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-slate-950 font-medium shadow-sm"
                    : "bg-slate-50 text-slate-800 border border-slate-200 shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-xs text-slate-500 italic flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-600 animate-pulse" /> Homeli AI está escribiendo...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu consulta..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
