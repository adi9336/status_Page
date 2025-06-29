import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ message: 'API is working' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 