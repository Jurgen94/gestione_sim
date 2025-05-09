'use client'
import React, { useState } from 'react'

type AddSocietaModalProps = {
  onClose: () => void
  onSave?: (data: any) => void
}

export default function AddSocietaModal({ onClose, onSave }: AddSocietaModalProps) {
  const [form, setForm] = useState({
    piva: '',
    ragione_sociale: '',
    referente: '',
    iban: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')

    if (!form.piva || !form.iban) {
      setError('P.IVA e IBAN sono obbligatori')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/societa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
      <div className="bg-gray-800 p-6 rounded w-full max-w-md space-y-4">
        <h2 className="text-white text-xl font-bold mb-2">🏢 Aggiungi Società</h2>
        <div className="grid grid-cols-1 gap-4">
          <input name="piva" placeholder="P.IVA *" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="ragione_sociale" placeholder="Ragione Sociale" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="referente" placeholder="Referente" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="iban" placeholder="IBAN *" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-600 rounded text-white">Annulla</button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white">
            {loading ? 'Salvo...' : 'Salva'}
          </button>
        </div>
      </div>
    </div>
  )
}