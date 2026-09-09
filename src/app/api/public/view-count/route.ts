import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const BASE_COUNT = 100000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldIncrement = searchParams.get('increment') === 'true';

    const docRef = adminDb.collection('site_stats').doc('views');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      const initialCount = shouldIncrement ? 1 : 0;
      await docRef.set({
        base: BASE_COUNT,
        count: initialCount,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return NextResponse.json({
        success: true,
        count: BASE_COUNT + initialCount,
        base: BASE_COUNT,
      });
    }

    if (shouldIncrement) {
      await docRef.update({
        count: FieldValue.increment(1),
        updated_at: new Date(),
      });
      const updatedSnap = await docRef.get();
      const currentCount = updatedSnap.data()?.count || 0;
      return NextResponse.json({
        success: true,
        count: BASE_COUNT + currentCount,
        base: BASE_COUNT,
      });
    }

    const currentCount = docSnap.data()?.count || 0;
    return NextResponse.json({
      success: true,
      count: BASE_COUNT + currentCount,
      base: BASE_COUNT,
    });
  } catch (error: any) {
    console.error('[View Count API] Error:', error);
    // Graceful fallback to guarantee 100,000 baseline even if DB is temporarily unreachable
    return NextResponse.json({
      success: true,
      count: BASE_COUNT,
      base: BASE_COUNT,
      fallback: true,
    });
  }
}

export async function POST() {
  try {
    const docRef = adminDb.collection('site_stats').doc('views');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      await docRef.set({
        base: BASE_COUNT,
        count: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return NextResponse.json({
        success: true,
        count: BASE_COUNT + 1,
        base: BASE_COUNT,
      });
    }

    await docRef.update({
      count: FieldValue.increment(1),
      updated_at: new Date(),
    });

    const updatedSnap = await docRef.get();
    const currentCount = updatedSnap.data()?.count || 0;

    return NextResponse.json({
      success: true,
      count: BASE_COUNT + currentCount,
      base: BASE_COUNT,
    });
  } catch (error: any) {
    console.error('[View Count API POST] Error:', error);
    return NextResponse.json({
      success: true,
      count: BASE_COUNT + 1,
      base: BASE_COUNT,
      fallback: true,
    });
  }
}
