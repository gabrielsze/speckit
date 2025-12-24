import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { validateEventSubmission } from '../../../lib/validation';
import { submitEvent } from '../../../lib/services/eventSubmission';

export async function POST(request: NextRequest) {
  const correlationId = uuid();

  try {
    const body = await request.json();

    // Client-side validation (server-side double-check)
    const validation = validateEventSubmission(body);
    if (!validation.success) {
      return NextResponse.json(
        { fieldErrors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Persist to database
    const event = await submitEvent(validation.data);

    return NextResponse.json({ id: event.id, createdAt: event.createdAt }, { status: 200 });
  } catch (error) {
    console.error(`[${correlationId}] Error submitting event:`, error);

    return NextResponse.json(
      { code: 'SQL_INSERT_FAILED', message: 'Failed to save event. Please try again.' },
      { status: 500 }
    );
  }
}
