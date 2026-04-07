import { NextResponse } from "next/server"
import { getAllStudents } from "@/lib/simulation"

export async function GET() {
  const students = await getAllStudents()
  return NextResponse.json(students)
}
