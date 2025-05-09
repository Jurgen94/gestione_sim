import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const sims = await req.json()

    if (!Array.isArray(sims) || sims.length === 0) {
      return NextResponse.json({ error: "Nessun dato ricevuto" }, { status: 400 })
    }

    const cleaned = sims.map(sim => ({
      iccid: sim.iccid,
      operatore: sim.operatore,
      stato: sim.stato || "Attiva",
      costo_mensile: sim.costo_mensile || 0,
      data_fatturazione: sim.data_fatturazione || null,
      minuti_lavorati: sim.minuti_lavorati || 0,
      societa_piva: sim.societa_piva,
    }))

    await prisma.sim.createMany({
      data: cleaned,
      skipDuplicates: true,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Errore bulk SIM:", err)
    return NextResponse.json({ error: "Errore server" }, { status: 500 })
  }
}