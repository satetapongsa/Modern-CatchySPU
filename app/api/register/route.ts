import { NextResponse } from "next/server"
import { getStaggeredSlot, tickSimulation, createStudentRecord } from "@/lib/simulation"

export async function POST(req: Request) {
  try {
    const { faculty, studentId, name } = await req.json()
    
    // Simulate some logic
    tickSimulation()
    const student = await createStudentRecord({ 
      studentId, 
      faculty, 
      name: name || `Student ${studentId}` 
    })
    
    return NextResponse.json({
      success: true,
      message: `Registration successful for student ${studentId} from faculty ${faculty}.`,
      assignedSlot: student.slot,
      shardedDb: student.shardedDb,
      status: `Enrolled in AI-Staggered Queue: ${student.slot}`
    })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 })
  }
}

export async function GET() {
  // Just show current common slots
  return NextResponse.json({
    slots: {
      'ICT': '09:00 - 10:00',
      'Engineering': '10:00 - 11:00',
      'Business': '11:00 - 12:00',
      'Accountancy': '13:00 - 14:00',
      'Arts': '14:00 - 15:00',
      'CommArts': '15:00 - 16:00'
    }
  })
}
