/*
  # Project Management System Schema

  1. New Tables
    - `user_profiles`
      - Extends auth.users with additional profile information
      - Stores user role (member/creator), tier, loyalty points
      - Tracks verification status and metadata
    
    - `projects`
      - Main projects table for tracking all projects
      - Links to client (member) and provider (creator/team/agency)
      - Stores project details, budget, timeline, status
      - Tracks payment and completion information
    
    - `project_milestones`
      - Tracks project progress with milestones
      - Each milestone has description, status, due date
      - Links to parent project
    
    - `project_messages`
      - Real-time messaging between clients and providers
      - Stores message content, sender, timestamp
      - Links to project for context
    
    - `project_transactions`
      - Financial records for all project payments
      - Tracks amount, status, payment method
      - Links receipts and invoices
    
    - `project_reviews`
      - Reviews and ratings from both parties
      - Stores rating (1-5), review text, response
      - Links to project and reviewer
    
    - `notifications`
      - System notifications for users
      - Tracks hiring, messages, payments, milestones
      - Marks read/unread status
    
    - `user_analytics`
      - Analytics data for creators
      - Tracks views, engagement, demographics
      - Performance metrics over time

  2. Security
    - Enable RLS on all tables
    - Users can only view their own data
    - Project participants can access project data
    - Secure messaging between authorized parties
    - Transaction data restricted to involved parties

  3. Indexes
    - Optimized queries for projects by user
    - Fast message retrieval by project
    - Efficient notification lookups
    - Analytics aggregation support
*/

-- User Profiles Extension
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'creator')),
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'professional', 'elite')),
  loyalty_points integer DEFAULT 0,
  profile_image text,
  bio text,
  location text,
  skills text[],
  hourly_rate integer,
  is_verified boolean DEFAULT false,
  portfolio_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  client_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  provider_type text CHECK (provider_type IN ('talent', 'team', 'agency')),
  category text,
  budget_amount integer NOT NULL DEFAULT 0,
  budget_currency text DEFAULT 'UGX',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'in_progress', 'review', 'completed', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  start_date timestamptz,
  due_date timestamptz,
  completed_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project Milestones
CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date timestamptz,
  completed_date timestamptz,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project Messages
CREATE TABLE IF NOT EXISTS project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  message_text text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Project Transactions
CREATE TABLE IF NOT EXISTS project_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  payer_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  currency text DEFAULT 'UGX',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text,
  receipt_url text,
  invoice_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project Reviews
CREATE TABLE IF NOT EXISTS project_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  response_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('hired', 'message', 'payment', 'milestone', 'review', 'project_update')),
  title text NOT NULL,
  message text NOT NULL,
  link text,
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User Analytics (for Creators)
CREATE TABLE IF NOT EXISTS user_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  profile_views integer DEFAULT 0,
  project_inquiries integer DEFAULT 0,
  projects_won integer DEFAULT 0,
  revenue_earned integer DEFAULT 0,
  avg_rating numeric(3,2),
  client_demographics jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public profiles viewable by all authenticated users"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects as client"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = projects.client_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own projects as provider"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = projects.provider_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = projects.client_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update their projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = projects.client_id
      AND user_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = projects.client_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update assigned projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = projects.provider_id
      AND user_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = projects.provider_id
      AND user_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for project_milestones
CREATE POLICY "Project participants can view milestones"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      WHERE projects.id = project_milestones.project_id
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  );

CREATE POLICY "Project participants can insert milestones"
  ON project_milestones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      WHERE projects.id = project_milestones.project_id
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  );

CREATE POLICY "Project participants can update milestones"
  ON project_milestones FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      WHERE projects.id = project_milestones.project_id
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      WHERE projects.id = project_milestones.project_id
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  );

-- RLS Policies for project_messages
CREATE POLICY "Project participants can view messages"
  ON project_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      WHERE projects.id = project_messages.project_id
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  );

CREATE POLICY "Project participants can send messages"
  ON project_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      JOIN user_profiles AS sender ON project_messages.sender_id = sender.id
      WHERE projects.id = project_messages.project_id
      AND sender.user_id = auth.uid()
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  );

CREATE POLICY "Message recipients can mark as read"
  ON project_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      WHERE projects.id = project_messages.project_id
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      JOIN user_profiles AS client ON projects.client_id = client.id
      LEFT JOIN user_profiles AS provider ON projects.provider_id = provider.id
      WHERE projects.id = project_messages.project_id
      AND (client.user_id = auth.uid() OR provider.user_id = auth.uid())
    )
  );

-- RLS Policies for project_transactions
CREATE POLICY "Transaction participants can view transactions"
  ON project_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE (user_profiles.id = project_transactions.payer_id OR user_profiles.id = project_transactions.recipient_id)
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Payers can create transactions"
  ON project_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = project_transactions.payer_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Transaction participants can update transactions"
  ON project_transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE (user_profiles.id = project_transactions.payer_id OR user_profiles.id = project_transactions.recipient_id)
      AND user_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE (user_profiles.id = project_transactions.payer_id OR user_profiles.id = project_transactions.recipient_id)
      AND user_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for project_reviews
CREATE POLICY "Users can view reviews for their projects"
  ON project_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE (user_profiles.id = project_reviews.reviewer_id OR user_profiles.id = project_reviews.reviewee_id)
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reviews"
  ON project_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = project_reviews.reviewer_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Reviewees can respond to reviews"
  ON project_reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = project_reviews.reviewee_id
      AND user_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = project_reviews.reviewee_id
      AND user_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = notifications.user_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = notifications.user_id
      AND user_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = notifications.user_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = notifications.user_id
      AND user_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for user_analytics
CREATE POLICY "Users can view own analytics"
  ON user_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = user_analytics.user_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analytics"
  ON user_analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = user_analytics.user_id
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own analytics"
  ON user_analytics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = user_analytics.user_id
      AND user_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = user_analytics.user_id
      AND user_profiles.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_provider ON projects(provider_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_messages_project ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created ON project_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_date ON user_analytics(user_id, date DESC);
