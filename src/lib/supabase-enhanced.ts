// Enhanced Supabase client with UAE connectivity optimizations
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://kiogiyemoqbnuvclneoe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI";

// Connection state management
let connectionState = {
  isOnline: true,
  lastSuccessfulConnection: Date.now(),
  failureCount: 0,
  isBlocked: false
};

// Enhanced Supabase client with retry and timeout configurations
export const enhancedSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'x-client-info': 'uae-resilient-client',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Connection health checker
export const checkConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const { data, error } = await enhancedSupabase
      .from('properties')
      .select('id')
      .limit(1);
    
    clearTimeout(timeoutId);
    
    if (!error) {
      connectionState.isOnline = true;
      connectionState.lastSuccessfulConnection = Date.now();
      connectionState.failureCount = 0;
      connectionState.isBlocked = false;
      return true;
    }
    
    throw error;
  } catch (error: any) {
    connectionState.isOnline = false;
    connectionState.failureCount++;
    
    if (error.message?.includes('network') || error.message?.includes('timeout') || error.name === 'AbortError') {
      connectionState.isBlocked = connectionState.failureCount > 3;
    }
    
    return false;
  }
};

// Enhanced query wrapper with retry logic
export const resilientQuery = async <T>(
  queryFn: () => Promise<T>,
  maxRetries = 3,
  backoffMs = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        queryFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 15000)
        )
      ]);
      
      // Reset failure count on success
      connectionState.failureCount = 0;
      connectionState.isOnline = true;
      connectionState.lastSuccessfulConnection = Date.now();
      
      return result as T;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.message?.includes('400') || error.message?.includes('401') || error.message?.includes('403')) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delay = backoffMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  connectionState.failureCount++;
  throw lastError;
};

// Get connection state
export const getConnectionState = () => ({ ...connectionState });

// Manual connection reset
export const resetConnection = () => {
  connectionState = {
    isOnline: true,
    lastSuccessfulConnection: Date.now(),
    failureCount: 0,
    isBlocked: false
  };
};

// Fallback data for offline mode (matching database structure)
export const fallbackPropertyData = [
  {
    id: 'offline-1',
    title: 'Sample Property - Available When Connected',
    location: 'Antalya, Turkey',
    price: '€350,000',
    bedrooms: '2',
    bathrooms: '2',
    sizes_m2: '120',
    property_image: '/placeholder.svg',
    property_images: ['/placeholder.svg'],
    property_facilities: ['Sample Feature'],
    description: 'This is sample data shown when offline. Please check your connection to view real properties.',
    ref_no: 'OFFLINE001',
    property_type: 'Apartment',
    status: 'available',
    is_active: true,
    agent_id: null,
    agent_name: null,
    agent_phone_number: null,
    amenities: [],
    apartment_types: null,
    building_complete_date: null,
    cities: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    delivery_date: null,
    developer: null,
    distance_to_airport_km: null,
    distance_to_beach_km: null,
    down_payment_from: null,
    featured: false,
    interest_rates: null,
    investment_value: null,
    max_installments: null,
    region: null,
    slug: 'offline-sample',
    starting_price_eur: '€350,000',
    tags: []
  }
];