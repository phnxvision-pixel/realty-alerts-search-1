# Complete Database Schema for Apartment Finder Pro

## Run this SQL in Supabase SQL Editor

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  provider TEXT, -- 'google', 'apple', or null for email/password
  provider_id TEXT, -- OAuth provider user ID
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMPTZ,
  subscription_status TEXT DEFAULT 'free',
  subscription_expiry TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  user_type TEXT CHECK (user_type IN ('tenant', 'landlord', 'vendor')),
  skipped_steps TEXT[] DEFAULT '{}',
  preferred_language TEXT DEFAULT 'de',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



-- Apartments table
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  square_feet INTEGER,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  images TEXT[],
  amenities TEXT[],
  available_date DATE,
  lease_term TEXT,
  pet_friendly BOOLEAN DEFAULT false,
  parking_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('tenant', 'landlord')),
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image')),
  file_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message reactions table
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Typing indicators table
CREATE TABLE typing_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User presence table
CREATE TABLE user_presence (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT false,
  last_seen_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message notification preferences table
CREATE TABLE message_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT false,
  sms_enabled BOOLEAN DEFAULT false,
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  priority_only BOOLEAN DEFAULT false,
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification history table (with email delivery tracking)
CREATE TABLE notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  priority TEXT DEFAULT 'normal',
  sent_via TEXT[], -- ['push', 'email', 'sms']
  read_at TIMESTAMPTZ,
  email_status TEXT CHECK (email_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  email_sent_at TIMESTAMPTZ,
  email_delivered_at TIMESTAMPTZ,
  email_error TEXT,
  sendgrid_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for email tracking
CREATE INDEX IF NOT EXISTS idx_notification_history_email_status ON notification_history(email_status);
CREATE INDEX IF NOT EXISTS idx_notification_history_sendgrid_id ON notification_history(sendgrid_message_id);


-- Push tokens table (for multiple devices)
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message templates table
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for message templates
CREATE INDEX IF NOT EXISTS idx_message_templates_landlord ON message_templates(landlord_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_category ON message_templates(category);
CREATE INDEX IF NOT EXISTS idx_message_templates_favorite ON message_templates(landlord_id, is_favorite);

-- Bulk messages table
CREATE TABLE bulk_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_filter JSONB NOT NULL,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bulk message recipients table
CREATE TABLE bulk_message_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bulk_message_id UUID REFERENCES bulk_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant preferences table
CREATE TABLE tenant_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  allow_bulk_messages BOOLEAN DEFAULT true,
  allow_marketing_emails BOOLEAN DEFAULT true,
  allow_property_updates BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for bulk messaging
CREATE INDEX IF NOT EXISTS idx_bulk_messages_landlord ON bulk_messages(landlord_id);
CREATE INDEX IF NOT EXISTS idx_bulk_messages_status ON bulk_messages(status);
CREATE INDEX IF NOT EXISTS idx_bulk_message_recipients_bulk ON bulk_message_recipients(bulk_message_id);
CREATE INDEX IF NOT EXISTS idx_tenant_preferences_user ON tenant_preferences(user_id);




-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_preferences ENABLE ROW LEVEL SECURITY;



-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view apartments" ON apartments FOR SELECT USING (true);
CREATE POLICY "Landlords can insert apartments" ON apartments FOR INSERT WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Landlords can update own apartments" ON apartments FOR UPDATE USING (auth.uid() = landlord_id);

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT 
  USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT 
  WITH CHECK (auth.uid() = tenant_id OR auth.uid() = landlord_id);

CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id 
    AND (tenant_id = auth.uid() OR landlord_id = auth.uid())));
CREATE POLICY "Users can send messages" ON messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view reactions" ON message_reactions FOR SELECT USING (true);
CREATE POLICY "Users can add reactions" ON message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON message_reactions FOR DELETE USING (auth.uid() = user_id);


-- Typing indicators policies
CREATE POLICY "Users can view typing in own conversations" ON typing_indicators FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id 
    AND (tenant_id = auth.uid() OR landlord_id = auth.uid())));
CREATE POLICY "Users can update typing status" ON typing_indicators FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User presence policies
CREATE POLICY "Anyone can view presence" ON user_presence FOR SELECT USING (true);
CREATE POLICY "Users can update own presence" ON user_presence FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notification preferences policies
CREATE POLICY "Users can view own preferences" ON message_notification_preferences FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON message_notification_preferences FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notification history policies
CREATE POLICY "Users can view own history" ON notification_history FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON notification_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Push tokens policies
CREATE POLICY "Users can view own tokens" ON push_tokens FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tokens" ON push_tokens FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Message templates policies
CREATE POLICY "Landlords can view their own templates" ON message_templates FOR SELECT
  USING (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));
CREATE POLICY "Landlords can create their own templates" ON message_templates FOR INSERT
  WITH CHECK (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));
CREATE POLICY "Landlords can update their own templates" ON message_templates FOR UPDATE
  USING (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));
CREATE POLICY "Landlords can delete their own templates" ON message_templates FOR DELETE
  USING (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));

-- Bulk messages policies
CREATE POLICY "Landlords can view their own bulk messages" ON bulk_messages FOR SELECT
  USING (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));
CREATE POLICY "Landlords can create bulk messages" ON bulk_messages FOR INSERT
  WITH CHECK (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));
CREATE POLICY "Landlords can update their own bulk messages" ON bulk_messages FOR UPDATE
  USING (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));
CREATE POLICY "Landlords can delete their own bulk messages" ON bulk_messages FOR DELETE
  USING (landlord_id IN (SELECT id FROM landlords WHERE user_id = auth.uid()));

-- Bulk message recipients policies
CREATE POLICY "Landlords can view recipients of their bulk messages" ON bulk_message_recipients FOR SELECT
  USING (bulk_message_id IN (
    SELECT id FROM bulk_messages WHERE landlord_id IN (
      SELECT id FROM landlords WHERE user_id = auth.uid()
    )
  ));

-- Tenant preferences policies
CREATE POLICY "Users can view their own preferences" ON tenant_preferences FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON tenant_preferences FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON tenant_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);



-- Create storage bucket for chat images
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-images', 'chat-images', true);

-- Storage policy for chat images
CREATE POLICY "Users can upload chat images" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view chat images" ON storage.objects FOR SELECT 
  USING (bucket_id = 'chat-images');
```
