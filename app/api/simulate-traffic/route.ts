import { NextResponse } from "next/server"
import { createStudentRecord, tickSimulation, getRegistrationStats, getShardStats, logSystemEvent } from "@/lib/simulation"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const count = body.count || 1000
  const startTime = Date.now()
  
  const batchSize = 100
  const faculties = ['IT', 'Engineering', 'Business', 'Accountancy', 'DigitalMedia', 'CommArts']
  
  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i)
    const batch = Array.from({ length: currentBatchSize }).map((_, j) => {
      const globalIdx = i + j
      const suffix = Math.floor(10000000 + Math.random() * 90000000).toString()
      const studentId = `66${suffix.substring(2)}` // Keep it 8 digits total? No, keep it specific.
      const faculty = faculties[Math.floor(Math.random() * faculties.length)]
      
      // Strict balancing: ensure even distribution across 3 shards
      const botName = `bot${Math.floor(10000000 + Math.random() * 90000000)}`
      
      return createStudentRecord({
        studentId,
        faculty,
        name: botName,
        forceShardIndex: (globalIdx % 3) + 1
      })
    })
    
    await Promise.all(batch)
    await tickSimulation()
  }
  
  const endTime = Date.now()
  const duration = endTime - startTime
  
  // Log entry using dedicated function
  await logSystemEvent(`Mass Traffic Simulation: ${count.toLocaleString()} requests processed in ${duration}ms`, 100)

  return NextResponse.json({
    success: true,
    count: count,
    durationMs: duration,
    avgResponseMs: duration / count,
    timestamp: new Date().toISOString()
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
