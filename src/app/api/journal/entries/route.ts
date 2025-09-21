import { NextRequest, NextResponse } from 'next/server';
import { JournalEntry } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // In a real application, you would fetch from your database
    // For now, we'll return mock data or check localStorage

    // Example database query (replace with your actual database logic):
    // const entries = await db.journalEntries.findMany({
    //   where: {
    //     userId: userId, // from authentication
    //     createdAt: {
    //       gte: new Date(date + 'T00:00:00.000Z'),
    //       lt: new Date(date + 'T23:59:59.999Z')
    //     }
    //   },
    //   orderBy: { createdAt: 'asc' }
    // });

    // Mock response for development
    const entries: JournalEntry[] = [];

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}
