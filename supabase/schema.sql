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
  census_number TEXT NOT NULL DEFAULT '',
  head_name TEXT NOT NULL DEFAULT '',
  total_rooms INTEGER NOT NULL DEFAULT 0,
  married_couples INTEGER NOT NULL DEFAULT 0,
  has_car BOOLEAN NOT NULL DEFAULT false,
  has_tv BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for faster search
CREATE INDEX IF NOT EXISTS idx_houses_census_number ON houses(census_number);
CREATE INDEX IF NOT EXISTS idx_houses_head_name ON houses(head_name);

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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can read houses" ON houses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert houses" ON houses
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update houses" ON houses
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete houses" ON houses
  FOR DELETE TO authenticated USING (true);
