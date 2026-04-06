import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST() {
  try {
     // Delete all records in Student table
     // Note: Since .delete() requires a filter, we use a filter that matches all rows
     const { error } = await supabase
       .from('Student')
       .delete()
       .neq('studentId', '0') // match everything effectively
     
     if (error) throw error

     return NextResponse.json({ success: true, message: 'Infrastructure database cleared successfully.' })
  } catch (error: any) {
     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
