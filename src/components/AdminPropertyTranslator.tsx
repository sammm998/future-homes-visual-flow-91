import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminPropertyTranslator = () => {
  const [loading, setLoading] = useState(false);
  const [batchSize, setBatchSize] = useState(3);
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
        .select('id')
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

      // Process in batches
      for (let i = 0; i < allIds.length; i += batchSize) {
        const batch = allIds.slice(i, i + batchSize);
        setProgress({ done: i, total });

        const { data, error } = await supabase.functions.invoke(
          'translate-properties',
          {
            body: {
              property_ids: batch,
              force,
            },
          },
        );

        if (error) {
          console.error('Batch error:', error);
          totalErrors += batch.length;
        } else if (data) {
          totalSaved += data.translations_saved || 0;
          totalErrors += data.errors || 0;
          totalProcessed += data.properties_processed || 0;
        }
      }

      setProgress({ done: total, total });
      setStats({
        translations_saved: totalSaved,
        errors: totalErrors,
        properties_processed: totalProcessed,
      });
      toast.success(
        `Översatte ${totalSaved} texter för ${totalProcessed} fastigheter`,
      );
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
          till 12 språk (sv, tr, ar, ru, no, da, fa, ur, de, fr, es, nl) via
          Lovable AI. Befintliga översättningar hoppas över.
        </p>

        <div className="space-y-2">
          <Label htmlFor="batch-size">Batchstorlek (fastigheter per anrop)</Label>
          <Input
            id="batch-size"
            type="number"
            min={1}
            max={10}
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value) || 3)}
            disabled={loading}
            className="w-32"
          />
        </div>

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
            <div className="h-2 bg-muted rounded overflow-hidden">
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
