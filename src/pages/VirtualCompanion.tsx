
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const VirtualCompanion = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Nestie, your compassionate virtual companion. I'm here to support you through your wellness journey. I can help you understand your health data, remind you about appointments, and provide emotional support. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to use Nestie');
      }

      console.log('Sending message to Nestie:', inputText);
      const response = await supabase.functions.invoke('nestie-chat', {
        body: {
          message: inputText,
          userId: user.id
        }
      });

      console.log('Nestie response:', response);

      if (response.error) {
        console.error('Supabase function error:', response.error);
        throw new Error(response.error.message || 'Failed to connect to Nestie');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with Nestie:', error);
      
      let errorMessage = "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
      
      if (error.message.includes('log in')) {
        errorMessage = "Please log in to chat with Nestie.";
      } else if (error.message.includes('OpenAI')) {
        errorMessage = "I'm having trouble with my AI service. The OpenAI API may need to be configured properly.";
      }
      
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorBotMessage]);
      
      toast({
        title: "Connection Issue",
        description: error.message.includes('OpenAI') 
          ? "OpenAI API configuration may be needed. Please check Edge Function settings."
          : "Unable to connect to Nestie. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "How did I score on my last mental health assessment?",
    "What were my latest vitals?",
    "Do I have any reminders today?",
    "I'm feeling anxious today",
    "What actions should I take based on my last assessment?"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto h-full">
              <Card className="h-[calc(100vh-200px)] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="font-poppins text-2xl text-primary flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span>Nestie</span>
                      <div className="flex items-center gap-1 text-sm font-normal text-gray-600">
                        <Sparkles className="w-3 h-3" />
                        Your Compassionate AI Companion
                      </div>
                    </div>
                  </CardTitle>
                  <p className="font-poppins text-gray-600">
                    Supporting you through your wellness journey with personalized insights and care
                  </p>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender === 'bot' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[75%] p-4 rounded-2xl font-poppins ${
                            message.sender === 'user'
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        {message.sender === 'user' && (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 font-poppins">Nestie is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Prompts */}
                  {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                      <p className="font-poppins text-sm text-gray-600 mb-2">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickPrompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickPrompt(prompt)}
                            className="font-poppins text-xs rounded-full"
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share how you're feeling or ask about your health data..."
                        className="font-poppins"
                        disabled={isLoading}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        className="px-4"
                        disabled={isLoading || !inputText.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-poppins">
                      💜 Nestie has access to your health data to provide personalized support
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default VirtualCompanion;
