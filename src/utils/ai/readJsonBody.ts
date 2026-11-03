import 'server-only';

const maxBodyBytes = 24_000;

/** Parses a JSON request body, returning null for anything oversized or malformed. */
export async function readJsonBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > maxBodyBytes) return null;

  const text = await request.text();
  if (text.length > maxBodyBytes) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
