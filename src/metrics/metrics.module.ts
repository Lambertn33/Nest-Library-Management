import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsMiddleware } from './metrics.middleware';
import { MetricsController } from './metrics.controller';

@Module({
  providers: [MetricsService],
  exports: [MetricsService],
  controllers: [MetricsController],
})
export class MetricsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
