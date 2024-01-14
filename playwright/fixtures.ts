import { test as baseTest } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const { encode } = await import("@auth/core/jwt");

export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${id}.json`,
      );

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined });

      // Clear cookies to make sure we don't have any existing sessions.
      await page.context().clearCookies();
      // Acquire a unique account, for example create a new one.
      // Alternatively, you can have a list of precreated accounts for testing.
      // Make sure that accounts are unique, so that multiple team members
      // can run tests at the same time without interference.

      const prisma = new PrismaClient();

      const account = await prisma.user.upsert({
        where: {
          email: `testing${id}@example.com`,
        },
        create: {
          name: `Testing ${id}`,
          email: `testing${id}@example.com`,
        },
        update: {},
      });

      const token = await encode({
        salt: "authjs.session-token",
        secret: process.env.AUTH_SECRET as string,
        maxAge: 1000 * 60 * 60,
        token: {
          name: account.name,
          email: account.email,
          picture: "https://placekitten.com/400/400",
          sub: account.id,
          jti: randomUUID(),
        },
      });

      // Perform authentication steps. Replace these actions with your own.
      await page.goto("http://localhost:3000/");
      await page.context().addCookies([
        {
          name: "authjs.session-token",
          value: token,
          domain: "localhost",
          path: "/",
          httpOnly: true,
          sameSite: "Lax",
        },
      ]);

      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});
