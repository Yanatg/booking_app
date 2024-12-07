import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract fields
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const price_per_night = parseInt(formData.get('price_per_night') as string);
    const imageFile = formData.get('image') as File;

    // Check if the image file is valid
    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    // Define the path to save the image
    const imagePath = path.join(process.cwd(), 'public', 'uploads', imageFile.name);

    // Create the uploads directory if it doesn't exist
    fs.mkdirSync(path.dirname(imagePath), { recursive: true });

    // Save the file to the server
    const buffer = await imageFile.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));

    const newId = uuidv4();

    const newAccommodation = await prisma.accommodations.create({
      data: {
        id: newId,
        name,
        location,
        price_per_night,
        image: `/uploads/${imageFile.name}`, // Store the relative path
        available: true,
      },
    });

    return NextResponse.json({ data: newAccommodation, status: 201 });
  } catch (error) {
    console.error('Error creating accommodation:', error);
    return NextResponse.json({ error: 'Failed to create accommodation' }, { status: 500 });
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
