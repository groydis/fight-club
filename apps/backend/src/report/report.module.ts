// src/report/report.module.ts

import { Module } from '@nestjs/common';
import { CreateReportService } from './services/create-report.service';
import { ReportController } from './report.controller';
import { PrismaModule } from '../services/prisma/prisma.module';
import { SupabaseModule } from '..//services/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [ReportController],
  providers: [CreateReportService],
})
export class ReportModule {}
