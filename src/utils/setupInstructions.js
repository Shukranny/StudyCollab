/*
Step-by-Step Guide to Set Up Your Database in Supabase

1. Log in to your Supabase dashboard at https://app.supabase.com/
2. Select your project
3. Go to the "SQL Editor" section in the left sidebar
4. Click "New Query" to create a new SQL query
5. Copy ALL the SQL commands from src/utils/supabaseSchema.js (everything between the comments)
6. Paste the SQL commands into the SQL Editor
7. Click "Run" to execute the SQL commands

Troubleshooting:
- If you encounter an error about "relation already exists", you can safely ignore it
- If you encounter an error about "policy already exists", you may need to drop the existing policies first
- If you encounter an infinite recursion error, make sure you're using the updated schema from this file

To verify the setup:
1. Go to the "Table Editor" section in the left sidebar
2. You should see the following tables:
   - projects
   - project_members
   - tasks
3. Go to the "Storage" section to verify the "avatars" bucket exists

If you need to reset the database:
1. Go to the "SQL Editor" section
2. Run the following commands:

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;

Then run the setup SQL commands again.
*/
