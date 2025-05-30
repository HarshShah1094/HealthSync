import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const patientName = formData.get('patientName');
    const age = formData.get('age');
    const bloodGroup = formData.get('bloodGroup');
    const fileName = formData.get('fileName');
    const file = formData.get('file');

    if (!patientName || !fileName || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('prescriptionApp');

    const reportData = {
      patientName,
      age: age || 'Unknown',
      bloodGroup: bloodGroup || 'Unknown',
      fileName,
      file, // Assuming file is stored as binary or base64
      uploadedAt: new Date(),
    };

    const result = await db.collection('reports').insertOne(reportData);

    return NextResponse.json({ message: 'Report uploaded successfully', id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error uploading report:', error);
    return NextResponse.json({ error: 'Failed to upload report' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('prescriptionApp');

    const prescriptions = await db.collection('prescriptions').find({}).toArray();

    return NextResponse.json(prescriptions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}
