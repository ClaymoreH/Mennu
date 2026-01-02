import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://myctqbotwpsoisapjaxs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_I8xiAR2aMzQwUX0LfL0alZg_gM8QV7DU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
