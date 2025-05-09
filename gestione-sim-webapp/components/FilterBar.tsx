'use client'
import React from 'react'

type Societa = { id: number; piva: string; ragione_sociale: string }

type FilterBarProps = {
  societaOptions: Societa[]
  selectedSocieta: string
  setSelectedSocieta: (value: string) => void
  operatore: string
  setOperatore: (value: string) => void
  onAggiungiSim: () => void
  onAggiungiSocieta: () => void
  onImportaSim: () => void
  onEsporta: () => void
}

export default function FilterBar({
  societaOptions,
  selectedSocieta,
  setSelectedSocieta,
  operatore,
  setOperatore,
  onAggiungiSim,
  onAggiungiSocieta,
  onImportaSim,
  onEsporta
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
      <div className="flex gap-4">
        <select
          value={selectedSocieta}
          onChange={(e) => setSelectedSocieta(e.target.value)}
          className="bg-gray-800 text-white rounded px-4 py-2"
        >
          <option value="">Tutte le società</option>
          {societaOptions.map((s) => (
            <option key={s.id} value={s.piva}>
              {s.ragione_sociale || s.piva}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtra per operatore"
          value={operatore}
          onChange={(e) => setOperatore(e.target.value)}
          className="bg-gray-800 text-white rounded px-4 py-2"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={onAggiungiSim} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          ➕ SIM
        </button>
        <button onClick={onAggiungiSocieta} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          🏢 Società
        </button>
        <button onClick={onImportaSim} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
          📥 Importa
        </button>
        <button onClick={onEsporta} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          📄 Esporta
        </button>
      </div>
    </div>
  )
}