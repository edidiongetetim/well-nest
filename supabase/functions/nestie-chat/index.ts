
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Nestie-chat function invoked');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasOpenAIKey: !!openAIApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      openAIKeyLength: openAIApiKey?.length || 0
    });

    // Validate required environment variables
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key is not configured. Please add your OpenAI API key to Supabase Edge Functions secrets.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return new Response(JSON.stringify({ 
        error: 'Supabase configuration is missing.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userId } = await req.json();
    console.log('Request data:', { messageLength: message?.length, userId: !!userId });
    
    if (!message || !userId) {
      return new Response(JSON.stringify({ 
        error: 'Message and userId are required.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client initialized');
    
    // Fetch user's health data for context
    console.log('Fetching user health data...');
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

    console.log('Database queries completed:', {
      physicalDataCount: physicalData.data?.length || 0,
      mentalDataCount: mentalData.data?.length || 0,
      remindersCount: reminders.data?.length || 0,
      physicalError: physicalData.error?.message,
      mentalError: mentalData.error?.message,
      remindersError: reminders.error?.message
    });

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

    console.log('Making OpenAI API request...');
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

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in nestie-chat function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'I apologize, but I encountered an issue processing your request. Please try again in a moment.';
    
    if (error.message.includes('OpenAI API error')) {
      errorMessage = 'I\'m having trouble connecting to my AI service. Please check that your OpenAI API key is valid and try again.';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'I\'m having trouble connecting to external services. Please check your internet connection and try again.';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
