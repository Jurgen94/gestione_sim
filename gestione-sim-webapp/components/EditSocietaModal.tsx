'use client'

import { useState, useEffect } from 'react'

export default function EditSocietaModal({ societa, onClose, onUpdate }: {
  societa: any,
  onClose: () => void,
  onUpdate?: () => void,
}) {
  const [form, setForm] = useState({ ...societa })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/societa/${form.piva}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Errore durante l\'aggiornamento')
        return
      }

      if (onUpdate) onUpdate()
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
        <h2 className="text-white text-xl font-bold mb-2">✏️ Modifica Società</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="ragione_sociale" value={form.ragione_sociale} onChange={handleChange} placeholder="Ragione Sociale" className="bg-gray-700 p-2 rounded text-white col-span-2" />
          <input name="referente" value={form.referente || ''} onChange={handleChange} placeholder="Referente" className="bg-gray-700 p-2 rounded text-white col-span-2" />
          <input name="iban" value={form.iban || ''} onChange={handleChange} placeholder="IBAN" className="bg-gray-700 p-2 rounded text-white col-span-2" />
          <input name="sede_legale" value={form.sede_legale || ''} onChange={handleChange} placeholder="Sede Legale" className="bg-gray-700 p-2 rounded text-white col-span-2" />
          <input name="telefono" value={form.telefono || ''} onChange={handleChange} placeholder="Telefono" className="bg-gray-700 p-2 rounded text-white" />
          <input name="n_dipendenti" value={form.n_dipendenti || ''} onChange={handleChange} placeholder="N° Dipendenti" type="number" className="bg-gray-700 p-2 rounded text-white" />
          <input name="nome_amm" value={form.nome_amm || ''} onChange={handleChange} placeholder="Nome Amm." className="bg-gray-700 p-2 rounded text-white" />
          <input name="cognome_amm" value={form.cognome_amm || ''} onChange={handleChange} placeholder="Cognome Amm." className="bg-gray-700 p-2 rounded text-white" />
          <input name="cf_amm" value={form.cf_amm || ''} onChange={handleChange} placeholder="CF Amm." className="bg-gray-700 p-2 rounded text-white" />
          <input name="data_nascita_amm" value={form.data_nascita_amm?.split('T')[0] || ''} onChange={handleChange} type="date" className="bg-gray-700 p-2 rounded text-white" />
          <input name="luogo_nascita_amm" value={form.luogo_nascita_amm || ''} onChange={handleChange} placeholder="Luogo Nascita Amm." className="bg-gray-700 p-2 rounded text-white" />
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