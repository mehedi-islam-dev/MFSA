import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { Pool } from "pg";
// ── Debug: confirm DATABASE_URL is visible to the Next.js runtime ────────────
console.log("DB_URL Check:", process.env.DATABASE_URL ? "Found" : "Missing");

// ── Pool setup ────────────────────────────────────────────────────────────────
// DATABASE_URL is loaded by Next.js from .env at dev-server startup.
const connectionString = process.env.DATABASE_URL;

const pool = connectionString 
  ? new Pool({ 
      connectionString,
      ssl: { rejectUnauthorized: false } // Crucial for strict Supabase environments 
    }) 
  : null;

if (pool) {
  // ── Critical: suppress unhandled pool connection errors ───────────────────────
  // Without this handler, any failed TCP connection attempt emits an unhandled 'error' event
  pool.on("error", (err) => {
    console.error("[DB Pool] Background client error:", err.message);
  });
}

// ── Better-Auth instance ──────────────────────────────────────────────────────
export const auth = betterAuth({
  // BETTER_AUTH_URL ensures callback URLs and redirects work correctly.
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,

  database: pool,

  emailAndPassword: {
    enabled: true,
  },

  // [ACTION REQUIRED]: Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },
  plugins: [
    anonymous()
  ],
});
