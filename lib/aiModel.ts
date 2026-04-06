/**
 * Simple Linear Regression Model for AI Predictive Load Analysis
 * Formulas used: 
 * slope (m) = (nΣxy - ΣxΣy) / (nΣx^2 - (Σx)^2)
 * intercept (b) = (Σy - mΣx) / n
 */

export type DataPoint = {
  time: number; // x: independent variable (seconds from start)
  load: number; // y: dependent variable (CPU load %)
}

export class AIPredictiveModel {
  private history: DataPoint[] = [];
  private maxHistory: number = 30; // Last 30 snapshots

  /**
   * Add a new observation to the model's memory
   */
  addDataPoint(load: number) {
    const now = Date.now() / 1000;
    this.history.push({ time: now, load });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Use Linear Regression to predict load in the next N seconds
   * Returns: { predictedLoad, confidenceScore }
   */
  predictFutureLoad(secondsInFuture: number = 600): { predictedLoad: number, confidence: number } {
    if (this.history.length < 5) {
      return { predictedLoad: 35.0, confidence: 50.0 }; // Not enough data yet
    }

    const n = this.history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    // Normalize X to start from 0 for numerical stability
    const firstTime = this.history[0].time;

    for (const point of this.history) {
      const x = point.time - firstTime;
      const y = point.load;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const denominator = (n * sumX2 - sumX * sumX);
    if (denominator === 0) return { predictedLoad: this.history[n-1].load, confidence: 70 };

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // Forecast: Target Time X is (current time - first time + future offset)
    const currentTime = Date.now() / 1000;
    const targetX = currentTime - firstTime + secondsInFuture;
    const prediction = Math.max(5, Math.min(100, slope * targetX + intercept));

    // Calculate Variance (simple confidence metric)
    const confidence = this.calculateConfidence(slope);

    return { 
      predictedLoad: prediction,
      confidence: confidence
    };
  }

  private calculateConfidence(slope: number): number {
    // High slope (extreme change) reduces confidence, stability increases it
    const baseConfidence = 95.0;
    const volatility = Math.abs(slope) * 10;
    return Math.max(75, Math.min(99, baseConfidence - volatility));
  }
}
