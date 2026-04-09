import { supabase } from "./supabase"
import { AIPredictiveModel } from "./aiModel"

const aiModel = new AIPredictiveModel()

export type ShardStatus = {
  id: string
  name: string
  faculties: string[]
  load: number
  status: 'online' | 'offline' | 'warning'
  region: string
}

export type ScalingEvent = {
  timestamp: Date
  type: 'UP' | 'DOWN'
  reason: string
  newCount: number
}

// AI Core state for predictive management
let aiCore = {
  predictedLoadNext10m: 45.2,
  aiConfidenceScore: 98.4,
  systemSafetyIndex: 92.0,
  activeStrategy: 'Predictive Load Balancing',
  lastOptimizedAt: new Date().toISOString()
}

// In-memory state (resets on server restart, but works for prototype)
let currentStats = {
  cpuUsage: 42,
  memoryUsage: 68,
  networkStatus: 35,
  securityLevel: 95,
  systemStatus: 92,
  instances: 3,
  activeRequests: 1420
}

let shards: ShardStatus[] = [
  { id: 'SERVER NODE 1', name: 'Tech & Architecture', faculties: ['IT', 'Engineering', 'Architecture'], load: 0, status: 'online', region: 'SPU-SOUTH-A' },
  { id: 'SERVER NODE 2', name: 'Business, Law & Global', faculties: ['Business', 'Accountancy', 'Law', 'International'], load: 0, status: 'online', region: 'SPU-WEST-C' },
  { id: 'SERVER NODE 3', name: 'Media & Liberal Arts', faculties: ['Arts', 'CommArts', 'DigitalMedia', 'Tourism'], load: 0, status: 'online', region: 'SPU-NORTH-B' },
]

// Simulation: Update stats every few seconds (called by API)
export async function updateSystemStats() {
  const now = new Date()
  const hour = now.getHours()
  
  // Metrics stay low unless an action occurs
  currentStats.cpuUsage = Math.min(100, Math.max(5, (currentStats.activeRequests / 200) + (Math.random() * 2)))
  currentStats.memoryUsage = Math.min(100, Math.max(10, (currentStats.activeRequests / 300) + (Math.random() * 5)))
  currentStats.networkStatus = Math.min(100, Math.max(0, (currentStats.activeRequests / 500) + (Math.random() * 3)))
  
  // Update Shards Load based on database counts (Enhanced Realism)
  const stats = await getShardStats()
  shards = shards.map(shard => {
    const shardData = stats.find(s => s.shardedDb === shard.id)
    const recordCount = shardData ? shardData._count : 0
    // Load increases with record counts
    const calculatedLoad = Math.min(100, (recordCount / 100) + (Math.random() * 2))
    return {
      ...shard,
      load: calculatedLoad
    }
  })

  // Update AI Engine Predictions (USING Machine Learning Model)
  aiModel.addDataPoint(currentStats.cpuUsage)
  const prediction = aiModel.predictFutureLoad(600) // 10 mins forward

  aiCore.predictedLoadNext10m = prediction.predictedLoad
  aiCore.aiConfidenceScore = prediction.confidence
  aiCore.systemSafetyIndex = Math.min(100, 100 - (currentStats.cpuUsage / 5))
  aiCore.lastOptimizedAt = new Date().toISOString()

  // Simulating "AI Auto-Scaling"
  if (currentStats.cpuUsage > 85 && currentStats.instances < 10) {
    currentStats.instances++
    logSystemEvent(`[AI-SCALING] Scaling UP to ${currentStats.instances} instances. Reason: Predictive Load Surge.`, 100)
  } else if (currentStats.cpuUsage < 35 && currentStats.instances > 2) {
    currentStats.instances--
    logSystemEvent(`[AI-SCALING] Scaling DOWN to ${currentStats.instances} instances. Reason: Efficiency Optimization.`, 30)
  }
}

// Keep tickSimulation for backward compatibility if needed, but make it call updateSystemStats
export async function tickSimulation() {
  await updateSystemStats()
}

export function getSystemStatus() { 
  return { 
    ...currentStats,
    aiCore: aiCore
  } 
}
export function getShards() { return shards }

// AI Timing logic
export function getStaggeredSlot(faculty: string) {
  const slots: Record<string, string> = {
    'IT': '08:00 - 09:30',
    'Engineering': '09:30 - 11:00',
    'Business': '11:00 - 12:30',
    'Accountancy': '12:30 - 13:30',
    'DigitalMedia': '13:30 - 14:30',
    'CommArts': '14:30 - 15:30',
    'Arts': '15:30 - 16:30',
    'Law': '16:30 - 17:30',
    'Architecture': '09:00 - 10:30',
    'Tourism': '10:30 - 12:00',
    'International': '13:00 - 14:30'
  }
  return slots[faculty] || 'Anytime'
}

// Database helper functions using Supabase SDK
export async function createStudentRecord(data: { studentId: string, name: string, faculty: string, course?: string, forceShardIndex?: number }) {
  const slot = getStaggeredSlot(data.faculty)
  
  let shardedDb = ""
  
  if (data.forceShardIndex !== undefined) {
    shardedDb = `SERVER NODE ${data.forceShardIndex}`
  } else {
    // Fetch current total count to implement Round-robin
    const { count: totalCount, error: countError } = await supabase
      .from('Student')
      .select('*', { count: 'exact', head: true })

    if (countError) console.error("❌ Count Error:", countError)
    const currentCount = totalCount || 0
    const nodeIndex = (currentCount % 3) + 1 // 1, 2, or 3
    shardedDb = `SERVER NODE ${nodeIndex}`
  }

  // 1. Check for duplicate ID
  const { data: existing, error: searchError } = await supabase
    .from('Student')
    .select('studentId')
    .eq('studentId', data.studentId)
    .maybeSingle()

  if (searchError) console.error("❌ Search Error:", searchError)
  if (existing) {
    return { error: 'DUPLICATE_ID', message: "รหัสนักศึกษานี้ถูกใช้ลงทะเบียนไปแล้ว" }
  }

  try {
    const { data: result, error } = await supabase
      .from('Student')
      .insert({
        studentId: data.studentId,
        name: data.name,
        faculty: data.faculty,
        course: data.course || 'GENERAL_EDUCATION',
        slot: slot,
        shardedDb: shardedDb
      })
      .select()
      .single()

    if (error) throw error
    return { ...result, success: true }
  } catch (err) {
    console.error("❌ Supabase Insert Error (StudentRecord):", err)
    return { ...data, slot, shardedDb, error: true, message: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" }
  }
}

export async function logSystemEvent(event: string, loadLevel: number) {
  try {
    const { data, error } = await supabase
      .from('SystemLog')
      .insert({
        event,
        loadLevel,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error("❌ Supabase Log Error:", err)
    return null
  }
}

export async function getRegistrationStats() {
  try {
    // Supabase JS SDK doesn't natively support groupBy in select yet.
    // For large datasets, use an RPC call or view.
    // For this simulation, we'll fetch faculties and count in JS if needed,
    // or just fetch counts specifically for known faculties.
    const { data, error } = await supabase
      .from('Student')
      .select('faculty')
    
    if (error) throw error
    
    if (!data) return []

    // Manual grouping (simulation only)
    const counts: Record<string, number> = {}
    data.forEach((s: any) => {
      counts[s.faculty] = (counts[s.faculty] || 0) + 1
    })

    return Object.entries(counts).map(([faculty, count]) => ({
      faculty,
      _count: count
    }))
  } catch (err) {
    console.error("❌ Stats Fetch Error (Faculty):", err)
    return []
  }
}

export async function getShardStats() {
  try {
    const { data, error } = await supabase
      .from('Student')
      .select('shardedDb')
    
    if (error) throw error
    if (!data) return []

    const counts: Record<string, number> = {}
    data.forEach((s: any) => {
      counts[s.shardedDb] = (counts[s.shardedDb] || 0) + 1
    })

    return Object.entries(counts).map(([shardedDb, count]) => ({
      shardedDb,
      _count: count
    }))
  } catch (err) {
    console.error("❌ Stats Fetch Error (Shard):", err)
    return []
  }
}

export async function getLatestStudentsByShard(shardName: string) {
  try {
    const { data, error } = await supabase
      .from('Student')
      .select('*')
      .eq('shardedDb', shardName)
      .order('studentId', { ascending: false }) // Use ID or another field for latest
      .limit(10)
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error(`❌ Fetch Error for Shard ${shardName}:`, err)
    return []
  }
}

export async function getAllStudents() {
  try {
    const { data, error } = await supabase
      .from('Student')
      .select('*')
      .order('studentId', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("❌ Fetch All Students Error:", err)
    return []
  }
}
