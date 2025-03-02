import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ companyId: string }> } // ✅ params ahora es una Promesa
) {
  try {
    const { userId } = await auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 🔥 Solución: Hacer `await` en `params`
    const { companyId } = await context.params;

    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const contact = await db.contact.create({
      data: {
        companyId,
        ...data,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("[CONTACT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
