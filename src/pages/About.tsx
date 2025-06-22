
import Header from "@/components/Header";

const About = () => {
  const teamMembers = [
    { 
      name: "Busayo Ososanwo",
      image: "/lovable-uploads/f37a3715-d305-42f1-9bd1-66e0fe84d99d.png"
    },
    { 
      name: "Edidiong Okon",
      image: "/lovable-uploads/e7bc6374-d89a-45df-b659-0a9ec0347726.png"
    },
    { 
      name: "Nusrat Jahan",
      image: "/lovable-uploads/802d9016-9178-4cc6-b977-ed1bc678ebed.png"
    },
    { 
      name: "Saja Abufarha",
      image: "/lovable-uploads/c0555895-cf0b-4551-a623-f9b6a5d908be.png"
    },
    { 
      name: "Esther Wei",
      image: "/lovable-uploads/5a8a0752-ba84-4a45-9e9e-adfff24a86d0.png"
    }
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={`Photo of ${member.name}`}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-lg border-2 border-white mx-auto"
                  />
                </div>
                <h3 className="font-poppins font-bold text-purple-800 text-sm md:text-base">
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
