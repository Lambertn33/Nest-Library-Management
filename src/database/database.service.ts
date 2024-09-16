import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly metricsService: MetricsService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
