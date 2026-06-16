-- ============================================================
-- GUJARATI CENSUS SURVEY — SEED DATA
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Clean up any existing data
TRUNCATE TABLE houses CASCADE;

-- Seed mock houses with census data
INSERT INTO houses (census_number, head_name, total_rooms, married_couples, has_car, has_tv, created_at, updated_at) VALUES
('C-001', 'રમેશભાઈ ગોવિંદભાઈ પટેલ', 3, 1, true, true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('C-002', 'સુરેશભાઈ નારણભાઈ ચૌધરી', 4, 2, false, true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('C-003', 'મહેશભાઈ કાંતિલાલ શાહ', 2, 1, false, false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('C-004', 'દિનેશભાઈ બાબુભાઈ વ્યાસ', 5, 2, true, true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('C-005', 'અશ્વિનભાઈ કરશનભાઈ ઠાકોર', 3, 1, false, true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('C-006', 'સંજયભાઈ હરજીવનભાઈ ગોહિલ', 4, 2, true, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('C-007', 'હરેશભાઈ નટવરલાલ વાઘેલા', 2, 1, false, false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('C-008', 'મનિષભાઈ અંબાલાલ સોની', 3, 1, false, true, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
('C-009', 'કિશોરભાઈ મણિલાલ ત્રિવેદી', 6, 3, true, true, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
('C-010', 'રાજેન્દ્રભાઈ રમણલાલ મેહતા', 4, 2, true, true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('C-011', 'જગદીશભાઈ શંભુભાઈ રબારી', 3, 1, false, true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('C-012', 'ભરતભાઈ ચીમનભાઈ સોલંકી', 2, 1, false, false, NOW(), NOW());
