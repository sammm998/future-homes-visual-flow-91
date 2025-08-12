import { useNavigate } from 'react-router-dom';

const SimplePopularCities = () => {
  const navigate = useNavigate();
  
  const cities = [
    {
      name: 'ANTALYA',
      image: '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png',
      path: '/antalya',
      count: '80+ Properties'
    },
    {
      name: 'DUBAI',
      image: '/lovable-uploads/739b5c8c-7e7d-42ee-a412-963fad0a408d.png',
      path: '/dubai',
      count: '35+ Properties'
    },
    {
      name: 'CYPRUS',
      image: '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.png',
      path: '/cyprus',
      count: '32+ Properties'
    },
    {
      name: 'MERSIN',
      image: '/lovable-uploads/60f987b0-c196-47b5-894d-173d604fa4c8.png',
      path: '/mersin',
      count: '25+ Properties'
    },
    {
      name: 'STRASBOURG',
      image: '/lovable-uploads/bfe83af6-39c4-4a52-b4e4-82ff091c5f48.png',
      path: '/france',
      count: '15+ Properties'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Most Popular Cities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover properties in our most sought-after destinations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cities.map((city, index) => (
            <div
              key={city.name}
              onClick={() => navigate(city.path)}
              className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                  <p className="text-white/80 text-sm">{city.count}</p>
                </div>
                
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimplePopularCities;