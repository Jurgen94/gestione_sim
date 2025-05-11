'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function SocietaPage() {
  const { piva } = useParams()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/societa/${piva}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        setError('Errore nel recupero dati società.')
      }
    }

    fetchData()
  }, [piva])

  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!data) return <div className="text-white p-4">Caricamento...</div>

  const simList = Array.isArray(data.sim) ? data.sim : []

  const simAttive = simList.filter((s: any) => s.stato === 'Attiva')
  const simInConsegna = simList.filter((s: any) => s.stato === 'In consegna')

  const raggruppaPerOperatore = (sims: any[]) => {
    const mappa: Record<string, number> = {}
    sims.forEach(s => {
      mappa[s.operatore] = (mappa[s.operatore] || 0) + 1
    })
    return mappa
  }

  const attivePerOperatore = raggruppaPerOperatore(simAttive)
  const consegnaPerOperatore = raggruppaPerOperatore(simInConsegna)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">📁 {data.ragione_sociale}</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">📊 Statistiche SIM</h2>
          <p><strong>Totale SIM:</strong> {simList.length}</p>
          <p><strong>SIM attive:</strong> {simAttive.length}</p>
          <p><strong>SIM in consegna:</strong> {simInConsegna.length}</p>
          <p className="mt-2"><strong>Attive per operatore:</strong></p>
          <ul className="text-sm">
            {Object.entries(attivePerOperatore).map(([op, count]) => (
              <li key={op}>{op}: {count}</li>
            ))}
          </ul>
          <p className="mt-2"><strong>In consegna per operatore:</strong></p>
          <ul className="text-sm">
            {Object.entries(consegnaPerOperatore).map(([op, count]) => (
              <li key={op}>{op}: {count}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">🏢 Info Società</h2>
          <p><strong>P.IVA:</strong> {data.piva}</p>
          <p><strong>Sede legale:</strong> {data.sede_legale || '-'}</p>
          <p><strong>Dipendenti:</strong> {data.n_dipendenti ?? '-'}</p>
          <p><strong>Telefono:</strong> {data.telefono || '-'}</p>
          <hr className="my-2 border-gray-700" />
          <p><strong>Amministratore:</strong></p>
          <p>{data.nome_amm} {data.cognome_amm}</p>
          <p><strong>Codice fiscale:</strong> {data.cf_amm || '-'}</p>
          <p><strong>Nascita:</strong> {data.data_nascita_amm?.split('T')[0] || '-'} a {data.luogo_nascita_amm || '-'}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">📎 Documenti Amministratore</h2>
        <p>⚠️ Caricamento/visualizzazione documenti non ancora implementati.</p>
      </div>
    </div>
  )
}