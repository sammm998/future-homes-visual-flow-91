import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import aliKaranImage from "@/assets/ali-karan-founder.webp";

interface HomeConciergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HomeConciergeDialog({ open, onOpenChange }: HomeConciergeDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden border-0 bg-ivory p-0 text-left shadow-[var(--shadow-luxe)] sm:rounded-sm">
        <div className="h-1.5 bg-gold" />
        <div className="px-7 pb-8 pt-9 sm:px-10 sm:pb-10">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gold bg-background p-1">
                <img src={aliKaranImage} alt="Ali Karan - Property Expert" width={80} height={80} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <div><p className="text-[10px] font-bold uppercase text-gold">Future Homes Concierge</p><p className="mt-1 text-sm font-semibold text-navy">Ali Karan</p><p className="text-xs text-navy/55">International Property Advisor</p></div>
            </div>
            <DialogTitle className="pt-3 font-serif text-3xl font-semibold leading-tight text-navy sm:text-4xl">
              {t('home.find_property')}
            </DialogTitle>
            <p className="max-w-md text-base leading-7 text-navy/65">{t('home.find_property_subtitle')}</p>
          </DialogHeader>
          <div className="mt-7 space-y-5">
            <Button onClick={() => { onOpenChange(false); window.location.href = '/property-wizard'; }} className="h-14 w-full justify-between rounded-sm bg-navy px-5 text-navy-foreground hover:bg-gold hover:text-gold-foreground">
              <span>{t('home.start_journey')}</span><ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-navy/55"><span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold"/>Türkiye · Dubai · Bali</span><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-gold"/>Private guidance</span></div>
            <button onClick={() => onOpenChange(false)} className="text-xs text-navy/50 underline decoration-gold/60 underline-offset-4 transition-colors hover:text-navy">
              {t('home.maybe_later')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}