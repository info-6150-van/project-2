-- Check for tables that has a FK constraint --
-- Useful when manually deleting a user --

SELECT rc.constraint_name, rc.delete_rule
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu
  ON rc.constraint_name = kcu.constraint_name
WHERE kcu.table_name = 'observations'
  AND kcu.column_name = 'user_id';