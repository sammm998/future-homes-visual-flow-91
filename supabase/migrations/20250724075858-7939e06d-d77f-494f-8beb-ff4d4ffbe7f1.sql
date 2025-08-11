-- Update conversations table to track message count and contact collection
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS contact_collected BOOLEAN DEFAULT FALSE;

-- Update contacts table to be more comprehensive
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS collected_at TIMESTAMP WITH TIME ZONE DEFAULT now();