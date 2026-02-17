import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const publisher = await prisma.publisher.findUnique({
      where: { id },
      include: {
        screens: true,
      },
    });

    if (!publisher) {
      return NextResponse.json({ error: "Publisher not found" }, { status: 404 });
    }

    return NextResponse.json(publisher);
  } catch (error) {
    console.error("Error fetching publisher details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    const publisher = await prisma.publisher.update({
      where: { id },
      data: {
        name,
      },
    });

    return NextResponse.json(publisher);
  } catch (error) {
    console.error("Error updating publisher:", error);
    return NextResponse.json(
      { error: "Failed to update publisher." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if there are screens linked to this publisher
    const screensCount = await prisma.screen.count({
      where: { publisherId: id }
    });

    if (screensCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete publisher with active screens. Please reassign or delete the screens first." },
        { status: 400 }
      );
    }

    await prisma.publisher.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting publisher:", error);
    return NextResponse.json(
      { error: "Failed to delete publisher." },
      { status: 500 }
    );
  }
}
