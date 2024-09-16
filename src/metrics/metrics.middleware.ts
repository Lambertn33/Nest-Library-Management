import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Histogram } from 'prom-client';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly httpRequestDuration: Histogram<string>;

  constructor(private metricsService: MetricsService) {
    this.httpRequestDuration = this.metricsService.getDbRequestDurationMetric();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const end = this.httpRequestDuration.startTimer();
    res.on('finish', () => {
      end({
        method: req.method,
        route: req.route ? req.route.path : 'unknown',
        status_code: res.statusCode,
      });
    });
    next();
  }
}
