
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { redirect } from "next/navigation";
import { readUserTotalPage, readUserByPage, deleteUser } from "@/app/_actions/auth";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/restricted/auth/user/columns";
import { type TReadUserWithoutPassSchema } from "@/app/_libs/zod_auth";
import { Suspense } from "react";
import type { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
    title: 'User',
    description: 'Developed by jiajunlee',
};

export default async function User(
    props: { searchParams?: Promise<{ itemsPerPage?: string, currentPage?: string, query?: string }> }
) {

    const session = await getServerSession(options);

    if (!session || session.user.role !== 'boss') {
        redirect("/denied");
    }

    const searchParams = await props.searchParams;

    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readUserTotalPage(itemsPerPage, query);

    const pageTitle = 'Manage User';

    const createButtonTitle = 'Sign Up User';

    const readAction = readUserByPage;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Link className="btn btn-primary w-min no-underline p-[1%]" href="/restricted/user/signUp">
                {createButtonTitle}
            </Link>
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} readAction={readAction} columns={columns} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
}
