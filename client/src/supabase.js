import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://takpzwjozuxnukbsuymw.supabase.co'
const supabaseKey = 'sb_publishable_16TiVmIF8tDYw888GDVmbg_YZRffjY-'

export const supabase = createClient(supabaseUrl, supabaseKey)
