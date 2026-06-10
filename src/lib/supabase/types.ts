// Manually maintained Supabase schema types for Ivera.
// Update when running migrations — regenerate with `supabase gen types typescript` once CLI is configured.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type BookingStatus = "pending" | "contacted" | "confirmed" | "completed" | "cancelled";

export interface Database {
  public: {
    Tables: {
      explorer_profiles: {
        Row: {
          id: string;
          name: string;
          country: string | null;
          interest: string | null;
          whatsapp_optional: string | null;
          language: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country?: string | null;
          interest?: string | null;
          whatsapp_optional?: string | null;
          language?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string | null;
          interest?: string | null;
          whatsapp_optional?: string | null;
          language?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          booking_code: string | null;
          explorer_id: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          customer_email: string | null;
          tour_slug: string;
          tour_title: string;
          tour_category: string | null;
          selected_date: string;
          people_count: number;
          // Legacy columns kept for backward compatibility
          price_per_person: number | null;
          total_price: number | null;
          // Detailed pricing breakdown
          base_price_per_person: number | null;
          base_total: number | null;
          discount_applied: number;
          discount_reason: string | null;
          savings: number;
          final_price_per_person: number | null;
          final_total: number | null;
          currency: string;
          seats_left_at_booking: number | null;
          xp_reward: number;
          whatsapp_opened: boolean;
          notes: string | null;
          status: BookingStatus;
          whatsapp_message: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          booking_code?: string | null;
          explorer_id?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          customer_email?: string | null;
          tour_slug: string;
          tour_title: string;
          tour_category?: string | null;
          selected_date: string;
          people_count: number;
          price_per_person?: number | null;
          total_price?: number | null;
          base_price_per_person?: number | null;
          base_total?: number | null;
          discount_applied?: number;
          discount_reason?: string | null;
          savings?: number;
          final_price_per_person?: number | null;
          final_total?: number | null;
          currency?: string;
          seats_left_at_booking?: number | null;
          xp_reward?: number;
          whatsapp_opened?: boolean;
          notes?: string | null;
          status?: BookingStatus;
          whatsapp_message?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          status?: BookingStatus;
          whatsapp_opened?: boolean;
          notes?: string | null;
          updated_at?: string | null;
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
