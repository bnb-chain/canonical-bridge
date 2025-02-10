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

  async createCoingeckoTokens(tokens: Prisma.LlamaTokenCreateManyInput[]) {
    return this.prismaService.llamaToken.createMany({
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

  async updateLlamaTokens(tokens: (Prisma.LlamaTokenUpdateInput & { id: string })[]) {
    return this.prismaService.$transaction(
      tokens.map((token) =>
        this.prismaService.llamaToken.update({ where: { id: token.id }, data: token }),
      ),
    );
  }

  async getTokens(start: number, limit: number, platforms: string[]) {
    return this.prismaService.token.findMany({
      skip: (start - 1) * limit,
      take: limit,
      where: {
        OR: [
          {
            slug: {
              in: platforms,
            },
          },
          {
            platformSlug: {
              in: platforms,
            },
          },
        ],
      },
    });
  }

  async getCoingeckoTokens(start: number, limit: number, chainIds: number[], platforms: string[]) {
    return this.prismaService.llamaToken.findMany({
      skip: (start - 1) * limit,
      take: limit,
      where: {
        OR: [
          {
            chainId: {
              in: chainIds,
            },
          },
          {
            platform: {
              in: platforms,
            },
          },
        ],
      },
    });
  }

  async getAllTokens() {
    return this.prismaService.token.findMany();
  }

  async getAllCoingeckoTokens() {
    return this.prismaService.llamaToken.findMany();
  }

  async getToken(platform: string, tokenAddress?: string) {
    if (platform && tokenAddress) {
      return this.prismaService.token.findFirst({
        where: {
          platformSlug: platform,
          address: tokenAddress,
        },
      });
    }

    if (platform) {
      return this.prismaService.token.findFirst({
        where: {
          slug: platform,
          platformSlug: null,
          address: null,
        },
      });
    }
  }

  async getCoingeckoToken(chainId: number, platform?: string, tokenAddress?: string) {
    if (tokenAddress && chainId) {
      return this.prismaService.llamaToken.findFirst({
        where: {
          chainId,
          address: tokenAddress,
        },
      });
    }

    if (tokenAddress && platform) {
      return this.prismaService.llamaToken.findFirst({
        where: {
          platform,
          address: tokenAddress,
        },
      });
    }

    if (chainId) {
      return this.prismaService.llamaToken.findFirst({
        where: {
          chainId,
          address: null,
        },
      });
    }
  }
}
