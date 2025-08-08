/**
 * TypeScript interfaces describing the key data structures used by the
 * BGP simulator. These types are intentionally comprehensive but can
 * be extended as the simulator grows. They mirror the structures
 * described in the high‑level design document provided by the user.
 */

export type Asn = number;

export interface Router {
  id: string;
  name: string;
  asn: Asn;
  routerId: string;
  loopbacks: string[];
  interfaces: Interface[];
  neighbors: NeighborRef[];
  afiSafi: {
    ipv4: boolean;
    ipv6: boolean;
    vpnv4?: boolean;
    vpnv6?: boolean;
  };
  policy: {
    routeMaps: RouteMap[];
    communityLists: CommunityList[];
    asPathLists: AsPathList[];
    prefixLists: PrefixList[];
  };
  timers: {
    keepalive: number;
    hold: number;
    connectRetry: number;
    gracefulRestart?: boolean;
  };
  knobs: {
    alwaysCompareMed?: boolean;
    deterministicMed?: boolean;
    multipath?: boolean;
    maxPaths?: number;
    addPath?: boolean;
    nextHopSelf?: boolean;
  };
  security?: {
    tcpMd5?: string;
    tcpAo?: string;
    ttlSecurity?: number;
  };
}

export interface Interface {
  id: string;
  name: string;
  ip: string;
  network: string;
  cost?: number;
}

export interface NeighborRef {
  id: string;
  peerId: string;
}

export interface Neighbor {
  id: string;
  localRouterId: string;
  peerRouterId: string;
  localAs: Asn;
  peerAs: Asn;
  sessionType: 'eBGP' | 'iBGP';
  multihopTtl?: number;
  passive?: boolean;
  routeServerClient?: boolean;
  families: ('ipv4' | 'ipv6' | 'vpnv4' | 'vpnv6')[];
  inRouteMaps?: string[];
  outRouteMaps?: string[];
  maxPrefixes?: number;
  bfd?: {
    enabled: boolean;
    minTx: number;
    minRx: number;
    mult: number;
  };
  fsm?: BgpFsmState;
}

export type BgpFsmState =
  | 'Idle'
  | 'Connect'
  | 'Active'
  | 'OpenSent'
  | 'OpenConfirm'
  | 'Established';

export interface PathAttributes {
  origin: 'igp' | 'egp' | 'incomplete';
  asPath: Asn[];
  med?: number;
  localPref?: number;
  communities?: string[];
  extCommunities?: string[];
  aggregator?: {
    asn: Asn;
    routerId: string;
  };
  atomicAggregate?: boolean;
  originatorId?: string;
  clusterList?: string[];
  weight?: number;
}

export interface RibEntry {
  prefix: string;
  pathAttributes: PathAttributes;
  source: 'eBGP' | 'iBGP' | 'local' | 'aggregate' | 'rr-client';
  nextHop: string;
  ageMs: number;
}

export interface RouterRibs {
  adjRibIn: Record<string, RibEntry[]>;
  locRib: Record<string, RibEntry[]>;
  adjRibOut: Record<string, RibEntry[]>;
}

// Policy structures for future expansion. In this skeleton they are
// represented as opaque types to avoid implementing a full DSL. The
// simulator will treat them as descriptive strings for now.
export interface RouteMap {
  name: string;
  statements: string[];
}

export interface CommunityList {
  name: string;
  entries: string[];
}

export interface AsPathList {
  name: string;
  regexes: string[];
}

export interface PrefixList {
  name: string;
  prefixes: string[];
}
