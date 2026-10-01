import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "905523032750";

const WhatsAppButton = () => {
  return (
    <a
      href={`https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&app_absent=0`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="global-whatsapp fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
    >
      <FaWhatsapp className="h-6 w-6 sm:h-[30px] sm:w-[30px]" aria-hidden="true" />
    </a>
  );
};

export default WhatsAppButton;
