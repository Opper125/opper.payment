import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anonymous key from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://mecpzriiiyxyxzbmqasy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3B6cmlpaXl4eXh6Ym1xYXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTEyNjcsImV4cCI6MjA1ODE2NzI2N30.pXus4Lt8KeaHt_OLEZMhZUmprYKbTCm-29O5Th1remw';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
