import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './entity/report.entity';
import { ReportRepository } from './repository/report.repository';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
  imports: [TypeOrmModule.forFeature([ReportEntity])],
  exports: [ReportService],
})
export class ReportModule {}
