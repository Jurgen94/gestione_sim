'use client';

import { useEffect, useState } from 'react';
import FilterBar from '@/components/FilterBar';
import SIMTable from '@/components/SIMTable';
import AddSimModal from '@/components/AddSimModal';
import AddSocietaModal from '@/components/AddSocietaModal';
import ImportSimModal from '@/components/ImportSimModal';

export default function HomePage() {
  const [selectedSocieta, setSelectedSocieta] = useState('');
  const [operatore, setOperatore] = useState('');
  const [sims, setSims] = useState([]);
  const [selectedSims, setSelectedSims] = useState<string[]>([]);
  const [societaOptions, setSocietaOptions] = useState<
    { id: number; piva: string; ragione_sociale: string }[]
  >([]);
  const [showSimModal, setShowSimModal] = useState(false);
  const [showSocietaModal, setShowSocietaModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const fetchSocieta = async () => {
    const res = await fetch('/api/societa');
    if (res.ok) {
      const data = await res.json();
      setSocietaOptions(data);
    }
  };

  const fetchSIMs = async () => {
    const res = await fetch('/api/sim');
    if (res.ok) {
      const data = await res.json();
      const filtrate = data.filter((sim: any) => {
        return (
          (!selectedSocieta || sim.societa?.piva === selectedSocieta) &&
          (!operatore || sim.operatore.toLowerCase().includes(operatore.toLowerCase()))
        );
      });
      setSims(filtrate);
    }
  };

  useEffect(() => {
    fetchSocieta();
  }, []);

  useEffect(() => {
    fetchSIMs();
  }, [selectedSocieta, operatore]);

  const handleAddSim = () => fetchSIMs();
  const handleAddSocieta = () => fetchSocieta();
  const handleImportSim = () => fetchSIMs();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📡 Gestione SIM</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <FilterBar
        societaOptions={societaOptions}
        selectedSocieta={selectedSocieta}
        setSelectedSocieta={setSelectedSocieta}
        operatore={operatore}
        setOperatore={setOperatore}
        onAggiungiSim={() => setShowSimModal(true)}
        onAggiungiSocieta={() => setShowSocietaModal(true)}
        onImportaSim={() => setShowImportModal(true)}
        onEsporta={() => alert('Esportazione PDF da implementare')}
      />

      <SIMTable sims={sims} selected={selectedSims} setSelected={setSelectedSims} />

      {showSimModal && (
        <AddSimModal
          onClose={() => setShowSimModal(false)}
          onSave={handleAddSim}
        />
      )}

      {showSocietaModal && (
        <AddSocietaModal
          onClose={() => setShowSocietaModal(false)}
          onSave={handleAddSocieta}
        />
      )}

      {showImportModal && (
        <ImportSimModal
          onClose={() => setShowImportModal(false)}
          onSave={handleImportSim}
        />
      )}
    </main>
  );
}