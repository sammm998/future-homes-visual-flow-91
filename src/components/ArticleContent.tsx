import React from 'react';
import DOMPurify from 'dompurify';

interface ArticleContentProps {
  content: string;
  sanitize?: boolean;
  className?: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  sanitize = true,
  className = ''
}) => {
  const processedContent = sanitize ? DOMPurify.sanitize(content) : content;

  return (
    <>
      {/* Article-specific CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .article-prose {
            line-height: 1.75;
            color: hsl(var(--muted-foreground));
          }
          
          .article-prose h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: hsl(var(--foreground));
            margin-bottom: 1.5rem;
            margin-top: 2rem;
            line-height: 1.2;
          }
          
          .article-prose h1:first-child {
            margin-top: 0;
          }
          
          .article-prose h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: hsl(var(--foreground));
            margin-bottom: 1rem;
            margin-top: 2rem;
            line-height: 1.3;
          }
          
          .article-prose h2:first-child {
            margin-top: 0;
          }
          
          .article-prose h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: hsl(var(--foreground));
            margin-bottom: 0.75rem;
            margin-top: 1.5rem;
            line-height: 1.4;
          }
          
          .article-prose h4 {
            font-size: 1.25rem;
            font-weight: 600;
            color: hsl(var(--foreground));
            margin-bottom: 0.5rem;
            margin-top: 1rem;
            line-height: 1.5;
          }
          
          .article-prose p {
            font-size: 1.125rem;
            margin-bottom: 1rem;
            line-height: 1.75;
          }
          
          .article-prose ul, 
          .article-prose ol {
            margin-bottom: 1rem;
            margin-left: 1.5rem;
          }
          
          .article-prose li {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
            line-height: 1.75;
          }
          
          .article-prose ul li {
            list-style-type: disc;
          }
          
          .article-prose ol li {
            list-style-type: decimal;
          }
          
          .article-prose blockquote {
            border-left: 4px solid hsl(var(--primary));
            padding-left: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            margin: 1rem 0;
            background-color: hsl(var(--muted) / 0.5);
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
          
          .article-prose blockquote p {
            color: hsl(var(--foreground));
            font-weight: 500;
            font-style: italic;
            margin-bottom: 0;
          }
          
          .article-prose a {
            color: hsl(var(--primary));
            text-decoration: underline;
            text-underline-offset: 2px;
            transition: color 0.2s ease;
          }
          
          .article-prose a:hover {
            color: hsl(var(--primary-glow));
          }
          
          .article-prose img {
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            margin: 1.5rem 0;
            max-width: 100%;
            height: auto;
          }
          
          .article-prose code {
            background-color: hsl(var(--muted));
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-family: monospace;
          }
          
          .article-prose pre {
            background-color: hsl(var(--muted));
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          
          .article-prose pre code {
            background-color: transparent;
            padding: 0;
          }
          
          .article-prose table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid hsl(var(--border));
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          
          .article-prose th,
          .article-prose td {
            border: 1px solid hsl(var(--border));
            padding: 0.75rem 1rem;
            text-align: left;
          }
          
          .article-prose th {
            background-color: hsl(var(--muted));
            font-weight: 600;
          }
          
          .article-prose .highlight-box {
            background-color: hsl(var(--primary) / 0.05);
            border: 1px solid hsl(var(--primary) / 0.2);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          
          .article-prose .warning-box {
            background-color: #fefce8;
            border: 1px solid #fde047;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          
          .article-prose .info-box {
            background-color: #eff6ff;
            border: 1px solid #93c5fd;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          
          .article-prose .success-box {
            background-color: #f0fdf4;
            border: 1px solid #86efac;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          
          /* Dark mode adjustments */
          @media (prefers-color-scheme: dark) {
            .article-prose .warning-box {
              background-color: #422006;
              border-color: #a16207;
            }
            
            .article-prose .info-box {
              background-color: #1e3a8a;
              border-color: #3b82f6;
            }
            
            .article-prose .success-box {
              background-color: #14532d;
              border-color: #16a34a;
            }
          }
        `
      }} />
      
      <div 
        className={`article-prose ${className}`}
        dangerouslySetInnerHTML={{ 
          __html: processedContent 
        }}
      />
    </>
  );
};

export default ArticleContent;