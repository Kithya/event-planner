import DashboardContent from "@/components/DashboardContent";
import { getSession } from "@/lib/auth/server";
import React from "react";

const DashboardPage = async () => {
  const session = await getSession();

  return <DashboardContent userId={session.data?.user.id} />;
};

export default DashboardPage;
