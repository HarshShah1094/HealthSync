import clientPromise from '../mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientEmail = searchParams.get('patientEmail');
    const client = await clientPromise;
    const db = client.db('prescriptionApp');
    let query = {};
    if (patientEmail) {
      query = { patient: patientEmail };
    }
    const notifications = await db.collection('notifications').find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch notifications', details: errorMessage }, { status: 500 });
  }
}
