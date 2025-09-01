import { supabase } from '@/integrations/supabase/client';

export const findPropertyLocationByRefNo = async (refNo: string): Promise<string> => {
  // First check Supabase database
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('location')
      .eq('ref_no', refNo)
      .maybeSingle();
    
    if (!error && data?.location) {
      const location = data.location.toLowerCase();
      if (location.includes('dubai')) return '/dubai';
      if (location.includes('antalya')) return '/antalya';
      if (location.includes('cyprus')) return '/cyprus';
      if (location.includes('mersin')) return '/mersin';
      
    }
  } catch (error) {
    console.log('Database lookup failed, falling back to static data');
  }
  
  // Fallback to number-based routing
  const refNumber = parseInt(refNo);
  if ((refNumber >= 1000 && refNumber <= 2999) || (refNumber >= 10000 && refNumber <= 29999)) {
    return '/dubai';
  } else if (refNumber >= 3000 && refNumber <= 4999) {
    return '/antalya';
  } else if (refNumber >= 5000 && refNumber <= 5999) {
    return '/cyprus';
  } else if (refNumber >= 6000 && refNumber <= 6999) {
    return '/mersin';
  }
  
  // For numbers outside expected ranges, default to Antalya
  return '/antalya';
};