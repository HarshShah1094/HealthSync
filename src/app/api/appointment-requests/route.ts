import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../mongodb';

export async function POST(request: NextRequest) {
  try {
    const appointmentRequest = await request.json();

    // Basic validation for required fields
    if (!appointmentRequest.patientName || !appointmentRequest.preferredDate || !appointmentRequest.preferredTime || !appointmentRequest.requestedBy) {
      return NextResponse.json({ error: 'Missing required appointment fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('healthsync');

    // Add a status field and timestamp to the request
    const newAppointmentRequest = {
      ...appointmentRequest,
      status: 'pending', // Initial status
      createdAt: new Date(),
    };

    const result = await db.collection('appointmentRequests').insertOne(newAppointmentRequest);

    return NextResponse.json({ message: 'Appointment request submitted successfully', requestId: result.insertedId }, { status: 201 });

  } catch (error: any) {
    console.error('Error handling appointment request:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit appointment request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('healthsync');
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const role = searchParams.get('role');

    let filter: any = {};
    if (userEmail) {
      // If email is provided, filter by requestedBy for the patient view
      filter = { requestedBy: userEmail };
    } else if (role === 'admin') {
      // If role is admin, fetch all appointments
      filter = {};
    } else if (role === 'doctor') {
      // If role is doctor, fetch only pending appointments
      filter = { status: 'pending' };
    } else {
      // If no email or role is provided, return empty array
      return NextResponse.json([]);
    }

    const appointmentRequests = await db.collection('appointmentRequests')
                                      .find(filter)
                                      .sort({ preferredDate: 1, preferredTime: 1 })
                                      .toArray();

    return NextResponse.json(appointmentRequests);

  } catch (error: any) {
    console.error('Error fetching appointment requests:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch appointment requests' }, { status: 500 });
  }
} 