import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GenerationResult {
  slug: string;
  success: boolean;
  imageUrl?: string;
  error?: string;
}

const GenerateBaliImages = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);

  const generateImages = async () => {
    setIsGenerating(true);
    setResults([]);

    try {
      const response = await fetch('/functions/v1/generate-bali-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
        const successCount = data.results.filter((r: GenerationResult) => r.success).length;
        toast.success(`Generated ${successCount} out of ${data.results.length} Bali article images successfully!`);
      }

    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Generate Bali Article Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Generate AI-powered images for all Bali real estate articles. This will create professional, 
          high-quality images that match the style of your existing content.
        </p>

        <Button 
          onClick={generateImages} 
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Images...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate All Bali Images
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Generation Results:</h4>
            {results.map((result) => (
              <div 
                key={result.slug}
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
              >
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm">
                  {result.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {result.error && (
                  <span className="text-xs text-red-500 ml-auto">
                    {result.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>This will generate images for:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Bali Real Estate Investment Complete Guide</li>
            <li>Top 5 Bali Neighborhoods for Property Investment</li>
            <li>Bali Villa Rental Business Guide</li>
            <li>Legal Guide for Foreign Property Ownership</li>
            <li>Bali Lifestyle for International Buyers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerateBaliImages;