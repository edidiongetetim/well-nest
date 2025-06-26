
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
import { NestieIntelligentService } from "@/services/nestieIntelligentService";

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
      text: "Hello! I'm Nestie, your compassionate virtual companion. I'm here to support you through your wellness journey. I can help you understand your health data, check your reminders, and provide emotional support. How are you feeling today? 💜",
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
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'd love to help you, but you'll need to sign in first so I can provide personalized support. Once you're signed in, I can access your health data and give you better guidance! 💜",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        return;
      }

      console.log('Processing message with intelligent service:', inputText);
      
      // Try intelligent response first
      let responseText = "";
      try {
        responseText = await NestieIntelligentService.getIntelligentResponse(inputText, user.id);
      } catch (intelligentError) {
        console.error('Intelligent service failed, falling back to regular chat:', intelligentError);
        
        // Fallback to regular Nestie chat
        try {
          const response = await supabase.functions.invoke('nestie-chat', {
            body: {
              message: inputText,
              userId: user.id
            }
          });

          if (response.data && response.data.response) {
            responseText = response.data.response;
          } else {
            throw new Error('No response from chat service');
          }
        } catch (chatError) {
          console.error('Chat service also failed:', chatError);
          responseText = "I'm here for you! While I'm having some technical difficulties right now, I want you to know that your wellness journey matters. Please check your dashboard for your latest health information, and remember that it's okay to reach out for support when you need it. 💜";
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with Nestie:', error);
      
      const supportiveMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here for you, even though I'm having some connection issues right now. Your wellness and feelings matter to me. While I work on getting back to full capacity, please remember to take care of yourself and don't hesitate to reach out to someone you trust if you need support. 💜",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportiveMessage]);
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
    "How are you feeling today?",
    "What were my latest vitals?",
    "Do I have any reminders today?",
    "I'm feeling anxious today",
    "Can you help me with my wellness journey?"
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
                        Your Intelligent AI Companion
                      </div>
                    </div>
                  </CardTitle>
                  <p className="font-poppins text-gray-600">
                    Supporting you with personalized insights, health analysis, and care
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
                        placeholder="Ask about your health, reminders, or share how you're feeling..."
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
                      💜 Nestie can analyze your health data and provide intelligent insights
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
