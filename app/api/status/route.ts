import { NextResponse } from "next/server"
import { getSystemStatus, tickSimulation } from "@/lib/simulation"

export async function GET() {
  // Simulating a real tick before fetching data
  await tickSimulation()
  const status = getSystemStatus()
  
  return NextResponse.json(status)
}
