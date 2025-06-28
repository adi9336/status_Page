import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    // Not logged in — redirect to sign-in
    redirect("/sign-in")
  }

  return <DashboardClient />
}
