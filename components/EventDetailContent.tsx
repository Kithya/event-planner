import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import { countByStatus } from "./DashboardContent";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createInviteLinkAction } from "@/lib/actions/events";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const EventDetailContent = async ({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) => {
  const row = await prisma.event.findFirst({
    where: {
      id: eventId,
      ownerUserId: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      rsvp: {
        select: {
          status: true,
        },
      },
      invite: { select: { token: true } },
    },
  });
  if (!row) return notFound();
  const counts = countByStatus(row.rsvp);

  const event = {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    inviteToken: row.invite?.token ?? null,
    goingCount: counts.goingCount,
    maybeCount: counts.maybeCount,
    notGoingCount: counts.notGoingCount,
  };
  const createInviteActionForEvent = createInviteLinkAction.bind(
    null,
    event.id,
  );
  const rsvpRows = await prisma.eventRsvp.findMany({
    where: { eventId },
    orderBy: { respondedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      respondedAt: true,
    },
  });

  const rsvps = rsvpRows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    status: r.status,
    respondedAt: r.respondedAt.toISOString(),
  }));

  const inviteUrl = event.inviteToken
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}`
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <p>
            {event.eventDate
              ? new Date(event.eventDate).toLocaleString()
              : "No Date selected"}
            {event.location && ` - ${event.location}`}
          </p>

          {event.description && (
            <p className="text-muted-foreground">{event.description}</p>
          )}
        </div>
        <Button asChild variant={"outline"}>
          <Link href={"/dashboard"}>Back</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge>Going: {event.goingCount}</Badge>
        <Badge variant={"secondary"}>Maybe: {event.maybeCount}</Badge>
        <Badge variant={"outline"}>Not Going: {event.notGoingCount}</Badge>
      </div>

      <Card>
        <CardHeader>Invite Link</CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this link with guest so they can RSVP without creating an
            account
          </p>
          {inviteUrl ? (
            <div className="rounded-md border border-border p-3 text-sm">
              {inviteUrl}
            </div>
          ) : (
            <div>No Invite Link</div>
          )}
          <form action={createInviteActionForEvent}>
            <Button type="submit">Generate Link</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No responses yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>
                      <Badge>
                        {r.status === "not_going" ? "Not going" : r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(r.respondedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetailContent;
