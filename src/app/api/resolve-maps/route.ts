import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

  try {
    // We use a GET request to ensure we trigger the redirect fully
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
    return NextResponse.json({ resolvedUrl: response.url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve URL' }, { status: 500 });
  }
}
