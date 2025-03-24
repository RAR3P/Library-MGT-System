-- Step 1: Create a temporary table with sequential user IDs
CREATE TEMPORARY TABLE temp_table AS
SELECT user_id, @row_number := @row_number + 1 AS new_user_id
FROM user, (SELECT @row_number := 0) AS init
ORDER BY user_id;

-- Step 2: Update the original table using the temporary table
UPDATE User AS t
JOIN temp_table AS tmp ON t.user_id = tmp.user_id
SET t.user_id = tmp.new_user_id;

-- Step 3: Drop the temporary table
DROP TEMPORARY TABLE temp_table;




ALTER TABLE book
CHANGE COLUMN `ISBN` `ISBN/ebook` VARCHAR(255);