import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (client) {
    console.log('Reusing existing client');
    return client;
  }
  
  console.log('Creating NEW client');
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
          auth: {
              detectSessionInUrl: false,
              flowType: 'pkce',
          },
      }
  );
  
  return client;
};
