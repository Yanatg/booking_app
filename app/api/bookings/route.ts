import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET endpoint to retrieve bookings
export async function GET(req: NextRequest) {
  try {
    // Get user_id from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    console.log("userId:", userId);

    // Fetch bookings for the given user_id
    const bookings = await prisma.bookings.findMany({
      where: { user_id: userId },
    });

    return NextResponse.json({ data: bookings, status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}