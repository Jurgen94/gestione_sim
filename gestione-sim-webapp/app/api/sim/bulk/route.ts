import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { iccids, operatore, stato, societa_piva } = await req.json()

    if (!Array.isArray(iccids) || iccids.length === 0 || !operatore || !societa_piva || !stato) {
      return NextResponse.json({ error: 'Dati mancanti o errati' }, { status: 400 })
    }

    const societa = await prisma.societa.findUnique({
      where: { piva: societa_piva },
    })

    if (!societa) {
      return NextResponse.json({ error: 'Società non trovata' }, { status: 404 })
    }

    const nuoveSim = await Promise.all(
      iccids.map(iccid =>
        prisma.sim.create({
          data: {
            iccid,
            operatore,
            stato,
            costo_mensile: 0,
            societaId: societa.id,
          },
        })
      )
    )

    return NextResponse.json({ count: nuoveSim.length })
  } catch (error) {
    console.error('Errore bulk insert:', error)
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}