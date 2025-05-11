// app/api/societa/route.ts
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
    const {
      piva,
      ragione_sociale,
      referente,
      iban,
      sede_legale,
      n_dipendenti,
      telefono,
      nome_amm,
      cognome_amm,
      cf_amm,
      data_nascita_amm,
      luogo_nascita_amm,
    } = await req.json()

    if (!piva || !ragione_sociale || !iban) {
      return NextResponse.json({ error: 'P.IVA, Ragione Sociale e IBAN sono obbligatori' }, { status: 400 })
    }

    const nuovaSocieta = await prisma.societa.create({
      data: {
        piva,
        ragione_sociale,
        referente,
        iban,
        sede_legale,
        n_dipendenti,
        telefono,
        nome_amm,
        cognome_amm,
        cf_amm,
        data_nascita_amm: data_nascita_amm ? new Date(data_nascita_amm) : undefined,
        luogo_nascita_amm,
      },
    })

    return NextResponse.json(nuovaSocieta)
  } catch (error) {
    console.error('Errore inserimento società:', error)
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}