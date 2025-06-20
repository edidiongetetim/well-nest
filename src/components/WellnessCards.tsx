
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WellnessCards() {
  const wellnessContent = [
    {
      id: "1",
      title: "Guided Meditation for Stress Relief",
      description: "A 10-minute guided meditation specifically designed for expectant mothers to reduce stress and anxiety.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop",
      duration: "10 min",
    },
    {
      id: "2",
      title: "Daily Breathing Exercise",
      description: "Simple breathing techniques to help you stay calm and centered throughout your pregnancy journey.",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=200&fit=crop",
      duration: "5 min",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="font-poppins font-bold text-xl text-primary mb-4">
        Recommended Wellness Content
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wellnessContent.map((content) => (
          <Card key={content.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative">
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full">
                <span className="font-poppins text-xs">{content.duration}</span>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="font-poppins font-semibold text-lg mb-2 text-gray-800">
                {content.title}
              </h3>
              <p className="font-poppins text-gray-600 text-sm mb-4 leading-relaxed">
                {content.description}
              </p>
              
              <Button 
                className="w-full font-poppins bg-primary hover:bg-primary/90"
              >
                See more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
