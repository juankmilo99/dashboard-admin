import { db } from "@/lib/db"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { Header } from "./components/Header"
import { CompanyInformation } from "./components/CompanyInformation"
import { FooterCompany } from "./components/FooterCompany"


export default async function CompanyIdPage({ params }: { params: Promise<{ companyId: string }> }) {
    const resolvedParams = await params; // 👈 Esperar a que params se resuelva

    if (!resolvedParams || typeof resolvedParams.companyId !== "string") {
        console.error("Error: params is not valid", resolvedParams);
        return redirect("/");
    }

    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    const company = await db.company.findUnique({
        where: {
            id: resolvedParams.companyId, // 👈 Usar los params ya resueltos
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

