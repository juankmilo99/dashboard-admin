import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> } // ✅ `params` es una promesa
) {
  try {
    const { userId } = await auth();
    const { eventId } = await context.params; // ✅ Se usa `await` en `params`

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedEvent = await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("[DELETE_EVENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
