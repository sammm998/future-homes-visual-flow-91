
import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, MapPin, DollarSign, Users, Building, Waves, Mountain, TreePine, Palmtree, Check, ArrowRight, ArrowLeft, Star, User, Mail, Phone, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';


const PropertyWizardComponent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  // Step data
  const steps: any = {
    1: {
      title: t('wizard.s1_title'),
      subtitle: t('wizard.s1_sub'),
      options: [
        { id: 'antalya', name: t('wizard.loc_antalya'), icon: <Palmtree className="w-6 h-6" />, description: t('wizard.loc_antalya_d'), color: 'from-blue-500 to-cyan-500' },
        { id: 'istanbul', name: t('wizard.loc_istanbul'), icon: <Building className="w-6 h-6" />, description: t('wizard.loc_istanbul_d'), color: 'from-rose-500 to-red-500' },
        { id: 'dubai', name: t('wizard.loc_dubai'), icon: <Building className="w-6 h-6" />, description: t('wizard.loc_dubai_d'), color: 'from-amber-500 to-orange-500' },
        { id: 'cyprus', name: t('wizard.loc_cyprus'), icon: <Waves className="w-6 h-6" />, description: t('wizard.loc_cyprus_d'), color: 'from-emerald-500 to-teal-500' },
        { id: 'mersin', name: t('wizard.loc_mersin'), icon: <Mountain className="w-6 h-6" />, description: t('wizard.loc_mersin_d'), color: 'from-purple-500 to-indigo-500' },
        { id: 'bali', name: t('wizard.loc_bali'), icon: <TreePine className="w-6 h-6" />, description: t('wizard.loc_bali_d'), color: 'from-green-500 to-emerald-500' }
      ]
    },
    2: {
      title: t('wizard.s2_title'),
      subtitle: t('wizard.s2_sub'),
      options: [
        { id: 'apartment', name: t('wizard.pt_apartment'), icon: <Building className="w-6 h-6" />, description: t('wizard.pt_apartment_d'), color: 'from-blue-500 to-purple-500' },
        { id: 'villa', name: t('wizard.pt_villa'), icon: <Home className="w-6 h-6" />, description: t('wizard.pt_villa_d'), color: 'from-green-500 to-blue-500' },
        { id: 'penthouse', name: t('wizard.pt_penthouse'), icon: <Star className="w-6 h-6" />, description: t('wizard.pt_penthouse_d'), color: 'from-amber-500 to-red-500' },
        { id: 'commercial', name: t('wizard.pt_commercial'), icon: <Building className="w-6 h-6" />, description: t('wizard.pt_commercial_d'), color: 'from-indigo-500 to-purple-500' }
      ]
    },
    3: {
      title: t('wizard.s3_title'),
      subtitle: t('wizard.s3_sub'),
      options: [
        { id: '0-100k', name: '$0 - $100K', icon: <DollarSign className="w-6 h-6" />, description: t('wizard.b_starter'), color: 'from-teal-500 to-green-500' },
        { id: '100k-250k', name: '$100K - $250K', icon: <DollarSign className="w-6 h-6" />, description: t('wizard.b_entry'), color: 'from-green-500 to-emerald-500' },
        { id: '250k-500k', name: '$250K - $500K', icon: <DollarSign className="w-6 h-6" />, description: t('wizard.b_mid'), color: 'from-blue-500 to-cyan-500' },
        { id: '500k-1m', name: '$500K - $1M', icon: <DollarSign className="w-6 h-6" />, description: t('wizard.b_premium'), color: 'from-purple-500 to-pink-500' },
        { id: '1m+', name: '$1M+', icon: <DollarSign className="w-6 h-6" />, description: t('wizard.b_luxury'), color: 'from-amber-500 to-orange-500' }
      ]
    },
    4: {
      title: t('wizard.s4_title'),
      subtitle: t('wizard.s4_sub'),
      multiSelect: true,
      options: [
        { id: 'sea-view', name: t('wizard.f_sea'), icon: <Waves className="w-6 h-6" />, description: t('wizard.f_sea_d'), color: 'from-blue-500 to-cyan-500' },
        { id: 'pool', name: t('wizard.f_pool'), icon: <Waves className="w-6 h-6" />, description: t('wizard.f_pool_d'), color: 'from-teal-500 to-blue-500' },
        { id: 'gym', name: t('wizard.f_gym'), icon: <Users className="w-6 h-6" />, description: t('wizard.f_gym_d'), color: 'from-red-500 to-pink-500' },
        { id: 'parking', name: t('wizard.f_parking'), icon: <MapPin className="w-6 h-6" />, description: t('wizard.f_parking_d'), color: 'from-gray-500 to-slate-500' },
        { id: 'security', name: t('wizard.f_security'), icon: <Users className="w-6 h-6" />, description: t('wizard.f_security_d'), color: 'from-orange-500 to-red-500' },
        { id: 'balcony', name: t('wizard.f_balcony'), icon: <Home className="w-6 h-6" />, description: t('wizard.f_balcony_d'), color: 'from-green-500 to-teal-500' }
      ]
    },
    5: {
      title: t('wizard.s5_title'),
      subtitle: t('wizard.s5_sub'),
      isContactForm: true
    }
  };

  const currentStepData = steps[currentStep];

  const handleOptionSelect = (optionId: string) => {
    if (currentStep === 4) {
      setSelections(prev => ({
        ...prev,
        features: prev.features.includes(optionId) 
          ? prev.features.filter(f => f !== optionId)
          : [...prev.features, optionId]
      }));
    } else {
      const stepKey = currentStep === 1 ? 'location' : 
                     currentStep === 2 ? 'propertyType' : 'budget';
      setSelections(prev => ({ ...prev, [stepKey]: optionId }));
    }
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setSelections(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  };

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return;
    }
    if (isSubmitting) return;
    await handleFindProperties();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
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
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-notification', {
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

      if (error || data?.success === false) {
        const messageFromApi = (data as any)?.error?.message as string | undefined;
        console.warn('Email notification failed:', error ?? data);
        toast({
          title: "Notis",
          description: messageFromApi?.includes("Too many requests")
            ? "För många försök på kort tid. Vi sparade dina val, men kunde inte skicka e-post just nu."
            : "Vi sparade dina val, men kunde inte skicka e-post just nu.",
          variant: "default",
        });
      }
    } catch (emailError) {
      console.warn('Failed to send email notification:', emailError);
    }

    navigate('/wizard-thank-you');
  };

  const getStepProgress = () => (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('wizard.find_perfect')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t('wizard.help_discover')}
          </p>
          
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{t('wizard.step')} {currentStep} {t('wizard.of')} {totalSteps}</span>
              <span>{Math.round(getStepProgress())}% {t('wizard.complete')}</span>
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
                          <h3 className="text-xl font-semibold">{t('wizard.personal_info')}</h3>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground">{t('wizard.full_name')}</Label>
                          <Input
                            id="name"
                            placeholder={t('wizard.full_name_ph')}
                            value={selections.contactInfo.name}
                            onChange={(e) => handleContactInfoChange('name', e.target.value)}
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground">{t('wizard.email')}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t('wizard.email_ph')}
                            value={selections.contactInfo.email}
                            onChange={(e) => handleContactInfoChange('email', e.target.value)}
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-foreground">{t('wizard.phone')}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t('wizard.phone_ph')}
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
                            {t('wizard.why_need')}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {t('wizard.why_desc')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{t('wizard.no_spam')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{t('wizard.personalized')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{t('wizard.priority')}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentStepData.options?.map((option: any) => {
                  const isSelected = currentStep === 4 
                    ? selections.features.includes(option.id)
                    : selections[currentStep === 1 ? 'location' : currentStep === 2 ? 'propertyType' : 'budget'] === option.id;

                  return (
                    <div key={option.id} className="relative group">
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
            {t('wizard.previous')}
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
            disabled={!isStepValid() || isSubmitting}
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                {t('wizard.sending')}
                <Loader2 className="ml-2 w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                {currentStep === totalSteps ? t('wizard.get_results') : t('wizard.next')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertyWizardComponent);
