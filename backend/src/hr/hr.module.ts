import { Module } from '@nestjs/common';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';

let employees = [
  { id: 1, name: 'Karimov Abdulloh', role: 'Nonvoy', phone: '+998901111111', salary: 1500000, type: 'sdelniy', onShift: true },
  { id: 2, name: 'Rahimov Bahodir', role: 'Nonvoy', phone: '+998902222222', salary: 1500000, type: 'sdelniy', onShift: true },
  { id: 3, name: 'Nazarova Malika', role: 'Sotuvchi', phone: '+998903333333', salary: 1200000, type: 'fixed', onShift: true },
  { id: 4, name: 'Qodirov Sanjar', role: 'Sotuvchi', phone: '+998904444444', salary: 1200000, type: 'fixed', onShift: false },
  { id: 5, name: 'Hamidova Nodira', role: 'Sotuvchi', phone: '+998905555555', salary: 1200000, type: 'fixed', onShift: true },
  { id: 6, name: 'Toshmatov Comiljon', role: 'Nonvoy', phone: '+998906666666', salary: 1500000, type: 'sdelniy', onShift: false },
  { id: 7, name: 'Xasanov Ulug\'bek', role: 'Haydovchi', phone: '+998907777777', salary: 1000000, type: 'fixed', onShift: true },
  { id: 8, name: 'Yusupova Gulnora', role: 'Hisobchi', phone: '+998908888888', salary: 1800000, type: 'fixed', onShift: true },
];

let attendance = [
  { id: 1, employeeId: 1, date: '2025-05-06', checkIn: '08:00', checkOut: null, status: 'present' },
  { id: 2, employeeId: 2, date: '2025-05-06', checkIn: '07:55', checkOut: null, status: 'present' },
  { id: 3, employeeId: 3, date: '2025-05-06', checkIn: '09:00', checkOut: null, status: 'present' },
  { id: 4, employeeId: 4, date: '2025-05-06', checkIn: null, checkOut: null, status: 'off' },
];

let advances = [
  { id: 1, employeeId: 1, amount: 300000, date: '2025-05-03', note: 'Shaxsiy ehtiyoj' },
  { id: 2, employeeId: 3, amount: 200000, date: '2025-05-02', note: 'Tibbiy xarajat' },
];

@Injectable()
class HrService {
  getEmployees() {
    return employees.map(e => ({
      ...e,
      advances: advances.filter(a => a.employeeId === e.id).reduce((sum, a) => sum + a.amount, 0),
    }));
  }

  addEmployee(data: any) {
    const employee = { id: employees.length + 1, ...data, onShift: false };
    employees.push(employee);
    return employee;
  }

  getAttendance() {
    return attendance.map(a => ({
      ...a,
      employee: employees.find(e => e.id === a.employeeId)?.name,
    }));
  }

  checkIn(employeeId: number) {
    const record = {
      id: attendance.length + 1,
      employeeId,
      date: new Date().toISOString().split('T')[0],
      checkIn: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      checkOut: null,
      status: 'present',
    };
    attendance.push(record);
    const emp = employees.find(e => e.id === employeeId);
    if (emp) emp.onShift = true;
    return record;
  }

  checkOut(employeeId: number) {
    const record = attendance.find(a => a.employeeId === employeeId && !a.checkOut);
    if (record) {
      record.checkOut = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const emp = employees.find(e => e.id === employeeId);
      if (emp) emp.onShift = false;
    }
    return record;
  }

  giveAdvance(data: any) {
    const advance = { id: advances.length + 1, ...data, date: new Date().toISOString().split('T')[0] };
    advances.push(advance);
    return advance;
  }

  getSalaryReport() {
    return employees.map(e => {
      const employeeAdvances = advances.filter(a => a.employeeId === e.id).reduce((sum, a) => sum + a.amount, 0);
      return {
        id: e.id,
        name: e.name,
        role: e.role,
        grossSalary: e.salary,
        advances: employeeAdvances,
        netSalary: e.salary - employeeAdvances,
      };
    });
  }
}

@ApiTags('hr')
@Controller('hr')
class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('employees')
  @ApiOperation({ summary: 'Barcha xodimlar' })
  getEmployees() { return this.hrService.getEmployees(); }

  @Post('employees')
  @ApiOperation({ summary: 'Yangi xodim qo\'shish' })
  addEmployee(@Body() body: any) { return this.hrService.addEmployee(body); }

  @Get('attendance')
  @ApiOperation({ summary: 'Davomat hisoboti' })
  getAttendance() { return this.hrService.getAttendance(); }

  @Post('check-in/:id')
  @ApiOperation({ summary: 'Ishga kelish belgisi' })
  checkIn(@Param('id') id: string) { return this.hrService.checkIn(+id); }

  @Post('check-out/:id')
  @ApiOperation({ summary: 'Ishdan ketish belgisi' })
  checkOut(@Param('id') id: string) { return this.hrService.checkOut(+id); }

  @Post('advance')
  @ApiOperation({ summary: 'Avans berish' })
  giveAdvance(@Body() body: any) { return this.hrService.giveAdvance(body); }

  @Get('salary-report')
  @ApiOperation({ summary: 'Ish haqi hisoboti' })
  getSalaryReport() { return this.hrService.getSalaryReport(); }
}

@Module({
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
