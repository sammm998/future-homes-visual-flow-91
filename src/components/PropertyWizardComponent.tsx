
import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, MapPin, DollarSign, Users, Building, Waves, Mountain, TreePine, Palmtree, Check, ArrowRight, ArrowLeft, Star, User, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';


const PropertyWizardComponent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    location: '',
    propertyType: '',
    budget: '',
    features: [],
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  const [showResult, setShowResult] = useState(false);

  const totalSteps = 5;

  // Animation variants without ease property
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      x: -50, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: 50, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Step data
  const steps = {
    1: {
      title: "Where would you like to invest?",
      subtitle: "Choose your preferred location",
      options: [
        { id: 'antalya', name: 'Antalya', icon: <Palmtree className="w-6 h-6" />, description: 'Turkish Riviera paradise', color: 'from-blue-500 to-cyan-500' },
        { id: 'dubai', name: 'Dubai', icon: <Building className="w-6 h-6" />, description: 'Modern luxury metropolis', color: 'from-amber-500 to-orange-500' },
        { id: 'cyprus', name: 'Cyprus', icon: <Waves className="w-6 h-6" />, description: 'Mediterranean island gem', color: 'from-emerald-500 to-teal-500' },
        { id: 'mersin', name: 'Mersin', icon: <Mountain className="w-6 h-6" />, description: 'Coastal Mediterranean city', color: 'from-purple-500 to-indigo-500' },
        { id: 'bali', name: 'Bali', icon: <TreePine className="w-6 h-6" />, description: 'Island of Gods paradise', color: 'from-green-500 to-emerald-500' }
      ]
    },
    2: {
      title: "What type of property interests you?",
      subtitle: "Select your ideal property type",
      options: [
        { id: 'apartment', name: 'Apartment', icon: <Building className="w-6 h-6" />, description: 'Modern city living', color: 'from-blue-500 to-purple-500' },
        { id: 'villa', name: 'Villa', icon: <Home className="w-6 h-6" />, description: 'Luxury private residence', color: 'from-green-500 to-blue-500' },
        { id: 'penthouse', name: 'Penthouse', icon: <Star className="w-6 h-6" />, description: 'Premium top-floor luxury', color: 'from-amber-500 to-red-500' },
        { id: 'commercial', name: 'Commercial', icon: <Building className="w-6 h-6" />, description: 'Investment properties', color: 'from-indigo-500 to-purple-500' }
      ]
    },
    3: {
      title: "What's your investment budget?",
      subtitle: "Choose your price range",
      options: [
        { id: '0-100k', name: '$0 - $100K', icon: <DollarSign className="w-6 h-6" />, description: 'Starter investment', color: 'from-teal-500 to-green-500' },
        { id: '100k-250k', name: '$100K - $250K', icon: <DollarSign className="w-6 h-6" />, description: 'Entry level investment', color: 'from-green-500 to-emerald-500' },
        { id: '250k-500k', name: '$250K - $500K', icon: <DollarSign className="w-6 h-6" />, description: 'Mid-range properties', color: 'from-blue-500 to-cyan-500' },
        { id: '500k-1m', name: '$500K - $1M', icon: <DollarSign className="w-6 h-6" />, description: 'Premium investments', color: 'from-purple-500 to-pink-500' },
        { id: '1m+', name: '$1M+', icon: <DollarSign className="w-6 h-6" />, description: 'Luxury portfolio', color: 'from-amber-500 to-orange-500' }
      ]
    },
    4: {
      title: "What features are important to you?",
      subtitle: "Select all that apply",
      multiSelect: true,
      options: [
        { id: 'sea-view', name: 'Sea View', icon: <Waves className="w-6 h-6" />, description: 'Ocean or sea views', color: 'from-blue-500 to-cyan-500' },
        { id: 'pool', name: 'Swimming Pool', icon: <Waves className="w-6 h-6" />, description: 'Private or shared pool', color: 'from-teal-500 to-blue-500' },
        { id: 'gym', name: 'Fitness Center', icon: <Users className="w-6 h-6" />, description: 'On-site gym facilities', color: 'from-red-500 to-pink-500' },
        { id: 'parking', name: 'Parking', icon: <MapPin className="w-6 h-6" />, description: 'Dedicated parking space', color: 'from-gray-500 to-slate-500' },
        { id: 'security', name: '24/7 Security', icon: <Users className="w-6 h-6" />, description: 'Round-the-clock security', color: 'from-orange-500 to-red-500' },
        { id: 'balcony', name: 'Balcony/Terrace', icon: <Home className="w-6 h-6" />, description: 'Outdoor living space', color: 'from-green-500 to-teal-500' }
      ]
    },
    5: {
      title: "Almost there! Let's get in touch",
      subtitle: "Please provide your contact information so we can assist you better",
      isContactForm: true
    }
  };

  const currentStepData = steps[currentStep];

  const handleOptionSelect = (optionId: string) => {
    if (currentStep === 4) {
      // Multi-select for features
      setSelections(prev => ({
        ...prev,
        features: prev.features.includes(optionId) 
          ? prev.features.filter(f => f !== optionId)
          : [...prev.features, optionId]
      }));
    } else {
      // Single select for other steps
      const stepKey = currentStep === 1 ? 'location' : 
                     currentStep === 2 ? 'propertyType' : 'budget';
      
      setSelections(prev => ({
        ...prev,
        [stepKey]: optionId
      }));
    }
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setSelections(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return selections.location !== '';
      case 2: return selections.propertyType !== '';
      case 3: return selections.budget !== '';
      case 4: return selections.features.length > 0;
      case 5: return selections.contactInfo.name !== '' && 
                     selections.contactInfo.email !== '' && 
                     selections.contactInfo.phone !== '';
      default: return false;
    }
  };

  const handleFindProperties = async () => {
    try {
      // Send email notification with all selections
      const emailResponse = await supabase.functions.invoke('send-contact-notification', {
        body: {
          name: selections.contactInfo.name,
          email: selections.contactInfo.email,
          phone: selections.contactInfo.phone,
          source: 'property-wizard',
          selections: {
            location: selections.location,
            propertyType: selections.propertyType,
            budget: selections.budget,
            features: selections.features
          }
        }
      });

      if (emailResponse.error) {
        console.error('Email notification error:', emailResponse.error);
        toast({
          title: "Note",
          description: "Your preferences have been saved, but we couldn't send a notification email.",
          variant: "default",
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    // Navigate to thank you page
    navigate('/wizard-thank-you');
  };

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelections({
      location: '',
      propertyType: '',
      budget: '',
      features: [],
      contactInfo: {
        name: '',
        email: '',
        phone: ''
      }
    });
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Perfect Match Found!
            </h1>
            <p className="text-xl text-muted-foreground">
              Based on your preferences, we've identified the ideal properties for you
            </p>
          </div>

          <div>
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20 mb-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-foreground mb-6">Your Preferences Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">Location:</span>
                        <span className="ml-2 text-muted-foreground capitalize">{selections.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">Property Type:</span>
                        <span className="ml-2 text-muted-foreground capitalize">{selections.propertyType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">Budget:</span>
                        <span className="ml-2 text-muted-foreground">{selections.budget}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Features:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selections.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="capitalize">
                              {feature.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleFindProperties}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold px-8 py-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                Find Properties
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={resetWizard}
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-xl border-2 border-primary/20 hover:border-primary/40"
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Let us help you discover the ideal investment opportunity
          </p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(getStepProgress())}% Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div key={currentStep} className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {currentStepData.subtitle}
              </p>
            </div>

            {currentStep === 5 ? (
              <div className="max-w-2xl mx-auto">
                <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary mb-4">
                          <User className="w-6 h-6" />
                          <h3 className="text-xl font-semibold">Personal Information</h3>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={selections.contactInfo.name}
                            onChange={(e) => handleContactInfoChange('name', e.target.value)}
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={selections.contactInfo.email}
                            onChange={(e) => handleContactInfoChange('email', e.target.value)}
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={selections.contactInfo.phone}
                            onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                            className="bg-background border-border"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="text-center">
                          <Mail className="w-16 h-16 mx-auto text-primary/40 mb-4" />
                          <h4 className="text-lg font-semibold text-foreground mb-2">
                            Why do we need this?
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            We'll use your contact information to send you personalized property recommendations and schedule consultations.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          <span>No spam, we promise</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          <span>Personalized recommendations</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          <span>Priority access to new properties</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentStepData.options?.map((option, index) => {
                  const isSelected = currentStep === 4 
                    ? selections.features.includes(option.id)
                    : selections[currentStep === 1 ? 'location' : currentStep === 2 ? 'propertyType' : 'budget'] === option.id;

                  return (
                    <div
                      key={option.id}
                      className="relative group"
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 overflow-hidden border-2 ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-glow' 
                            : 'border-border hover:border-primary/50 hover:shadow-elegant'
                        }`}
                        onClick={() => handleOptionSelect(option.id)}
                      >
                        <CardContent className="p-6 relative">
                          <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-white shadow-lg`}>
                                {option.icon}
                              </div>
                              {isSelected && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground mb-2">
                              {option.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl border-2 border-primary/20 hover:border-primary/40 disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i + 1 === currentStep
                    ? 'bg-primary scale-125'
                    : i + 1 < currentStep
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {currentStep === totalSteps ? 'Get Results' : 'Next'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertyWizardComponent);
