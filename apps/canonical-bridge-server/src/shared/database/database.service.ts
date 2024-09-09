import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DatabaseService {
  private logger = new Logger(DatabaseService.name);

  constructor(private prismaService: PrismaService) {}

  async createTokens(tokens: Prisma.TokenCreateManyInput[]) {
    return this.prismaService.token.createMany({
      data: tokens,
      skipDuplicates: true,
    });
  }

  async updateTokens(tokens: (Prisma.TokenUpdateInput & { id: number })[]) {
    return this.prismaService.$transaction(
      tokens.map((token) =>
        this.prismaService.token.update({ where: { id: token.id }, data: token }),
      ),
    );
  }

  async getTokens(limit: number) {
    return this.prismaService.token.findMany({
      take: limit,
      orderBy: { updateAt: 'asc' },
    });
  }

  async getAllTokens() {
    return this.prismaService.token.findMany();
  }
}
