import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Request body:', body); // Log the request body for debugging
    const { user_id, accommodation_id, start_date, end_date, status } = body;

    if (!user_id || !accommodation_id || !start_date || !end_date || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBooking = await prisma.bookings.create({
      data: {
        id: uuidv4(),
        user_id,
        accommodation_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        status,
      },
    });

    return NextResponse.json({ data: newBooking, status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// GET endpoint to retrieve all accommodations
export async function GET(req: NextRequest) {
  try {
    const accommodations = await prisma.accommodations.findMany();
    console.log("accommodations", accommodations);
    return NextResponse.json({ data: accommodations, status: 200 });
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return NextResponse.json({ error: 'Failed to fetch accommodations' }, { status: 500 });
  }
}