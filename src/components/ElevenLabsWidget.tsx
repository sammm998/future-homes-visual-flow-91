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