'use client'
import React from 'react'

type SIM = {
  id: number
  iccid: string
  operatore: string
  stato: string
  data_fatturazione: string
  costo_mensile: number
  minuti_lavorati: number
  societa_piva: string
}

type SIMTableProps = {
  sims: SIM[]
}

export default function SIMTable({ sims }: SIMTableProps) {
  return (
    <div className="overflow-x-auto rounded border border-gray-700">
      <table className="w-full text-sm text-left text-white bg-gray-800">
        <thead className="bg-gray-700 text-xs uppercase">
          <tr>
            <th className="px-4 py-3">ICCID</th>
            <th className="px-4 py-3">Operatore</th>
            <th className="px-4 py-3">Stato</th>
            <th className="px-4 py-3">Fatturazione</th>
            <th className="px-4 py-3">Costo €</th>
            <th className="px-4 py-3">Minuti</th>
            <th className="px-4 py-3">P.IVA Società</th>
          </tr>
        </thead>
        <tbody>
          {sims.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                Nessuna SIM trovata.
              </td>
            </tr>
          ) : (
            sims.map((sim) => (
              <tr key={sim.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                <td className="px-4 py-2">{sim.iccid}</td>
                <td className="px-4 py-2">{sim.operatore}</td>
                <td className="px-4 py-2">{sim.stato}</td>
                <td className="px-4 py-2">{sim.data_fatturazione}</td>
                <td className="px-4 py-2">{sim.costo_mensile}</td>
                <td className="px-4 py-2">{sim.minuti_lavorati}</td>
                <td className="px-4 py-2">{sim.societa_piva}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}