'use client'
import React, { useState } from 'react'

type ImportSimModalProps = {
  onClose: () => void
  onSave?: () => void
}

export default function ImportSimModal({ onClose, onSave }: ImportSimModalProps) {
  const [iccidList, setIccidList] = useState('')
  const [operatore, setOperatore] = useState('')
  const [stato, setStato] = useState('Attiva')
  const [societa_piva, setSocietaPiva] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const righe = iccidList.trim().split('\n').map(r => r.trim()).filter(Boolean)
    if (righe.length === 0 || !operatore || !societa_piva) {
      setError('Tutti i campi sono obbligatori')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/sim/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iccids: righe, operatore, stato, societa_piva }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Errore durante l’importazione')
        return
      }

      if (onSave) onSave()
      onClose()
    } catch (err) {
      setError('Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded w-full max-w-xl space-y-4">
        <h2 className="text-white text-xl font-bold mb-2">📥 Importa SIM in blocco</h2>

        <textarea
          rows={8}
          placeholder="Inserisci un ICCID per riga"
          value={iccidList}
          onChange={(e) => setIccidList(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        />

        <input
          type="text"
          placeholder="Operatore *"
          value={operatore}
          onChange={(e) => setOperatore(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        />

        <select
          value={stato}
          onChange={(e) => setStato(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="Attiva">Attiva</option>
          <option value="Bloccata">Bloccata</option>
          <option value="In consegna">In consegna</option>
        </select>

        <input
          type="text"
          placeholder="P.IVA Società *"
          value={societa_piva}
          onChange={(e) => setSocietaPiva(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-600 rounded text-white">Annulla</button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white">
            {loading ? 'Importo...' : 'Importa'}
          </button>
        </div>
      </div>
    </div>
  )
}