
import Header from "@/components/Header";

const About = () => {
  const teamMembers = [
    { name: "Busayo Osossanwo"},
    { name: "Edidiong Okon"},
    { name: "Nusrat Jahan"},
    { name: "Saja Abufarha"},
    { name: "Yuechun Wei"}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Our Story Section */}
        <div className="text-center mb-16">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-800 mb-8">
            Our Story
          </h1>
          <p className="font-poppins text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            At WellNest, our mission is to support pregnant individuals throughout their pregnancy and postpartum journey using AI. We believe every person deserves care, attention, and emotional support during this life-changing time.
          </p>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-16">
          <h2 className="font-poppins text-3xl font-bold text-purple-800 text-center mb-12">
            Meet the Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-poppins font-semibold text-purple-800 mb-2">
                  {member.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
