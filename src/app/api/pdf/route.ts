import { NextRequest, NextResponse } from 'next/server';
import { getSignedPdfUrl } from '@/lib/services/yandexStorage';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  const shouldDownload = searchParams.get('download') === 'true';
  
  if (!path) {
    return NextResponse.json({ error: 'Path required' }, { status: 400 });
  }

  if (shouldDownload) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const signedUrl = await getSignedPdfUrl(path, 60);
    
    if (shouldDownload) {
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || 'application/pdf';
      
      return new NextResponse(blob, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${path.split('/').pop()}"`,
        },
      });
    }

    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('Yandex Storage error:', error);
    return NextResponse.json(
      { error: 'Failed to get PDF' },
      { status: 500 }
    );
  }
}
