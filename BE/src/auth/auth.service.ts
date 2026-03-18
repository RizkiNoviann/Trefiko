import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password and confirm password must match');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await hash(dto.password, 10);

    const username = await this.generateUniqueUsername(dto.email);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        username,
        role: 'USER',
      },
    });

    const token = this.signToken(user);

    return {
      message: 'Register success',
      token,
      user: this.safeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { username: dto.identifier },
          { name: dto.identifier },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(user);

    return {
      message: 'Login success',
      token,
      user: this.safeUser(user),
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      message: 'Profile fetched',
      user: this.safeUser(user),
    };
  }

  private signToken(user: { id: string; email: string; name: string; role: 'ADMIN' | 'USER' }): string {
    const secret = process.env.JWT_SECRET ?? 'trefiko_dev_secret';

    return sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      secret,
      {
        expiresIn: '1d',
      },
    );
  }

  private safeUser(user: {
    id: string;
    name: string;
    email: string;
    username: string | null;
    role: 'ADMIN' | 'USER';
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async generateUniqueUsername(email: string): Promise<string> {
    const baseUsername = email.split('@')[0].toLowerCase();
    let username = baseUsername;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!existing) {
        return username;
      }

      username = `${baseUsername}${counter}`;
      counter += 1;
    }
  }
}
