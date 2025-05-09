import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const sims = await req.json()

    if (!Array.isArray(sims) || sims.length === 0) {
      return NextResponse.json({ error: "Nessun dato ricevuto" }, { status: 400 })
    }

    // Mappiamo ogni sim a un oggetto valido per Prisma
    const cleaned = await Promise.all(
      sims.map(async (sim: any) => {
        const societa = await prisma.societa.findUnique({
          where: { piva: sim.societa_piva },
        })

        if (!societa) {
          throw new Error(`Società con PIVA ${sim.societa_piva} non trovata`)
        }

        return {
          iccid: sim.iccid,
          operatore: sim.operatore,
          stato: sim.stato || "Attiva",
          costo_mensile: parseFloat(sim.costo_mensile) || 0,
          data_fatturazione: sim.data_fatturazione || null,
          minuti_lavorati: parseInt(sim.minuti_lavorati) || 0,
          societaId: societa.id,
        }
      })
    )

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