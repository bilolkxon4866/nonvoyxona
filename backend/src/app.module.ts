import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductionModule } from './production/production.module';
import { SalesModule } from './sales/sales.module';
import { PointsModule } from './points/points.module';
import { FinanceModule } from './finance/finance.module';
import { HrModule } from './hr/hr.module';

@Module({
  imports: [
    DashboardModule,
    ProductionModule,
    SalesModule,
    PointsModule,
    FinanceModule,
    HrModule,
  ],
})
export class AppModule {}
