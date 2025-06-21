import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CreateCharacterReportDto } from './dto/create-character-report.dto';
import { CreateReportService } from './services/create-report.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('api/report')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly createReportService: CreateReportService) {}

  @Post()
  create(@Body() dto: CreateCharacterReportDto, @Req() req: Request) {
    const userId = req.user?.local?.id;
    if (!userId) {
      throw new BadRequestException('Missing user information');
    }
    return this.createReportService.execute(dto, userId);
  }
}
