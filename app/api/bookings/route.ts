import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Helper function to calculate total payment
const calculateTotalPayment = (startDate: string, endDate: string, pricePerNight: number) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return numberOfDays * pricePerNight;
};

// GET endpoint to retrieve bookings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    const bookings = await prisma.bookings.findMany({
      where: { user_id: userId },
      include: {
        accommodations: true,
      },
    });

    return NextResponse.json({ data: bookings, status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST endpoint to handle payments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_id, amount } = body;

    // Validate required fields
    if (!booking_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await prisma.bookings.findUnique({
      where: { id: booking_id },
      include: { accommodations: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Calculate expected payment amount
    const expectedAmount = calculateTotalPayment(
      booking.start_date.toISOString(),
      booking.end_date.toISOString(),
      booking.accommodations?.price_per_night ? Number(booking.accommodations.price_per_night) : 0
    );

    // Verify payment amount
    if (Number(amount) !== expectedAmount) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payments.create({
      data: {
        id: uuidv4(),
        booking_id,
        amount: amount,
        status: 'Completed',
        payment_date: new Date(),
      },
    });

    // Update booking status
    await prisma.bookings.update({
      where: { id: booking_id },
      data: { status: 'Paid' },
    });

    return NextResponse.json({
      data: {
        payment_id: payment.id,
        status: 'success',
        message: 'Payment processed successfully'
      },
      status: 200
    });

  } catch (error: any) {
    console.error('Error processing payment:', error.message);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}