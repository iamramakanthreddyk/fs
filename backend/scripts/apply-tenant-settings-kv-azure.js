const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Skip when running in Codex or CI
if (process.env.CODEX_ENV_NODE_VERSION || process.env.CI) {
  console.log('Codex environment detected. Skipping Azure migration.');
  process.exit(0);
}

async function run() {
  const filePath = path.join(__dirname, '../migrations/schema/008_create_tenant_settings_kv.sql');
  let sql = fs.readFileSync(filePath, 'utf8');

  // Remove FK references unsupported on Azure Citus
  sql = sql.replace(/REFERENCES public\.tenants\(id\)(?:\s+ON DELETE CASCADE)?/g, '');

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Applying tenant_settings_kv migration without foreign keys...');
    await pool.query(sql);
    console.log('✅ Migration 008 applied');
  } catch (err) {
    console.error('Error applying migration:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  run();
}
