// ─────────────────────────────────────────────
// Supabase Database & App Types
// ─────────────────────────────────────────────

export type UserRole = "user" | "business_owner";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  area_zone: string;
  business_id?: string;
  business_name?: string;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  owner_name?: string;
  category: string;
  area_zone: string | null;
  address?: string;
  phone: string | null;
  whatsapp?: string | null;
  is_open: boolean;
  has_delivery: boolean;
  opening_time?: string;
  closing_time?: string;
  description?: string;
  call_leads?: number;
  whatsapp_leads?: number;
  view_leads?: number;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_name: string;
  contact: string | null;
  tag: string | null;
  message: string;
  created_at: string;
}

export interface MarketplaceAd {
  id: string;
  title: string;
  price: number | null;
  condition: "Like New" | "Good" | "Fair" | null;
  contact: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string | null;
  niche: string | null;
  followers: number | null;
  starting_price: number | null;
  contact: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: Omit<Business, "id" | "created_at">;
        Update: Partial<Omit<Business, "id" | "created_at">>;
      };
      community_posts: {
        Row: CommunityPost;
        Insert: Omit<CommunityPost, "id" | "created_at">;
        Update: Partial<Omit<CommunityPost, "id" | "created_at">>;
      };
      marketplace_ads: {
        Row: MarketplaceAd;
        Insert: Omit<MarketplaceAd, "id" | "created_at">;
        Update: Partial<Omit<MarketplaceAd, "id" | "created_at">>;
      };
      creators: {
        Row: Creator;
        Insert: Omit<Creator, "id" | "created_at">;
        Update: Partial<Omit<Creator, "id" | "created_at">>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "id" | "created_at">;
        Update: Partial<Omit<UserProfile, "id" | "created_at">>;
      };
    };
  };
}
