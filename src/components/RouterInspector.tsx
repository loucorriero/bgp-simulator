import React from 'react';
import { useBGPStore } from '../store/useBGPStore';

/**
 * RouterInspector displays detailed information about the selected
 * router, including its basic properties and the contents of its
 * local RIB. If no router is selected a prompt instructs the user to
 * click a node on the topology canvas.
 */
const RouterInspector: React.FC = () => {
  const selectedRouterId = useBGPStore((s) => s.selectedRouterId);
  const routers = useBGPStore((s) => s.routers);
  const getRib = useBGPStore((s) => s.getRib);

  if (!selectedRouterId) {
    return <div style={{ padding: '1rem' }}>Select a router on the canvas to view its details.</div>;
  }

  const router = routers.find((r) => r.id === selectedRouterId);
  if (!router) return null;
  const rib = getRib(router.id);

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{router.name}</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        <strong>Router ID:</strong> {router.routerId}
      </p>
      <p style={{ marginBottom: '0.5rem' }}>
        <strong>ASN:</strong> {router.asn}
      </p>
      <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Local RIB</h3>
      {rib.length === 0 ? (
        <p>No prefixes installed on this router.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '0.25rem' }}>Prefix</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '0.25rem' }}>Next Hop</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '0.25rem' }}>LocalPref</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '0.25rem' }}>MED</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '0.25rem' }}>AS Path</th>
            </tr>
          </thead>
          <tbody>
            {rib.map((entry, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.25rem' }}>{entry.prefix}</td>
                <td style={{ padding: '0.25rem' }}>{entry.nextHop}</td>
                <td style={{ padding: '0.25rem' }}>{entry.pathAttributes.localPref ?? '-'}</td>
                <td style={{ padding: '0.25rem' }}>{entry.pathAttributes.med ?? '-'}</td>
                <td style={{ padding: '0.25rem' }}>{entry.pathAttributes.asPath && entry.pathAttributes.asPath.length > 0 ? entry.pathAttributes.asPath.join(' ') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RouterInspector;
