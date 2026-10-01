import { FaWhatsapp } from "react-icons/fa";
import { trackConversionEvent } from "@/lib/analytics-events";

const WHATSAPP_NUMBER = "905523032750";

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onClick={() => trackConversionEvent("whatsapp_click", { placement: "floating_button" })}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <FaWhatsapp size={30} aria-hidden="true" />
    </a>
  );
};

export default WhatsAppButton;
