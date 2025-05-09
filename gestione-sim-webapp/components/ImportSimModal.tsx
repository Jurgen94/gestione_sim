'use client'
import React, { useEffect, useState } from 'react'

type ImportSimModalProps = {
  onClose: () => void
  onSave?: () => void
}

export default function ImportSimModal({ onClose, onSave }: ImportSimModalProps) {
  const [iccidList, setIccidList] = useState('')
  const [operatore, setOperatore] = useState('')
  const [stato, setStato] = useState('Attiva')
  const [societa_piva, setSocietaPiva] = useState('')
  const [costoMensile, setCostoMensile] = useState('')
  const [societaList, setSocietaList] = useState<{ piva: string; ragione_sociale: string }[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/societa')
      .then(res => res.json())
      .then(data => setSocietaList(data))
  }, [])

  const handleSubmit = async () => {
    const righe = iccidList.trim().split('\n').map(r => r.trim()).filter(Boolean)
    const piva = societa_piva.trim()

    if (righe.length === 0 || !operatore || !piva || !costoMensile) {
      setError('Tutti i campi sono obbligatori')
      return
    }

    const pivaEsiste = societaList.some(s => s.piva === piva)
    if (!pivaEsiste) {
      setError('P.IVA non trovata. Aggiungi prima la società.')
      return
    }

    setLoading(true)
    try {
      const sims = righe.map((iccid) => ({
        iccid,
        operatore,
        stato,
        societa_piva: piva,
        costo_mensile: parseFloat(costoMensile),
        data_fatturazione: null,
        minuti_lavorati: 0
      }))

      const res = await fetch('/api/sim/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sims),
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
          type="number"
          step="0.01"
          placeholder="Costo mensile *"
          value={costoMensile}
          onChange={(e) => setCostoMensile(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        />

        <input
          type="text"
          list="piva-options"
          placeholder="Seleziona società *"
          value={societa_piva}
          onChange={(e) => setSocietaPiva(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        />
        <datalist id="piva-options">
          {societaList.map(({ piva, ragione_sociale }) => (
            <option key={piva} value={piva} label={ragione_sociale} />
          ))}
        </datalist>

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