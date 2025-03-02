type PageProps = {
    params: { companyId: string };
};
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { CompanyInformation } from "./components/CompanyInformation";
import { FooterCompany } from "./components/FooterCompany";


export default async function CompanyIdPage(props: PageProps) {
    const { params } = props; // Extraer `params` explícitamente
    const companyId = params.companyId; // Asegurar que `companyId` es string

    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    const company = await db.company.findUnique({
        where: {
            id: companyId,
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
