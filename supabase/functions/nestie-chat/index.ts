
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced fallback responses with specific quick prompt handling
const getQuickPromptResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Quick prompt responses
  if (lowerMessage.includes('how are you feeling today') || lowerMessage === 'how are you feeling today?') {
    return "I'm here and ready to support you. Have you been feeling okay lately, physically or emotionally? 💜";
  }
  
  if (lowerMessage.includes('what were my latest vitals') || lowerMessage.includes('latest vitals')) {
    return "Here's what I found: Your latest vitals include [placeholder values]. Remember, staying consistent with check-ins helps track patterns over time. 💜";
  }
  
  if (lowerMessage.includes('do i have any reminders today') || lowerMessage.includes('reminders today')) {
    return "Yes! You have a doctor's appointment reminder today at 3:00 PM. Make sure to prepare any questions you have in advance. 💜";
  }
  
  if (lowerMessage.includes("i'm feeling anxious today") || lowerMessage.includes('feeling anxious')) {
    return "I'm so sorry you're feeling that way. Let's take a few slow breaths together. Would you like some calming affirmations or to review your latest check-ins? 💜";
  }
  
  if (lowerMessage.includes('can you help me with my wellness journey') || lowerMessage.includes('wellness journey')) {
    return "Absolutely. I can help you set goals, track your progress, and offer insights from your data. Let's take it step by step. 💜";
  }
  
  return null;
};

// Follow-up conversation responses
const getConversationResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Responses to physical/emotional well-being questions
  if (lowerMessage === 'yes' || lowerMessage === 'yeah' || lowerMessage === 'good' || lowerMessage === 'fine' || lowerMessage === 'okay') {
    return "That's wonderful to hear 💜 Let's keep tracking how you're feeling to stay on top of your wellness.";
  }
  
  if (lowerMessage === 'no' || lowerMessage === 'not good' || lowerMessage === 'bad' || lowerMessage === 'not really' || lowerMessage === 'not okay') {
    return "I'm really sorry to hear that. You're not alone — would you like me to guide you through a short check-in or suggest some calming support? 💜";
  }
  
  // Responses to affirmations vs check-ins choice
  if (lowerMessage.includes('affirmations') || lowerMessage === 'affirmations') {
    return "Here's one for you: 'You are doing the best you can, and that is enough.' 💜\n\nWould you like another one?";
  }
  
  if (lowerMessage.includes('check-ins') || lowerMessage.includes('check ins') || lowerMessage === 'check-ins' || lowerMessage.includes('summary') || lowerMessage.includes('show me')) {
    return "Here's a quick summary of your latest check-ins: [placeholder summary – e.g. 'Vitals are stable, mental health score improved by 2 points.'] Would you like to explore trends or speak with someone? 💜";
  }
  
  return null;
};

// Fallback responses for when AI is not available
const getFallbackResponse = (message: string): string => {
  // First check for quick prompts
  const quickResponse = getQuickPromptResponse(message);
  if (quickResponse) return quickResponse;
  
  // Then check for conversation responses
  const conversationResponse = getConversationResponse(message);
  if (conversationResponse) return conversationResponse;
  
  // General responses
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return "Hi there! I'm Nestie, your caring companion in the WellNest app. I'm here to support you on your wellness journey. How are you feeling today? 💜";
  }
  
  if (lowerMessage.includes('score') || lowerMessage.includes('assessment') || lowerMessage.includes('result')) {
    return "I don't have your latest results right now, but you can view them in your health dashboard. I'm still learning how to help you better! Would you like me to guide you to your dashboard? 💜";
  }
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return "I'm here for you. It sounds like you're going through a tough time. It might help to talk to someone you trust or reach out to a professional. Remember to breathe and take things one step at a time. 🤗";
  }
  
  if (lowerMessage.includes('health') || lowerMessage.includes('vitals') || lowerMessage.includes('blood pressure')) {
    return "I'd love to help you with your health questions! Would you like to review your health dashboard together? You can find all your vitals and health check-ins there. 💜";
  }
  
  if (lowerMessage.includes('reminder') || lowerMessage.includes('appointment')) {
    return "Your reminders and appointments are important! You can check all your upcoming reminders in your dashboard. Is there something specific you'd like to be reminded about? 💜";
  }
  
  // Generic supportive response
  return "Thank you for reaching out! I'm Nestie, and I'm here to support you on your wellness journey. While I'm still learning how to help you better, remember that you're not alone. Would you like to check your health dashboard or talk about how you're feeling today? 💜";
};

serve(async (req) => {
  console.log('Nestie-chat function invoked');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Request data:', { messageLength: message?.length, userId: !!userId });
    
    if (!message || !userId) {
      return new Response(JSON.stringify({ 
        response: getFallbackResponse("Hello! I'm here to help.")
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasOpenAIKey: !!openAIApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      openAIKeyLength: openAIApiKey?.length || 0,
      openAIKeyPrefix: openAIApiKey?.substring(0, 10) || 'none'
    });

    // If OpenAI API key is missing or invalid, use fallback
    if (!openAIApiKey || openAIApiKey.trim() === '' || !openAIApiKey.startsWith('sk-')) {
      console.log('OpenAI API key missing or invalid, using fallback response');
      return new Response(JSON.stringify({ 
        response: getFallbackResponse(message)
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase configuration missing, using fallback response');
      return new Response(JSON.stringify({ 
        response: getFallbackResponse(message)
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try to get user data, but don't fail if it doesn't work
    let contextInfo = "User's Recent Health Data:\n";
    let hasHealthData = false;

    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      console.log('Supabase client initialized');
      
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

      // Build context if we have data
      if (physicalData.data && physicalData.data.length > 0) {
        const latest = physicalData.data[0];
        contextInfo += `Latest Physical Check-in (${latest.created_at}):\n`;
        contextInfo += `- Blood Pressure: ${latest.systolic}/${latest.diastolic} mmHg\n`;
        contextInfo += `- Heart Rate: ${latest.heartbeat} BPM\n`;
        contextInfo += `- Risk Level: ${latest.risk_level || latest.prediction_result}\n\n`;
        hasHealthData = true;
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
        hasHealthData = true;
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
        hasHealthData = true;
      }
    } catch (dbError) {
      console.error('Database error, continuing with fallback:', dbError);
    }

    // Check for quick prompt responses first (even with AI available)
    const quickResponse = getQuickPromptResponse(message);
    if (quickResponse) {
      return new Response(JSON.stringify({ response: quickResponse }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for conversation responses
    const conversationResponse = getConversationResponse(message);
    if (conversationResponse) {
      return new Response(JSON.stringify({ response: conversationResponse }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare system prompt for more complex queries
    const systemPrompt = `You are Nestie, a warm and caring virtual companion in the WellNest app. You support users on their wellness journey by answering their questions, offering emotional support, and gently suggesting next steps.

Core Guidelines:
- Be warm, empathetic, and supportive
- Use gender-inclusive language consistently
- Keep responses concise but compassionate
- Always prioritize user safety and well-being
- End responses with 💜 when appropriate

Your responses should be:
- Kind and understanding
- Encouraging without being overly optimistic
- Practical when offering suggestions

If they ask about health or mood, give general, supportive suggestions such as:
- "I'm here for you. It might help to talk to someone you trust or reach out to a professional."
- "Would you like to review your health dashboard together?"
- "Remember to breathe and take things one step at a time."

${hasHealthData ? `Available User Data:\n${contextInfo}` : 'Note: I don\'t have access to the user\'s latest health data right now, but I can still provide general support and guidance.'}

If asked about specific scores or assessments and you don't have current data, reply:
"I don't have your latest results right now, but you can view them in your health dashboard. I'm still learning how to help you better!"

Always be supportive and caring, regardless of what technical limitations might exist.`;

    try {
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
        throw new Error('OpenAI API failed');
      }

      const data = await response.json();
      console.log('OpenAI response received successfully');
      
      const aiResponse = data.choices[0].message.content;

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError) {
      console.error('OpenAI API failed, using fallback response:', apiError);
      return new Response(JSON.stringify({ 
        response: getFallbackResponse(message)
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in nestie-chat function:', error);
    
    // Always provide a helpful fallback response
    const fallbackMessage = typeof error === 'object' && error !== null && 'message' in error 
      ? getFallbackResponse(error.message as string)
      : getFallbackResponse("I'm here to help!");
    
    return new Response(JSON.stringify({ 
      response: fallbackMessage
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
