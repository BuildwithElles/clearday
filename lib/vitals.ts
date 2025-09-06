export interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface PerformanceMetrics {
  lcp?: WebVitalsMetric;
  fid?: WebVitalsMetric;
  cls?: WebVitalsMetric;
  fcp?: WebVitalsMetric;
  ttfb?: WebVitalsMetric;
}

class VitalsTracker {
  private metrics: PerformanceMetrics = {};
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];
  private initialized = false;

  constructor() {
    // Initialize on client-side only
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    if (this.initialized) return;
    this.initialized = true;

    // Use PerformanceObserver for modern browsers
    if (typeof PerformanceObserver !== 'undefined') {
      this.setupPerformanceObservers();
    }

    // Fallback for basic metrics
    this.trackBasicMetrics();
  }

  private setupPerformanceObservers() {
    try {
      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        if (lastEntry) {
          const metric = {
            name: 'LCP',
            value: lastEntry.startTime,
            delta: 0,
            id: 'v3-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            rating: this.getRating('LCP', lastEntry.startTime)
          };

          this.metrics.lcp = metric;
          this.notifyObservers();
          this.logMetric(metric);
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const metric = {
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            delta: 0,
            id: 'v3-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            rating: this.getRating('FID', entry.processingStart - entry.startTime)
          };

          this.metrics.fid = metric;
          this.notifyObservers();
          this.logMetric(metric);
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        const metric = {
          name: 'CLS',
          value: clsValue,
          delta: 0,
          id: 'v3-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          rating: this.getRating('CLS', clsValue)
        };

        this.metrics.cls = metric;
        this.notifyObservers();
        this.logMetric(metric);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('PerformanceObserver setup failed:', error);
      this.trackBasicMetrics();
    }
  }

  private trackBasicMetrics() {
    // Fallback metrics using basic Performance API
    if (typeof performance !== 'undefined' && performance.timing) {
      const timing = performance.timing;

      // Basic TTFB estimate
      if (timing.responseStart && timing.requestStart) {
        const ttfb = timing.responseStart - timing.requestStart;
        const metric = {
          name: 'TTFB',
          value: ttfb,
          delta: 0,
          id: 'fallback-' + Date.now(),
          rating: this.getRating('TTFB', ttfb)
        };

        this.metrics.ttfb = metric;
        this.logMetric(metric);
      }
    }
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (metricName) {
      case 'LCP':
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';

      case 'FID':
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';

      case 'CLS':
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';

      case 'FCP':
        if (value <= 1800) return 'good';
        if (value <= 3000) return 'needs-improvement';
        return 'poor';

      case 'TTFB':
        if (value <= 800) return 'good';
        if (value <= 1800) return 'needs-improvement';
        return 'poor';

      default:
        return 'good';
    }
  }

  private logMetric(metric: WebVitalsMetric) {
    const ratingEmoji = {
      good: '✅',
      'needs-improvement': '⚠️',
      poor: '❌'
    };

    console.log(
      `${ratingEmoji[metric.rating]} Web Vitals - ${metric.name}: ${metric.value.toFixed(2)}ms`,
      {
        rating: metric.rating,
        value: metric.value,
        delta: metric.delta,
        id: metric.id
      }
    );

    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name.toLowerCase(), {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        custom_map: { metric_rating: metric.rating }
      });
    }
  }

  private notifyObservers() {
    this.observers.forEach(observer => observer(this.metrics));
  }

  // Public API
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getMetric(name: keyof PerformanceMetrics): WebVitalsMetric | undefined {
    return this.metrics[name];
  }

  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void) {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  // Performance targets validation
  validateTargets(): {
    lcp: boolean;
    fid: boolean;
    cls: boolean;
    allPassed: boolean;
  } {
    const lcp = this.metrics.lcp?.rating === 'good' || this.metrics.lcp?.rating === 'needs-improvement';
    const fid = this.metrics.fid?.rating === 'good';
    const cls = this.metrics.cls?.rating === 'good';

    return {
      lcp,
      fid,
      cls,
      allPassed: lcp && fid && cls
    };
  }

  // Export metrics for external analysis
  exportMetrics() {
    return {
      timestamp: Date.now(),
      metrics: this.metrics,
      targets: this.validateTargets(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    };
  }
}

// Singleton instance
export const vitalsTracker = new VitalsTracker();

// React hook for using vitals
export function useVitals() {
  return {
    getMetrics: () => vitalsTracker.getMetrics(),
    getMetric: (name: keyof PerformanceMetrics) => vitalsTracker.getMetric(name),
    onMetricsUpdate: (callback: (metrics: PerformanceMetrics) => void) =>
      vitalsTracker.onMetricsUpdate(callback),
    validateTargets: () => vitalsTracker.validateTargets(),
    exportMetrics: () => vitalsTracker.exportMetrics()
  };
}

// Simplified performance utilities
export const performanceUtils = {
  // Create performance marks
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      try {
        performance.mark(name);
      } catch (error) {
        console.warn('Performance mark failed:', error);
      }
    }
  }
};

// Initialize vitals tracking when module loads (client-side only)
if (typeof window !== 'undefined') {
  // Ensure vitals are tracked after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Vitals are already initialized in the constructor
    });
  }
}
