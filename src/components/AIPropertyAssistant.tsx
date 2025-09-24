import { useState } from "react";
import { AIAssistantInterface } from "@/components/ui/ai-assistant-interface";
import { Button } from "@/components/ui/button";

export function AIPropertyAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            AI Property Assistant
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Få omedelbar hjälp att hitta din perfekta fastighet med vår AI som är tränad på hela databasen
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AIAssistantInterface />
          
          {/* Open Chat Button */}
          <div className="text-center mt-8">
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl"
            >
              Starta konversation med AI
            </Button>
          </div>
        </div>
        
        {/* Chat Dialog */}
        <AIAssistantInterface 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      </div>
    </section>
  );
}