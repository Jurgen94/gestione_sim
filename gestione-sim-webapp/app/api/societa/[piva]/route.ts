// app/api/societa/[piva]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { piva: string } }
) {
  try {
    const societa = await prisma.societa.findUnique({
      where: { piva: params.piva },
      include: {
        sim: true,
        documenti: true,
      },
    })

    if (!societa) {
      return NextResponse.json({ error: 'Società non trovata' }, { status: 404 })
    }

    const simTotali = societa.sim.length

    const attivePerOperatore = societa.sim.reduce((acc, sim) => {
      if (sim.stato === 'Attiva') {
        acc[sim.operatore] = (acc[sim.operatore] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const inConsegnaPerOperatore = societa.sim.reduce((acc, sim) => {
      if (sim.stato === 'In consegna') {
        acc[sim.operatore] = (acc[sim.operatore] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const responseData = {
      societa: {
        piva: societa.piva,
        ragione_sociale: societa.ragione_sociale,
        sede_legale: societa.sede_legale,
        n_dipendenti: societa.n_dipendenti,
        telefono: societa.telefono,
        nome_amm: societa.nome_amm,
        cognome_amm: societa.cognome_amm,
        cf_amm: societa.cf_amm,
        data_nascita_amm: societa.data_nascita_amm,
        luogo_nascita_amm: societa.luogo_nascita_amm,
      },
      documenti: societa.documenti,
      sim_totali: simTotali,
      sim_attive_per_operatore: attivePerOperatore,
      sim_in_consegna_per_operatore: inConsegnaPerOperatore,
    }

    return NextResponse.json(responseData)
  } catch (err) {
    console.error('Errore recupero dati società:', err)
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { piva: string } }
) {
  try {
    const body = await req.json()

    const updated = await prisma.societa.update({
      where: { piva: params.piva },
      data: {
        ragione_sociale: body.ragione_sociale,
        sede_legale: body.sede_legale,
        n_dipendenti: body.n_dipendenti,
        telefono: body.telefono,
        nome_amm: body.nome_amm,
        cognome_amm: body.cognome_amm,
        cf_amm: body.cf_amm,
        data_nascita_amm: body.data_nascita_amm ? new Date(body.data_nascita_amm) : undefined,
        luogo_nascita_amm: body.luogo_nascita_amm,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Errore aggiornamento società:', error)
    return NextResponse.json({ error: 'Errore server' }, { status: 500 })
  }
}