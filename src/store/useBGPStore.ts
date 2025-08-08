import create from 'zustand';
import { BgpEngine } from '../engine/BgpEngine';
import type { LabDefinition, Router, Neighbor, RibEntry } from '../engine/BgpEngine';

/**
 * Zustand store encapsulating the BGP engine and current UI state. This
 * store exposes methods to load labs, step the simulation and select
 * routers for inspection. The UI can subscribe to parts of the state
 * individually for efficient re‑renders.
 */
interface BGPState {
  engine: BgpEngine;
  currentLab?: LabDefinition;
  routers: Router[];
  neighbors: Neighbor[];
  selectedRouterId?: string;
  loadLab: (lab: LabDefinition) => void;
  step: (ms?: number) => void;
  selectRouter: (id: string) => void;
  getRib: (routerId: string) => RibEntry[];
}

export const useBGPStore = create<BGPState>((set, get) => ({
  engine: new BgpEngine(),
  routers: [],
  neighbors: [],
  loadLab: (lab) => {
    const engine = get().engine;
    engine.loadLab(lab);
    set({ currentLab: lab, routers: engine.getRouters(), neighbors: engine.getNeighbors(), selectedRouterId: undefined });
  },
  step: (ms = 1000) => {
    const engine = get().engine;
    engine.step(ms);
    // update nothing else; RIBs retrieved via getRib
    set({});
  },
  selectRouter: (id) => set({ selectedRouterId: id }),
  getRib: (routerId) => {
    return get().engine.getRib(routerId);
  },
}));
