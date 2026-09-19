import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(10).max(4000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  contact: router({
    send: publicProcedure.input(contactSchema).mutation(async ({ input }) => {
      const destination = process.env.CONTACT_TO_EMAIL || process.env.OWNER_EMAIL;
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && destination) {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
            to: [destination],
            reply_to: input.email,
            subject: `Portfolio note from ${input.name}`,
            text: `${input.name} (${input.email}) wrote:\n\n${input.message}`,
          }),
        });
        if (!response.ok) throw new Error("Email delivery failed");
        return { success: true, mode: "email" as const };
      }
      console.info(`[Contact] ${input.name} <${input.email}>: ${input.message}`);
      return { success: true, mode: "queued" as const };
    }),
  }),
});

export type AppRouter = typeof appRouter;
