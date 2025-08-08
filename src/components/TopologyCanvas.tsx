import React, { useMemo } from 'react';
import { useBGPStore } from '../store/useBGPStore';
import ReactFlow, { Node, Edge } from 'react-flow-renderer';

/**
 * The topology canvas renders the network graph using react‑flow. It
 * converts the routers and neighbours from the store into nodes and
 * edges. Clicking on a node will select that router for inspection.
 */
const TopologyCanvas: React.FC = () => {
  const routers = useBGPStore((s) => s.routers);
  const neighbors = useBGPStore((s) => s.neighbors);
  const selectRouter = useBGPStore((s) => s.selectRouter);

  // Compute node positions on a circle. Memoising prevents
  // recalculation on every render unless the router set changes.
  const nodes: Node[] = useMemo(() => {
    const count = Math.max(routers.length, 1);
    const radius = 200;
    return routers.map((router, index) => {
      const angle = (index / count) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      return {
        id: router.id,
        data: { label: router.name },
        position: { x, y },
        type: 'default',
      } as Node;
    });
  }, [routers]);

  const edges: Edge[] = useMemo(() => {
    return neighbors.map((nbr) => ({
      id: nbr.id,
      source: nbr.localRouterId,
      target: nbr.peerRouterId,
      animated: false,
    }));
  }, [neighbors]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      onNodeClick={(event, node) => {
        selectRouter(node.id);
      }}
      style={{ width: '100%', height: '100%', background: '#f0f4f8' }}
    />
  );
};

export default TopologyCanvas;
