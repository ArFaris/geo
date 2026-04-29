import { NextRequest, NextResponse } from 'next/server';
import { getSignedPdfUrl } from '@/lib/services/yandexStorage';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path required' }, { status: 400 });
  }

  try {
    const signedUrl = await getSignedPdfUrl(path, 60);
    
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('Yandex Storage error:', error);
    return NextResponse.json(
      { error: 'Failed to get PDF' },
      { status: 500 }
    );
  }
}
