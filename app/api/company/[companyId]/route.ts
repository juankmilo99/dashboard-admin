import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ companyId: string }> } // ✅ `params` como Promesa
) {
  try {
    const { userId } = await auth();
    const { companyId } = await context.params; // ✅ `await` en `params`
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const company = await db.company.update({
      where: {
        id: companyId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log("[COMPANY ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ companyId: string }> } // ✅ `params` como Promesa
) {
  try {
    const { userId } = await auth();
    const { companyId } = await context.params; // ✅ `await` en `params`

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedCompany = await db.company.delete({
      where: {
        id: companyId,
      },
    });

    return NextResponse.json(deletedCompany);
  } catch (error) {
    console.log("[DELETE COMPANY ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
