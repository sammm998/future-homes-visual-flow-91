import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Users, Linkedin, Mail, Phone } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string | null;
  image_url?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  phone?: string | null;
}

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
        if (error) throw error;
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-background cinematic-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-muted animate-pulse rounded-sm mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-sm mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-md p-6 animate-pulse border border-border/60">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-6 w-32 bg-muted rounded-sm mx-auto mb-2" />
                <div className="h-4 w-24 bg-muted rounded-sm mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-background cinematic-section">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="section-kicker cinematic-rule mb-5">Future Homes</span>
          <div className="flex items-center justify-center gap-3 mb-5">
            <Users className="w-7 h-7 text-primary" />
            <h2 className="text-4xl md:text-6xl font-bold text-foreground">
              {t('home.meet_team')} <span className="text-primary">{t('home.team')}</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t('home.meet_team_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div key={member.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group">
               <div className="bg-card rounded-md p-6 cinematic-card border border-border/70">
                <div className="relative mb-6">
                  {member.image_url ? (
                    <img src={getOptimizedImageUrl(member.image_url, 192)} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all" loading="lazy" decoding="async" width={96} height={96} />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors notranslate" translate="no">{member.name}</h3>
                  <p className="text-primary font-medium mb-3 notranslate" translate="no">{member.position}</p>
                  {member.bio && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{member.bio}</p>}
                   <div className="flex justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                     {member.linkedin_url && <a aria-label={`LinkedIn — ${member.name}`} href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"><Linkedin className="w-4 h-4" /></a>}
                     {member.email && <a aria-label={`Email — ${member.name}`} href={`mailto:${member.email}`} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"><Mail className="w-4 h-4" /></a>}
                     {member.phone && <a aria-label={`Phone — ${member.name}`} href={`tel:${member.phone}`} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"><Phone className="w-4 h-4" /></a>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
