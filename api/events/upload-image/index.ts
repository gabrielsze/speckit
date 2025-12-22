import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { validateImageFile } from '../../../lib/validation';
import { uploadImage } from '../../../lib/blob';

export async function POST(request: NextRequest) {
  const correlationId = uuid();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { code: 'NO_FILE', message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { code: 'INVALID_FILE', message: validation.error },
        { status: 400 }
      );
    }

    // Upload to Blob Storage
    const buffer = await file.arrayBuffer();
    const imageUrl = await uploadImage(Buffer.from(buffer), file.type);

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error(`[${correlationId}] Error uploading image:`, error);

    return NextResponse.json(
      { code: 'STORAGE_TIMEOUT', message: 'Upload failed. Please try again.' },
      { status: 503 }
    );
  }
}
