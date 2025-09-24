import { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
      };
    }
  }
}

const ElevenLabsWidget = () => {
  useEffect(() => {
    // Listen for AI Property Assistant open/close events
    const handlePopupToggle = (event: CustomEvent) => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        if (event.detail.isOpen) {
          widget.classList.add('hidden-behind-popup');
        } else {
          widget.classList.remove('hidden-behind-popup');
        }
      }
    };

    window.addEventListener('aiPropertyAssistantToggle', handlePopupToggle as EventListener);

    return () => {
      window.removeEventListener('aiPropertyAssistantToggle', handlePopupToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    document.head.appendChild(script);

    // Add CSS to prevent overlap with pagination and other UI elements
    const style = document.createElement('style');
    style.textContent = `
      elevenlabs-convai {
        z-index: 1000 !important;
        position: fixed !important;
        bottom: 80px !important; /* Ensure space above pagination */
        right: 20px !important;
        transition: opacity 0.3s ease !important;
      }
      
      /* Hide when AI Property Assistant is open */
      elevenlabs-convai.hidden-behind-popup {
        opacity: 0 !important;
        pointer-events: none !important;
      }
      
      /* Mobile adjustments */
      @media (max-width: 768px) {
        elevenlabs-convai {
          bottom: 100px !important; /* More space on mobile for pagination */
          right: 16px !important;
          left: 16px !important;
          width: calc(100% - 32px) !important;
          max-width: 320px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="elevenlabs-widget-container">
      <elevenlabs-convai agent-id="agent_01jzfqzb51eha8drdp5z56zavy"></elevenlabs-convai>
    </div>
  );
};

export default ElevenLabsWidget;