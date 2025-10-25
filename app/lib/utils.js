/**
 * Rounds a decimal float to the nearest decimal point places
 * 
 * @param {float} num - number to round 
 * @param {int} places - number of places to round to 
 * @returns 
 */
export function roundToDecimal(num, places) {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
}

/**
 * Maps a raw score to 0-100 using sigmoid-like curve
 * 
 * @param {int} value - Raw value to normalize
 * @param {int} min - Value that maps to ~10th percentile (score: 10)
 * @param {int} median - Value that maps to 50th percentile (score: 50)
 * @param {int} max - Value that maps to ~90th percentile (score: 90)
 * @returns Score from 0-100
 */
export function normalizeToPercentile(value, min, median, max) {
  if (value <= min) return Math.max(0, (value / min) * 10);
  
  if (value <= median) {
    const ratio = (value - min) / (median - min);
    return 10 + (ratio * 40);
  }
  
  if (value <= max) {
    const ratio = (value - median) / (max - median);
    return 50 + (ratio * 40);
  }
  
  const excessRatio = (value - max) / max;
  return Math.min(100, 90 + (excessRatio * 10));
}