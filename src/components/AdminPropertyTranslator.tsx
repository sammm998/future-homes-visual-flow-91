import { useState } from 'react';
import { supabase } from '@/integrations/legacy/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { translateSavedProperty, PROPERTY_TRANSLATION_LANGUAGES } from '@/lib/translateSavedProperty';
import { isCompletePropertyTranslation } from '@/lib/propertyTranslationRules';

const AdminPropertyTranslator = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [stats, setStats] = useState<{
    translations_saved: number;
    errors: number;
    properties_processed: number;
  } | null>(null);

  const runTranslation = async (force = false) => {
    setLoading(true);
    setStats(null);
    setProgress(null);

    try {
      // Get all active property IDs
      const { data: allProps, error: fetchError } = await supabase
        .from('properties')
        .select('id,title,description,location')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (!allProps || allProps.length === 0) {
        toast.error('Inga fastigheter hittades');
        setLoading(false);
        return;
      }

      const allIds = allProps.map((p) => p.id);
      const total = allIds.length;
      let totalSaved = 0;
      let totalErrors = 0;
      let totalProcessed = 0;

      {
        // Only properties still missing a language; translated & saved one by one.
        const rows: Array<{property_id: string; language_code: string; title: string | null; description: string | null; location: string | null}> = [];
        for (let from = 0; ; from += 500) {
          const { data: page, error } = await supabase.from('property_translations')
            .select('property_id,language_code,title,description,location')
            .order('id').range(from, from + 499);
          if (error) throw error;
          rows.push(...(page ?? []));
          if (!page || page.length < 500) break;
        }
        const sources = new Map(allProps.map(p => [p.id, p]));
        const completed = new Map<string, Set<string>>();
        for (const r of rows) {
          if (!PROPERTY_TRANSLATION_LANGUAGES.some(code => code === r.language_code) || !isCompletePropertyTranslation(r, sources.get(r.property_id))) continue;
          const languages = completed.get(r.property_id) ?? new Set<string>();
          languages.add(r.language_code);
          completed.set(r.property_id, languages);
        }
        const doneCount = new Map([...completed].map(([id, languages]) => [id, languages.size]));
        const todo = allIds.filter(id => force || (doneCount.get(id) || 0) < PROPERTY_TRANSLATION_LANGUAGES.length);
        for (let i = 0; i < todo.length; i++) {
          setProgress({ done: i, total: todo.length });
          const before = doneCount.get(todo[i]) || 0;
          try {
            const after = await translateSavedProperty(todo[i], () => {}, supabase, force);
            totalSaved += force ? after : after - before;
            totalProcessed++;
          } catch (e: any) {
            totalErrors++;
            toast.error(e.message);
            setStats({ translations_saved: totalSaved, errors: totalErrors, properties_processed: totalProcessed });
            return; // Every failure ends this run; never continue billing after a denial.
          }
        }
        setProgress({ done: todo.length, total: todo.length });
        setStats({ translations_saved: totalSaved, errors: totalErrors, properties_processed: totalProcessed });
        toast.success(`Översatte ${totalSaved} texter för ${totalProcessed} fastigheter`);
        return;
      }

    } catch (e: any) {
      console.error('Translation error:', e);
      toast.error(`Fel: ${e.message || 'Okänt fel'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Översätt fastigheter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Översätter titel, plats och beskrivning för alla aktiva fastigheter
          till 12 språk (sv, tr, ar, ru, no, da, fa, ur, de, fr, es, id) via
          Lovable AI. Sparade engelska kopior och ofullständiga översättningar rättas också.
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => runTranslation(false)}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Languages className="h-4 w-4" />
            )}
            Översätt nya (hoppar över befintliga)
          </Button>
          <Button
            onClick={() => runTranslation(true)}
            disabled={loading}
            variant="outline"
          >
            Tvinga omöversättning
          </Button>
        </div>

        {progress && (
          <div className="text-sm">
            <div className="font-medium mb-1">
              Framsteg: {progress.done} / {progress.total} fastigheter
            </div>
            <div className="h-2 bg-muted rounded-sm overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <div className="text-2xl font-bold">{stats.properties_processed}</div>
              <div className="text-xs text-muted-foreground">Fastigheter</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats.translations_saved}
              </div>
              <div className="text-xs text-muted-foreground">Översättningar</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {stats.errors}
              </div>
              <div className="text-xs text-muted-foreground">Fel</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPropertyTranslator;
