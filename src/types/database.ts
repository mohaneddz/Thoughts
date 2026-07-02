export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tests: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          estimated_minutes: number;
          depth: string;
          tone: string;
          questions_json: unknown;
          scoring_json: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          estimated_minutes: number;
          depth: string;
          tone: string;
          questions_json: unknown;
          scoring_json?: unknown;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          category?: string;
          estimated_minutes?: number;
          depth?: string;
          tone?: string;
          questions_json?: unknown;
          scoring_json?: unknown;
          created_at?: string;
        };
        Relationships: [];
      };
      test_results: {
        Row: {
          id: string;
          user_id: string;
          test_id: string;
          answers_json: unknown;
          scores_json: unknown;
          summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_id: string;
          answers_json: unknown;
          scores_json: unknown;
          summary: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_id?: string;
          answers_json?: unknown;
          scores_json?: unknown;
          summary?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_interpretations: {
        Row: {
          id: string;
          user_id: string;
          result_id: string;
          mode: string;
          prompt: string;
          response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          result_id: string;
          mode: string;
          prompt: string;
          response: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          result_id?: string;
          mode?: string;
          prompt?: string;
          response?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      check_ins: {
        Row: {
          id: string;
          user_id: string;
          mood: number;
          stress: number;
          energy: number;
          sleep: number;
          focus: number;
          motivation: number;
          social_battery: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: number;
          stress: number;
          energy: number;
          sleep: number;
          focus: number;
          motivation: number;
          social_battery: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: number;
          stress?: number;
          energy?: number;
          sleep?: number;
          focus?: number;
          motivation?: number;
          social_battery?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_thoughts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          source_type: string;
          source_id: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          source_type: string;
          source_id?: string | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          source_type?: string;
          source_id?: string | null;
          tags?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
