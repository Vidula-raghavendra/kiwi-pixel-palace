
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), { status: 400, headers: corsHeaders });
    }

    // Log the payload for tracing
    console.log("Gemini request prompt:", prompt);

    const geminiResponse = await fetch(
      GEMINI_API_ENDPOINT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const geminiData = await geminiResponse.json();

    // Log the raw response for debugging
    console.log("Gemini raw response:", JSON.stringify(geminiData));

    const result =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      geminiData.candidates?.[0]?.content?.text ||
      geminiData.candidates?.[0]?.output ||
      null;

    return new Response(JSON.stringify({ result, raw: geminiData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Gemini Direct error:", err);
    return new Response(JSON.stringify({ error: "Gemini API call failed", detail: String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
