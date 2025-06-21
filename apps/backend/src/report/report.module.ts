// src/report/report.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateReportService } from './services/create-report.service';
import { ReportController } from './report.controller';

@Module({
  controllers: [ReportController],
  providers: [CreateReportService, PrismaService],
})
export class ReportModule {}
