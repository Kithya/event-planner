import DashboardContent from "@/components/DashboardContent";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const DashboardPage = async () => {
  await connection();

  const session = await getSession();
  const userId = session.data?.user.id;

  if (!userId) {
    redirect("/auth/sign-in");
  }

  return <DashboardContent userId={userId} />;
};

export default DashboardPage;
