'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import EditSocietaModal from '@/components/EditSocietaModal'

export default function SocietaPage() {
  const { piva } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)

  const fetchData = async () => {
    const res = await fetch(`/api/societa/${piva}`)
    if (res.ok) {
      const json = await res.json()
      setData(json)
    } else {
      setError('Errore nel recupero dati società.')
    }
  }

  useEffect(() => {
    fetchData()
  }, [piva])

  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!data) return <div className="text-white p-4">Caricamento...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📁 {data.societa.ragione_sociale}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            ⬅ Torna alla Home
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            ✏️ Modifica Società
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">📊 Statistiche SIM</h2>
          <p><strong>Totale SIM:</strong> {data.sim_totali}</p>

          <div className="mt-4">
            <p className="font-bold">SIM attive per operatore:</p>
            <ul className="text-sm ml-4 mt-1">
              {Object.entries(data.sim_attive_per_operatore).map(([op, count]) => (
                <li key={op}>• {op}: {count as number}</li>
              ))}
              {Object.keys(data.sim_attive_per_operatore).length === 0 && <li>Nessuna</li>}
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-bold">SIM in consegna per operatore:</p>
            <ul className="text-sm ml-4 mt-1">
              {Object.entries(data.sim_in_consegna_per_operatore).map(([op, count]) => (
                <li key={op}>• {op}: {count as number}</li>
              ))}
              {Object.keys(data.sim_in_consegna_per_operatore).length === 0 && <li>Nessuna</li>}
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">🏢 Info Società</h2>
          <p><strong>P.IVA:</strong> {data.societa.piva}</p>
          <p><strong>Sede legale:</strong> {data.societa.sede_legale || '-'}</p>
          <p><strong>Dipendenti:</strong> {data.societa.n_dipendenti ?? '-'}</p>
          <p><strong>Telefono:</strong> {data.societa.telefono || '-'}</p>
          <hr className="my-2 border-gray-700" />
          <p><strong>Amministratore:</strong></p>
          <p>{data.societa.nome_amm || '-'} {data.societa.cognome_amm || ''}</p>
          <p><strong>Codice fiscale:</strong> {data.societa.cf_amm || '-'}</p>
          <p><strong>Nascita:</strong> {data.societa.data_nascita_amm?.split('T')[0] || '-'} a {data.societa.luogo_nascita_amm || '-'}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">📎 Documenti Amministratore</h2>
        <p>⚠️ Caricamento/visualizzazione documenti non ancora implementati.</p>
      </div>

      {showEditModal && (
        <EditSocietaModal
          societa={data.societa}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            setShowEditModal(false)
            fetchData()
          }}
        />
      )}
    </div>
  )
}
