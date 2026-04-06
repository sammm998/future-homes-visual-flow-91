import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import aliKaranImage from "@/assets/ali-karan-founder.png";
import { useTranslation } from "@/hooks/useTranslation";

export default function FounderSection() {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('home.meet_founder')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('home.meet_founder_subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
          <Card className="overflow-hidden max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary-glow/10">
                {!imageError ? (
                  <img src={aliKaranImage} alt="Ali Karan - Founder and CEO" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={() => setImageError(true)} />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-24 h-24 text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold text-foreground notranslate" translate="no">Ali Karan</p>
                      <p className="text-muted-foreground">{t('home.founder_ceo')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2 notranslate" translate="no">Ali Karan</h3>
                    <p className="text-lg text-primary font-semibold mb-4">{t('home.founder_ceo')}</p>
                    <p className="text-muted-foreground leading-relaxed">{t('home.founder_bio')}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground">6 Years</p>
                      <p className="text-xs text-muted-foreground">{t('home.years_experience')}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground">1000+</p>
                      <p className="text-xs text-muted-foreground">{t('home.happy_clients')}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground">4</p>
                      <p className="text-xs text-muted-foreground">{t('home.countries')}</p>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to="/ali-karan" className="inline-flex items-center gap-2">
                      {t('home.learn_more_ali')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
