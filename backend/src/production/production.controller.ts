import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductionService } from './production.service';

@ApiTags('production')
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha ishlab chiqarish yozuvlari' })
  getAll() {
    return this.productionService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Yangi ishlab chiqarish akti qo\'shish' })
  addProduction(@Body() body: any) {
    return this.productionService.addProduction(body);
  }

  @Get('materials')
  @ApiOperation({ summary: 'Xomashyo ombori holati' })
  getMaterials() {
    return this.productionService.getRawMaterials();
  }

  @Post('materials')
  @ApiOperation({ summary: 'Xomashyo kirim qilish' })
  addMaterial(@Body() body: any) {
    return this.productionService.addRawMaterial(body);
  }

  @Get('recipes')
  @ApiOperation({ summary: 'Texnologik xaritalar (retseptlar)' })
  getRecipes() {
    return this.productionService.getRecipes();
  }

  @Get('defects')
  @ApiOperation({ summary: 'Brak (yaroqsiz) mahsulotlar' })
  getDefects() {
    return this.productionService.getDefects();
  }
}
