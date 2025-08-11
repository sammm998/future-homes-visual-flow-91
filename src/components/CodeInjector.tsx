import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CodeSnippet {
  id: string;
  name: string;
  code_type: 'javascript' | 'html' | 'css' | 'php';
  code_content: string;
  injection_location: 'header' | 'body_start' | 'body_end';
  is_active: boolean;
}

const CodeInjector: React.FC = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

  useEffect(() => {
    const fetchActiveSnippets = async () => {
      try {
        const { data, error } = await supabase
          .from('code_snippets')
          .select('*')
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching code snippets:', error);
          return;
        }

        console.log('Code snippets fetched:', data);
        setSnippets((data || []) as CodeSnippet[]);
      } catch (error) {
        console.error('Error fetching code snippets:', error);
      }
    };

    fetchActiveSnippets();
  }, []);

  useEffect(() => {
    // Clear any previously injected code
    const existingInjectedElements = document.querySelectorAll('[data-code-injector]');
    existingInjectedElements.forEach(el => el.remove());

    console.log('Processing snippets:', snippets);
    snippets.forEach((snippet) => {
      if (snippet.code_type === 'javascript') {
        const script = document.createElement('script');
        script.textContent = snippet.code_content;
        script.setAttribute('data-code-injector', snippet.id);
        script.setAttribute('data-snippet-name', snippet.name);

        if (snippet.injection_location === 'header') {
          document.head.appendChild(script);
        } else {
          document.body.appendChild(script);
        }
      } else if (snippet.code_type === 'css') {
        const style = document.createElement('style');
        style.textContent = snippet.code_content;
        style.setAttribute('data-code-injector', snippet.id);
        style.setAttribute('data-snippet-name', snippet.name);
        document.head.appendChild(style);
      } else if (snippet.code_type === 'html') {
        // For HTML content, we need to parse and inject each element properly
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = snippet.code_content;
        
        // Process each child element
        Array.from(tempDiv.children).forEach((element) => {
          const clonedElement = element.cloneNode(true) as Element;
          clonedElement.setAttribute('data-code-injector', snippet.id);
          clonedElement.setAttribute('data-snippet-name', snippet.name);

          if (snippet.injection_location === 'header') {
            document.head.appendChild(clonedElement);
          } else if (snippet.injection_location === 'body_start') {
            document.body.insertBefore(clonedElement, document.body.firstChild);
          } else {
            document.body.appendChild(clonedElement);
          }
        });

        // Handle any text nodes or script content that's not wrapped in elements
        if (tempDiv.textContent && tempDiv.textContent.trim()) {
          const scriptMatch = snippet.code_content.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
          if (scriptMatch) {
            scriptMatch.forEach((scriptContent) => {
              const script = document.createElement('script');
              const srcMatch = scriptContent.match(/src="([^"]+)"/);
              const deferMatch = scriptContent.match(/defer/);
              
              if (srcMatch) {
                script.src = srcMatch[1];
                if (deferMatch) script.defer = true;
              } else {
                const innerScript = scriptContent.replace(/<script[^>]*>|<\/script>/g, '');
                script.textContent = innerScript;
              }
              
              script.setAttribute('data-code-injector', snippet.id);
              script.setAttribute('data-snippet-name', snippet.name);
              
              if (snippet.injection_location === 'header') {
                document.head.appendChild(script);
              } else {
                document.body.appendChild(script);
              }
            });
          }
        }
      }
      // Note: PHP code cannot be executed in the browser, it would need server-side processing
    });

    // Cleanup function to remove injected code when component unmounts
    return () => {
      const injectedElements = document.querySelectorAll('[data-code-injector]');
      injectedElements.forEach(el => el.remove());
    };
  }, [snippets]);

  return null; // This component doesn't render anything visible
};

export default CodeInjector;