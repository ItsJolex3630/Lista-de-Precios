import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/storage";

// POST /api/seed - Initialize database with seed data
export async function POST() {
  try {
    const success = await seedDatabase();

    if (success) {
      return NextResponse.json({ seeded: true });
    }

    return NextResponse.json(
      { seeded: false, reason: "Database not configured" },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { seeded: false, reason: "Server error" },
      { status: 500 }
    );
  }
}
