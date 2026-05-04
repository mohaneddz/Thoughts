import { NextResponse } from 'next/server';
import type { AIInterpretationMode, TestResultSummary } from '@/types/result';
import { explainResultSimply, generateReflectionQuestions, interpretTestResult } from '@/utils/ai/groq';

interface Payload {
  mode: AIInterpretationMode;
  result: TestResultSummary;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;

    let message = '';
    if (body.mode === 'explain-simply') {
      message = await explainResultSimply(body.result);
    } else if (body.mode === 'journal-prompts') {
      message = await generateReflectionQuestions(body.result);
    } else {
      message = await interpretTestResult(body.result, body.mode);
    }

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json(
      { message: 'I could not interpret this result right now. Please try again.' },
      { status: 500 },
    );
  }
}

