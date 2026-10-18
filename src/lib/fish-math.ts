import { FishSample, LWRParams, LengthBin, SummaryStats, RegressionPoint } from "@/types";

// ============================================================
// Marine Analytica — Fisheries Mathematics Engine v2
// Methods: LWR log-log regression, Fulton K, Le Cren Wr,
//          length-freq, sex breakdown, maturity ogive,
//          weight-at-length curve, Pauly M, Beverton-Holt Z
// ============================================================

// ─── Core Regression ────────────────────────────────────────

/** OLS linear regression */
function linearRegression(
  x: number[],
  y: number[]
): { slope: number; intercept: number; r2: number; se_slope: number; se_intercept: number } {
  const n = x.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, se_slope: 0, se_intercept: 0 };

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

  const Sxx = sumXX - (sumX * sumX) / n;
  const Sxy = sumXY - (sumX * sumY) / n;
  const slope = Sxx === 0 ? 0 : Sxy / Sxx;
  const intercept = (sumY - slope * sumX) / n;

  const yMean = sumY / n;
  const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
  const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  // Standard errors
  const s2 = n > 2 ? ssRes / (n - 2) : 0;
  const se_slope = Sxx > 0 ? Math.sqrt(s2 / Sxx) : 0;
  const se_intercept = Math.sqrt(s2 * ((1 / n) + (sumX / n) ** 2 / Sxx));

  return { slope, intercept, r2, se_slope, se_intercept };
}

/** Standard deviation (sample) */
export function sd(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (values.length - 1));
}

// ─── LWR ────────────────────────────────────────────────────

/**
 * Length-Weight Relationship via log-log regression
 * Model: W = a × L^b  ⟹  log₁₀(W) = log₁₀(a) + b × log₁₀(L)
 */
export function computeLWR(samples: FishSample[]): LWRParams {
  const valid = samples.filter((s) => s.totalLength > 0 && s.weight > 0);
  if (valid.length < 3) return { a: 0, b: 0, r2: 0, n: 0 };

  const logL = valid.map((s) => Math.log10(s.totalLength));
  const logW = valid.map((s) => Math.log10(s.weight));
  const { slope, intercept, r2, se_slope, se_intercept } = linearRegression(logL, logW);

  // 95% CI for b (t-critical ≈ 1.96 for large n, use 2 as conservative)
  const tCrit = 2;
  const ci_b_lower = parseFloat((slope - tCrit * se_slope).toFixed(4));
  const ci_b_upper = parseFloat((slope + tCrit * se_slope).toFixed(4));

  return {
    a: parseFloat(Math.pow(10, intercept).toFixed(6)),
    b: parseFloat(slope.toFixed(4)),
    r2: parseFloat(r2.toFixed(4)),
    n: valid.length,
    ci_b_lower,
    ci_b_upper,
    se_b: parseFloat(se_slope.toFixed(4)),
    logA: parseFloat(intercept.toFixed(6)),
    se_logA: parseFloat(se_intercept.toFixed(4)),
  };
}

/** Build scatter points with predicted regression values */
export function buildRegressionPoints(samples: FishSample[], lwr: LWRParams): RegressionPoint[] {
  return samples
    .filter((s) => s.totalLength > 0 && s.weight > 0)
    .map((s) => {
      const logL = Math.log10(s.totalLength);
      const logW = Math.log10(s.weight);
      const predictedLogW = lwr.logA !== undefined ? lwr.logA + lwr.b * logL : Math.log10(lwr.a) + lwr.b * logL;
      const predictedW = parseFloat(Math.pow(10, predictedLogW).toFixed(2));
      return {
        logL: parseFloat(logL.toFixed(4)),
        logW: parseFloat(logW.toFixed(4)),
        predictedLogW: parseFloat(predictedLogW.toFixed(4)),
        totalLength: s.totalLength,
        weight: s.weight,
        predictedW,
        sex: s.sex,
        maturityStage: s.maturityStage,
        residual: parseFloat((logW - predictedLogW).toFixed(4)),
      };
    });
}

/** Generate smooth predicted weight-at-length curve */
export function buildWeightAtLengthCurve(
  lwr: LWRParams,
  minL: number,
  maxL: number,
  steps = 60
): { totalLength: number; predictedW: number }[] {
  if (lwr.n === 0) return [];
  const result = [];
  const step = (maxL - minL) / steps;
  for (let l = minL; l <= maxL + 0.01; l += step) {
    result.push({
      totalLength: parseFloat(l.toFixed(2)),
      predictedW: parseFloat((lwr.a * Math.pow(l, lwr.b)).toFixed(2)),
    });
  }
  return result;
}

// ─── Condition Factor ────────────────────────────────────────

/** Fulton's Condition Factor K = (W / L³) × 100 */
export function computeFultonK(weight: number, totalLength: number): number {
  if (totalLength <= 0) return 0;
  return parseFloat(((weight / Math.pow(totalLength, 3)) * 100).toFixed(4));
}

/**
 * Le Cren Relative Condition Factor Kn = W / W'
 * W' = predicted weight from LWR
 */
export function computeRelativeCondition(weight: number, totalLength: number, lwr: LWRParams): number {
  if (totalLength <= 0 || lwr.n === 0) return 0;
  const predictedW = lwr.a * Math.pow(totalLength, lwr.b);
  return predictedW > 0 ? parseFloat((weight / predictedW).toFixed(4)) : 0;
}

/** Build condition factor distribution for histogram */
export function buildConditionDistribution(
  samples: FishSample[],
  lwr: LWRParams,
  binWidth = 0.05
): { bin: string; midpoint: number; count: number; frequency: number }[] {
  const valid = samples.filter((s) => s.totalLength > 0 && s.weight > 0);
  if (valid.length === 0) return [];

  const kValues = valid.map((s) => computeRelativeCondition(s.weight, s.totalLength, lwr));
  const minK = Math.floor(Math.min(...kValues) / binWidth) * binWidth;
  const maxK = Math.ceil(Math.max(...kValues) / binWidth) * binWidth;

  const bins = [];
  for (let lower = minK; lower < maxK; lower += binWidth) {
    const upper = lower + binWidth;
    const count = kValues.filter((k) => k >= lower && k < upper).length;
    bins.push({
      bin: `${lower.toFixed(2)}–${upper.toFixed(2)}`,
      midpoint: parseFloat((lower + binWidth / 2).toFixed(3)),
      count,
      frequency: parseFloat(((count / valid.length) * 100).toFixed(2)),
    });
  }
  return bins.filter((b) => b.count > 0);
}

// ─── Length Frequency ────────────────────────────────────────

/** Length-frequency distribution with configurable bin width */
export function computeLengthFrequency(samples: FishSample[], binWidth = 5): LengthBin[] {
  const valid = samples.filter((s) => s.totalLength > 0);
  if (valid.length === 0) return [];

  const lengths = valid.map((s) => s.totalLength);
  const minL = Math.floor(Math.min(...lengths) / binWidth) * binWidth;
  const maxL = Math.ceil(Math.max(...lengths) / binWidth) * binWidth;

  const bins: LengthBin[] = [];
  for (let lower = minL; lower < maxL; lower += binWidth) {
    const upper = lower + binWidth;
    const count = lengths.filter((l) => l >= lower && l < upper).length;
    bins.push({
      bin: `${lower}–${upper}`,
      midpoint: lower + binWidth / 2,
      count,
      frequency: parseFloat(((count / valid.length) * 100).toFixed(2)),
    });
  }
  return bins;
}

// ─── Sex & Maturity Breakdown ────────────────────────────────

export interface SexBreakdown {
  sex: string;
  count: number;
  percentage: number;
  meanTL: number;
  meanWeight: number;
  meanK: number;
}

export interface MaturityBreakdown {
  stage: string;
  label: string;
  count: number;
  percentage: number;
  meanTL: number;
}

const MATURITY_LABELS: Record<string, string> = {
  "1": "Immature",
  "2": "Developing",
  "3": "Spawning",
  "4": "Spent",
  "5": "Recovering",
  "Unknown": "Unknown",
};

export function computeSexBreakdown(samples: FishSample[], lwr: LWRParams): SexBreakdown[] {
  const valid = samples.filter((s) => s.totalLength > 0 && s.weight > 0);
  const groups: Record<string, FishSample[]> = { M: [], F: [], U: [], Unknown: [] };

  valid.forEach((s) => {
    const key = s.sex ?? "Unknown";
    if (!(key in groups)) groups[key] = [];
    groups[key].push(s);
  });

  const mean = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return Object.entries(groups)
    .filter(([, arr]) => arr.length > 0)
    .map(([sex, arr]) => ({
      sex: sex === "M" ? "Male" : sex === "F" ? "Female" : sex === "U" ? "Undetermined" : "Unknown",
      count: arr.length,
      percentage: parseFloat(((arr.length / valid.length) * 100).toFixed(1)),
      meanTL: parseFloat(mean(arr.map((s) => s.totalLength)).toFixed(2)),
      meanWeight: parseFloat(mean(arr.map((s) => s.weight)).toFixed(2)),
      meanK: parseFloat(mean(arr.map((s) => computeFultonK(s.weight, s.totalLength))).toFixed(4)),
    }));
}

export function computeMaturityBreakdown(samples: FishSample[]): MaturityBreakdown[] {
  const valid = samples.filter((s) => s.totalLength > 0);
  const groups: Record<string, FishSample[]> = {};

  valid.forEach((s) => {
    const key = s.maturityStage?.toString() ?? "Unknown";
    if (!(key in groups)) groups[key] = [];
    groups[key].push(s);
  });

  const mean = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return Object.entries(groups)
    .sort(([a], [b]) => (parseInt(a) || 99) - (parseInt(b) || 99))
    .map(([stage, arr]) => ({
      stage,
      label: MATURITY_LABELS[stage] ?? `Stage ${stage}`,
      count: arr.length,
      percentage: parseFloat(((arr.length / valid.length) * 100).toFixed(1)),
      meanTL: parseFloat(mean(arr.map((s) => s.totalLength)).toFixed(2)),
    }));
}

// ─── Residuals ───────────────────────────────────────────────

export interface ResidualPoint {
  totalLength: number;
  residual: number;
  sex?: string;
}

export function buildResiduals(samples: FishSample[], lwr: LWRParams): ResidualPoint[] {
  return samples
    .filter((s) => s.totalLength > 0 && s.weight > 0 && lwr.n > 0)
    .map((s) => {
      const predictedLogW = (lwr.logA ?? Math.log10(lwr.a)) + lwr.b * Math.log10(s.totalLength);
      const actualLogW = Math.log10(s.weight);
      return {
        totalLength: s.totalLength,
        residual: parseFloat((actualLogW - predictedLogW).toFixed(4)),
        sex: s.sex,
      };
    });
}

// ─── Full Summary Stats ──────────────────────────────────────

export function computeSummaryStats(samples: FishSample[], binWidth = 5): SummaryStats {
  const valid = samples.filter((s) => s.totalLength > 0 && s.weight > 0);
  const n = valid.length;

  if (n === 0) {
    return {
      n: 0, meanTL: 0, sdTL: 0, minTL: 0, maxTL: 0,
      meanWeight: 0, sdWeight: 0, minWeight: 0, maxWeight: 0,
      meanK: 0, lwrParams: { a: 0, b: 0, r2: 0, n: 0 }, lengthBins: [],
    };
  }

  const lengths = valid.map((s) => s.totalLength);
  const weights = valid.map((s) => s.weight);
  const lwr = computeLWR(valid);
  const kValues = valid.map((s) => computeFultonK(s.weight, s.totalLength));

  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  return {
    n,
    meanTL: parseFloat(mean(lengths).toFixed(2)),
    sdTL: parseFloat(sd(lengths).toFixed(2)),
    minTL: parseFloat(Math.min(...lengths).toFixed(2)),
    maxTL: parseFloat(Math.max(...lengths).toFixed(2)),
    meanWeight: parseFloat(mean(weights).toFixed(2)),
    sdWeight: parseFloat(sd(weights).toFixed(2)),
    minWeight: parseFloat(Math.min(...weights).toFixed(2)),
    maxWeight: parseFloat(Math.max(...weights).toFixed(2)),
    meanK: parseFloat(mean(kValues).toFixed(4)),
    lwrParams: lwr,
    lengthBins: computeLengthFrequency(valid, binWidth),
  };
}

// ─── Mortality & Growth ──────────────────────────────────────

/**
 * Pauly (1980) Natural Mortality Estimator
 * ln(M) = −0.0152 − 0.279·ln(Linf) + 0.6543·ln(K) + 0.463·ln(T)
 * @param Linf  Asymptotic length from von Bertalanffy (cm)
 * @param K     VBGF growth coefficient (yr⁻¹)
 * @param T     Mean annual water temperature (°C)
 */
export function computePaulyMortality(Linf: number, K: number, T: number): number {
  if (Linf <= 0 || K <= 0 || T <= 0) return 0;
  return parseFloat(
    Math.exp(-0.0152 - 0.279 * Math.log(Linf) + 0.6543 * Math.log(K) + 0.463 * Math.log(T)).toFixed(4)
  );
}

/**
 * Jensen (1996) M estimator — simpler alternative: M ≈ 1.5 × K
 */
export function computeJensenMortality(K: number): number {
  return parseFloat((1.5 * K).toFixed(4));
}

/**
 * Beverton-Holt (1956) Total Mortality Z from length-frequency
 * Z = K × (Linf − L̄) / (L̄ − L')
 * @param Linf  Asymptotic length (cm)
 * @param K     VBGF growth coefficient (yr⁻¹)
 * @param Lbar  Mean length of fully-recruited fish (cm)
 * @param Lprime Cut-off length (cm) = smallest fully-recruited length
 */
export function computeBevertonHoltZ(Linf: number, K: number, Lbar: number, Lprime: number): number {
  if (Linf <= Lbar || Lbar <= Lprime) return 0;
  return parseFloat((K * (Linf - Lbar) / (Lbar - Lprime)).toFixed(4));
}

/**
 * Exploitation rate E = F/Z  (F = Z − M)
 */
export function computeExploitationRate(Z: number, M: number): { F: number; E: number } {
  const F = Math.max(0, Z - M);
  const E = Z > 0 ? parseFloat((F / Z).toFixed(4)) : 0;
  return { F: parseFloat(F.toFixed(4)), E };
}

/** Generate von Bertalanffy growth curve: L(t) = Linf × (1 − e^(−K(t−t0))) */
export function buildVBGFCurve(
  Linf: number,
  K: number,
  t0 = 0,
  maxAge = 10,
  steps = 50
): { age: number; length: number }[] {
  const result = [];
  for (let t = 0; t <= maxAge; t += maxAge / steps) {
    result.push({
      age: parseFloat(t.toFixed(2)),
      length: parseFloat((Linf * (1 - Math.exp(-K * (t - t0)))).toFixed(2)),
    });
  }
  return result;
}

// ─── Confidence Interval for b ───────────────────────────────

/**
 * Test if b is significantly different from 3.0 (isometric growth)
 * using t-test: t = (b − 3) / SE_b
 * Returns two-tailed p-value approximation for large df
 */
export function testIsometry(b: number, se_b: number, n: number): { t: number; isIsometric: boolean; verdict: string } {
  if (se_b === 0 || n < 4) return { t: 0, isIsometric: true, verdict: "Insufficient data" };
  const t = Math.abs((b - 3) / se_b);
  const df = n - 2;
  // Approximate p-value: use t > 2 as proxy for p < 0.05
  const isIsometric = t < 1.96;
  let verdict = "";
  if (isIsometric) {
    verdict = "Isometric growth (b not significantly different from 3)";
  } else if (b < 3) {
    verdict = "Significant negative allometry (b < 3, fish become relatively lighter as they grow)";
  } else {
    verdict = "Significant positive allometry (b > 3, fish become relatively heavier as they grow)";
  }
  return { t: parseFloat(t.toFixed(4)), isIsometric, verdict };
}
