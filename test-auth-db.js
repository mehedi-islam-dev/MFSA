
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await pool.query('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "isAnonymous" BOOLEAN DEFAULT FALSE');
    await pool.query('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT \'user\'');
    console.log("Success");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
main();
