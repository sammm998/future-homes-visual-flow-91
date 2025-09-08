import { supabase } from '@/integrations/supabase/client';

export const findPropertyLocationByRefNo = async (refNo: string): Promise<string> => {
  // Database lookup only - no more static data fallback
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('location')
      .eq('ref_no', refNo)
      .eq('is_active', true)
      .maybeSingle();
    
    if (!error && data?.location) {
      const location = data.location.toLowerCase();
      if (location.includes('dubai')) return '/dubai';
      if (location.includes('antalya')) return '/antalya';
      if (location.includes('cyprus')) return '/cyprus';
      if (location.includes('mersin')) return '/mersin';
      if (location.includes('bali')) return '/bali';
    }
  } catch (error) {
    console.error('Database lookup failed:', error);
  }
  
  // Fallback to number-based routing only if database lookup fails
  const refNumber = parseInt(refNo);
  if ((refNumber >= 1000 && refNumber <= 2999) || (refNumber >= 10000 && refNumber <= 29999)) {
    return '/dubai';
  } else if (refNumber >= 3000 && refNumber <= 4999) {
    return '/antalya';
  } else if (refNumber >= 5000 && refNumber <= 5999) {
    return '/cyprus';
  } else if (refNumber >= 6000 && refNumber <= 6999) {
    return '/mersin';
  } else if (refNumber >= 8000 && refNumber <= 8999) {
    return '/bali';
  }
  
  // Default to Antalya for unknown ranges
  return '/antalya';
};