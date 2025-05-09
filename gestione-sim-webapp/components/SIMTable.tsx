'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type SIM = {
  id: string
  iccid: string
  operatore: string
  stato: string
  data_fatturazione: string | null
  minuti_lavorati: number | null
  costo_mensile: number
  societa_piva: string
}

type SIMTableProps = {
  sims: SIM[]
  selected: string[]
  setSelected: (ids: string[]) => void
}

export default function SIMTable({ sims, selected, setSelected }: SIMTableProps) {
  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const allSelected = sims.length > 0 && selected.length === sims.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected(sims.map(sim => sim.id))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              title="Seleziona tutte"
            />
          </TableHead>
          <TableHead>ICCID</TableHead>
          <TableHead>Operatore</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Fatturazione</TableHead>
          <TableHead>Minuti</TableHead>
          <TableHead>Costo</TableHead>
          <TableHead>Società</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sims.map(sim => (
          <TableRow key={sim.id}>
            <TableCell>
              <input
                type="checkbox"
                checked={selected.includes(sim.id)}
                onChange={() => toggleSelection(sim.id)}
              />
            </TableCell>
            <TableCell>{sim.iccid}</TableCell>
            <TableCell>{sim.operatore}</TableCell>
            <TableCell>{sim.stato}</TableCell>
            <TableCell>{sim.data_fatturazione || "-"}</TableCell>
            <TableCell>{sim.minuti_lavorati ?? "-"}</TableCell>
            <TableCell>{sim.costo_mensile} €</TableCell>
            <TableCell>{sim.societa_piva}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}