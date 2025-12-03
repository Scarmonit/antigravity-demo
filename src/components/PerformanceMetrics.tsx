import React, { useState, useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number | null;
  rating: 'good' | 'needs-improvement' | 'poor' | 'pending';
  unit: string;
  description: string;
}

const getMetricRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

const formatValue = (name: string, value: number): string => {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return Math.round(value).toString();
};

const getRatingColor = (rating: string): string => {
  switch (rating) {
    case 'good':
      return '#22c55e';
    case 'needs-improvement':
      return '#eab308';
    case 'poor':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const getRatingEmoji = (rating: string): string => {
  switch (rating) {
    case 'good':
      return '✓';
    case 'needs-improvement':
      return '△';
    case 'poor':
      return '✗';
    default:
      return '○';
  }
};

const PerformanceMetrics: React.FC = React.memo(() => {
  const [metrics, setMetrics] = useState<Record<string, VitalMetric>>({
    LCP: {
      name: 'LCP',
      value: null,
      rating: 'pending',
      unit: 'ms',
      description: 'Largest Contentful Paint',
    },
    INP: {
      name: 'INP',
      value: null,
      rating: 'pending',
      unit: 'ms',
      description: 'Interaction to Next Paint',
    },
    CLS: {
      name: 'CLS',
      value: null,
      rating: 'pending',
      unit: '',
      description: 'Cumulative Layout Shift',
    },
    FCP: {
      name: 'FCP',
      value: null,
      rating: 'pending',
      unit: 'ms',
      description: 'First Contentful Paint',
    },
    TTFB: {
      name: 'TTFB',
      value: null,
      rating: 'pending',
      unit: 'ms',
      description: 'Time to First Byte',
    },
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      setMetrics((prev) => ({
        ...prev,
        [metric.name]: {
          ...prev[metric.name],
          value: metric.value,
          rating: getMetricRating(metric.name, metric.value),
        },
      }));
    };

    onLCP(handleMetric);
    onINP(handleMetric);
    onCLS(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);
  }, []);

  const coreVitals = ['LCP', 'INP', 'CLS'];
  const otherVitals = ['FCP', 'TTFB'];

  return (
    <div className="card performance-metrics">
      <h2>
        <span role="img" aria-label="Performance">⚡</span> Performance Metrics
      </h2>
      <p className="performance-description">
        Real-time Core Web Vitals monitoring
      </p>

      <div className="vitals-grid">
        {coreVitals.map((key) => {
          const metric = metrics[key];
          return (
            <div
              key={key}
              className={`vital-card vital-${metric.rating}`}
              style={{ borderColor: getRatingColor(metric.rating) }}
            >
              <div className="vital-header">
                <span className="vital-name">{metric.name}</span>
                <span
                  className="vital-rating"
                  style={{ color: getRatingColor(metric.rating) }}
                >
                  {getRatingEmoji(metric.rating)}
                </span>
              </div>
              <div className="vital-value">
                {metric.value !== null
                  ? `${formatValue(metric.name, metric.value)}${metric.unit}`
                  : '—'}
              </div>
              <div className="vital-description">{metric.description}</div>
            </div>
          );
        })}
      </div>

      <button
        className="toggle-details-btn"
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
      >
        {showDetails ? 'Hide' : 'Show'} Additional Metrics
      </button>

      {showDetails && (
        <div className="additional-metrics">
          {otherVitals.map((key) => {
            const metric = metrics[key];
            return (
              <div key={key} className="additional-metric">
                <span className="metric-name">{metric.description}</span>
                <span
                  className="metric-value"
                  style={{ color: getRatingColor(metric.rating) }}
                >
                  {metric.value !== null
                    ? `${formatValue(metric.name, metric.value)}${metric.unit}`
                    : 'Pending...'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="performance-hint">
        <p>
          <span role="img" aria-label="Info">💡</span> Core Web Vitals measure real user experience
        </p>
      </div>
    </div>
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';

export default PerformanceMetrics;
