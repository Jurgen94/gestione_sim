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
    sede_legale: '',
    n_dipendenti: '',
    telefono: '',
    nome_amm: '',
    cognome_amm: '',
    cf_amm: '',
    data_nascita_amm: '',
    luogo_nascita_amm: '',
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
        body: JSON.stringify({
          ...form,
          n_dipendenti: form.n_dipendenti ? parseInt(form.n_dipendenti) : null,
          data_nascita_amm: form.data_nascita_amm || null,
        }),
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
      <div className="bg-gray-800 p-6 rounded w-full max-w-2xl space-y-4">
        <h2 className="text-white text-xl font-bold mb-2">🏢 Aggiungi Società</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="piva" placeholder="P.IVA *" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="ragione_sociale" placeholder="Ragione Sociale" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="referente" placeholder="Referente" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="iban" placeholder="IBAN *" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="sede_legale" placeholder="Sede Legale" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="n_dipendenti" placeholder="Numero Dipendenti" type="number" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="telefono" placeholder="Telefono" onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="nome_amm" placeholder="Nome Amm." onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="cognome_amm" placeholder="Cognome Amm." onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="cf_amm" placeholder="Codice Fiscale Amm." onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="data_nascita_amm" type="date" placeholder="Data Nascita Amm." onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          <input name="luogo_nascita_amm" placeholder="Luogo Nascita Amm." onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
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