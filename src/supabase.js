import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dmuezmxembwpnvlqdits.supabase.co'
const supabaseKey = 'sb_publishable_cNEb27Mtrsh05-AzXxvKxg_7zdc8QOF'

export const supabase = createClient(supabaseUrl, supabaseKey)