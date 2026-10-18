import { betterAuth } from "better-auth";
import { Pool } from "pg";

const connectionString = "postgresql://postgres:FnwiXeqtVgQUEnIP@db.hsdhnqkfmkbqcnrgebwx.supabase.co:5432/postgres";
const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const auth = betterAuth({
      database: new Pool({ connectionString, ssl: { rejectUnauthorized: false } }),
      emailAndPassword: { enabled: true }
    });
    console.log("betterAuth created with direct pool successfully.");
  } catch (err) {
    console.error("Direct pool failed:", err);
  }

  try {
    const auth2 = betterAuth({
      database: { dialect: "postgres", pool: new Pool({ connectionString, ssl: { rejectUnauthorized: false } }) },
      emailAndPassword: { enabled: true }
    });
    console.log("betterAuth created with dialect+pool successfully.");
  } catch (err) {
    console.error("Dialect+pool failed:", err);
  }

  try {
    const auth3 = betterAuth({
      database: { provider: "postgres", client: new Pool({ connectionString, ssl: { rejectUnauthorized: false } }) },
      emailAndPassword: { enabled: true }
    });
    console.log("betterAuth created with provider+client successfully.");
  } catch (err) {
    console.error("Provider+client failed:", err.message);
  }

  pool.end();
}
main();
