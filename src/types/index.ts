// ============================================================
// Marine Analytica — Central Type Definitions
// ============================================================

export interface FishSample {
  id: string;
  totalLength: number;      // cm
  forkLength?: number;      // cm
  standardLength?: number;  // cm
  weight: number;           // grams
  sex?: "M" | "F" | "U";
  maturityStage?: 1 | 2 | 3 | 4 | 5;
  collectionDate?: string;  // ISO date string
  location?: string;
  notes?: string;
  species?: string;
}

export interface LWRParams {
  a: number;          // LWR intercept
  b: number;          // LWR slope (allometric exponent)
  r2: number;         // Coefficient of determination
  n: number;          // sample size
  ci_b_lower?: number;
  ci_b_upper?: number;
  se_b?: number;
  logA?: number;
  se_logA?: number;
}

export interface LengthBin {
  bin: string;        // e.g. "10–15"
  midpoint: number;
  count: number;
  frequency: number;  // relative %
}

export interface SummaryStats {
  n: number;
  meanTL: number;
  sdTL: number;
  minTL: number;
  maxTL: number;
  meanWeight: number;
  sdWeight: number;
  minWeight: number;
  maxWeight: number;
  meanK: number;      // mean Fulton's condition factor
  lwrParams: LWRParams;
  lengthBins: LengthBin[];
}

export interface RegressionPoint {
  logL: number;
  logW: number;
  predictedLogW: number;
  totalLength: number;
  weight: number;
  predictedW?: number;
  sex?: string;
  maturityStage?: number;
  residual?: number;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  tourId?: string;
  badge?: string;
}

export interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
  };
}

export type ExportFormat = "pdf" | "docx";

export interface ReportMeta {
  title: string;
  species: string;
  author: string;
  institution: string;
  date: string;
  location: string;
}

// Better-Auth session type extension
export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "researcher" | "guest";
    image?: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}
