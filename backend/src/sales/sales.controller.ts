import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SalesService } from './sales.service';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'Bugungi barcha sotuvlar' })
  getAll() {
    return this.salesService.getAll();
  }

  @Get('products')
  @ApiOperation({ summary: 'Mavjud mahsulotlar va narxlar' })
  getProducts() {
    return this.salesService.getProducts();
  }

  @Post()
  @ApiOperation({ summary: 'Yangi sotuv yaratish' })
  createSale(@Body() body: any) {
    return this.salesService.createSale(body);
  }

  @Get('report')
  @ApiOperation({ summary: 'Kassa hisoboti' })
  getCashReport() {
    return this.salesService.getCashReport();
  }
}
