import { useEffect } from 'react';
import { useBGPStore } from '../store/useBGPStore';
import { LabDefinition } from '../engine/BgpEngine';
import dynamic from 'next/dynamic';

// Dynamically import the topology canvas since react-flow does not
// support server side rendering out of the box. This ensures the
// component only loads on the client.
const TopologyCanvas = dynamic(() => import('../components/TopologyCanvas'), {
  ssr: false,
});
const RouterInspector = dynamic(() => import('../components/RouterInspector'), {
  ssr: false,
});

// Import lab definitions statically. Additional labs can be added
// by placing JSON files in the labs directory and importing them here.
import ebgp101 from '../labs/ebgp101.json';
import localPrefVsMed from '../labs/localPrefVsMed.json';

const labs: LabDefinition[] = [ebgp101 as unknown as LabDefinition, localPrefVsMed as unknown as LabDefinition];

export default function Home() {
  const loadLab = useBGPStore((s) => s.loadLab);
  const currentLab = useBGPStore((s) => s.currentLab);
  const step = useBGPStore((s) => s.step);

  // Kick off a timer when a lab is loaded. This will advance the
  // simulation every second. The timer is cleared when the component
  // unmounts or the lab changes.
  useEffect(() => {
    if (!currentLab) return;
    const interval = setInterval(() => {
      step(1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLab, step]);

  return (
    <main style={{ padding: '1rem', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>BGP Simulator</h1>
      {!currentLab ? (
        <>
          <p>Select a lab to begin exploring BGP behaviour. Each lab defines
            a topology and a set of initial routing table entries.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            {labs.map((lab) => (
              <div
                key={lab.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--border-radius)',
                  padding: '1rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  maxWidth: '240px',
                  flex: '1 1 240px',
                }}
              >
                <h3 style={{ marginBottom: '0.25rem' }}>{lab.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>{lab.description}</p>
                <button
                  onClick={() => loadLab(lab)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                  }}
                >
                  Load Lab
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ flex: 3, minHeight: '600px' }}>
            <TopologyCanvas />
          </div>
          <div style={{ flex: 2 }}>
            <RouterInspector />
          </div>
        </div>
      )}
    </main>
  );
}
