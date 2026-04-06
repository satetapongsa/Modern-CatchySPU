import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL as string
}).$extends(withAccelerate())

const faculties = ['ICT', 'Engineering', 'Business', 'Accountancy', 'Arts', 'CommArts']

async function main() {
  console.log('--- Seeding 1,000 Students ---')
  
  // Clear existing students
  await prisma.student.deleteMany({})

  const students = []
  const slots: Record<string, string> = {
    'ICT': '09:00 - 10:00',
    'Engineering': '10:00 - 11:00',
    'Business': '11:00 - 12:00',
    'Accountancy': '13:00 - 14:00',
    'Arts': '14:00 - 15:00',
    'CommArts': '15:00 - 16:00'
  }

  for (let i = 0; i < 1000; i++) {
    const suffix = Math.floor(100000 + Math.random() * 900000).toString()
    const studentId = `66${suffix}`
    const faculty = faculties[Math.floor(Math.random() * faculties.length)]
    const slot = slots[faculty]
    
    let shardedDb = "Shard C"
    if (faculty === 'ICT' || faculty === 'Engineering') shardedDb = "Shard A"
    else if (faculty === 'Business' || faculty === 'Accountancy') shardedDb = "Shard B"

    students.push({
      studentId,
      name: `Student Name ${i + 1}`,
      faculty,
      slot,
      shardedDb
    })
  }

  // Batch insert for performance
  await prisma.student.createMany({
    data: students
  })

  console.log('--- Seed Completed Successfully ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await (prisma as any).$disconnect()
  })
