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
      absences: {
        Row: {
          created_at: string
          decided_by: string | null
          ends_on: string
          id: string
          kind: string
          note: string | null
          starts_on: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          decided_by?: string | null
          ends_on: string
          id?: string
          kind?: string
          note?: string | null
          starts_on: string
          status?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          decided_by?: string | null
          ends_on?: string
          id?: string
          kind?: string
          note?: string | null
          starts_on?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_messages: {
        Row: {
          action_status: string | null
          actions: Json
          agent: string
          content: string
          conversation_id: string
          created_at: string
          id: string
          pending_action: Json | null
          role: string
          user_id: string
        }
        Insert: {
          action_status?: string | null
          actions?: Json
          agent?: string
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          pending_action?: Json | null
          role: string
          user_id?: string
        }
        Update: {
          action_status?: string | null
          actions?: Json
          agent?: string
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          pending_action?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
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
      approvals: {
        Row: {
          amount_eur: number | null
          approver_id: string | null
          created_at: string
          decided_at: string | null
          details: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          kind: string
          requested_by: string | null
          status: string
          title: string
        }
        Insert: {
          amount_eur?: number | null
          approver_id?: string | null
          created_at?: string
          decided_at?: string | null
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: string
          requested_by?: string | null
          status?: string
          title: string
        }
        Update: {
          amount_eur?: number | null
          approver_id?: string | null
          created_at?: string
          decided_at?: string | null
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: string
          requested_by?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          actions: Json
          active: boolean
          conditions: Json
          created_at: string
          created_by: string | null
          id: string
          name: string
          trigger_event: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          active?: boolean
          conditions?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          trigger_event: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          active?: boolean
          conditions?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          trigger_event?: string
          updated_at?: string
        }
        Relationships: []
      }
      automation_runs: {
        Row: {
          created_at: string
          detail: Json
          entity_id: string | null
          event: string
          id: string
          rule_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          detail?: Json
          entity_id?: string | null
          event: string
          id?: string
          rule_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          detail?: Json
          entity_id?: string | null
          event?: string
          id?: string
          rule_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
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
      calendar_events: {
        Row: {
          client_email: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          ends_at: string | null
          id: string
          kind: string
          lead_id: string | null
          location: string | null
          notes: string | null
          notify_client: boolean
          owner_id: string | null
          property_ref: string | null
          remind_minutes: number
          reminder_sent_at: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          client_email?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          ends_at?: string | null
          id?: string
          kind?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          notify_client?: boolean
          owner_id?: string | null
          property_ref?: string | null
          remind_minutes?: number
          reminder_sent_at?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          client_email?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          ends_at?: string | null
          id?: string
          kind?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          notify_client?: boolean
          owner_id?: string | null
          property_ref?: string | null
          remind_minutes?: number
          reminder_sent_at?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          created_at: string
          direction: string
          duration_min: number | null
          id: string
          lead_id: string | null
          notes: string | null
          outcome: string
          phone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          direction?: string
          duration_min?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          direction?: string
          duration_min?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string
          phone?: string | null
          user_id?: string | null
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
      chat_channels: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_direct: boolean
          member_ids: string[]
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_direct?: boolean
          member_ids?: string[]
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_direct?: boolean
          member_ids?: string[]
          name?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          author_id: string | null
          body: string
          channel_id: string
          created_at: string
          id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          channel_id: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          channel_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_reads: {
        Row: {
          channel_id: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_reads_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          country: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          owner_id: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      composio_sessions: {
        Row: {
          agent: string
          created_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          agent: string
          created_at?: string
          session_id: string
          user_id: string
        }
        Update: {
          agent?: string
          created_at?: string
          session_id?: string
          user_id?: string
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
      course_progress: {
        Row: {
          completed_at: string
          module_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          module_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          module_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
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
      customer_accounts: {
        Row: {
          budget: string | null
          created_at: string
          email: string
          full_name: string | null
          last_seen_at: string | null
          lead_id: string | null
          phone: string | null
          preferred_language: string | null
          stage: string
          user_id: string
          wishes: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          last_seen_at?: string | null
          lead_id?: string | null
          phone?: string | null
          preferred_language?: string | null
          stage?: string
          user_id: string
          wishes?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          last_seen_at?: string | null
          lead_id?: string | null
          phone?: string | null
          preferred_language?: string | null
          stage?: string
          user_id?: string
          wishes?: string | null
        }
        Relationships: []
      }
      deal_stage_history: {
        Row: {
          changed_by: string | null
          created_at: string
          deal_id: string
          from_stage: string | null
          id: string
          to_stage: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          deal_id: string
          from_stage?: string | null
          id?: string
          to_stage: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          deal_id?: string
          from_stage?: string | null
          id?: string
          to_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_stage_history_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          client_email: string | null
          client_name: string | null
          company_id: string | null
          country: string | null
          created_at: string
          created_by: string | null
          expected_close: string | null
          id: string
          lead_id: string | null
          owner_id: string | null
          position: number
          property_ref: string | null
          stage: string
          stage_changed_at: string
          title: string
          updated_at: string
          value_eur: number
        }
        Insert: {
          client_email?: string | null
          client_name?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          expected_close?: string | null
          id?: string
          lead_id?: string | null
          owner_id?: string | null
          position?: number
          property_ref?: string | null
          stage?: string
          stage_changed_at?: string
          title: string
          updated_at?: string
          value_eur?: number
        }
        Update: {
          client_email?: string | null
          client_name?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          expected_close?: string | null
          id?: string
          lead_id?: string | null
          owner_id?: string | null
          position?: number
          property_ref?: string | null
          stage?: string
          stage_changed_at?: string
          title?: string
          updated_at?: string
          value_eur?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          head_id: string | null
          id: string
          name: string
          office: string | null
        }
        Insert: {
          created_at?: string
          head_id?: string | null
          id?: string
          name: string
          office?: string | null
        }
        Update: {
          created_at?: string
          head_id?: string | null
          id?: string
          name?: string
          office?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          deal_id: string | null
          filename: string
          id: string
          lead_id: string | null
          mime: string | null
          path: string
          property_ref: string | null
          size_bytes: number | null
          tags: string[]
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          deal_id?: string | null
          filename: string
          id?: string
          lead_id?: string | null
          mime?: string | null
          path: string
          property_ref?: string | null
          size_bytes?: number | null
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          deal_id?: string | null
          filename?: string
          id?: string
          lead_id?: string | null
          mime?: string | null
          path?: string
          property_ref?: string | null
          size_bytes?: number | null
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_files: {
        Row: {
          created_at: string
          filename: string
          folder_id: string | null
          id: string
          mime: string | null
          path: string
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          filename: string
          folder_id?: string | null
          id?: string
          mime?: string | null
          path: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          filename?: string
          folder_id?: string | null
          id?: string
          mime?: string | null
          path?: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "drive_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_folders: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "drive_folders"
            referencedColumns: ["id"]
          },
        ]
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
      employee_profiles: {
        Row: {
          created_at: string
          department_id: string | null
          full_name: string | null
          languages: string[]
          manager_id: string | null
          office: string | null
          phone: string | null
          photo_url: string | null
          scope: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          full_name?: string | null
          languages?: string[]
          manager_id?: string | null
          office?: string | null
          phone?: string | null
          photo_url?: string | null
          scope?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          full_name?: string | null
          languages?: string[]
          manager_id?: string | null
          office?: string | null
          phone?: string | null
          photo_url?: string | null
          scope?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
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
      feed_comments: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          post_id: string | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          post_id?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          kind: string
          likes: string[]
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: string
          likes?: string[]
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: string
          likes?: string[]
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
      inbox_conversations: {
        Row: {
          assigned_to: string | null
          channel: string
          contact_handle: string
          contact_name: string | null
          created_at: string
          id: string
          last_inbound_at: string | null
          last_message_at: string
          lead_id: string | null
          status: string
          unread_count: number
        }
        Insert: {
          assigned_to?: string | null
          channel?: string
          contact_handle: string
          contact_name?: string | null
          created_at?: string
          id?: string
          last_inbound_at?: string | null
          last_message_at?: string
          lead_id?: string | null
          status?: string
          unread_count?: number
        }
        Update: {
          assigned_to?: string | null
          channel?: string
          contact_handle?: string
          contact_name?: string | null
          created_at?: string
          id?: string
          last_inbound_at?: string | null
          last_message_at?: string
          lead_id?: string | null
          status?: string
          unread_count?: number
        }
        Relationships: []
      }
      inbox_messages: {
        Row: {
          author_id: string | null
          body: string
          conversation_id: string
          created_at: string
          direction: string
          error: Json | null
          id: string
          media: Json | null
          provider_message_id: string | null
          status: string
          status_at: string | null
          status_times: Json
        }
        Insert: {
          author_id?: string | null
          body?: string
          conversation_id: string
          created_at?: string
          direction: string
          error?: Json | null
          id?: string
          media?: Json | null
          provider_message_id?: string | null
          status?: string
          status_at?: string | null
          status_times?: Json
        }
        Update: {
          author_id?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          direction?: string
          error?: Json | null
          id?: string
          media?: Json | null
          provider_message_id?: string | null
          status?: string
          status_at?: string | null
          status_times?: Json
        }
        Relationships: [
          {
            foreignKeyName: "inbox_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "inbox_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_analyses: {
        Row: {
          created_at: string
          id: string
          property_ref: string
          result: Json
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_ref: string
          result: Json
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_ref?: string
          result?: Json
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoice_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          method: string | null
          note: string | null
          paid_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          method?: string | null
          note?: string | null
          paid_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          method?: string | null
          note?: string | null
          paid_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_email: string | null
          client_name: string
          created_at: string
          created_by: string | null
          currency: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_no: string
          issue_date: string
          notes: string | null
          quote_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_no?: string
          issue_date?: string
          notes?: string | null
          quote_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_no?: string
          issue_date?: string
          notes?: string | null
          quote_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
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
      lead_routing_rules: {
        Row: {
          active: boolean
          assignees: string[]
          created_at: string
          id: string
          match_country: string | null
          match_language: string | null
          match_source: string | null
          name: string
          next_index: number
          priority: number
        }
        Insert: {
          active?: boolean
          assignees?: string[]
          created_at?: string
          id?: string
          match_country?: string | null
          match_language?: string | null
          match_source?: string | null
          name: string
          next_index?: number
          priority?: number
        }
        Update: {
          active?: boolean
          assignees?: string[]
          created_at?: string
          id?: string
          match_country?: string | null
          match_language?: string | null
          match_source?: string | null
          name?: string
          next_index?: number
          priority?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_currency: string | null
          budget_max: number | null
          budget_min: number | null
          company_id: string | null
          created_at: string
          email: string | null
          first_response_at: string | null
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
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_response_at?: string | null
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
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_response_at?: string | null
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
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          calendar_event_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          id: string
          lead_id: string | null
          notes: string | null
          room_url: string
          starts_at: string
          summary: string | null
          title: string
        }
        Insert: {
          calendar_event_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          room_url: string
          starts_at?: string
          summary?: string | null
          title: string
        }
        Update: {
          calendar_event_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          room_url?: string
          starts_at?: string
          summary?: string | null
          title?: string
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
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
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
      portal_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          customer_id: string
          from_staff: boolean
          id: string
          read_at: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          customer_id: string
          from_staff?: boolean
          id?: string
          read_at?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          customer_id?: string
          from_staff?: boolean
          id?: string
          read_at?: string | null
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
      project_tasks: {
        Row: {
          assignee_id: string | null
          checklist: Json
          created_at: string
          depends_on: string | null
          ends_on: string | null
          id: string
          position: number
          project_id: string
          starts_on: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          checklist?: Json
          created_at?: string
          depends_on?: string | null
          ends_on?: string | null
          id?: string
          position?: number
          project_id: string
          starts_on?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          checklist?: Json
          created_at?: string
          depends_on?: string | null
          ends_on?: string | null
          id?: string
          position?: number
          project_id?: string
          starts_on?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_depends_on_fkey"
            columns: ["depends_on"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string | null
          deal_id: string | null
          description: string | null
          ends_on: string | null
          id: string
          name: string
          owner_id: string | null
          starts_on: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          ends_on?: string | null
          id?: string
          name: string
          owner_id?: string | null
          starts_on?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          ends_on?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          starts_on?: string | null
          status?: string
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
          model_3d: Json | null
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
          model_3d?: Json | null
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
          model_3d?: Json | null
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
      quote_items: {
        Row: {
          description: string
          id: string
          position: number
          qty: number
          quote_id: string
          unit_price: number
        }
        Insert: {
          description?: string
          id?: string
          position?: number
          qty?: number
          quote_id: string
          unit_price?: number
        }
        Update: {
          description?: string
          id?: string
          position?: number
          qty?: number
          quote_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_email: string | null
          client_name: string
          created_at: string
          created_by: string | null
          currency: string
          deal_id: string | null
          discount_pct: number
          id: string
          lead_id: string | null
          notes: string | null
          payment_plan: string | null
          property_ref: string | null
          quote_no: string
          status: string
          unit_type: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deal_id?: string | null
          discount_pct?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_plan?: string | null
          property_ref?: string | null
          quote_no?: string
          status?: string
          unit_type?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deal_id?: string | null
          discount_pct?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_plan?: string | null
          property_ref?: string | null
          quote_no?: string
          status?: string
          unit_type?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_reports: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
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
      share_links: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          file_id: string
          id: string
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at: string
          file_id: string
          id?: string
          token?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          file_id?: string
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_links_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "drive_files"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_items: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          kind: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          kind: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          kind?: string
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      signature_requests: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          deal_id: string | null
          expires_at: string
          id: string
          quote_id: string | null
          signature_png: string | null
          signed_at: string | null
          signed_name: string | null
          signer_email: string | null
          signer_ip: string | null
          signer_name: string
          signer_ua: string | null
          status: string
          title: string
          token: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          expires_at?: string
          id?: string
          quote_id?: string | null
          signature_png?: string | null
          signed_at?: string | null
          signed_name?: string | null
          signer_email?: string | null
          signer_ip?: string | null
          signer_name: string
          signer_ua?: string | null
          status?: string
          title: string
          token?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          expires_at?: string
          id?: string
          quote_id?: string | null
          signature_png?: string | null
          signed_at?: string | null
          signed_name?: string | null
          signer_email?: string | null
          signer_ip?: string | null
          signer_name?: string
          signer_ua?: string | null
          status?: string
          title?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          id: string
          preferred_at: string | null
          property_ref: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          preferred_at?: string | null
          property_ref?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          preferred_at?: string | null
          property_ref?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_comments: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          task_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          task_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          task_id?: string
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
      ticket_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          from_staff: boolean
          id: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          from_staff?: boolean
          id?: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          from_staff?: boolean
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          note: string | null
          project_task_id: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          note?: string | null
          project_task_id?: string | null
          started_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          note?: string | null
          project_task_id?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_project_task_id_fkey"
            columns: ["project_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
        ]
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
      whatsapp_webhook_events: {
        Row: {
          attempts: number
          delivery_id: string
          event: string
          id: string
          next_attempt_at: string
          payload: Json
          processed_at: string | null
          processing_error: string | null
          received_at: string
        }
        Insert: {
          attempts?: number
          delivery_id: string
          event: string
          id?: string
          next_attempt_at?: string
          payload: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
        }
        Update: {
          attempts?: number
          delivery_id?: string
          event?: string
          id?: string
          next_attempt_at?: string
          payload?: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
        }
        Relationships: []
      }
      wiki_pages: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
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
      is_shared_with_me: {
        Args: { _item: string; _kind: string }
        Returns: boolean
      }
      link_customer_account: {
        Args: never
        Returns: {
          budget: string | null
          created_at: string
          email: string
          full_name: string | null
          last_seen_at: string | null
          lead_id: string | null
          phone: string | null
          preferred_language: string | null
          stage: string
          user_id: string
          wishes: string | null
        }
        SetofOptions: {
          from: "*"
          to: "customer_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      list_admin_users: {
        Args: never
        Returns: {
          email: string
          id: string
        }[]
      }
      run_automations: {
        Args: { _ctx: Json; _entity_id: string; _event: string }
        Returns: undefined
      }
      sees_all_crm: { Args: { _uid: string }; Returns: boolean }
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
