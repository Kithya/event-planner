import EventDetailContent from "@/components/EventDetailContent";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getSession();
  const userId = session.data?.user.id;

  if (!userId) {
    redirect("/auth/sign-in");
  }

  return <EventDetailContent userId={userId} eventId={eventId} />;
}
