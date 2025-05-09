import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ✅ Recupera tutte le società
export async function GET() {
  try {
    const societa = await prisma.societa.findMany({
      orderBy: { ragione_sociale: 'asc' },
    })
    return NextResponse.json(societa)
  } catch (error) {
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}

// ✅ Inserisce una nuova società
export async function POST(req: NextRequest) {
  try {
    const { piva, ragione_sociale, referente, iban } = await req.json()

    if (!piva || !iban) {
      return NextResponse.json({ error: 'P.IVA e IBAN sono obbligatori' }, { status: 400 })
    }

    const nuovaSocieta = await prisma.societa.create({
      data: {
        piva,
        ragione_sociale,
        referente,
        iban,
      },
    })

    return NextResponse.json(nuovaSocieta)
  } catch (error) {
    console.error('Errore inserimento società:', error)
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}