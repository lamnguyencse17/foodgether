import { createOrderSchema } from "../schemas/order";
import { auditOrder } from "../service/audit";
import { protectedProcedure } from "../trpc/trpc";
import { createOrder as createDbOrder } from "../db/order";

export const createOrder = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ ctx, input }) => {
    await auditOrder(input);
    return createDbOrder(input, ctx.session.user.id);
  });
