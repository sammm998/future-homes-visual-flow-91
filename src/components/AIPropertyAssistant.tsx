import { AIAssistantInterface } from "@/components/ui/ai-assistant-interface";

export function AIPropertyAssistant() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            AI Property Assistant
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant help finding your perfect property with our AI trained on our entire database
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AIAssistantInterface />
        </div>
      </div>
    </section>
  );
}