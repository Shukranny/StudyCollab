import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uzlcdiynfbdhrykyghfl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6bGNkaXluZmJkaHJ5a3lnaGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDU3NjcsImV4cCI6MjA2MjgyMTc2N30.kIB1vT6uDjAoX6djihFAiW_WrJCvYCQL84cELsynFLQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);