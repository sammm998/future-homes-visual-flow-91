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
      analytics_events: {
        Row: {
          browser: string | null
          channel: string | null
          city: string | null
          country: string | null
          device: string | null
          event_type: string
          id: number
          os: string | null
          page: string | null
          payload: Json | null
          property_id: string | null
          referrer: string | null
          session_id: string | null
          ts: string
          visitor_id: string | null
        }
        Insert: {
          browser?: string | null
          channel?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          event_type: string
          id?: number
          os?: string | null
          page?: string | null
          payload?: Json | null
          property_id?: string | null
          referrer?: string | null
          session_id?: string | null
          ts?: string
          visitor_id?: string | null
        }
        Update: {
          browser?: string | null
          channel?: string | null
          city?: string | null
          country?: string | null
          device?: string | null
          event_type?: string
          id?: number
          os?: string | null
          page?: string | null
          payload?: Json | null
          property_id?: string | null
          referrer?: string | null
          session_id?: string | null
          ts?: string
          visitor_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          language_code: string | null
          meta_description: string | null
          meta_title: string | null
          parent_post_id: string | null
          published: boolean
          published_at: string | null
          scheduled_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          language_code?: string | null
          meta_description?: string | null
          meta_title?: string | null
          parent_post_id?: string | null
          published?: boolean
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          language_code?: string | null
          meta_description?: string | null
          meta_title?: string | null
          parent_post_id?: string | null
          published?: boolean
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      campaign_recipients: {
        Row: {
          bounced_at: string | null
          campaign_id: string
          clicked_at: string | null
          email: string
          error: string | null
          id: string
          opened_at: string | null
          sent_at: string | null
          subscriber_id: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          bounced_at?: string | null
          campaign_id: string
          clicked_at?: string | null
          email: string
          error?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          subscriber_id?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          bounced_at?: string | null
          campaign_id?: string
          clicked_at?: string | null
          email?: string
          error?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          subscriber_id?: string | null
          unsubscribed_at?: string | null
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
        Relationships: []
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
        Relationships: []
      }
      course_modules: {
        Row: {
          body_html: string
          course_id: string
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean
          key_takeaways: Json
          order_index: number
          quiz: Json
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body_html: string
          course_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          key_takeaways?: Json
          order_index?: number
          quiz?: Json
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          course_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          key_takeaways?: Json
          order_index?: number
          quiz?: Json
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_fk"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          country_code: string
          created_at: string
          description: string
          difficulty: string
          estimated_minutes: number
          final_pass_threshold: number
          final_quiz: Json
          hero_image: string | null
          id: string
          is_published: boolean
          language_code: string
          order_index: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          country_code: string
          created_at?: string
          description: string
          difficulty?: string
          estimated_minutes?: number
          final_pass_threshold?: number
          final_quiz?: Json
          hero_image?: string | null
          id?: string
          is_published?: boolean
          language_code?: string
          order_index?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          description?: string
          difficulty?: string
          estimated_minutes?: number
          final_pass_threshold?: number
          final_quiz?: Json
          hero_image?: string | null
          id?: string
          is_published?: boolean
          language_code?: string
          order_index?: number
          slug?: string
          title?: string
          updated_at?: string
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
      email_campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          from_name: string | null
          html: string
          id: string
          recipient_count: number
          reply_to: string | null
          scheduled_at: string | null
          segment: Json
          sent_at: string | null
          stats: Json
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          from_name?: string | null
          html: string
          id?: string
          recipient_count?: number
          reply_to?: string | null
          scheduled_at?: string | null
          segment?: Json
          sent_at?: string | null
          stats?: Json
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          from_name?: string | null
          html?: string
          id?: string
          recipient_count?: number
          reply_to?: string | null
          scheduled_at?: string | null
          segment?: Json
          sent_at?: string | null
          stats?: Json
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          created_by: string | null
          html: string
          id: string
          name: string
          subject: string
          updated_at: string
          variables: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          html: string
          id?: string
          name: string
          subject: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          html?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json
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
      heatmap_clicks: {
        Row: {
          device: string | null
          id: number
          page: string
          session_id: string | null
          tag: string | null
          ts: string
          viewport_h: number | null
          viewport_w: number | null
          visitor_id: string | null
          x_pct: number
          y_pct: number
        }
        Insert: {
          device?: string | null
          id?: number
          page: string
          session_id?: string | null
          tag?: string | null
          ts?: string
          viewport_h?: number | null
          viewport_w?: number | null
          visitor_id?: string | null
          x_pct: number
          y_pct: number
        }
        Update: {
          device?: string | null
          id?: number
          page?: string
          session_id?: string | null
          tag?: string | null
          ts?: string
          viewport_h?: number | null
          viewport_w?: number | null
          visitor_id?: string | null
          x_pct?: number
          y_pct?: number
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
      lead_activities: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          lead_id: string
          payload: Json
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          lead_id: string
          payload?: Json
          type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          payload?: Json
          type?: string
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          lead_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          lead_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          lead_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_currency: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          nationality: string | null
          phone: string | null
          preferred_countries: string[] | null
          preferred_types: string[] | null
          property_id: string | null
          score: number
          source: string | null
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget_currency?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          nationality?: string | null
          phone?: string | null
          preferred_countries?: string[] | null
          preferred_types?: string[] | null
          property_id?: string | null
          score?: number
          source?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget_currency?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          nationality?: string | null
          phone?: string | null
          preferred_countries?: string[] | null
          preferred_types?: string[] | null
          property_id?: string | null
          score?: number
          source?: string | null
          status?: string
          tags?: string[] | null
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
      presentations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          property_id: string | null
          slides: Json
          theme: Json
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          property_id?: string | null
          slides?: Json
          theme?: Json
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          property_id?: string | null
          slides?: Json
          theme?: Json
          title?: string
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
          buyer_fee_percent: number | null
          citizenship_eligible: boolean | null
          country: string | null
          created_at: string
          description: string | null
          distance_to_airport_km: string | null
          distance_to_beach_km: string | null
          facilities: string | null
          floor_plan_url: string | null
          floors: number | null
          google_maps_embed: string | null
          id: string
          interior_images: string[] | null
          interior_scanned_at: string | null
          is_active: boolean
          language_code: string | null
          location: string
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          parent_property_id: string | null
          price: string
          price_currency: string | null
          property_district: string | null
          property_facilities: string[] | null
          property_image: string | null
          property_images: string[] | null
          property_prices_by_room: string | null
          property_subtype: string | null
          property_type: string | null
          property_url: string | null
          ref_no: string | null
          related_property_ids: string[] | null
          roi_percent: number | null
          sizes_m2: string | null
          slug: string | null
          slug_ar: string | null
          slug_da: string | null
          slug_de: string | null
          slug_es: string | null
          slug_fa: string | null
          slug_fr: string | null
          slug_id: string | null
          slug_no: string | null
          slug_ru: string | null
          slug_sv: string | null
          slug_tr: string | null
          slug_ur: string | null
          starting_price_eur: string | null
          status: string | null
          title: string
          tour_url: string | null
          updated_at: string
          video_url: string | null
          views_count: number
          year_built: number | null
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
          buyer_fee_percent?: number | null
          citizenship_eligible?: boolean | null
          country?: string | null
          created_at?: string
          description?: string | null
          distance_to_airport_km?: string | null
          distance_to_beach_km?: string | null
          facilities?: string | null
          floor_plan_url?: string | null
          floors?: number | null
          google_maps_embed?: string | null
          id?: string
          interior_images?: string[] | null
          interior_scanned_at?: string | null
          is_active?: boolean
          language_code?: string | null
          location: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          parent_property_id?: string | null
          price: string
          price_currency?: string | null
          property_district?: string | null
          property_facilities?: string[] | null
          property_image?: string | null
          property_images?: string[] | null
          property_prices_by_room?: string | null
          property_subtype?: string | null
          property_type?: string | null
          property_url?: string | null
          ref_no?: string | null
          related_property_ids?: string[] | null
          roi_percent?: number | null
          sizes_m2?: string | null
          slug?: string | null
          slug_ar?: string | null
          slug_da?: string | null
          slug_de?: string | null
          slug_es?: string | null
          slug_fa?: string | null
          slug_fr?: string | null
          slug_id?: string | null
          slug_no?: string | null
          slug_ru?: string | null
          slug_sv?: string | null
          slug_tr?: string | null
          slug_ur?: string | null
          starting_price_eur?: string | null
          status?: string | null
          title: string
          tour_url?: string | null
          updated_at?: string
          video_url?: string | null
          views_count?: number
          year_built?: number | null
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
          buyer_fee_percent?: number | null
          citizenship_eligible?: boolean | null
          country?: string | null
          created_at?: string
          description?: string | null
          distance_to_airport_km?: string | null
          distance_to_beach_km?: string | null
          facilities?: string | null
          floor_plan_url?: string | null
          floors?: number | null
          google_maps_embed?: string | null
          id?: string
          interior_images?: string[] | null
          interior_scanned_at?: string | null
          is_active?: boolean
          language_code?: string | null
          location?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          parent_property_id?: string | null
          price?: string
          price_currency?: string | null
          property_district?: string | null
          property_facilities?: string[] | null
          property_image?: string | null
          property_images?: string[] | null
          property_prices_by_room?: string | null
          property_subtype?: string | null
          property_type?: string | null
          property_url?: string | null
          ref_no?: string | null
          related_property_ids?: string[] | null
          roi_percent?: number | null
          sizes_m2?: string | null
          slug?: string | null
          slug_ar?: string | null
          slug_da?: string | null
          slug_de?: string | null
          slug_es?: string | null
          slug_fa?: string | null
          slug_fr?: string | null
          slug_id?: string | null
          slug_no?: string | null
          slug_ru?: string | null
          slug_sv?: string | null
          slug_tr?: string | null
          slug_ur?: string | null
          starting_price_eur?: string | null
          status?: string | null
          title?: string
          tour_url?: string | null
          updated_at?: string
          video_url?: string | null
          views_count?: number
          year_built?: number | null
        }
        Relationships: []
      }
      property_insertion_log: {
        Row: {
          created_at: string
          id: string
          insertion_rate_check: boolean | null
          ip_address: string | null
          property_id: string | null
          source_info: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          insertion_rate_check?: boolean | null
          ip_address?: string | null
          property_id?: string | null
          source_info?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          insertion_rate_check?: boolean | null
          ip_address?: string | null
          property_id?: string | null
          source_info?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      property_text_translations: {
        Row: {
          created_at: string
          description: string
          id: string
          language_code: string
          location: string | null
          property_id: string
          source_hash: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          language_code: string
          location?: string | null
          property_id: string
          source_hash: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          language_code?: string
          location?: string | null
          property_id?: string
          source_hash?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_translations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          language_code: string
          location: string | null
          property_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          language_code: string
          location?: string | null
          property_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          language_code?: string
          location?: string | null
          property_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_translations_property_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          title?: string
          updated_at?: string
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
      testimonial_translations: {
        Row: {
          created_at: string
          designation: string | null
          id: string
          language_code: string
          review_text: string
          testimonial_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation?: string | null
          id?: string
          language_code: string
          review_text: string
          testimonial_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string | null
          id?: string
          language_code?: string
          review_text?: string
          testimonial_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonial_translations_fk"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
        ]
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
      [_ in never]: never
    }
    Functions: {
      get_top_properties: {
        Args: { days_back?: number; top_n?: number }
        Returns: {
          id: string
          location: string
          price: string
          title: string
          views: number
        }[]
      }
      get_traffic_summary: { Args: { days_back?: number }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
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
