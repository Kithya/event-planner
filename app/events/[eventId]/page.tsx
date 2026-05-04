import EventDetailContent from "@/components/EventDetailContent";
import { getSession } from "@/lib/auth/server";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getSession();

  return (
    <EventDetailContent userId={session.data?.user.id} eventId={eventId} />
  );
}
