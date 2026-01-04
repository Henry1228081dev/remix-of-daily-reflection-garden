import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { badHabit } = await req.json();
    
    if (!badHabit || typeof badHabit !== "string") {
      return new Response(
        JSON.stringify({ error: "Bad habit is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating replacement suggestions for bad habit: ${badHabit}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a helpful wellness coach specializing in habit replacement therapy. 
When given a bad habit, suggest 5 healthier replacement activities that:
1. Address the same underlying need or trigger
2. Are easy to start immediately
3. Provide similar sensory or emotional satisfaction
4. Are practical for everyday life

For example, if someone wants to quit smoking:
- The hand-to-mouth action can be replaced with chewing gum, eating carrot sticks, or using a stress ball
- The stress relief aspect can be replaced with deep breathing, short walks, or fidget toys
- The social aspect can be replaced with texting friends or joining online communities

Return ONLY a JSON array of 5 objects with "name" and "reason" fields. No markdown, no explanation, just the JSON array.`,
          },
          {
            role: "user",
            content: `Suggest 5 healthier replacement habits for: "${badHabit}"`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_replacements",
              description: "Return 5 replacement habit suggestions",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Name of the replacement habit" },
                        reason: { type: "string", description: "Why this is a good replacement (1 sentence)" },
                      },
                      required: ["name", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_replacements" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data).slice(0, 200));

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({ suggestions: parsed.suggestions }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: try to parse content directly
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify({ suggestions: Array.isArray(parsed) ? parsed : parsed.suggestions }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        console.error("Failed to parse content as JSON:", content);
      }
    }

    // Default suggestions if AI fails
    const defaultSuggestions = [
      { name: "Take a 5-minute walk", reason: "Physical movement releases endorphins and breaks the urge cycle" },
      { name: "Practice deep breathing", reason: "Calms the nervous system and redirects focus" },
      { name: "Drink a glass of water", reason: "Simple action that satisfies the need to do something" },
      { name: "Text a friend", reason: "Social connection provides emotional support" },
      { name: "Do 10 jumping jacks", reason: "Quick burst of energy that shifts your mental state" },
    ];

    return new Response(
      JSON.stringify({ suggestions: defaultSuggestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in suggest-replacements:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
