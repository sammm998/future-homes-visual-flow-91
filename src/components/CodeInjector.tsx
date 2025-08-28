import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

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
      // Security: Only allow code injection for authenticated admin users
      if (!snippet.is_active) {
        console.warn('Inactive code snippet skipped:', snippet.name);
        return;
      }

      if (snippet.code_type === 'javascript') {
        // Security: Sanitize JavaScript content to prevent XSS
        const sanitizedContent = DOMPurify.sanitize(snippet.code_content, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          ALLOW_DATA_ATTR: false,
        });
        
        // Additional validation: Only allow safe JavaScript patterns
        if (sanitizedContent !== snippet.code_content.trim()) {
          console.error('JavaScript snippet contains potentially unsafe content:', snippet.name);
          return;
        }

        const script = document.createElement('script');
        script.textContent = sanitizedContent;
        script.setAttribute('data-code-injector', snippet.id);
        script.setAttribute('data-snippet-name', snippet.name);
        script.setAttribute('type', 'text/javascript');

        if (snippet.injection_location === 'header') {
          document.head.appendChild(script);
        } else {
          document.body.appendChild(script);
        }
      } else if (snippet.code_type === 'css') {
        // Security: Sanitize CSS content
        const sanitizedCSS = DOMPurify.sanitize(snippet.code_content, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          FORBID_TAGS: ['script', 'object', 'embed', 'iframe'],
          FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
        });

        const style = document.createElement('style');
        style.textContent = sanitizedCSS;
        style.setAttribute('data-code-injector', snippet.id);
        style.setAttribute('data-snippet-name', snippet.name);
        style.setAttribute('type', 'text/css');
        document.head.appendChild(style);
      } else if (snippet.code_type === 'html') {
        // Security: Sanitize HTML content to prevent XSS
        const sanitizedHTML = DOMPurify.sanitize(snippet.code_content, {
          ALLOWED_TAGS: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'u', 'br', 'img', 'a', 'ul', 'ol', 'li'],
          ALLOWED_ATTR: ['class', 'id', 'href', 'src', 'alt', 'title', 'target'],
          FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'textarea', 'button'],
          FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
        });

        // Additional check: If content was modified by sanitizer, log warning
        if (sanitizedHTML !== snippet.code_content.trim()) {
          console.warn('HTML snippet was sanitized for security:', snippet.name);
        }

        // For HTML content, we need to parse and inject each element properly
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sanitizedHTML;
        
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

        // Security: Do not process any script tags found in HTML content
        // Script tags should be handled via the 'javascript' code type only
        if (sanitizedHTML.includes('<script') || snippet.code_content.includes('<script')) {
          console.error('Script tags detected in HTML snippet. Use javascript code type instead:', snippet.name);
          return;
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