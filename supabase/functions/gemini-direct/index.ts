import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
// Use Gemini 2.0 Flash with v1beta
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY not set. Configure this secret in Supabase." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let prompt = "";
  try {
    const json = await req.json();
    prompt = json.prompt;
    if (!prompt || typeof prompt !== "string") throw "No prompt";
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid input: Supply a 'prompt' string in the request body." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const gRes = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });
    const body = await gRes.text();

    let parsed: any;
    try {
      parsed = JSON.parse(body);
    } catch {
      return new Response(
        JSON.stringify({ error: "Gemini returned invalid JSON.", raw: body }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to get Gemini's answer
    const result =
      parsed?.candidates?.[0]?.content?.parts?.[0]?.text ||
      parsed?.candidates?.[0]?.content?.text ||
      parsed?.candidates?.[0]?.output ||
      null;

    if (gRes.ok && result) {
      return new Response(
        JSON.stringify({ result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pass through Gemini error or message
    return new Response(
      JSON.stringify({
        error: parsed?.error?.message || "Gemini returned no answer.",
        status: gRes.status,
        raw: parsed,
      }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
