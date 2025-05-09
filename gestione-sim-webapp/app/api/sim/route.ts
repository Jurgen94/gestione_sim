import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ✅ Recupera tutte le SIM
export async function GET() {
  try {
    const sims = await prisma.sim.findMany({
      include: { societa: true },
      orderBy: { id: 'desc' },
    })
    return NextResponse.json(sims)
  } catch (err) {
    console.error('Errore nel recupero SIM:', err)
    return NextResponse.json({ error: 'Errore nel recupero SIM' }, { status: 500 })
  }
}

// ✅ Inserisce una nuova SIM
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      iccid,
      operatore,
      stato,
      data_fatturazione,
      costo_mensile,
      minuti_lavorati,
      societa_piva,
    } = body

    if (!iccid || !operatore || !stato || !costo_mensile || !societa_piva) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    const societa = await prisma.societa.findUnique({
      where: { piva: societa_piva },
    })

    if (!societa) {
      return NextResponse.json({ error: 'Società non trovata' }, { status: 404 })
    }

    const newSim = await prisma.sim.create({
      data: {
        iccid,
        operatore,
        stato,
        data_fatturazione: data_fatturazione ? new Date(data_fatturazione) : null,
        costo_mensile: parseFloat(costo_mensile),
        minuti_lavorati: minuti_lavorati ? parseInt(minuti_lavorati) : null,
        societa: {
          connect: { id: societa.id },
        },
      },
    })

    return NextResponse.json(newSim)
  } catch (err) {
    console.error('Errore inserimento SIM:', err)
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}