import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsMiddleware } from './metrics.middleware';
import { MetricsController } from './metrics.controller';
import { MetricsHelper } from './metrics.helpers';

@Module({
  providers: [MetricsService, MetricsHelper],
  exports: [MetricsService, MetricsHelper],
  controllers: [MetricsController],
})
export class MetricsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
