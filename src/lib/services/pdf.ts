import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPdfUrl = async (pdfPath: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('articles')
    .createSignedUrl(pdfPath, 60);

  if (error) {
    console.error('Supabase error:', error);
    return null;
  }

  return data?.signedUrl;
};