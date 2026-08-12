import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI lazily when API key is present
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({ apiKey });
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Homeli Super App", timestamp: new Date().toISOString() });
  });

  // AI Recommendations API endpoint
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { userInterests, userLocation, query } = req.body;
      const ai = getAI();
      const prompt = `Eres la IA oficial de Homeli, una Super App de servicios para el hogar, compras marketplace con WebAR 3D y servicios locales.
El usuario tiene los siguientes intereses: ${JSON.stringify(userInterests || ["Servicios del hogar", "Compras", "Mantenimiento"])} en la ubicación ${userLocation || "Puebla, México"}.
Consulta del usuario: ${query || "Recomiéndame 3 servicios y 2 productos destacados para mi hogar hoy."}

Responde en formato JSON con la siguiente estructura estricta:
{
  "greeting": "Mensaje amigable de bienvenida y contextualización",
  "recommendedServices": [
    {
      "title": "Nombre del servicio",
      "category": "Plomería | Limpieza | Mantenimiento | Electricidad | Pintura",
      "reason": "Por qué es ideal para el usuario",
      "estimatedPrice": "$350 - $600 MXN",
      "rating": 4.9
    }
  ],
  "recommendedProducts": [
    {
      "title": "Nombre del producto 3D AR",
      "category": "Desinfectantes | Detergentes | Utensilios y Mops | Limpieza de Baño | Limpieza de Cocina | Aromas",
      "reason": "Por qué es indispensable para la limpieza del hogar",
      "price": "$289 MXN",
      "has3D": true
    }
  ],
  "smartTip": "Consejo rápido de desinfección y limpieza del hogar"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Error in AI recommendations:", error);
      res.status(500).json({
        success: false,
        error: error.message || "No se pudieron obtener recomendaciones en este momento.",
        fallback: {
          greeting: "¡Hola! Te presentamos los productos de limpieza y servicios más recomendados en Homeli.",
          recommendedServices: [
            {
              title: "Limpieza Profunda de Hogar y Desinfección",
              category: "Limpieza",
              reason: "Súper valorado por clientes cercanos en tu zona",
              estimatedPrice: "$650 MXN",
              rating: 4.9
            }
          ],
          recommendedProducts: [
            {
              title: "Kit Limpiador Multiusos Biodegradable 3D",
              category: "Desinfectantes",
              reason: "Proyéctalo con la cámara WebAR antes de comprar",
              price: "$289 MXN",
              has3D: true
            }
          ],
          smartTip: "Usa limpiadores ecológicos cítricos para disolver la grasa en la cocina de forma natural."
        }
      });
    }
  });

  // AI Assistant Chatbot API endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;
      const ai = getAI();

      const systemInstruction = `Eres Homeli AI, el asistente virtual inteligente de Homeli - Servicios de Estilo de Vida.
Tus funciones son:
1. Ayudar a los usuarios a diagnosticar problemas en su hogar (plomería, electricidad, fugas, armado de muebles, etc.).
2. Recomendar los mejores especialistas o productos con visualización 3D en WebAR.
3. Explicar cómo funciona la garantía Homeli, la billetera digital y los puntos de recompensa.
Responde de manera cálida, concisa, profesional y en español. Usa emojis donde sea oportuno.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction}\n\nHistorial previo: ${JSON.stringify(chatHistory || [])}\nUsuario: ${message}`,
      });

      res.json({ success: true, reply: response.text });
    } catch (error: any) {
      console.error("Error in AI chat:", error);
      res.status(500).json({
        success: false,
        reply: "¡Hola! Soy el asistente de Homeli. Puedo ayudarte a agendar un técnico certificado o sugerirte productos 3D para tu hogar. ¿Qué necesitas reparar o cotizar hoy?"
      });
    }
  });

  // Vite middleware or Static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Homeli Server] Servidor activo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
