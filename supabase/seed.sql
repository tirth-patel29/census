-- ============================================================
-- GUJARATI CENSUS SURVEY — SEED DATA
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- SEED QUESTIONS (All 34 Gujarati Census Questions)
-- ============================================================

-- Q1: ટીટી નંબર
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (1, 'ટીટી નંબર', 'text', NULL);

-- Q2: મકાન નંબર
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (2, 'મકાન નંબર', 'number', NULL);

-- Q3: જનગણના ઘર નંબર
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (3, 'જનગણના ઘર નંબર', 'number', NULL);

-- Q4: ભોંયતળિયામાં વપરાયેલ મુખ્ય સામગ્રી
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (4, 'ભોંયતળિયામાં વપરાયેલ મુખ્ય સામગ્રી', 'radio', 'સિમેન્ટ');

-- Q5: દિવાલમાં વપરાયેલ મુખ્ય સામગ્રી
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (5, 'દિવાલમાં વપરાયેલ મુખ્ય સામગ્રી', 'radio', 'પાકી ઈંટ');

-- Q6: છતમાં વપરાયેલ મુખ્ય સામગ્રી
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (6, 'છતમાં વપરાયેલ મુખ્ય સામગ્રી', 'radio', 'કોંક્રીટ');

-- Q7: મકાનની સ્થિતિ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (7, 'મકાનની સ્થિતિ', 'radio', 'સારી સ્થિતિ');

-- Q8: મકાનનો ઉપયોગ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (8, 'મકાનનો ઉપયોગ', 'radio', 'ફક્ત રહેઠાણ');

-- Q9: પીવાના પાણીનો મુખ્ય સ્ત્રોત
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (9, 'પીવાના પાણીનો મુખ્ય સ્ત્રોત', 'radio', 'નળ (ઘરમાં)');

-- Q10: પીવાના પાણીના સ્ત્રોતની ઉપલબ્ધતા
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (10, 'પીવાના પાણીના સ્ત્રોતની ઉપલબ્ધતા', 'radio', 'ઘરની અંદર');

-- Q11: રોશનીનો મુખ્ય સ્ત્રોત
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (11, 'રોશનીનો મુખ્ય સ્ત્રોત', 'radio', 'વીજળી');

-- Q12: શૌચાલયની સ્થિતિ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (12, 'શૌચાલયની સ્થિતિ', 'radio', 'ઘરમાં છે');

-- Q13: શૌચાલયનો પ્રકાર
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (13, 'શૌચાલયનો પ્રકાર', 'radio', 'ફ્લોર સ્વ-ફ્લશ / ફ્લશ');

-- Q14: ગંદા પાણીના નિકાલની વ્યવસ્થા
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (14, 'ગંદા પાણીના નિકાલની વ્યવસ્થા', 'radio', 'બંધ ગટર');

-- Q15: રસોઈ માટેના ઇંધણનો પ્રકાર
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (15, 'રસોઈ માટેના ઇંધણનો પ્રકાર', 'radio', 'LPG / PNG');

-- Q16: રસોઈઘરની ઉપલબ્ધતા
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (16, 'રસોઈઘર / ચૂલો ક્યાં છે?', 'radio', 'ઘરમાં અલગ રૂમ');

-- Q17: રેડિયો / ટ્રાન્ઝિસ્ટર
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (17, 'રેડિયો / ટ્રાન્ઝિસ્ટર', 'radio', 'ના');

-- Q18: ટેલિવિઝન
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (18, 'ટેલિવિઝન', 'radio', 'હા');

-- Q19: કમ્પ્યૂટર / લેપટોપ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (19, 'કમ્પ્યૂટર / લેપટોપ', 'radio', 'ના');

-- Q20: ટેલિફોન / મોબાઇલ ફોન
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (20, 'ટેલિફોન / મોબાઇલ ફોન', 'radio', 'ફક્ત મોબાઇલ ફોન');

-- Q21: સાયકલ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (21, 'સાયકલ', 'radio', 'ના');

-- Q22: સ્કૂટર / મોટરસાયકલ / મોપેડ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (22, 'સ્કૂટર / મોટરસાયકલ / મોપેડ', 'radio', 'ના');

-- Q23: કાર / જીપ / વેન
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (23, 'કાર / જીપ / વેન', 'radio', 'ના');

-- Q24: કુટુંબના સભ્યોની સંખ્યા
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (24, 'કુટુંબના સભ્યોની કુલ સંખ્યા', 'number', NULL);

-- Q25: કુટુંબના વડાનું નામ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (25, 'કુટુંબના વડાનું નામ', 'text', NULL);

-- Q26: કુટુંબના વડાનું લિંગ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (26, 'કુટુંબના વડાનું લિંગ', 'radio', 'પુરુષ');

-- Q27: જ્ઞાતિ / અનુસૂચિત જ્ઞાતિ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (27, 'કુટુંબ કઈ જ્ઞાતિ-શ્રેણીમાં આવે છે?', 'radio', 'સામાન્ય');

-- Q28: ધર્મ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (28, 'ધર્મ', 'radio', 'હિન્દુ');

-- Q29: મુખ્ય આવકનો સ્ત્રોત
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (29, 'મુખ્ય આવકનો સ્ત્રોત', 'radio', 'નોકરી / વ્યવસાય');

-- Q30: માસિક આવક (રૂ.)
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (30, 'માસિક આવક (રૂ.)', 'number', NULL);

-- Q31: રેશન કાર્ડ
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (31, 'રેશન કાર્ડ ધરાવે છે?', 'radio', 'હા');

-- Q32: મકાનની માલિકી
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (32, 'મકાનની માલિકી', 'radio', 'પોતાની');

-- Q33: જમીનની માલિકી
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (33, 'જમીનની માલિકી', 'radio', 'ખેતીની જમીન ધરાવે છે');

-- Q34: ખેતીલાયક જમીન (વીઘા)
INSERT INTO questions (question_no, question_text_gujarati, answer_type, default_value)
VALUES (34, 'ખેતીલાયક જમીન (વીઘામાં)', 'number', NULL);

-- ============================================================
-- SEED QUESTION OPTIONS
-- ============================================================

-- Q4 Options: ભોંયતળિયામાં વપરાયેલ મુખ્ય સામગ્રી
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('માટી', 1),
  ('લાકડું / વાંસ', 2),
  ('પાકી ઈંટ', 3),
  ('પથ્થર', 4),
  ('સિમેન્ટ', 5),
  ('મોઝેક / ફ્લોર ટાઇલ્સ', 6),
  ('અન્ય', 7)
) AS opt(label, ord)
WHERE question_no = 4;

-- Q5 Options: દિવાલમાં વપરાયેલ મુખ્ય સામગ્રી
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ઘાસ / ખડ / વાંસ વગેરે', 1),
  ('પ્લાસ્ટિક / પોલિથીન', 2),
  ('માટી / કાચી ઈંટ', 3),
  ('લાકડું', 4),
  ('ગરા વિના જડેલ પથ્થર', 5),
  ('ગરા સાથે જડેલ પથ્થર', 6),
  ('ગેલ્વેનાઇઝ્ડ / ધાતુ / સિમેન્ટના પતરા', 7),
  ('પાકી ઈંટ', 8),
  ('કોંક્રીટ', 9),
  ('અન્ય', 10)
) AS opt(label, ord)
WHERE question_no = 5;

-- Q6 Options: છતમાં વપરાયેલ મુખ્ય સામગ્રી
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ઘાસ / ખડ / વાંસ / લાકડું / માટી વગેરે', 1),
  ('પ્લાસ્ટિક / પોલિથીન', 2),
  ('દેશી ઘાસ બનાવટનાં નળિયાં', 3),
  ('મશીન બનાવટનાં નળિયાં', 4),
  ('પાકી ઈંટ', 5),
  ('પથ્થર', 6),
  ('સ્લેટ', 7),
  ('ગેલ્વેનાઇઝ્ડ / ધાતુ / સિમેન્ટના પતરા', 8),
  ('કોંક્રીટ', 9),
  ('અન્ય', 10)
) AS opt(label, ord)
WHERE question_no = 6;

-- Q7 Options: મકાનની સ્થિતિ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('સારી સ્થિતિ', 1),
  ('વ્યવહારુ સ્થિતિ', 2),
  ('જીર્ણ / ખરાબ સ્થિતિ', 3)
) AS opt(label, ord)
WHERE question_no = 7;

-- Q8 Options: મકાનનો ઉપયોગ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ફક્ત રહેઠાણ', 1),
  ('રહેઠાણ અને અન્ય ઉપયોગ', 2),
  ('ફક્ત દુકાન / ઑફિસ', 3),
  ('ઉદ્યોગ / ફેક્ટરી', 4),
  ('ધર્મ / શૈક્ષણિક', 5),
  ('ખાલી / બિનવ્યવહારુ', 6),
  ('અન્ય', 7)
) AS opt(label, ord)
WHERE question_no = 8;

-- Q9 Options: પીવાના પાણીનો મુખ્ય સ્ત્રોત
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('નળ (ઘરમાં)', 1),
  ('નળ (ઘર બહાર)', 2),
  ('ટ્યૂબ-વેલ / હેન્ડ-પંપ', 3),
  ('કૂવો (ઢાંકેલો)', 4),
  ('કૂવો (ખુલ્લો)', 5),
  ('નદી / નહેર', 6),
  ('ટેન્ક / તળાવ / તળાવ', 7),
  ('અન્ય', 8)
) AS opt(label, ord)
WHERE question_no = 9;

-- Q10 Options: પીવાના પાણીના સ્ત્રોતની ઉપલબ્ધતા
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ઘરની અંદર', 1),
  ('ઘર નજીક (50 મીટરથી ઓછું)', 2),
  ('ઘર નજીક (50-200 મીટર)', 3),
  ('ઘરથી દૂર (200 મીટરથી વધુ)', 4)
) AS opt(label, ord)
WHERE question_no = 10;

-- Q11 Options: રોશનીનો મુખ્ય સ્ત્રોત
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('વીજળી', 1),
  ('સોલાર', 2),
  ('કેરોસીન', 3),
  ('ઘઈ / મગ / ટેલ', 4),
  ('ગેસ', 5),
  ('અન્ય', 6),
  ('રોશની નથી', 7)
) AS opt(label, ord)
WHERE question_no = 11;

-- Q12 Options: શૌચાલયની સ્થિતિ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ઘરમાં છે', 1),
  ('ઘરની બહાર (ખાનગી)', 2),
  ('સહિયારી (શૌચાલય)', 3),
  ('ખુલ્લામાં', 4)
) AS opt(label, ord)
WHERE question_no = 12;

-- Q13 Options: શૌચાલયનો પ્રકાર
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ફ્લોર સ્વ-ફ્લશ / ફ્લશ', 1),
  ('ખાડો (ઢાંકેલો)', 2),
  ('ખાડો (ખુલ્લો)', 3),
  ('ખુલ્લા સ્થળ', 4),
  ('અન્ય', 5)
) AS opt(label, ord)
WHERE question_no = 13;

-- Q14 Options: ગંદા પાણીના નિકાલ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('બંધ ગટર', 1),
  ('ખુલ્લી ગટર', 2),
  ('ખેતર / ઉદ્યાન / ખુલ્લો ખાડો', 3),
  ('નદી / તળાવ / નહેર', 4),
  ('અન્ય', 5),
  ('ડ્રેનેજ નથી', 6)
) AS opt(label, ord)
WHERE question_no = 14;

-- Q15 Options: રસોઈ ઇંધણ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('LPG / PNG', 1),
  ('ઇલેક્ટ્રિક / ઇન્ડક્શન', 2),
  ('બાયોગેસ', 3),
  ('ઉકળ / કોલસો', 4),
  ('ખેતી કચરો', 5),
  ('ગોબર / ઘાસ', 6),
  ('કેરોસીન', 7),
  ('અન્ય', 8),
  ('ઘરમાં રસોઈ નથી', 9)
) AS opt(label, ord)
WHERE question_no = 15;

-- Q16 Options: રસોઈઘર
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ઘરમાં અલગ રૂમ', 1),
  ('ઘરના ભાગ તરીકે', 2),
  ('ઘર બહાર', 3),
  ('રસોઈઘર નથી', 4)
) AS opt(label, ord)
WHERE question_no = 16;

-- Q17 Options: રેડિયો / ટ્રાન્ઝિસ્ટર
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હા', 1),
  ('ના', 2)
) AS opt(label, ord)
WHERE question_no = 17;

-- Q18 Options: ટેલિવિઝન
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હા', 1),
  ('ના', 2)
) AS opt(label, ord)
WHERE question_no = 18;

-- Q19 Options: કમ્પ્યૂટર / લેપટોપ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હા', 1),
  ('ના', 2)
) AS opt(label, ord)
WHERE question_no = 19;

-- Q20 Options: ટેલિફોન / મોબાઇલ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ફક્ત ઘર ફોન', 1),
  ('ફક્ત મોબાઇલ ફોન', 2),
  ('ઘર ફોન અને મોબાઇલ બંને', 3),
  ('ના', 4)
) AS opt(label, ord)
WHERE question_no = 20;

-- Q21 Options: સાયકલ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હા', 1),
  ('ના', 2)
) AS opt(label, ord)
WHERE question_no = 21;

-- Q22 Options: સ્કૂટર / મોટરસાયકલ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હા', 1),
  ('ના', 2)
) AS opt(label, ord)
WHERE question_no = 22;

-- Q23 Options: કાર / જીપ / વેન
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હા', 1),
  ('ના', 2)
) AS opt(label, ord)
WHERE question_no = 23;

-- Q26 Options: કુટુંબના વડાનું લિંગ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('પુરુષ', 1),
  ('સ્ત્રી', 2),
  ('તૃતીય પ્રકૃતિ', 3)
) AS opt(label, ord)
WHERE question_no = 26;

-- Q27 Options: જ્ઞાતિ-શ્રેણી
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('સામાન્ય', 1),
  ('OBC', 2),
  ('SC (અનુસૂચિત જ્ઞાતિ)', 3),
  ('ST (અનુસૂચિત જન-જ્ઞાતિ)', 4)
) AS opt(label, ord)
WHERE question_no = 27;

-- Q28 Options: ધર્મ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હિન્દુ', 1),
  ('ઇસ્લામ', 2),
  ('ઈસાઈ', 3),
  ('શીખ', 4),
  ('બૌદ્ધ', 5),
  ('જૈન', 6),
  ('ઝોરોઐસ્ટ્રિઝ્મ', 7),
  ('અન્ય', 8)
) AS opt(label, ord)
WHERE question_no = 28;

-- Q29 Options: મુખ્ય આવકનો સ્ત્રોત
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ખેતી', 1),
  ('ખેત-મજૂરી', 2),
  ('નોકરી / વ્યવસાય', 3),
  ('ઉદ્યોગ / ધંધો', 4),
  ('બાંધકામ', 5),
  ('અન્ય', 6)
) AS opt(label, ord)
WHERE question_no = 29;

-- Q31 Options: રેશન કાર્ડ
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('હા', 1),
  ('ના', 2)
) AS opt(label, ord)
WHERE question_no = 31;

-- Q32 Options: મકાનની માલિકી
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('પોતાની', 1),
  ('ભાડે', 2),
  ('ફ્રી (ભાડા-મુક્ત)', 3),
  ('સરકારી', 4),
  ('અન્ય', 5)
) AS opt(label, ord)
WHERE question_no = 32;

-- Q33 Options: જમીનની માલિકી
INSERT INTO question_options (question_id, option_label, sort_order)
SELECT id, opt.label, opt.ord FROM questions, (VALUES
  ('ખેતીની જમીન ધરાવે છે', 1),
  ('ખેતીની જમીન ધરાવતા નથી', 2)
) AS opt(label, ord)
WHERE question_no = 33;

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
