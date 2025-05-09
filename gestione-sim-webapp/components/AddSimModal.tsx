'use client'
import React, { useEffect, useState } from 'react'

type AddSimModalProps = {
  onClose: () => void
  onSave?: (data: any) => void
}

export default function AddSimModal({ onClose, onSave }: AddSimModalProps) {
  const [form, setForm] = useState({
    iccid: '',
    operatore: '',
    stato: 'Attiva',
    data_fatturazione: '',
    costo_mensile: '',
    minuti_lavorati: '',
    societa_piva: '',
  })

  const [societaList, setSocietaList] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/societa')
      .then(res => res.json())
      .then(data => {
        setSocietaList(data.map((s: any) => s.piva.trim()))
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')

    if (!form.iccid || !form.operatore || !form.stato || !form.costo_mensile || !form.societa_piva) {
      setError('Compila tutti i campi obbligatori')
      return
    }

    const cleanedPiva = form.societa_piva.trim()
    if (!societaList.includes(cleanedPiva)) {
      setError("P.IVA non trovata. Aggiungi prima la società.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, societa_piva: cleanedPiva }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Errore durante il salvataggio')
        return
      }

      const saved = await res.json()
      if (onSave) onSave(saved)
      onClose()
    } catch (err) {
      setError('Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded w-full max-w-lg space-y-4">
        <h2 className="text-white text-xl font-bold mb-2">➕ Aggiungi SIM</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="iccid" placeholder="ICCID *" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="operatore" placeholder="Operatore *" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <select name="stato" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white">
            <option value="Attiva">Attiva</option>
            <option value="Bloccata">Bloccata</option>
            <option value="In consegna">In consegna</option>
          </select>
          <input type="date" name="data_fatturazione" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="costo_mensile" type="number" step="0.01" placeholder="Costo mensile *" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="minuti_lavorati" type="number" placeholder="Minuti lavorati" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />

          <input
            name="societa_piva"
            placeholder="P.IVA Società *"
            list="piva-options"
            onChange={handleChange}
            className="bg-gray-700 p-2 rounded text-white col-span-2"
          />
          <datalist id="piva-options">
            {societaList.map((piva) => (
              <option key={piva} value={piva} />
            ))}
          </datalist>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-600 rounded text-white">
            Annulla
          </button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
            {loading ? 'Salvo...' : 'Salva'}
          </button>
        </div>
      </div>
    </div>
  )
}