import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Header } from "./components/Header";
import { CompanyInformation } from "./components/CompanyInformation";
import { FooterCompany } from "./components/FooterCompany";

// ✅ Define explícitamente el tipo de props
interface PageProps {
  params: { companyId: string };
}

export default async function CompanyIdPage({ params }: PageProps) {
    const authData = await auth();
    const userId = authData?.userId;

    if (!userId) {
        return redirect("/");
    }

    const company = await db.company.findUnique({
        where: {
            id: params.companyId,
            userId,
        },
    });

    if (!company) {
        return redirect("/");
    }

    return (
        <div>
            <Header />
            <CompanyInformation company={company} />
            <FooterCompany companyId={company.id} />
        </div>
    );
}
