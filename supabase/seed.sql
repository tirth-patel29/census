-- ============================================================
-- GUJARATI CENSUS SURVEY — SEED DATA (REDUCED Q1-Q7)
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Clean up any existing data
TRUNCATE TABLE house_answers CASCADE;
TRUNCATE TABLE question_options CASCADE;
TRUNCATE TABLE questions CASCADE;
TRUNCATE TABLE houses CASCADE;

-- ============================================================
-- SEED QUESTIONS (Exactly Q1-Q7)
-- ============================================================

-- Q1: જનગણના નંબર
INSERT INTO questions (id, question_no, question_text_gujarati, answer_type, default_value)
VALUES ('11111111-1111-1111-1111-111111111111', 1, 'જનગણના નંબર', 'text', NULL);

-- Q2: મકાન નંબર
INSERT INTO questions (id, question_no, question_text_gujarati, answer_type, default_value)
VALUES ('22222222-2222-2222-2222-222222222222', 2, 'મકાન નંબર', 'text', NULL);

-- Q3: વડા નું નામ
INSERT INTO questions (id, question_no, question_text_gujarati, answer_type, default_value)
VALUES ('33333333-3333-3333-3333-333333333333', 3, 'વડા નું નામ', 'text', NULL);

-- Q4: ટોટલ રૂમ
INSERT INTO questions (id, question_no, question_text_gujarati, answer_type, default_value)
VALUES ('44444444-4444-4444-4444-444444444444', 4, 'ટોટલ રૂમ', 'number', NULL);

-- Q5: પરિણિત દંપતિ ની સંખ્યા
INSERT INTO questions (id, question_no, question_text_gujarati, answer_type, default_value)
VALUES ('55555555-5555-5555-5555-555555555555', 5, 'પરિણિત દંપતિ ની સંખ્યા', 'number', NULL);

-- Q6: કાર / જીપ
INSERT INTO questions (id, question_no, question_text_gujarati, answer_type, default_value)
VALUES ('66666666-6666-6666-6666-666666666666', 6, 'કાર / જીપ', 'radio', 'ના');

-- Q7: ટીવી
INSERT INTO questions (id, question_no, question_text_gujarati, answer_type, default_value)
VALUES ('77777777-7777-7777-7777-777777777777', 7, 'ટીવી', 'radio', 'ના');

-- ============================================================
-- SEED QUESTION OPTIONS (For Q6 & Q7)
-- ============================================================

-- Q6 Options: કાર / જીપ
INSERT INTO question_options (question_id, option_label, sort_order)
VALUES 
('66666666-6666-6666-6666-666666666666', 'હા', 1),
('66666666-6666-6666-6666-666666666666', 'ના', 2);

-- Q7 Options: ટીવી
INSERT INTO question_options (question_id, option_label, sort_order)
VALUES 
('77777777-7777-7777-7777-777777777777', 'હા', 1),
('77777777-7777-7777-7777-777777777777', 'ના', 2);

-- ============================================================
-- SEED 320 HOUSES
-- ============================================================
INSERT INTO houses (house_no, owner_name, area, status)
SELECT
  gs AS house_no,
  'મકાન-' || gs || ' (માલિક)' AS owner_name,
  CASE
    WHEN gs BETWEEN 1 AND 80 THEN 'વિસ્તાર-A'
    WHEN gs BETWEEN 81 AND 160 THEN 'વિસ્તાર-B'
    WHEN gs BETWEEN 161 AND 240 THEN 'વિસ્તાર-C'
    ELSE 'વિસ્તાર-D'
  END AS area,
  'pending' AS status
FROM generate_series(1, 320) AS gs;
