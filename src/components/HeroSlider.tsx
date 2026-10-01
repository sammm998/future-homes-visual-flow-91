import heroEstate from '@/assets/hero-modern-estate.jpg';

const HeroSlider = () => {
  return (
    <div dir="ltr" className="absolute inset-0 overflow-hidden bg-navy">
      <img
        src={heroEstate}
        alt="Modern Mediterranean estate overlooking the sea at sunset"
        width={1920}
        height={1080}
        className="h-full w-full object-cover object-center motion-safe:animate-[hero-drift_18s_ease-in-out_infinite_alternate]"
        loading="eager"
        fetchPriority="high"
        decoding="sync"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/55 to-navy/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-navy/10" />
    </div>
  );
};


export default HeroSlider;
