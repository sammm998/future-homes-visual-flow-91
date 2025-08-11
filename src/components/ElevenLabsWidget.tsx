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
  }, []);

  return <elevenlabs-convai agent-id="agent_01jzfqzb51eha8drdp5z56zavy"></elevenlabs-convai>;
};

export default ElevenLabsWidget;