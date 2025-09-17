import React from 'react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-primary animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Website Update in Progress
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            We're currently updating our website to serve you better. 
            Please check back soon for an improved experience.
          </p>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50">
            <p className="text-sm text-muted-foreground">
              Thank you for your patience while we make improvements to our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;