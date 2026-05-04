import { z } from 'zod';

export const checkInSchema = z.object({
  mood: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  sleep: z.number().min(1).max(10),
  focus: z.number().min(1).max(10),
  motivation: z.number().min(1).max(10),
  socialBattery: z.number().min(1).max(10),
  note: z.string().max(500).optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  depth: z.string().optional(),
  tone: z.string().optional(),
});

