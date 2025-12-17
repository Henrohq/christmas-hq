export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DecorationType = 'card' | 'gift' | 'ornament'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          display_name: string | null
          avatar_url: string | null
          tree_color: string
          star_color: string
          sky_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          display_name?: string | null
          avatar_url?: string | null
          tree_color?: string
          star_color?: string
          sky_color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          display_name?: string | null
          avatar_url?: string | null
          tree_color?: string
          star_color?: string
          sky_color?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          recipient_id: string
          sender_id: string
          content: string
          decoration_type: DecorationType
          decoration_style: string
          position_data: Json | null
          position_index: number | null
          is_private: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          sender_id: string
          content: string
          decoration_type?: DecorationType
          decoration_style?: string
          position_data?: Json | null
          position_index?: number | null
          is_private?: boolean
          created_at?: string
        }
        Update: {
          content?: string
          decoration_type?: DecorationType
          decoration_style?: string
          position_data?: Json | null
          is_private?: boolean
        }
      }
    }
    Views: {
      user_tree_stats: {
        Row: {
          id: string
          full_name: string
          display_name: string | null
          avatar_url: string | null
          message_count: number
          card_count: number
          gift_count: number
        }
      }
    }
    Functions: {
      search_users: {
        Args: { search_query: string }
        Returns: Database['public']['Tables']['profiles']['Row'][]
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type UserTreeStats = Database['public']['Views']['user_tree_stats']['Row']
