import { z } from 'zod';

const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1).or(z.literal('')),
  GROQ_MODEL: z.string().min(1).or(z.literal('')),
  NEXT_PUBLIC_APP_URL: z.string().url().or(z.literal('')),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  const parsed = envSchema.safeParse({
    GROQ_API_KEY: process.env.GROQ_API_KEY ?? '',
    GROQ_MODEL: process.env.GROQ_MODEL ?? '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? '',
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }

  return parsed.data;
}

export function getMissingEnvVars() {
  const env = getEnv();
  const required = Object.entries(env).filter(([, value]) => !value);
  return required.map(([key]) => key);
}
