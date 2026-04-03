import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import process from "node:process"
import { Client } from "pg"

const rootDir = process.cwd()
const migrationDir = path.join(rootDir, "supabase", "migrations")

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const data = fs.readFileSync(filePath, "utf8")
  const env = {}
  for (const rawLine of data.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eqIndex = line.indexOf("=")
    if (eqIndex < 1) continue
    const key = line.slice(0, eqIndex).trim()
    let value = line.slice(eqIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

function resolveDatabaseUrl() {
  const localEnv = parseEnvFile(path.join(rootDir, ".env.local"))
  const fallbackEnv = parseEnvFile(path.join(rootDir, ".env"))
  return (
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL ||
    localEnv.SUPABASE_DB_URL ||
    localEnv.DATABASE_URL ||
    fallbackEnv.SUPABASE_DB_URL ||
    fallbackEnv.DATABASE_URL ||
    ""
  )
}

function getMigrationFiles() {
  if (!fs.existsSync(migrationDir)) return []
  return fs
    .readdirSync(migrationDir)
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      name,
      absolutePath: path.join(migrationDir, name),
    }))
}

function sha256(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex")
}

async function ensureMigrationTable(client) {
  await client.query(`
    create table if not exists public.jobseek_schema_migrations (
      id bigserial primary key,
      name text not null unique,
      checksum text not null,
      applied_at timestamptz not null default now()
    );
  `)
}

async function getAppliedMigrations(client) {
  const result = await client.query(
    `select name, checksum from public.jobseek_schema_migrations order by name asc`
  )
  const map = new Map()
  for (const row of result.rows) {
    map.set(row.name, row.checksum)
  }
  return map
}

async function applyMigration(client, migration, content, checksum) {
  await client.query("begin")
  try {
    await client.query(content)
    await client.query(
      `insert into public.jobseek_schema_migrations (name, checksum) values ($1, $2)`,
      [migration.name, checksum]
    )
    await client.query("commit")
  } catch (error) {
    await client.query("rollback")
    throw error
  }
}

async function run() {
  const databaseUrl = resolveDatabaseUrl()
  if (!databaseUrl) {
    throw new Error(
      "Missing SUPABASE_DB_URL or DATABASE_URL. Add one to .env.local (server-only variable)."
    )
  }

  const files = getMigrationFiles()
  if (!files.length) {
    console.log("No SQL migration files found in supabase/migrations.")
    return
  }

  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()

  try {
    await ensureMigrationTable(client)
    const appliedMap = await getAppliedMigrations(client)

    let appliedCount = 0
    for (const migration of files) {
      const content = fs.readFileSync(migration.absolutePath, "utf8")
      const checksum = sha256(content)
      const existingChecksum = appliedMap.get(migration.name)

      if (existingChecksum) {
        if (existingChecksum !== checksum) {
          throw new Error(
            `Migration ${migration.name} was already applied with a different checksum. Create a new migration file instead of editing old ones.`
          )
        }
        console.log(`Skipped (already applied): ${migration.name}`)
        continue
      }

      await applyMigration(client, migration, content, checksum)
      appliedCount += 1
      console.log(`Applied: ${migration.name}`)
    }

    console.log(`Migration run complete. ${appliedCount} new migration(s) applied.`)
  } finally {
    await client.end()
  }
}

run().catch((error) => {
  console.error("Migration failed:", error.message)
  process.exit(1)
})
