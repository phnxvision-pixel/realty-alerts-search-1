import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://nsmwefmmgektqgfswobo.supabase.co';
const supabaseKey = 'sb_publishable_ri3xr2nkyZGj5IBqKmTx4w_0XXENCDZ';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };