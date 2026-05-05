import DashboardContent from "@/components/DashboardContent";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const session = await getSession();
  const userId = session.data?.user.id;

  if (!userId) {
    redirect("/auth/sign-in");
  }

  return <DashboardContent userId={userId} />;
};

export default DashboardPage;
