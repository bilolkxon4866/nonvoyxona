import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Asosiy dashboard statistikasi' })
  getStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('production')
  @ApiOperation({ summary: 'Ishlab chiqarish ma\'lumotlari' })
  getProduction() {
    return this.dashboardService.getProductionStats();
  }
}
