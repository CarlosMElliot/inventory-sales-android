import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { z, ZodError } from "zod";
import type { Profile, Dashboard } from "../src/domain";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export type CreateInput = {
  operation_id: string;
  business_name: string;
  display_name: string;
  email: string;
};
export interface Store {
  authenticate(token: string): Promise<Profile>;
  dashboard(): Promise<Dashboard>;
  create(actor: Profile, input: CreateInput): Promise<unknown>;
  change(
    actor: Profile,
    id: string,
    enabled: boolean | null,
    reason: string,
    revoke: boolean,
  ): Promise<void>;
  setup(actor: Profile, id: string): Promise<void>;
}
const creation = z
  .object({
    operation_id: z.uuid(),
    business_name: z.string().trim().min(2).max(120),
    display_name: z.string().trim().min(2).max(100),
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase()),
  })
  .strict();
export function makeApp(store: Store | null, origin: string) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "16kb" }));
  app.use(
    "/api",
    rateLimit({
      windowMs: 60000,
      limit: 100,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );
  app.get("/api/health", (_q, r) => r.json({ ready: !!store }));
  app.use("/api", async (q, r, next) => {
    try {
      if (!store)
        throw new HttpError(503, "Server authentication is not configured.");
      if (q.method !== "GET" && q.headers.origin && q.headers.origin !== origin)
        throw new HttpError(403, "Request origin not allowed.");
      const m = /^Bearer ([^\s]+)$/.exec(q.headers.authorization || "");
      if (!m) throw new HttpError(401, "Please sign in.");
      r.locals.actor = await store.authenticate(m[1]);
      next();
    } catch (e) {
      next(e);
    }
  });
  app.get("/api/me", (_q, r) => r.json(r.locals.actor));
  app.use("/api/admin", (_q, r, next) => {
    if (r.locals.actor.role !== "admin")
      return next(new HttpError(403, "Administrator access required."));
    next();
  });
  app.get("/api/admin/dashboard", async (_q, r, next) => {
    try {
      r.json(await store!.dashboard());
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/admin/accounts", async (q, r, next) => {
    try {
      r.status(201).json(
        await store!.create(r.locals.actor, creation.parse(q.body)),
      );
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/admin/users/:id/access", async (q, r, next) => {
    try {
      const b = z
        .object({
          enabled: z.boolean(),
          reason: z.string().trim().min(3).max(300),
        })
        .strict()
        .parse(q.body);
      await store!.change(
        r.locals.actor,
        z.uuid().parse(q.params.id),
        b.enabled,
        b.reason,
        false,
      );
      r.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/admin/users/:id/revoke", async (q, r, next) => {
    try {
      const b = z
        .object({ reason: z.string().trim().min(3).max(300) })
        .strict()
        .parse(q.body);
      await store!.change(
        r.locals.actor,
        z.uuid().parse(q.params.id),
        null,
        b.reason,
        true,
      );
      r.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });
  app.post(
    "/api/admin/users/:id/setup",
    rateLimit({ windowMs: 3600000, limit: 10 }),
    async (q, r, next) => {
      try {
        await store!.setup(r.locals.actor, z.uuid().parse(q.params.id));
        r.json({ ok: true });
      } catch (e) {
        next(e);
      }
    },
  );
  app.use("/api", (_q, _r, next) =>
    next(new HttpError(404, "Endpoint not found.")),
  );
  app.use(
    (
      err: unknown,
      _q: express.Request,
      r: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof ZodError)
        return void r
          .status(400)
          .json({ error: "Check the submitted names, email and request ID." });
      if (err instanceof HttpError)
        return void r.status(err.status).json({ error: err.message });
      if ((err as { type?: string })?.type === "entity.parse.failed")
        return void r.status(400).json({ error: "Invalid JSON." });
      r.status(500).json({
        error:
          "The operation could not be completed. Retry using the same request.",
      });
    },
  );
  return app;
}
