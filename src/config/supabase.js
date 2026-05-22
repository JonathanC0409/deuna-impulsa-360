import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jealrclfmywsykqunpvi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYWxyY2xmbXl3c3lrcXVucHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTY0NzcsImV4cCI6MjA5NDk3MjQ3N30.yAZxOfSe8BvIQ79t8WwKi0G4E2PGpD4rb_S3QvEJJuo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);