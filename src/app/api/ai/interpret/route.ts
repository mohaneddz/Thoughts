import { NextResponse } from 'next/server';
import { interpretRequestSchema } from '@/utils/ai/context';
import { AIUnavailableError, interpretResult } from '@/utils/ai/groq';
import { readJsonBody } from '@/utils/ai/readJsonBody';

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  const parsed = interpretRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'That request did not include a valid result to interpret.' }, { status: 400 });
  }

  try {
    const message = await interpretResult(parsed.data.context, parsed.data.mode);
    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof AIUnavailableError) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }
    return NextResponse.json({ message: 'The AI service did not answer in time. Try again in a moment.' }, { status: 502 });
  }
}
