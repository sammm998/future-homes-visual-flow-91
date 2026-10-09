export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      alert_cron_config: {
        Row: {
          created_at: string
          id: number
          secret: string
        }
        Insert: {
          created_at?: string
          id?: number
          secret?: string
        }
        Update: {
          created_at?: string
          id?: number
          secret?: string
        }
        Relationships: []
      }
      alert_deliveries: {
        Row: {
          channel: string
          created_at: string
          id: string
          kind: string
          price_seen: string | null
          property_id: string
          search_id: string | null
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          kind?: string
          price_seen?: string | null
          property_id: string
          search_id?: string | null
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          kind?: string
          price_seen?: string | null
          property_id?: string
          search_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      early_access_projects: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          launch_date: string | null
          location: string | null
          price_from: string | null
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          launch_date?: string | null
          location?: string | null
          price_from?: string | null
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          launch_date?: string | null
          location?: string | null
          price_from?: string | null
          title?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          price_at_save: string | null
          property_id: string
          ref_no: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price_at_save?: string | null
          property_id: string
          ref_no?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price_at_save?: string | null
          property_id?: string
          ref_no?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partner_referrals: {
        Row: {
          agreed_commission_pct: number | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string
          id: string
          notes: string | null
          partner_id: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agreed_commission_pct?: number | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          partner_id: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agreed_commission_pct?: number | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          partner_id?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          commission_pct: number
          company: string
          contact_name: string
          country: string | null
          created_at: string
          email: string
          id: string
          partner_type: string
          phone: string | null
          ref_code: string
          status: string
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          commission_pct?: number
          company: string
          contact_name: string
          country?: string | null
          created_at?: string
          email: string
          id?: string
          partner_type?: string
          phone?: string | null
          ref_code?: string
          status?: string
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          commission_pct?: number
          company?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          partner_type?: string
          phone?: string | null
          ref_code?: string
          status?: string
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          active: boolean
          city: string | null
          created_at: string
          id: string
          keywords: string | null
          max_price: number | null
          min_bedrooms: number | null
          name: string
          notify_email: boolean
          notify_whatsapp: boolean
          property_type: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          city?: string | null
          created_at?: string
          id?: string
          keywords?: string | null
          max_price?: number | null
          min_bedrooms?: number | null
          name?: string
          notify_email?: boolean
          notify_whatsapp?: boolean
          property_type?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          city?: string | null
          created_at?: string
          id?: string
          keywords?: string | null
          max_price?: number | null
          min_bedrooms?: number | null
          name?: string
          notify_email?: boolean
          notify_whatsapp?: boolean
          property_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vip_profiles: {
        Row: {
          created_at: string
          email: string | null
          email_alerts: boolean
          full_name: string | null
          language: string
          phone: string | null
          updated_at: string
          user_id: string
          whatsapp_consent: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          email_alerts?: boolean
          full_name?: string | null
          language?: string
          phone?: string | null
          updated_at?: string
          user_id: string
          whatsapp_consent?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          email_alerts?: boolean
          full_name?: string | null
          language?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_consent?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
