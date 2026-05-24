import { NextRequest, NextResponse } from "next/server";
import { getData, saveData } from "@/lib/storage";
import { initialPerfumes } from "@/data/perfumes";

// GET /api/data - Fetch all data
export async function GET() {
  try {
    const data = await getData();

    if (!data) {
      // No data in DB yet, return seed data and try to seed
      return NextResponse.json({
        perfumes: initialPerfumes,
        marginPercent: 35,
        isSeeded: false,
      });
    }

    return NextResponse.json({
      ...data,
      isSeeded: true,
    });
  } catch {
    // Fallback to seed data if database fails
    return NextResponse.json({
      perfumes: initialPerfumes,
      marginPercent: 35,
      isSeeded: false,
    });
  }
}

// POST /api/data - Save all data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.perfumes || !Array.isArray(body.perfumes)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    const success = await saveData({
      perfumes: body.perfumes,
      marginPercent: body.marginPercent ?? 35,
    });

    if (success) {
      return NextResponse.json({ saved: true });
    }

    // Database not available
    return NextResponse.json(
      { saved: false, reason: "Database not configured" },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { saved: false, reason: "Server error" },
      { status: 500 }
    );
  }
}
