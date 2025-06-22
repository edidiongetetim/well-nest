
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      title: "Pregnancy Risk Predictor",
      description: "Advanced AI-powered risk assessment that monitors your health indicators and provides personalized insights to keep you and your baby safe throughout your pregnancy journey.",
      icon: "🔮"
    },
    {
      title: "Postpartum Depression Monitoring",
      description: "Compassionate mental health support using validated screening tools and continuous monitoring to help identify and address postpartum depression early.",
      icon: "💚"
    },
    {
      title: "Daily Wellness Companion",
      description: "Your personal AI companion that provides daily check-ins, wellness tips, meditation guidance, and emotional support tailored to your unique pregnancy experience.",
      icon: "🌟"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* What We Offer Section */}
        <div className="text-center mb-16">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-800 mb-8">
            What We Offer
          </h1>
          <p className="font-poppins text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            WellNest provides compassionate, AI-powered support for pregnancy and postpartum wellness. From predictive risk assessments to emotional check-ins, our tools grow with you.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">{service.icon}</span>
              </div>
              
              <h3 className="font-poppins font-semibold text-xl text-purple-800 mb-4">
                {service.title}
              </h3>
              
              <p className="font-poppins text-gray-700 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-poppins text-2xl font-bold text-purple-800 mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="font-poppins text-gray-700 mb-6">
            Join thousands of expecting parents who trust WellNest for their pregnancy and postpartum support.
          </p>
          <Link to="/signup">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-poppins font-medium px-8 py-3 rounded-full transition-colors">
              Get Started Today
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Services;
