import { Injectable } from '@nestjs/common';
import { Histogram, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestDuration: Histogram<string>;
  constructor() {
    collectDefaultMetrics();

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
    });
  }

  getHttpRequestDurationMetric() {
    return this.httpRequestDuration;
  }

  startDbTimer(method: string, route: string, status_code: number) {
    return this.httpRequestDuration.startTimer({ method, route, status_code });
  }
}
