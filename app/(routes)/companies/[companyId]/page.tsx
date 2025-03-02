import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Header } from "./components/Header";
import { CompanyInformation } from "./components/CompanyInformation";
import { FooterCompany } from "./components/FooterCompany";

// ✅ Definimos el tipo manualmente
interface CompanyIdPageProps {
  params: {
    companyId: string;
  };
}

export default async function CompanyIdPage({ params }: CompanyIdPageProps) {
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
