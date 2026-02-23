import { NextResponse } from "next/server";
import { validateName } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { isValid: false, reason: "Name must be a valid string." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return NextResponse.json({ isValid: false, reason: "Name is too short." });
    }

    if (trimmedName.length > 50) {
      return NextResponse.json({ isValid: false, reason: "Name is too long." });
    }

    const result = await validateName(trimmedName);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in validate-name API route:", error);
    return NextResponse.json({ isValid: true });
  }
}
