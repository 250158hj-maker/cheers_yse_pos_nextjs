import { PrismaClient } from '@prisma/client';

// Next.js の HMR で開発時に PrismaClient が複数インスタンス化されるのを防ぐため、
// globalThis にキャッシュする（Prisma 公式推奨パターン）
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
