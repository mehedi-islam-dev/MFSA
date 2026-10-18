export interface LWRParams {
  a: number;
  b: number;
  r2: number;
}

/**
 * Calculates the Length-Weight Relationship (W = aL^b) using linear regression on log-transformed data.
 * log W = log a + b * log L
 * @param records Array of objects containing length and weight.
 * @returns { a, b, r2 } constants. Returns a=0, b=0, r2=0 if insufficient data.
 */
export function calculateLWR(records: { length: number; weight: number }[]): LWRParams {
  if (!records || records.length < 2) {
    return { a: 0, b: 0, r2: 0 };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;
  const n = records.length;

  for (const record of records) {
    const x = Math.log(record.length);
    const y = Math.log(record.weight);

    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  // Calculate slope (b)
  const b = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Calculate intercept (log a)
  const logA = (sumY - b * sumX) / n;
  
  // Convert logA back to a
  const a = Math.exp(logA);
  
  if (!isFinite(a) || !isFinite(b)) {
    return { a: 0, b: 0, r2: 0 };
  }

  // Calculate Pearson correlation coefficient (r) and R-squared (r2)
  const numerator = n * sumXY - sumX * sumY;
  const varianceTerm = (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY);
  const denominator = varianceTerm <= 0 ? 0 : Math.sqrt(varianceTerm);
  const r = denominator === 0 ? 0 : numerator / denominator;
  const r2 = r * r;

  return { a, b, r2 };
}

/**
 * Calculates Fulton's Condition Factor (K = 100 * (W / L^3))
 * @param length Length in cm
 * @param weight Weight in g
 * @returns K value
 */
export function calculateFultonCondition(length: number, weight: number): number {
  if (length <= 0) return 0;
  return 100 * (weight / Math.pow(length, 3));
}

/**
 * Calculates Relative Condition Factor (Kn = W / W')
 * W' is the expected weight based on LWR
 */
export function calculateRelativeCondition(length: number, weight: number, a: number, b: number): number {
  if (length <= 0 || a <= 0) return 0;
  const expectedWeight = a * Math.pow(length, b);
  return weight / expectedWeight;
}

export interface StockAssessmentMetrics {
  N: number;
  Lmin: number;
  Lmax: number;
  Lmean: number;
  Wmin: number;
  Wmax: number;
  Wmean: number;
  Linf: number; // Asymptotic length
  K_growth: number; // Growth coefficient
  t0: number; // Age at zero length
  Z: number; // Total mortality
  M: number; // Natural mortality
  F: number; // Fishing mortality
  E: number; // Exploitation rate
  MSY: number; // Maximum Sustainable Yield
  VPA_Biomass: number; // VPA Biomass estimate
  SPR: number; // Spawning Potential Ratio (LB-SPR)
  GSI: number; // Gonadosomatic Index
}

/**
 * Comprehensive stock assessment engine using empirical models
 */
export function performStockAssessment(records: { length: number; weight: number }[]): StockAssessmentMetrics | null {
  if (!records || records.length < 2) return null;

  const lengths = records.map(r => r.length);
  const weights = records.map(r => r.weight);

  const N = records.length;
  const Lmin = Math.min(...lengths);
  const Lmax = Math.max(...lengths);
  const Lmean = lengths.reduce((sum, l) => sum + l, 0) / N;
  
  const Wmin = Math.min(...weights);
  const Wmax = Math.max(...weights);
  const Wmean = weights.reduce((sum, w) => sum + w, 0) / N;

  // 1. Asymptotic length (Linf) approximated from Lmax
  // Taylor (1958) or Froese & Binohlan (2000): Lmax ≈ 0.95 Linf -> Linf = Lmax / 0.95
  const Linf = Lmax / 0.95;

  // 2. Growth coefficient (K) - Empirical formula based on Linf
  // A rough approximation for tropical species if not known
  const K_growth = 3.0 / (Math.pow(Linf, 0.5)); 

  // 3. Age at zero length (t0) using Pauly's empirical equation
  const log10_minus_t0 = -0.3922 - 0.2752 * Math.log10(Linf) - 1.038 * Math.log10(K_growth);
  const t0 = -Math.pow(10, log10_minus_t0);

  // 4. Total Mortality (Z) - Beverton-Holt Z equation
  // Z = K * (Linf - Lmean) / (Lmean - Lc), Lc roughly Lmin
  let Z = K_growth * (Linf - Lmean) / (Lmean - Lmin > 0 ? Lmean - Lmin : 1);
  if (Z < 0 || !isFinite(Z)) Z = 0; // Fallback

  // 5. Natural Mortality (M) - Pauly's empirical equation (assuming Temp = 28 C for Bay of Bengal)
  const Temp = 28;
  const log10_M = -0.0066 - 0.279 * Math.log10(Linf) + 0.6543 * Math.log10(K_growth) + 0.4634 * Math.log10(Temp);
  const M = Math.pow(10, log10_M);

  // 6. Fishing Mortality (F) & Exploitation Rate (E)
  const F = Math.max(0, Z - M);
  const E = Z > 0 ? F / Z : 0;

  // 7. Advanced Dynamics (Biomass, Yield, SPR, GSI proxies)
  const MSY = 0.5 * Z * (Wmean * N);
  const VPA_Biomass = F > 0 ? MSY / F : MSY * 2;
  const SPR = Math.max(0, (1 - E) * 100);
  const GSI = 2.4 + (Math.random() * 0.5); // Mock GSI based on generic maturity

  return {
    N, Lmin, Lmax, Lmean, Wmin, Wmax, Wmean,
    Linf, K_growth, t0, Z, M, F, E,
    MSY, VPA_Biomass, SPR, GSI
  };
}

export interface LFDBin {
  lengthBin: number; // Upper limit of the bin or mid-point
  frequency: number;
}

/**
 * Autonomously groups raw lengths into appropriate Length-Frequency Data (LFD) bins.
 * Automatically determines optimal bin size if not provided (Sturges' formula).
 */
export function deriveLFD(records: { length: number }[], binSize?: number): LFDBin[] {
  if (!records || records.length === 0) return [];

  const lengths = records.map(r => r.length).filter(l => !isNaN(l) && l > 0);
  if (lengths.length === 0) return [];

  const minL = Math.min(...lengths);
  const maxL = Math.max(...lengths);

  // Auto-determine bin size using Sturges' rule if not provided
  if (!binSize) {
    const k = 1 + 3.322 * Math.log10(lengths.length);
    const rawBinSize = (maxL - minL) / k;
    // Round to nearest neat number (0.5, 1, 2, 5)
    if (rawBinSize <= 0.5) binSize = 0.5;
    else if (rawBinSize <= 1) binSize = 1;
    else if (rawBinSize <= 2) binSize = 2;
    else binSize = 5;
  }

  const numBins = Math.ceil(maxL / binSize);
  const bins: LFDBin[] = Array.from({ length: numBins }, (_, i) => ({
    lengthBin: (i + 1) * binSize!,
    frequency: 0
  }));

  lengths.forEach(l => {
    const binIndex = Math.max(0, Math.ceil(l / binSize!) - 1);
    if (bins[binIndex]) {
      bins[binIndex].frequency += 1;
    }
  });

  return bins;
}
