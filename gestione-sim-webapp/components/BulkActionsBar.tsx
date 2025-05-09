'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BulkActionsBar({
  selected,
  onRefresh,
}: {
  selected: string[]
  onRefresh: () => void
}) {
  const [stato, setStato] = useState("")
  const [fatturazione, setFatturazione] = useState("")
  const [minuti, setMinuti] = useState("")
  const [costo, setCosto] = useState("")

  const handleUpdate = async () => {
    if (selected.length === 0) return

    await fetch("/api/sim/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: selected,
        data: {
          stato: stato || undefined,
          data_fatturazione: fatturazione || undefined,
          minuti_lavorati: minuti ? parseInt(minuti) : undefined,
          costo_mensile: costo ? parseFloat(costo) : undefined,
        },
      }),
    })

    onRefresh()
    setStato("")
    setFatturazione("")
    setMinuti("")
    setCosto("")
  }

  const handleDelete = async () => {
    if (!confirm("Confermi l'eliminazione delle SIM selezionate?")) return

    await fetch("/api/sim/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    })

    onRefresh()
  }

  if (selected.length === 0) return null

  return (
    <div className="bg-gray-800 p-4 rounded mb-4 space-y-2">
      <div className="text-sm text-gray-300 mb-2">
        {selected.length} SIM selezionate
      </div>
      <div className="grid grid-cols-5 gap-2">
        <select
          className="bg-gray-900 border rounded p-2 text-white"
          value={stato}
          onChange={(e) => setStato(e.target.value)}
        >
          <option value="">Cambia stato...</option>
          <option value="Attiva">Attiva</option>
          <option value="Bloccata">Bloccata</option>
          <option value="In consegna">In consegna</option>
        </select>
        <Input
          type="date"
          placeholder="Data fatturazione"
          value={fatturazione}
          onChange={(e) => setFatturazione(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Minuti lavorati"
          value={minuti}
          onChange={(e) => setMinuti(e.target.value)}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Costo mensile"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleUpdate}>Applica</Button>
          <Button variant="destructive" onClick={handleDelete}>Elimina</Button>
        </div>
      </div>
    </div>
  )
}