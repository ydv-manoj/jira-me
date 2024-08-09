import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: { id: id },
      data: { Status: body.status as Status },
    });
    return NextResponse.json(updatedIssue, { status: 200 });
  } catch (error) {
    console.error("Error updating issue status:", error);
    return NextResponse.json(
      { error: "Failed to update issue status" },
      { status: 500 }
    );
  }
}