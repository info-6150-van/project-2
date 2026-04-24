-- Check for tables that reference user id --
-- Useful when manually deleting a user --

SELECT
    tc.table_name,
    kcu.column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
  JOIN information_schema.table_constraints AS ccu
    ON rc.unique_constraint_name = ccu.constraint_name
  WHERE ccu.table_schema = 'auth'
    AND ccu.table_name = 'users';