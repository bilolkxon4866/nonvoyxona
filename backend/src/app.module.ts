import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductionModule } from './production/production.module';
import { SalesModule } from './sales/sales.module';
import { PointsModule } from './points/points.module';
import { FinanceModule } from './finance/finance.module';
import { HrModule } from './hr/hr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        
        return {
          type: 'postgres',
          url: 'postgresql://neondb_owner:npg_wIs23oxDJkBd@ep-mute-dawn-anztr4jz.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require',
          autoLoadEntities: true,
          synchronize: true,
          
          ssl: configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
          
          extra: {
            authMechanism: 'SCRAM-SHA-256',
          },
        };
      },
    }),

    DashboardModule,
    ProductionModule,
    SalesModule,
    PointsModule,
    FinanceModule,
    HrModule,
  ],
})
export class AppModule {}