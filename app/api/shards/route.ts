import { NextResponse } from "next/server"
import { getShards } from "@/lib/simulation"

export async function GET() {
  const shards = getShards()
  return NextResponse.json(shards)
}
