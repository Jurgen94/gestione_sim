import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Nessun ID fornito" }, { status: 400 })
    }

    await prisma.sim.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Errore eliminazione SIM:", error)
    return NextResponse.json({ error: "Errore server" }, { status: 500 })
  }
}
