-- ============================================================
-- GUJARATI CENSUS SURVEY — DATABASE SCHEMA
-- Run this in Supabase SQL Editor FIRST
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- HOUSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_no INTEGER NOT NULL UNIQUE,
  owner_name TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'draft', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_houses_status ON houses(status);
CREATE INDEX IF NOT EXISTS idx_houses_house_no ON houses(house_no);

-- ============================================================
-- QUESTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_no INTEGER NOT NULL UNIQUE,
  question_text_gujarati TEXT NOT NULL,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('text', 'number', 'radio', 'select')),
  default_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_question_no ON questions(question_no);

-- ============================================================
-- QUESTION OPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);

-- ============================================================
-- HOUSE ANSWERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS house_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(house_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_house_answers_house_id ON house_answers(house_id);
CREATE INDEX IF NOT EXISTS idx_house_answers_question_id ON house_answers(question_id);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_houses_updated_at
  BEFORE UPDATE ON houses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_house_answers_updated_at
  BEFORE UPDATE ON house_answers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_answers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can read houses" ON houses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert houses" ON houses
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update houses" ON houses
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read questions" ON questions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read question_options" ON question_options
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read house_answers" ON house_answers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert house_answers" ON house_answers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update house_answers" ON house_answers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete house_answers" ON house_answers
  FOR DELETE TO authenticated USING (true);
