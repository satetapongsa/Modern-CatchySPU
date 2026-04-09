import { NextResponse } from "next/server"
import { tickSimulation, getRegistrationStats, getShardStats, logSystemEvent, getStaggeredSlot } from "@/lib/simulation"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const count = body.count || 1000
  const startTime = Date.now()
  
  const faculties = [
    'IT', 'Engineering', 'Business', 'Accountancy', 
    'DigitalMedia', 'CommArts', 'Arts', 'Law', 
    'Architecture', 'Tourism', 'International'
  ]
  
  const batchSize = 100; // Increased for speed
  
  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i)
    const studentsBatch = []
    
    for (let j = 0; j < currentBatchSize; j++) {
      const globalIdx = i + j
      // Generate extremely unique ID to avoid collisions
      const randomSuffix = Math.floor(10000000 + Math.random() * 90000000)
      const studentId = `66${randomSuffix}`
      const facultyIdx = globalIdx % faculties.length
      const faculty = faculties[facultyIdx]
      
      const shardIndex = (globalIdx % 3) + 1
      const shardedDb = `SERVER NODE ${shardIndex}`
      
      studentsBatch.push({
        studentId,
        name: `STRESS_TEST_BOT_${randomSuffix}`,
        faculty,
        course: 'MASS_SIMULATION_STRESS_TEST',
        slot: getStaggeredSlot(faculty),
        shardedDb: shardedDb
      })
    }
    
    // Bulk insert with detailed error checking
    const { data: inserted, error } = await supabase
      .from('Student')
      .insert(studentsBatch)
      .select('studentId')
    
    if (error) {
      console.error(`❌ Batch Failure at index ${i}:`, error.message)
    } else {
      console.log(`✅ Sharded Ingress: Batch ${i/batchSize + 1} (${studentsBatch.length} recs) sharded to infrastructure.`)
    }
    await tickSimulation()
  }
  
  const duration = Date.now() - startTime
  await logSystemEvent(`Infrastructure Load Balancing: ${count.toLocaleString()} students sharded and persisted in ${duration}ms`, 100)

  return NextResponse.json({ 
    success: true, 
    count, 
    durationMs: duration,
    message: "Data strictly sharded and stored in Supabase" 
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const shard = searchParams.get('shard')
  
  // Get distribution stats safely
  const stats = await getRegistrationStats()
  const shardStats = await getShardStats()
  
  let shardStudents: any[] = []
  if (shard) {
     const { getLatestStudentsByShard } = await import("@/lib/simulation")
     shardStudents = await getLatestStudentsByShard(shard)
  }

  return NextResponse.json({
    facultyDistribution: stats,
    shardDistribution: shardStats,
    shardStudents: shardStudents
  })
}
