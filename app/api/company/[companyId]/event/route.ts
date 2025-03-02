import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ companyId: string }> } // ✅ `params` como promesa
) {
  try {
    const { userId } = await auth();
    const { companyId } = await context.params; // ✅ `await` en `params`
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const event = await db.event.create({
      data: {
        companyId,
        ...data,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log("[EVENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
