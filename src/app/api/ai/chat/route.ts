import { NextResponse } from 'next/server';
import { chatRequestSchema } from '@/utils/ai/context';
import { AIUnavailableError, chatAboutResult } from '@/utils/ai/groq';
import { readJsonBody } from '@/utils/ai/readJsonBody';

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== 'user') {
    return NextResponse.json({ message: 'That chat request was not valid.' }, { status: 400 });
  }

  try {
    const message = await chatAboutResult(parsed.data.context, parsed.data.messages);
    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof AIUnavailableError) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }
    return NextResponse.json({ message: 'The AI service did not answer in time. Try again in a moment.' }, { status: 502 });
  }
}
