import { createClient as createServerClient } from '@/lib/supabase/server';

export const getPdfUrl = async (pdfPath: string): Promise<string | null> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.storage
    .from('articles')
    .createSignedUrl(pdfPath, 60);

  if (error) {
    console.error('Supabase error:', error);
    return null;
  }

  return data?.signedUrl || null;
};
