import { Router, Neighbor, RibEntry } from './types';

/**
 * A minimal BGP engine skeleton. This class is intentionally simple to
 * focus on the data flow and interactions with the UI rather than
 * implementing the entire protocol. It provides facilities to load
 * routers and prefixes from a lab definition, retrieve current
 * RIBs and neighbours, and step the simulation (no real FSM yet).
 */
export class BgpEngine {
  private routers: Record<string, Router> = {};
  private neighbors: Record<string, Neighbor> = {};
  private ribs: Record<string, RibEntry[]> = {};

  /**
   * Load a lab scenario into the engine. Existing state is wiped.
   * @param lab A JSON document describing routers, neighbours and prefixes.
   */
  loadLab(lab: LabDefinition) {
    this.routers = {};
    this.neighbors = {};
    this.ribs = {};
    // Initialise routers
    lab.routers.forEach((router) => {
      this.routers[router.id] = router;
      this.ribs[router.id] = [];
    });
    // Initialise neighbours
    lab.neighbors.forEach((nbr) => {
      this.neighbors[nbr.id] = nbr;
    });
    // Load initial RIB entries
    lab.initialRibs.forEach((rib) => {
      if (!this.ribs[rib.routerId]) {
        this.ribs[rib.routerId] = [];
      }
      this.ribs[rib.routerId].push(rib.entry);
    });
  }

  /**
   * Return the routers known to the engine.
   */
  getRouters(): Router[] {
    return Object.values(this.routers);
  }

  /**
   * Return the neighbours known to the engine.
   */
  getNeighbors(): Neighbor[] {
    return Object.values(this.neighbors);
  }

  /**
   * Return the RIB entries for a router.
   */
  getRib(routerId: string): RibEntry[] {
    return this.ribs[routerId] ?? [];
  }

  /**
   * Step the simulation. In a full implementation this would process
   * timers, send UPDATEs, recalculate best paths etc. This skeleton
   * simply increments the age of each RIB entry to illustrate time.
   */
  step(ms: number = 1000) {
    Object.keys(this.ribs).forEach((rid) => {
      this.ribs[rid] = this.ribs[rid].map((entry) => ({
        ...entry,
        ageMs: entry.ageMs + ms,
      }));
    });
  }
}


/**
 * Shape of a lab definition loaded via JSON. Labs can define
 * routers, neighbours and a set of initial RIB entries for each router.
 */
export interface LabDefinition {
  id: string;
  name: string;
  description: string;
  routers: Router[];
  neighbors: Neighbor[];
  initialRibs: { routerId: string; entry: RibEntry }[];
}

export type { Router, Neighbor, RibEntry } from './types';
