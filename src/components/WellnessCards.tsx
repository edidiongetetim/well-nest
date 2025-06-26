
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ExternalLink } from "lucide-react";

export function WellnessCards() {
  const wellnessContent = [
    {
      id: "1",
      title: "Guided Meditation for Stress Relief",
      description: "A 10-minute guided meditation specifically designed for expectant parents to reduce stress and anxiety.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop",
      duration: "10 min",
      type: "audio",
      buttonText: "Play",
      buttonIcon: Play,
    },
    {
      id: "2",
      title: "Daily Breathing Exercise",
      description: "Simple breathing techniques to help you stay calm and centered throughout your pregnancy journey.",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=200&fit=crop",
      duration: "5 min",
      type: "exercise",
      buttonText: "Start",
      buttonIcon: Play,
    },
    {
      id: "3",
      title: "Prenatal Yoga Flow",
      description: "Gentle yoga movements designed to strengthen your body and calm your mind during pregnancy.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop",
      duration: "15 min",
      type: "video",
      buttonText: "Watch",
      buttonIcon: Play,
    },
    {
      id: "4",
      title: "Sleep Stories for Parents",
      description: "Relaxing bedtime stories and soundscapes to help you drift into peaceful sleep.",
      image: "https://images.unsplash.com/photo-1445109673451-c511bb51bd17?w=400&h=200&fit=crop",
      duration: "20 min",
      type: "audio",
      buttonText: "Listen",
      buttonIcon: Play,
    },
  ];

  return (
    <div>
      <h2 className="font-poppins font-bold text-xl text-primary mb-6">
        Recommended Wellness Content
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wellnessContent.map((content) => (
          <Card key={content.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full">
                <span className="font-poppins text-xs font-medium">{content.duration}</span>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="font-poppins font-bold text-lg mb-3 text-gray-800">
                {content.title}
              </h3>
              <p className="font-poppins text-gray-600 text-sm mb-4 leading-relaxed">
                {content.description}
              </p>
              
              <Button 
                className="w-full font-poppins bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
              >
                <content.buttonIcon className="w-4 h-4" />
                {content.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
