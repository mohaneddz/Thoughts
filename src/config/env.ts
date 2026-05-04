import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).or(z.literal('')),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).or(z.literal('')),
  GROQ_API_KEY: z.string().min(1).or(z.literal('')),
  GROQ_MODEL: z.string().min(1).or(z.literal('')),
  NEXT_PUBLIC_APP_URL: z.string().url().or(z.literal('')),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
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

