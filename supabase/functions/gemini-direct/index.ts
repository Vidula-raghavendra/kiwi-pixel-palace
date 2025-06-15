
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

  // Validate key
  if (!GEMINI_API_KEY) {
    console.error("[Gemini] No GEMINI_API_KEY found.");
    return new Response(
      JSON.stringify({ error: "Gemini API key is missing from server configuration." }),
      { status: 500, headers: corsHeaders }
    );
  }

  let prompt;
  try {
    const json = await req.json();
    prompt = json.prompt;
  } catch {
    return new Response(JSON.stringify({ error: "Malformed JSON payload." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (!prompt) {
    return new Response(
      JSON.stringify({ error: "No prompt provided" }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Log request for debugging
    console.log("Gemini-direct: sending prompt:", prompt);

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

    const status = geminiResponse.status;
    const body = await geminiResponse.text();
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = null;
    }

    // Log raw Gemini API response for troubleshooting
    console.log(
      "Gemini-direct: Gemini API status:",
      status,
      "body:",
      body
    );

    // Success: try to extract text
    if (geminiResponse.ok && parsed) {
      const result =
        parsed.candidates?.[0]?.content?.parts?.[0]?.text ||
        parsed.candidates?.[0]?.content?.text ||
        parsed.candidates?.[0]?.output ||
        null;

      if (result) {
        return new Response(JSON.stringify({ result, raw: parsed }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({
            error: "No candidate text in Gemini response.",
            status,
            raw: parsed,
          }),
          { status: 502, headers: corsHeaders }
        );
      }
    }

    // If we have an error, include everything we know
    return new Response(
      JSON.stringify({
        error:
          parsed?.error?.message || "Gemini API returned error or unknown format.",
        status,
        raw: parsed ?? body,
      }),
      { status: 502, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Gemini Direct error:", err);
    return new Response(
      JSON.stringify({ error: "Gemini API call failed", detail: String(err) }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
