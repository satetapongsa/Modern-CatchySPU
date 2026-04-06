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
  { id: 'SERVER 1', name: 'Information Tech & Engineering', faculties: ['ICT', 'Engineering'], load: 45, status: 'online', region: 'US-EAST-1' },
  { id: 'SERVER 2', name: 'Business & Accounting', faculties: ['Business', 'Accountancy'], load: 78, status: 'online', region: 'US-EAST-2' },
  { id: 'SERVER 3', name: 'Arts & Communication', faculties: ['Arts', 'CommArts'], load: 22, status: 'online', region: 'US-EAST-3' },
]

// Simulation: Update stats every few seconds (called by API)
export async function updateSystemStats() {
  const now = new Date()
  const hour = now.getHours()
  
  // Base load depends on time of day (simulating student peak hours)
  let baseLoad = 30
  if ((hour >= 9 && hour <= 12) || (hour >= 13 && hour <= 16)) {
    baseLoad = 65 + Math.random() * 20
  } else {
    baseLoad = 15 + Math.random() * 10
  }

  currentStats.cpuUsage = Math.min(100, Math.max(10, baseLoad + (Math.random() * 15 - 7.5)))
  currentStats.memoryUsage = Math.min(100, Math.max(20, (baseLoad * 0.8) + (Math.random() * 10)))
  currentStats.networkStatus = Math.min(100, Math.max(5, (baseLoad / 2) + (Math.random() * 20)))
  
  // Update Shards Load based on database counts (Enhanced Realism)
  const stats = await getShardStats()
  shards = shards.map(shard => {
    const shardData = stats.find(s => s.shardedDb === shard.id)
    const recordCount = shardData ? shardData._count : 0
    // Load = base traffic + factor of record count (simulating processing overhead)
    const calculatedLoad = Math.min(100, baseLoad + (recordCount / 500) + (Math.random() * 4 - 2))
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
    'Accountancy': '13:00 - 14:30',
    'Arts': '14:30 - 16:00',
    'CommArts': '16:00 - 17:30'
  }
  return slots[faculty] || 'Anytime'
}

// Database helper functions using Supabase SDK
export async function createStudentRecord(data: { studentId: string, name: string, faculty: string }) {
  const slot = getStaggeredSlot(data.faculty)
  // Sharding simulation: assign shard based on faculty
  let shardedDb = "SERVER NODE 3"
  if (data.faculty === 'IT' || data.faculty === 'Engineering') shardedDb = "SERVER NODE 1"
  else if (data.faculty === 'Business' || data.faculty === 'Accountancy') shardedDb = "SERVER NODE 2"

  try {
    const { data: result, error } = await supabase
      .from('Student')
      .upsert({
        studentId: data.studentId,
        name: data.name,
        faculty: data.faculty,
        slot: slot,
        shardedDb: shardedDb
      }, { onConflict: 'studentId' })
      .select()
      .single()

    if (error) throw error
    return result
  } catch (err) {
    console.error("❌ Supabase Upsert Error (StudentRecord):", err)
    return { ...data, slot, shardedDb, error: true }
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
