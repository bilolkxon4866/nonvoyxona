import { Module } from '@nestjs/common';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';

let points = [
  { id: 1, name: 'Tochka №1', address: 'Chilonzor, 7-kvartal', seller: 'Nazarova M.', stock: 85, status: 'active' },
  { id: 2, name: 'Tochka №2', address: 'Mirzo Ulug\'bek, Bozor', seller: 'Qodirov S.', stock: 120, status: 'active' },
  { id: 3, name: 'Tochka №3', address: 'Yunusobod, 11-mavze', seller: 'Hamidova N.', stock: 45, status: 'active' },
  { id: 4, name: 'Tochka №4', address: 'Shayxontohur, Do\'kon', seller: 'Ergashev T.', stock: 0, status: 'inactive' },
];

let transfers = [
  { id: 1, pointId: 1, pointName: 'Tochka №1', quantity: 100, product: 'Patir non', status: 'delivered', date: '2025-05-06', driver: 'Xasanov U.' },
  { id: 2, pointId: 2, pointName: 'Tochka №2', quantity: 150, product: 'Obi non', status: 'in-transit', date: '2025-05-06', driver: 'Tursunov B.' },
  { id: 3, pointId: 3, pointName: 'Tochka №3', quantity: 80, product: 'Patir non', status: 'pending', date: '2025-05-06', driver: 'Xasanov U.' },
];

@Injectable()
class PointsService {
  getAll() {
    return points;
  }

  getTransfers() {
    return transfers;
  }

  sendTransfer(data: any) {
    const point = points.find(p => p.id === data.pointId);
    const transfer = {
      id: transfers.length + 1,
      pointId: data.pointId,
      pointName: point?.name || 'Noma\'lum',
      quantity: data.quantity,
      product: data.product,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      driver: data.driver,
    };
    transfers.push(transfer);
    return transfer;
  }

  confirmDelivery(transferId: number) {
    const transfer = transfers.find(t => t.id === transferId);
    if (transfer) {
      transfer.status = 'delivered';
      const point = points.find(p => p.id === transfer.pointId);
      if (point) point.stock += transfer.quantity;
    }
    return transfer;
  }

  getPlanFact() {
    return points.map(p => {
      const pointTransfers = transfers.filter(t => t.pointId === p.id && t.status === 'delivered');
      const sent = pointTransfers.reduce((sum, t) => sum + t.quantity, 0);
      const sold = Math.floor(sent * 0.88);
      const returned = Math.floor(sent * 0.05);
      const remaining = sent - sold - returned;
      const deficit = sent - sold - returned - remaining;
      return { point: p.name, sent, sold, returned, remaining, deficit, balanced: deficit === 0 };
    });
  }
}

@ApiTags('points')
@Controller('points')
class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha savdo nuqtalari' })
  getAll() { return this.pointsService.getAll(); }

  @Get('transfers')
  @ApiOperation({ summary: 'Yuk xatlari (transferlar)' })
  getTransfers() { return this.pointsService.getTransfers(); }

  @Post('transfer')
  @ApiOperation({ summary: 'Mahsulot yuborish' })
  sendTransfer(@Body() body: any) { return this.pointsService.sendTransfer(body); }

  @Post('confirm/:id')
  @ApiOperation({ summary: 'Qabul qilishni tasdiqlash' })
  confirm(@Param('id') id: string) { return this.pointsService.confirmDelivery(+id); }

  @Get('plan-fact')
  @ApiOperation({ summary: 'Plan-fakt tahlili' })
  getPlanFact() { return this.pointsService.getPlanFact(); }
}

@Module({
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
