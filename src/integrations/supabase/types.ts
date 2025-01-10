export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      instruments_primary: {
        Row: {
          agreement_type: string | null
          agreement_url: string | null
          amortization_type: string | null
          amount: number | null
          borrower: string | null
          channel: string | null
          collateral: string | null
          collateral_type: string | null
          created_at: string | null
          documentation_urls: string | null
          governing_law: string | null
          id: number
          interest_rate: number | null
          investment_id: string
          lien_jurisdiction: string | null
          lien_status: string | null
          maturity_date: string | null
          modification_options: Json | null
          modification_percent: number | null
          modification_types: Json | null
          next_payment_date: string | null
          origination_date: string | null
          originator: string | null
          originator_parent: string | null
          payment_day: number | null
          penalty_rate: number | null
          purchase_date: string | null
          rate_floor: number | null
          rate_type: string | null
          remaining_term: number | null
          risk_score: number | null
          servicer: string | null
          start_date: string | null
          stated_rate: number | null
          status: string | null
          subservicer: string | null
          term: number | null
          total_modifications: number | null
          type: string | null
        }
        Insert: {
          agreement_type?: string | null
          agreement_url?: string | null
          amortization_type?: string | null
          amount?: number | null
          borrower?: string | null
          channel?: string | null
          collateral?: string | null
          collateral_type?: string | null
          created_at?: string | null
          documentation_urls?: string | null
          governing_law?: string | null
          id?: number
          interest_rate?: number | null
          investment_id: string
          lien_jurisdiction?: string | null
          lien_status?: string | null
          maturity_date?: string | null
          modification_options?: Json | null
          modification_percent?: number | null
          modification_types?: Json | null
          next_payment_date?: string | null
          origination_date?: string | null
          originator?: string | null
          originator_parent?: string | null
          payment_day?: number | null
          penalty_rate?: number | null
          purchase_date?: string | null
          rate_floor?: number | null
          rate_type?: string | null
          remaining_term?: number | null
          risk_score?: number | null
          servicer?: string | null
          start_date?: string | null
          stated_rate?: number | null
          status?: string | null
          subservicer?: string | null
          term?: number | null
          total_modifications?: number | null
          type?: string | null
        }
        Update: {
          agreement_type?: string | null
          agreement_url?: string | null
          amortization_type?: string | null
          amount?: number | null
          borrower?: string | null
          channel?: string | null
          collateral?: string | null
          collateral_type?: string | null
          created_at?: string | null
          documentation_urls?: string | null
          governing_law?: string | null
          id?: number
          interest_rate?: number | null
          investment_id?: string
          lien_jurisdiction?: string | null
          lien_status?: string | null
          maturity_date?: string | null
          modification_options?: Json | null
          modification_percent?: number | null
          modification_types?: Json | null
          next_payment_date?: string | null
          origination_date?: string | null
          originator?: string | null
          originator_parent?: string | null
          payment_day?: number | null
          penalty_rate?: number | null
          purchase_date?: string | null
          rate_floor?: number | null
          rate_type?: string | null
          remaining_term?: number | null
          risk_score?: number | null
          servicer?: string | null
          start_date?: string | null
          stated_rate?: number | null
          status?: string | null
          subservicer?: string | null
          term?: number | null
          total_modifications?: number | null
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          last_accessed_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_accessed_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_accessed_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          notifications_enabled: boolean | null
          theme: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          notifications_enabled?: boolean | null
          theme?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
