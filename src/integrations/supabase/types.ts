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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_us_content: {
        Row: {
          content: string
          created_at: string
          id: string
          language_code: string
          section_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          language_code?: string
          section_key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          language_code?: string
          section_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          language_code: string | null
          parent_post_id: string | null
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          language_code?: string | null
          parent_post_id?: string | null
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          language_code?: string | null
          parent_post_id?: string | null
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["cms_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["cms_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["cms_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "cms_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_users: {
        Row: {
          active: boolean | null
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      code_snippets: {
        Row: {
          code_content: string
          code_type: string
          created_at: string
          id: string
          injection_location: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code_content: string
          code_type: string
          created_at?: string
          id?: string
          injection_location: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code_content?: string
          code_type?: string
          created_at?: string
          id?: string
          injection_location?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          collected_at: string | null
          conversation_id: string | null
          created_at: string
          email: string | null
          id: string
          language: string | null
          name: string
          phone: string | null
        }
        Insert: {
          collected_at?: string | null
          conversation_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          language?: string | null
          name: string
          phone?: string | null
        }
        Update: {
          collected_at?: string | null
          conversation_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          language?: string | null
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          contact_collected: boolean | null
          contact_id: string | null
          conversation_data: Json
          created_at: string
          id: string
          message_count: number | null
          session_id: string
          updated_at: string
        }
        Insert: {
          contact_collected?: boolean | null
          contact_id?: string | null
          conversation_data?: Json
          created_at?: string
          id?: string
          message_count?: number | null
          session_id: string
          updated_at?: string
        }
        Update: {
          contact_collected?: boolean | null
          contact_id?: string | null
          conversation_data?: Json
          created_at?: string
          id?: string
          message_count?: number | null
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_testimonials: {
        Row: {
          company_name: string | null
          company_url: string | null
          created_at: string
          customer_name: string
          designation: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          rating: number | null
          review_text: string
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          company_url?: string | null
          created_at?: string
          customer_name: string
          designation?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          rating?: number | null
          review_text: string
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          company_url?: string | null
          created_at?: string
          customer_name?: string
          designation?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          rating?: number | null
          review_text?: string
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string
          flag: string | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          flag?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          flag?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          source: string | null
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          agent_phone_number: string | null
          amenities: string[] | null
          apartment_types: Json | null
          bathrooms: string | null
          bedrooms: string | null
          building_complete_date: string | null
          created_at: string
          description: string | null
          distance_to_airport_km: string | null
          distance_to_beach_km: string | null
          facilities: string | null
          google_maps_embed: string | null
          id: string
          is_active: boolean
          language_code: string | null
          location: string
          parent_property_id: string | null
          price: string
          property_district: string | null
          property_facilities: string[] | null
          property_image: string | null
          property_images: string[] | null
          property_prices_by_room: string | null
          property_subtype: string | null
          property_type: string | null
          property_url: string | null
          ref_no: string | null
          sizes_m2: string | null
          slug: string | null
          slug_ar: string | null
          slug_da: string | null
          slug_fa: string | null
          slug_no: string | null
          slug_ru: string | null
          slug_sv: string | null
          slug_tr: string | null
          slug_ur: string | null
          starting_price_eur: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          agent_name?: string | null
          agent_phone_number?: string | null
          amenities?: string[] | null
          apartment_types?: Json | null
          bathrooms?: string | null
          bedrooms?: string | null
          building_complete_date?: string | null
          created_at?: string
          description?: string | null
          distance_to_airport_km?: string | null
          distance_to_beach_km?: string | null
          facilities?: string | null
          google_maps_embed?: string | null
          id?: string
          is_active?: boolean
          language_code?: string | null
          location: string
          parent_property_id?: string | null
          price: string
          property_district?: string | null
          property_facilities?: string[] | null
          property_image?: string | null
          property_images?: string[] | null
          property_prices_by_room?: string | null
          property_subtype?: string | null
          property_type?: string | null
          property_url?: string | null
          ref_no?: string | null
          sizes_m2?: string | null
          slug?: string | null
          slug_ar?: string | null
          slug_da?: string | null
          slug_fa?: string | null
          slug_no?: string | null
          slug_ru?: string | null
          slug_sv?: string | null
          slug_tr?: string | null
          slug_ur?: string | null
          starting_price_eur?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          agent_name?: string | null
          agent_phone_number?: string | null
          amenities?: string[] | null
          apartment_types?: Json | null
          bathrooms?: string | null
          bedrooms?: string | null
          building_complete_date?: string | null
          created_at?: string
          description?: string | null
          distance_to_airport_km?: string | null
          distance_to_beach_km?: string | null
          facilities?: string | null
          google_maps_embed?: string | null
          id?: string
          is_active?: boolean
          language_code?: string | null
          location?: string
          parent_property_id?: string | null
          price?: string
          property_district?: string | null
          property_facilities?: string[] | null
          property_image?: string | null
          property_images?: string[] | null
          property_prices_by_room?: string | null
          property_subtype?: string | null
          property_type?: string | null
          property_url?: string | null
          ref_no?: string | null
          sizes_m2?: string | null
          slug?: string | null
          slug_ar?: string | null
          slug_da?: string | null
          slug_fa?: string | null
          slug_no?: string | null
          slug_ru?: string | null
          slug_sv?: string | null
          slug_tr?: string | null
          slug_ur?: string | null
          starting_price_eur?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "property_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_parent_property_id_fkey"
            columns: ["parent_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_parent_property_id_fkey"
            columns: ["parent_property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      properties_duplicates_backup: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          agent_phone_number: string | null
          amenities: string[] | null
          apartment_types: Json | null
          bathrooms: string | null
          bedrooms: string | null
          building_complete_date: string | null
          created_at: string | null
          description: string | null
          distance_to_airport_km: string | null
          distance_to_beach_km: string | null
          facilities: string | null
          google_maps_embed: string | null
          id: string | null
          is_active: boolean | null
          language_code: string | null
          location: string | null
          parent_property_id: string | null
          price: string | null
          property_district: string | null
          property_facilities: string[] | null
          property_image: string | null
          property_images: string[] | null
          property_prices_by_room: string | null
          property_subtype: string | null
          property_type: string | null
          property_url: string | null
          ref_no: string | null
          sizes_m2: string | null
          slug: string | null
          starting_price_eur: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          agent_name?: string | null
          agent_phone_number?: string | null
          amenities?: string[] | null
          apartment_types?: Json | null
          bathrooms?: string | null
          bedrooms?: string | null
          building_complete_date?: string | null
          created_at?: string | null
          description?: string | null
          distance_to_airport_km?: string | null
          distance_to_beach_km?: string | null
          facilities?: string | null
          google_maps_embed?: string | null
          id?: string | null
          is_active?: boolean | null
          language_code?: string | null
          location?: string | null
          parent_property_id?: string | null
          price?: string | null
          property_district?: string | null
          property_facilities?: string[] | null
          property_image?: string | null
          property_images?: string[] | null
          property_prices_by_room?: string | null
          property_subtype?: string | null
          property_type?: string | null
          property_url?: string | null
          ref_no?: string | null
          sizes_m2?: string | null
          slug?: string | null
          starting_price_eur?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          agent_name?: string | null
          agent_phone_number?: string | null
          amenities?: string[] | null
          apartment_types?: Json | null
          bathrooms?: string | null
          bedrooms?: string | null
          building_complete_date?: string | null
          created_at?: string | null
          description?: string | null
          distance_to_airport_km?: string | null
          distance_to_beach_km?: string | null
          facilities?: string | null
          google_maps_embed?: string | null
          id?: string | null
          is_active?: boolean | null
          language_code?: string | null
          location?: string | null
          parent_property_id?: string | null
          price?: string | null
          property_district?: string | null
          property_facilities?: string[] | null
          property_image?: string | null
          property_images?: string[] | null
          property_prices_by_room?: string | null
          property_subtype?: string | null
          property_type?: string | null
          property_url?: string | null
          ref_no?: string | null
          sizes_m2?: string | null
          slug?: string | null
          starting_price_eur?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_agents: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      property_audit_log: {
        Row: {
          action: string
          changed_by: string | null
          changed_fields: Json | null
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          property_id: string
        }
        Insert: {
          action: string
          changed_by?: string | null
          changed_fields?: Json | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          property_id: string
        }
        Update: {
          action?: string
          changed_by?: string | null
          changed_fields?: Json | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          property_id?: string
        }
        Relationships: []
      }
      property_insertion_log: {
        Row: {
          created_at: string
          id: string
          insertion_rate_check: boolean | null
          ip_address: unknown
          property_id: string | null
          source_info: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          insertion_rate_check?: boolean | null
          ip_address?: unknown
          property_id?: string | null
          source_info?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          insertion_rate_check?: boolean | null
          ip_address?: unknown
          property_id?: string | null
          source_info?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      scan_sessions: {
        Row: {
          created_at: string
          id: string
          page_url: string
          scan_type: string
          texts_found: number
        }
        Insert: {
          created_at?: string
          id?: string
          page_url: string
          scan_type?: string
          texts_found?: number
        }
        Update: {
          created_at?: string
          id?: string
          page_url?: string
          scan_type?: string
          texts_found?: number
        }
        Relationships: []
      }
      sync_failures: {
        Row: {
          created_at: string
          error_message: string
          event_type: string
          id: string
          property_id: string
          resolved_at: string | null
          retry_count: number
          sync_data: Json
        }
        Insert: {
          created_at?: string
          error_message: string
          event_type: string
          id?: string
          property_id: string
          resolved_at?: string | null
          retry_count?: number
          sync_data: Json
        }
        Update: {
          created_at?: string
          error_message?: string
          event_type?: string
          id?: string
          property_id?: string
          resolved_at?: string | null
          retry_count?: number
          sync_data?: Json
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean
          linkedin_url: string | null
          name: string
          phone: string | null
          position: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          name: string
          phone?: string | null
          position: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company_name: string | null
          company_url: string | null
          created_at: string
          customer_country: string | null
          customer_name: string
          designation: string | null
          id: string
          image_url: string | null
          location: string | null
          property_type: string | null
          rating: number | null
          review_text: string
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          company_url?: string | null
          created_at?: string
          customer_country?: string | null
          customer_name: string
          designation?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          property_type?: string | null
          rating?: number | null
          review_text: string
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          company_url?: string | null
          created_at?: string
          customer_country?: string | null
          customer_name?: string
          designation?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          property_type?: string | null
          rating?: number | null
          review_text?: string
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      text_keys: {
        Row: {
          component_source: string | null
          context: string | null
          created_at: string
          found_at: string
          id: string
          is_active: boolean
          key_path: string
          last_seen: string
          original_text: string
          page_source: string | null
          updated_at: string
        }
        Insert: {
          component_source?: string | null
          context?: string | null
          created_at?: string
          found_at?: string
          id?: string
          is_active?: boolean
          key_path: string
          last_seen?: string
          original_text: string
          page_source?: string | null
          updated_at?: string
        }
        Update: {
          component_source?: string | null
          context?: string | null
          created_at?: string
          found_at?: string
          id?: string
          is_active?: boolean
          key_path?: string
          last_seen?: string
          original_text?: string
          page_source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_calls: {
        Row: {
          audio_url: string | null
          call_duration: number | null
          call_status: string | null
          conversation_summary: string | null
          created_at: string
          id: string
          language: string | null
          session_id: string
          transcript: string | null
          updated_at: string
          user_email: string | null
          user_name: string | null
          user_phone: string | null
        }
        Insert: {
          audio_url?: string | null
          call_duration?: number | null
          call_status?: string | null
          conversation_summary?: string | null
          created_at?: string
          id?: string
          language?: string | null
          session_id: string
          transcript?: string | null
          updated_at?: string
          user_email?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Update: {
          audio_url?: string | null
          call_duration?: number | null
          call_status?: string | null
          conversation_summary?: string | null
          created_at?: string
          id?: string
          language?: string | null
          session_id?: string
          transcript?: string | null
          updated_at?: string
          user_email?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Relationships: []
      }
      website_content: {
        Row: {
          content_sections: Json
          created_at: string
          id: string
          meta_description: string | null
          page_slug: string
          page_title: string
          updated_at: string
        }
        Insert: {
          content_sections?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          page_slug: string
          page_title: string
          updated_at?: string
        }
        Update: {
          content_sections?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          page_slug?: string
          page_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_media: {
        Row: {
          alt_text: string | null
          created_at: string
          filename: string
          id: string
          url: string
          usage_context: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          filename: string
          id?: string
          url: string
          usage_context?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          filename?: string
          id?: string
          url?: string
          usage_context?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      properties_public: {
        Row: {
          agent_name: string | null
          amenities: string[] | null
          apartment_types: Json | null
          bathrooms: string | null
          bedrooms: string | null
          building_complete_date: string | null
          created_at: string | null
          description: string | null
          distance_to_airport_km: string | null
          distance_to_beach_km: string | null
          facilities: string | null
          google_maps_embed: string | null
          id: string | null
          is_active: boolean | null
          language_code: string | null
          location: string | null
          parent_property_id: string | null
          price: string | null
          property_district: string | null
          property_facilities: string[] | null
          property_image: string | null
          property_images: string[] | null
          property_prices_by_room: string | null
          property_subtype: string | null
          property_type: string | null
          property_url: string | null
          ref_no: string | null
          sizes_m2: string | null
          slug: string | null
          starting_price_eur: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_parent_property_id_fkey"
            columns: ["parent_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_parent_property_id_fkey"
            columns: ["parent_property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      property_insertion_monitoring: {
        Row: {
          created_at: string | null
          ip_address: unknown
          is_active: boolean | null
          location: string | null
          ref_no: string | null
          source_info: Json | null
          title: string | null
          user_id: string | null
        }
        Relationships: []
      }
      team_members_public: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          name: string | null
          position: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string | null
          position?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string | null
          position?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      ensure_current_user_is_admin: { Args: never; Returns: string }
      generate_property_slug: {
        Args: { id_param: string; title_param: string }
        Returns: string
      }
      get_complete_schema: { Args: never; Returns: Json }
      get_current_user_admin_status: { Args: never; Returns: boolean }
      get_min_apartment_price: {
        Args: { apartment_types_json: Json }
        Returns: string
      }
      has_cms_role: {
        Args: { role: Database["public"]["Enums"]["cms_role"] }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      normalize_price_to_eur: {
        Args: { price_string: string }
        Returns: string
      }
      translate_text: {
        Args: { target_language?: string; text_to_translate: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      cms_role: "admin" | "editor" | "author" | "viewer"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "moderator", "user"],
      cms_role: ["admin", "editor", "author", "viewer"],
    },
  },
} as const
