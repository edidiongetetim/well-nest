
import { supabase } from "@/integrations/supabase/client";

interface PhysicalHealthData {
  age: number;
  SystolicBP: number;
  DiastolicBP: number;
  BS: number;
  BodyTemp: number;
  HeartRate: number;
}

interface EPDSData {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
}

export class NestieIntelligentService {
  private static detectPhysicalHealthIntent(message: string): boolean {
    const physicalKeywords = [
      "blood pressure", "heart rate", "temperature", "physical health",
      "pregnancy risk", "vital signs", "blood sugar", "health check",
      "systolic", "diastolic", "bpm", "fever", "glucose"
    ];
    
    return physicalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private static detectMentalHealthIntent(message: string): boolean {
    const mentalKeywords = [
      "depression", "anxiety", "mental health", "mood", "sad", "worried",
      "overwhelmed", "stress", "postpartum", "epds", "feeling down",
      "sleep problems", "crying", "panic", "fear"
    ];
    
    return mentalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private static detectReminderIntent(message: string): boolean {
    const reminderKeywords = [
      "reminder", "appointment", "schedule", "calendar", "upcoming",
      "what do i have", "this week", "today", "tomorrow", "planned"
    ];
    
    return reminderKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  static async getIntelligentResponse(message: string, userId: string): Promise<string> {
    console.log('Processing intelligent response for:', message);

    // Check for reminder queries first
    if (this.detectReminderIntent(message)) {
      return await this.handleReminderQuery(userId);
    }

    // Check for physical health queries
    if (this.detectPhysicalHealthIntent(message)) {
      return await this.handlePhysicalHealthQuery(message, userId);
    }

    // Check for mental health queries
    if (this.detectMentalHealthIntent(message)) {
      return await this.handleMentalHealthQuery(message, userId);
    }

    // Default to conversational mode
    return this.getConversationalResponse(message);
  }

  private static async handleReminderQuery(userId: string): Promise<string> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: reminders, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .gte('reminder_date', today)
        .order('reminder_date', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching reminders:', error);
        return "I'm having trouble accessing your reminders right now, but you can check them in your dashboard. 💜";
      }

      if (!reminders || reminders.length === 0) {
        return "You don't have any upcoming reminders scheduled. That means you can relax a bit! 😊 If you'd like to add some, just visit your dashboard. 💜";
      }

      let response = "Here's what's coming up for you: 🗓️\n\n";
      reminders.forEach(reminder => {
        const date = new Date(reminder.reminder_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        const time = reminder.reminder_time ? ` at ${reminder.reminder_time}` : '';
        response += `• ${date}${time} – ${reminder.title}\n`;
      });

      response += "\nI'm here if you need help preparing for any of these! 💜";
      return response;
    } catch (error) {
      console.error('Error in reminder query:', error);
      return "I'm having some technical difficulties accessing your reminders. You can check them in your dashboard. 💜";
    }
  }

  private static async handlePhysicalHealthQuery(message: string, userId: string): Promise<string> {
    try {
      // Get user's latest physical health data
      const { data: healthData, error } = await supabase
        .from('physical_health_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !healthData || healthData.length === 0) {
        return "I'd love to help assess your physical health, but I don't see any recent check-in data. Would you like to do a quick health check-in first? You can find it in your Health section. 💜";
      }

      const latest = healthData[0];
      
      // Parse blood pressure data if it exists
      let bloodSugar = 5.5; // Default value
      let bodyTemp = 37.0; // Default value
      
      try {
        if (latest.blood_pressure) {
          const parsed = JSON.parse(latest.blood_pressure);
          bloodSugar = parseFloat(parsed.bloodSugar) || 5.5;
          bodyTemp = parseFloat(parsed.bodyTemperature) || 37.0;
        }
      } catch (parseError) {
        console.error('Error parsing blood pressure data:', parseError);
      }

      const physicalData: PhysicalHealthData = {
        age: parseInt(latest.age) || 25,
        SystolicBP: parseInt(latest.systolic) || 120,
        DiastolicBP: parseInt(latest.diastolic) || 80,
        BS: bloodSugar,
        BodyTemp: bodyTemp,
        HeartRate: parseInt(latest.heartbeat) || 70
      };

      console.log('Sending to physical health API:', physicalData);

      const response = await fetch('https://wellnest-51u4.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(physicalData),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Physical health API response:', result);

      const riskLevel = result.prediction || result.risk_level || 'moderate';
      
      return `Based on your recent health data, I'm seeing a ${riskLevel.toLowerCase()} risk level. ${this.getPhysicalHealthAdvice(riskLevel)} 💜\n\nRemember, I'm here to support you, but always consult with your healthcare provider for medical concerns.`;
      
    } catch (error) {
      console.error('Error in physical health query:', error);
      return "I'm having some trouble analyzing your physical health data right now. Please check your Health dashboard for your latest readings, and don't hesitate to contact your healthcare provider if you have concerns. 💜";
    }
  }

  private static async handleMentalHealthQuery(message: string, userId: string): Promise<string> {
    try {
      // Get user's latest mental health data
      const { data: mentalData, error } = await supabase
        .from('mental_epds_results')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (error || !mentalData || mentalData.length === 0) {
        return "I'd love to help with your mental health concerns. It might be helpful to take a mental health assessment first - you can find it in your Mental Health section. I'm here to support you through this journey. 💜";
      }

      const latest = mentalData[0];
      const score = latest.epds_score || 0;
      const assessment = latest.assessment || 'moderate';

      return `Based on your recent mental health assessment (EPDS score: ${score}), you're showing ${assessment.toLowerCase()} signs. ${this.getMentalHealthAdvice(assessment, score)} 💜\n\nRemember, you're not alone in this journey. I'm here to support you, and there are professional resources available if you need them.`;
      
    } catch (error) {
      console.error('Error in mental health query:', error);
      return "I'm having some trouble accessing your mental health data right now. Please check your Mental Health section for your latest assessment. Remember, I'm here for you, and it's always okay to reach out for professional support. 💜";
    }
  }

  private static getPhysicalHealthAdvice(riskLevel: string): string {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return "That's wonderful news! Your vitals are looking good. Keep up the great work with your health routine.";
      case 'moderate':
        return "There are some areas we should keep an eye on. Consider discussing these readings with your healthcare provider.";
      case 'high':
        return "I'm a bit concerned about these readings. Please reach out to your healthcare provider soon to discuss these results.";
      default:
        return "Let's keep monitoring your health together. Regular check-ins help us spot patterns over time.";
    }
  }

  private static getMentalHealthAdvice(assessment: string, score: number): string {
    if (score >= 13) {
      return "These scores suggest you might be experiencing significant challenges. Please consider reaching out to a mental health professional or your healthcare provider.";
    } else if (score >= 10) {
      return "You might be experiencing some emotional challenges. It could be helpful to talk to someone you trust or consider professional support.";
    } else {
      return "You're doing well emotionally. Keep taking care of yourself and remember that it's normal to have ups and downs.";
    }
  }

  private static getConversationalResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're so welcome! I'm always here to support you on your wellness journey. 💜";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help you in any way I can! Whether it's about your health data, reminders, or just need someone to talk to. What would you like to explore together? 💜";
    }
    
    if (lowerMessage.includes('how are you')) {
      return "I'm doing well, thank you for asking! More importantly, how are you feeling today? I'm here to support you through whatever you're experiencing. 💜";
    }
    
    return "I'm here to support you on your wellness journey. Feel free to ask me about your health data, upcoming reminders, or just share what's on your mind. 💜";
  }
}
