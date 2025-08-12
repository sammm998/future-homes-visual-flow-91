import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBuilding, FaTree, FaUmbrellaBeach } from 'react-icons/fa';

const SimpleInteractiveSelector = () => {
  const navigate = useNavigate();
  
  const options = [
    {
      title: "Antalya",
      description: "Turkish Riviera Paradise",
      propertyCount: "80+ Properties",
      image: "/lovable-uploads/37669c23-a476-4550-84f1-f370ce4333a1.png",
      icon: <FaUmbrellaBeach size={20} className="text-white" />,
      path: "/antalya"
    },
    {
      title: "Dubai",
      description: "Modern Metropolis",
      propertyCount: "35+ Properties",
      image: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.png",
      icon: <FaBuilding size={20} className="text-white" />,
      path: "/dubai"
    },
    {
      title: "Mersin",
      description: "Mediterranean Coastal",
      propertyCount: "25+ Properties",
      image: "/lovable-uploads/ae81b7b2-74ce-4693-b5bf-43a5e3bb2b97.png",
      icon: <FaUmbrellaBeach size={20} className="text-white" />,
      path: "/mersin"
    },
    {
      title: "Cyprus",
      description: "Island Paradise",
      propertyCount: "32+ Properties",
      image: "/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.png",
      icon: <FaTree size={20} className="text-white" />,
      path: "/cyprus"
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Destination
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select from our premium locations worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => (
            <div
              key={option.title}
              onClick={() => navigate(option.path)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={option.image}
                  alt={option.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3">
                  {option.icon}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                  <p className="text-white/90 mb-2">{option.description}</p>
                  <p className="text-white/80 text-sm">{option.propertyCount}</p>
                  
                  <button className="mt-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/30">
                    View Properties
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleInteractiveSelector;