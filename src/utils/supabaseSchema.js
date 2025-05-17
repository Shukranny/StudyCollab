// -- Step 1: Enable UUID extension
// CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

// -- Step 2: Create Projects Table
// CREATE TABLE IF NOT EXISTS projects (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   name TEXT NOT NULL,
//   description TEXT,
//   due_date TIMESTAMP WITH TIME ZONE,
//   progress INTEGER DEFAULT 0,
//   color TEXT DEFAULT '#2563EB',
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
// );

// -- Step 3: Create Project Members Table
// CREATE TABLE IF NOT EXISTS project_members (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
//   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
//   role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   UNIQUE(project_id, user_id)
// );

// -- Step 4: Create Tasks Table
// CREATE TABLE IF NOT EXISTS tasks (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   title TEXT NOT NULL,
//   description TEXT,
//   project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
//   assigned_to UUID REFERENCES auth.users(id),
//   due_date TIMESTAMP WITH TIME ZONE,
//   priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
//   completed BOOLEAN DEFAULT false,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// -- Step 5: Projects RLS Policies
// ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

// CREATE POLICY "Users can view their own projects" 
//   ON projects FOR SELECT USING (user_id = auth.uid());

// CREATE POLICY "Users can view projects they are members of" 
//   ON projects FOR SELECT USING (
//     EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_members.project_id = projects.id 
//       AND project_members.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can insert their own projects" 
//   ON projects FOR INSERT WITH CHECK (user_id = auth.uid());

// CREATE POLICY "Users can update their own projects" 
//   ON projects FOR UPDATE USING (user_id = auth.uid());

// CREATE POLICY "Users can update projects they admin" 
//   ON projects FOR UPDATE USING (
//     EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_members.project_id = projects.id 
//       AND project_members.user_id = auth.uid() 
//       AND project_members.role = 'admin'
//     )
//   );

// CREATE POLICY "Users can delete their own projects" 
//   ON projects FOR DELETE USING (user_id = auth.uid());

// -- Step 6: Project Members RLS Policies
// ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

// CREATE POLICY "Users can view project members of owned projects" 
//   ON project_members FOR SELECT USING (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = project_members.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can view project members they are part of" 
//   ON project_members FOR SELECT USING (
//     EXISTS (
//       SELECT 1 FROM project_members AS pm 
//       WHERE pm.project_id = project_members.project_id 
//       AND pm.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Project owners can insert project members" 
//   ON project_members FOR INSERT WITH CHECK (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = project_members.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Project admins can insert project members" 
//   ON project_members FOR INSERT WITH CHECK (
//     EXISTS (
//       SELECT 1 FROM project_members AS pm
//       WHERE pm.project_id = project_members.project_id 
//       AND pm.user_id = auth.uid() 
//       AND pm.role = 'admin'
//     )
//   );

// CREATE POLICY "Project owners can update project members" 
//   ON project_members FOR UPDATE USING (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = project_members.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Project admins can update project members" 
//   ON project_members FOR UPDATE USING (
//     EXISTS (
//       SELECT 1 FROM project_members AS pm
//       WHERE pm.project_id = project_members.project_id 
//       AND pm.user_id = auth.uid() 
//       AND pm.role = 'admin'
//       AND pm.user_id != project_members.user_id
//     )
//   );

// CREATE POLICY "Project owners can delete project members" 
//   ON project_members FOR DELETE USING (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = project_members.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Project admins can delete project members" 
//   ON project_members FOR DELETE USING (
//     EXISTS (
//       SELECT 1 FROM project_members AS pm
//       WHERE pm.project_id = project_members.project_id 
//       AND pm.user_id = auth.uid() 
//       AND pm.role = 'admin'
//       AND pm.user_id != project_members.user_id
//     )
//   );

// CREATE POLICY "Users can remove themselves from projects" 
//   ON project_members FOR DELETE USING (user_id = auth.uid());

// -- Step 7: Tasks RLS Policies
// ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

// CREATE POLICY "Users can view tasks assigned to them" 
//   ON tasks FOR SELECT USING (assigned_to = auth.uid());

// CREATE POLICY "Users can view tasks of owned projects" 
//   ON tasks FOR SELECT USING (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = tasks.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can view tasks of member projects" 
//   ON tasks FOR SELECT USING (
//     EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_members.project_id = tasks.project_id 
//       AND project_members.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can insert tasks to owned projects" 
//   ON tasks FOR INSERT WITH CHECK (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = tasks.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can insert tasks to member projects" 
//   ON tasks FOR INSERT WITH CHECK (
//     EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_members.project_id = tasks.project_id 
//       AND project_members.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can update tasks assigned to them" 
//   ON tasks FOR UPDATE USING (assigned_to = auth.uid());

// CREATE POLICY "Users can update tasks of owned projects" 
//   ON tasks FOR UPDATE USING (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = tasks.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can update tasks of member projects" 
//   ON tasks FOR UPDATE USING (
//     EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_members.project_id = tasks.project_id 
//       AND project_members.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can delete tasks assigned to them" 
//   ON tasks FOR DELETE USING (assigned_to = auth.uid());

// CREATE POLICY "Users can delete tasks of owned projects" 
//   ON tasks FOR DELETE USING (
//     EXISTS (
//       SELECT 1 FROM projects 
//       WHERE projects.id = tasks.project_id 
//       AND projects.user_id = auth.uid()
//     )
//   );

// CREATE POLICY "Users can delete tasks of member projects" 
//   ON tasks FOR DELETE USING (
//     EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_members.project_id = tasks.project_id 
//       AND project_members.user_id = auth.uid()
//     )
//   );

// -- Step 8: Avatar Storage Configuration
// INSERT INTO storage.buckets (id, name, public) 
// VALUES ('avatars', 'avatars', true)
// ON CONFLICT (id) DO NOTHING;

// -- Fixed Avatar Storage Policies (using split_part instead of regexp_matches)
// CREATE POLICY "Avatar images are publicly accessible"
// ON storage.objects FOR SELECT
// USING (bucket_id = 'avatars');

// CREATE POLICY "Users can upload their own avatars"
// ON storage.objects FOR INSERT
// WITH CHECK (
//   bucket_id = 'avatars' AND
//   auth.uid()::text = split_part(name, '/', 1)
// );

// CREATE POLICY "Users can update their own avatars"
// ON storage.objects FOR UPDATE
// USING (
//   bucket_id = 'avatars' AND
//   auth.uid()::text = split_part(name, '/', 1)
// );

// CREATE POLICY "Users can delete their own avatars"
// ON storage.objects FOR DELETE
// USING (
//   bucket_id = 'avatars' AND
//   auth.uid()::text = split_part(name, '/', 1)
// );

// -- Step 9: Last Admin Protection
// CREATE OR REPLACE FUNCTION prevent_last_admin_removal()
// RETURNS TRIGGER AS $$
// BEGIN
//   IF TG_OP = 'DELETE' AND OLD.role = 'admin' THEN
//     IF NOT EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_id = OLD.project_id 
//       AND role = 'admin' 
//       AND user_id != OLD.user_id
//     ) THEN
//       RAISE EXCEPTION 'Cannot remove the last admin from a project';
//     END IF;
//   END IF;
  
//   IF TG_OP = 'UPDATE' AND NEW.role != 'admin' AND OLD.role = 'admin' THEN
//     IF NOT EXISTS (
//       SELECT 1 FROM project_members 
//       WHERE project_id = OLD.project_id 
//       AND role = 'admin' 
//       AND user_id != OLD.user_id
//     ) THEN
//       RAISE EXCEPTION 'Cannot demote the last admin of a project';
//     END IF;
//   END IF;
  
//   IF TG_OP = 'DELETE' THEN
//     RETURN OLD;
//   ELSE
//     RETURN NEW;
//   END IF;
// END;
// $$ LANGUAGE plpgsql SECURITY DEFINER;

// CREATE TRIGGER check_last_admin_before_change
// BEFORE DELETE OR UPDATE OF role ON project_members
// FOR EACH ROW
// EXECUTE FUNCTION prevent_last_admin_removal();