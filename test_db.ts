import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  console.log('Testing connection to Supabase...')
  const { data, count, error } = await supabase
    .from('Student')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('❌ Connection failed:', error.message)
    return
  }

  console.log('✅ Connection successful!')
  console.log('Student count:', count)
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1) })
