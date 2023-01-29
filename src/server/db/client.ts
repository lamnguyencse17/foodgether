import { Prisma, PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import { RedisMemoryOptions } from "prisma-redis-middleware/dist/types.js";

import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// const redis = new Redis(env.REDIS_URL);

// const cacheMiddleware = createPrismaRedisCache({
//   storage: {
//     type: "redis",
//     options: {
//       client: redis,
//       invalidation: { referencesTTL: 300 },
//     } as unknown as RedisMemoryOptions,
//   },
//   excludeModels: ["Session"],
//   cacheTime: 300,
//   onError: (key) => {
//     console.log("error", key);
//   },
// });

// prisma.$use(cacheMiddleware);
