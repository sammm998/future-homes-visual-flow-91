import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Globe, Users, Heart, Shield, FileText, Home, CreditCard, Plane, Languages, CheckCircle } from 'lucide-react';
interface ContentSectionProps {
  section: {
    type: string;
    content?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    [key: string]: any;
  };
  className?: string;
}
export const ContentSection: React.FC<ContentSectionProps> = ({
  section,
  className = ''
}) => {
  const renderHeroSection = () => <div className={`text-center mb-16 ${className}`}>
      {section.subtitle && <Badge className="mb-4">{section.subtitle}</Badge>}
      {section.title && <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          {section.title}
        </h1>}
      {section.content && <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{section.content}</p>
        </div>}
    </div>;
  const renderContentSection = () => null;
  const renderCompanyInfoSection = () => <div className={`bg-primary/5 rounded-2xl p-8 mb-16 ${className}`}>
      <div className="text-center mb-8">
        {section.title && <h2 className="text-3xl font-bold text-foreground mb-4">{section.title}</h2>}
        {section.description && <p className="text-lg text-muted-foreground">{section.description.replace(/Future\s*Homes\s*Turkey\s*/gi, 'Future Homes ').replace(/Future\s*Homes\s*,?\s*/gi, 'Future Homes ').replace(/Dubai,?\s*Cyprus\s*&?\s*France/gi, 'Turkey, Dubai, Cyprus, Antalya, Mersin & France').replace(/Cyprus,?\s*Dubai\s*&?\s*France/gi, 'Turkey, Dubai, Cyprus, Antalya, Mersin & France').trim()}</p>}
      </div>
    </div>;
  const renderTeamHighlightSection = () => <div className={`mb-16 ${className}`}>
      
    </div>;
  const renderContactSection = () => <div className={`mb-16 ${className}`}>
      <div className="text-center mb-12">
        {section.title && <h2 className="text-3xl font-bold text-foreground mb-4">{section.title}</h2>}
        {section.content && <p className="text-lg text-muted-foreground">{section.content}</p>}
      </div>
    </div>;
  const renderFormSection = () => <div className={`mb-16 ${className}`}>
      {section.content && <p className="text-lg text-muted-foreground text-center">{section.content}</p>}
    </div>;
  const renderPropertiesSection = () => <div className={`mb-16 ${className}`}>
      <div className="text-center mb-12">
        {section.content && <h2 className="text-3xl font-bold text-foreground mb-4">{section.content}</h2>}
        {section.description && <p className="text-lg text-muted-foreground">{section.description}</p>}
      </div>
    </div>;
  const renderOfficesSection = () => {
    if (!section.offices || !Array.isArray(section.offices)) return null;
    return <div className={`mb-16 ${className}`}>
        <div className="text-center mb-12">
          {section.title && <h2 className="text-3xl font-bold text-foreground mb-4">{section.title}</h2>}
          {section.description && <p className="text-lg text-muted-foreground">{section.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.offices.map((office: any, index: number) => <Card key={index} className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>{office.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{office.location}</p>
              </CardContent>
            </Card>)}
        </div>
      </div>;
  };

  // Main render switch
  switch (section.type) {
    case 'hero':
      return renderHeroSection();
    case 'content':
      return renderContentSection();
    case 'company_info':
      return renderCompanyInfoSection();
    case 'team_highlight':
      return renderTeamHighlightSection();
    case 'contact':
      return renderContactSection();
    case 'form':
      return renderFormSection();
    case 'properties':
      return renderPropertiesSection();
    case 'offices':
      return renderOfficesSection();
    default:
      return renderContentSection();
  }
};