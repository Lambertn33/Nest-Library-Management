import { Injectable } from '@nestjs/common';
import { Histogram, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestDuration: Histogram<string>;
  private readonly dbRequestDuration: Histogram<string>;
  constructor() {
    collectDefaultMetrics();

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.dbRequestDuration = new Histogram({
      help: 'Duration of database requests in seconds',
      name: 'db_request_duration_seconds',
      labelNames: ['operation'],
    });
  }

  getHttpRequestDurationMetric() {
    return this.httpRequestDuration;
  }

  getDbRequestDurationMetric() {
    return this.dbRequestDuration;
  }

  startDbTimer(operation: string) {
    return this.dbRequestDuration.startTimer({ operation });
  }
}
