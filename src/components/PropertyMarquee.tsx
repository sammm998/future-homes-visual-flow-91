import { motion } from "framer-motion";

const PROPERTY_IMAGES = [
  'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/rl9q4mj1esj.jpg',
  'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/3n142jndva3.jpg',
  'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/bkr7jnjl6tj.jpg',
  'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/wkf3muk8mf.jpg',
  'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/ssml6o436x.jpg',
  'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/tttyz3px5ue.jpeg',
  'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/ani9abmbtg.jpg',
];

export const PropertyMarquee = () => {
  // Duplicate images for seamless loop
  const duplicatedImages = [...PROPERTY_IMAGES, ...PROPERTY_IMAGES];

  return (
    <section className="relative w-full py-16 overflow-hidden bg-background">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          className="flex gap-6"
          animate={{
            x: ["-50%", "0%"],
            transition: {
              ease: "linear",
              duration: 50,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] h-56 md:h-72 lg:h-80 flex-shrink-0"
              style={{
                rotate: `${(index % 2 === 0 ? -1 : 2)}deg`,
              }}
            >
              <img
                src={src}
                alt={`Property showcase ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
