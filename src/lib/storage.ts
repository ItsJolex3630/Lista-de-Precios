import { sql } from "@vercel/postgres";
import { Perfume, initialPerfumes } from "@/data/perfumes";

// Check if database is available
let dbAvailable: boolean | null = null;

async function isDbAvailable(): Promise<boolean> {
  if (dbAvailable !== null) return dbAvailable;
  try {
    await sql`SELECT 1`;
    dbAvailable = true;
    return true;
  } catch {
    dbAvailable = false;
    return false;
  }
}

// Reset cache (useful after env changes)
export function resetDbCache() {
  dbAvailable = null;
}

// Initialize the database schema
export async function initDatabase(): Promise<boolean> {
  try {
    if (!(await isDbAvailable())) return false;

    await sql`
      CREATE TABLE IF NOT EXISTS perfumes (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        volume VARCHAR(50) NOT NULL DEFAULT '100ML',
        gender VARCHAR(20) NOT NULL,
        wholesale DECIMAL(10,2)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    return true;
  } catch {
    return false;
  }
}

// Get all data from database
export async function getData(): Promise<{
  perfumes: Perfume[];
  marginPercent: number;
} | null> {
  try {
    if (!(await isDbAvailable())) return null;

    await initDatabase();

    // Check if there's data
    const countResult = await sql`SELECT COUNT(*) as count FROM perfumes`;
    const count = countResult.rows[0]?.count;

    if (count === "0" || !count) {
      return null; // No data yet, need to seed
    }

    const perfumesResult = await sql`
      SELECT id, name, volume, gender, wholesale FROM perfumes ORDER BY id ASC
    `;

    const settingsResult = await sql`
      SELECT value FROM settings WHERE key = 'marginPercent'
    `;

    const perfumes: Perfume[] = perfumesResult.rows.map((row) => ({
      id: Number(row.id),
      name: String(row.name),
      volume: String(row.volume),
      gender: String(row.gender) as Perfume["gender"],
      wholesale: row.wholesale === null ? null : Number(row.wholesale),
    }));

    const marginPercent = settingsResult.rows[0]
      ? Number(settingsResult.rows[0].value)
      : 35;

    return { perfumes, marginPercent };
  } catch {
    return null;
  }
}

// Save all data to database (full sync)
export async function saveData(data: {
  perfumes: Perfume[];
  marginPercent: number;
}): Promise<boolean> {
  try {
    if (!(await isDbAvailable())) return false;

    await initDatabase();

    // Use a transaction-like approach: delete all and re-insert
    await sql`DELETE FROM perfumes`;

    for (const p of data.perfumes) {
      await sql`
        INSERT INTO perfumes (id, name, volume, gender, wholesale)
        VALUES (${p.id}, ${p.name}, ${p.volume}, ${p.gender}, ${p.wholesale})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          volume = EXCLUDED.volume,
          gender = EXCLUDED.gender,
          wholesale = EXCLUDED.wholesale
      `;
    }

    // Save margin setting
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('marginPercent', ${String(data.marginPercent)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;

    return true;
  } catch {
    return false;
  }
}

// Seed database with initial data
export async function seedDatabase(): Promise<boolean> {
  try {
    return await saveData({
      perfumes: initialPerfumes,
      marginPercent: 35,
    });
  } catch {
    return false;
  }
}
