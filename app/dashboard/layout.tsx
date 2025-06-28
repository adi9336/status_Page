import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    return null;
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}