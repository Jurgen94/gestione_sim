import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { ids, data } = await req.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ID mancanti" }, { status: 400 })
    }

    // Filtra solo i campi validi
    const fieldsToUpdate: any = {}
    if (data.stato) fieldsToUpdate.stato = data.stato
    if (data.data_fatturazione) fieldsToUpdate.data_fatturazione = data.data_fatturazione
    if (typeof data.minuti_lavorati === "number") fieldsToUpdate.minuti_lavorati = data.minuti_lavorati
    if (typeof data.costo_mensile === "number") fieldsToUpdate.costo_mensile = data.costo_mensile

    await prisma.sim.updateMany({
      where: { id: { in: ids } },
      data: fieldsToUpdate,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Errore update SIM:", error)
    return NextResponse.json({ error: "Errore server" }, { status: 500 })
  }
}