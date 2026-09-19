import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: undefined,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.send", () => {
  it("accepts a valid message when no email provider is configured", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.contact.send({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would love to talk about a new interface.",
    });

    expect(result).toEqual({ success: true, mode: "queued" });
  });

  it("rejects incomplete messages", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.contact.send({
        name: "J",
        email: "not-an-email",
        message: "short",
      }),
    ).rejects.toThrow();
  });
});
