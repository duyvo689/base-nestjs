import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { StaffService } from 'src/resources/staff/staff.service';
import * as argon from 'argon2';
import { createCustomId } from 'src/utils/custom-id';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  async signIn(phone: string, pass: string): Promise<{ accessToken: string }> {
    const staff = await this.prismaService.staffs.findFirst({
      where: {
        OR: [{ phone: phone }, { phone2: phone }],
      },
    });

    if(!staff) {
      throw new NotFoundException(`Không tìm thấy tài khoản ${phone}`)
    }

    const passwordMatched = await argon.verify(
      staff.hashedPassword,
      pass,
    );

    if (!passwordMatched) {
      throw new ForbiddenException('incorrect password');
    }
    const payload = {
      sub: staff.id,
      name: staff.name,
      phone: staff?.phone,
      phone2: staff?.phone2,
      customerId: staff?.customId
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    phone: string,
    pass: string,
    name: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.prismaService.staffs.findFirst({
      where: {
        OR: [{ phone: phone }, { phone2: phone }],
      },
    });

    if (user) {
      throw new ConflictException(`Tài khoản ${phone} đã tồn tại.`);
    }

    const hashedPassword = await argon.hash(pass);
    const newUser: any = await this.prismaService.staffs.create({
      data: {
        name: name,
        phone: phone,
        hashedPassword: hashedPassword,
      },
    });

    const payload = {
      sub: newUser.id,
      name: newUser.name,
      phone: newUser?.phone,
      phone2: newUser?.phone2,
      customerId: newUser?.customId
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
