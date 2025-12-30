import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for production authentication
 * Only used when deployed to Vercel (not in Manus development environment)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if we're running in production (Vercel) or development (Manus)
 */
export function isProductionEnvironment(): boolean {
  // Check if we're on Vercel
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

/**
 * Verify Supabase JWT token and get user
 */
export async function verifySupabaseToken(token: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0],
    };
  } catch (error) {
    console.error('[Supabase Auth] Error verifying token:', error);
    return null;
  }
}
