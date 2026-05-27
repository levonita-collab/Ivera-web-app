// Auto-generated types for Ivera Supabase schema.
// Update this file when you run `supabase gen types typescript`.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      explorer_profiles: {
        Row: {
          id: string;
          name: string;
          country: string | null;
          interest: string | null; // comma-separated interests
          whatsapp_optional: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country?: string | null;
          interest?: string | null;
          whatsapp_optional?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string | null;
          interest?: string | null;
          whatsapp_optional?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          explorer_id: string | null;
          tour_slug: string;
          tour_title: string;
          selected_date: string;
          people_count: number;
          price_per_person: number | null;
          total_price: number | null;
          status: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
          whatsapp_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          explorer_id?: string | null;
          tour_slug: string;
          tour_title: string;
          selected_date: string;
          people_count: number;
          price_per_person?: number | null;
          total_price?: number | null;
          status?: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
          whatsapp_message?: string | null;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
        };
        Relationships: [];
      };
      quest_progress: {
        Row: {
          id: string;
          explorer_id: string | null;
          tour_slug: string;
          mission_id: string;
          completed: boolean;
          points_earned: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          explorer_id?: string | null;
          tour_slug: string;
          mission_id: string;
          completed?: boolean;
          points_earned: number;
          completed_at?: string;
        };
        Update: {
          completed?: boolean;
          points_earned?: number;
        };
        Relationships: [];
      };
      leaderboard_entries: {
        Row: {
          id: string;
          explorer_id: string | null;
          display_name: string;
          total_xp: number;
          completed_quests: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          explorer_id?: string | null;
          display_name: string;
          total_xp: number;
          completed_quests: number;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          total_xp?: number;
          completed_quests?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      qr_missions: {
        Row: {
          id: string;
          tour_slug: string;
          mission_id: string;
          qr_code: string;
          location_name: string;
          points: number;
          unlock_text: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tour_slug: string;
          mission_id: string;
          qr_code: string;
          location_name: string;
          points: number;
          unlock_text?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          active?: boolean;
          unlock_text?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
