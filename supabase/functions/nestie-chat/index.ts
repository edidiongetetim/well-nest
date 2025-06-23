
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Fetch user's health data for context
    const [physicalData, mentalData, reminders] = await Promise.all([
      supabase
        .from('physical_health_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('mental_epds_results')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(3),
      supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .order('reminder_date', { ascending: true })
        .limit(5)
    ]);

    // Build context for Nestie
    let contextInfo = "User's Recent Health Data:\n";
    
    if (physicalData.data && physicalData.data.length > 0) {
      const latest = physicalData.data[0];
      contextInfo += `Latest Physical Check-in (${latest.created_at}):\n`;
      contextInfo += `- Blood Pressure: ${latest.systolic}/${latest.diastolic} mmHg\n`;
      contextInfo += `- Heart Rate: ${latest.heartbeat} BPM\n`;
      contextInfo += `- Risk Level: ${latest.risk_level || latest.prediction_result}\n\n`;
    }

    if (mentalData.data && mentalData.data.length > 0) {
      const latest = mentalData.data[0];
      contextInfo += `Latest Mental Health Assessment (${latest.submitted_at}):\n`;
      contextInfo += `- EPDS Score: ${latest.epds_score}\n`;
      contextInfo += `- Assessment: ${latest.assessment}\n`;
      contextInfo += `- Anxiety Flag: ${latest.anxiety_flag ? 'Yes' : 'No'}\n`;
      if (latest.actions) {
        contextInfo += `- Recommended Actions: ${latest.actions}\n`;
      }
      if (latest.extra_actions) {
        contextInfo += `- Additional Support: ${latest.extra_actions}\n`;
      }
      contextInfo += "\n";
    }

    if (reminders.data && reminders.data.length > 0) {
      contextInfo += "Upcoming Reminders:\n";
      reminders.data.forEach(reminder => {
        contextInfo += `- ${reminder.title} on ${reminder.reminder_date}`;
        if (reminder.reminder_time) {
          contextInfo += ` at ${reminder.reminder_time}`;
        }
        contextInfo += `\n`;
      });
    }

    const systemPrompt = `You are Nestie, a compassionate, intelligent virtual companion designed to support users through their full reproductive and wellness journey. You are gender-inclusive and use terms like "birthing parent," "individual," or "your journey" instead of gendered terms like "mom" or "mother."

Core Guidelines:
- Be warm, empathetic, and supportive
- Use gender-inclusive language consistently
- Provide evidence-based wellness and mental health guidance
- When discussing health data, reference specific dates and values
- For mental health concerns, offer appropriate resources and escalation guidance
- Keep responses concise but comprehensive
- Always prioritize user safety and well-being

Available User Data:
${contextInfo}

Respond naturally to queries about:
- Recent health check-ins and vitals
- Mental health assessment results and recommended actions
- Upcoming reminders and appointments
- Emotional support and wellness suggestions
- General reproductive health and wellness questions

If asked about data that isn't available, politely explain that you don't have that information and suggest they check their health dashboard or add the information.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in nestie-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'I apologize, but I encountered an issue processing your request. Please try again in a moment.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
