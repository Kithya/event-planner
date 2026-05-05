import React from "react";
import { Button } from "./ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { notFound } from "next/navigation";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { submitOrUpdateRsvpAction } from "@/lib/actions/events";

export function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;

  for (const r of rsvps) {
    if (r.status === "going") {
      goingCount++;
    } else if (r.status === "maybe") {
      maybeCount++;
    } else if (r.status === "not_going") {
      notGoingCount++;
    }
  }

  return {
    goingCount,
    maybeCount,
    notGoingCount,
  };
}

const InviteRsvpContent = async ({
  token,
  submitted,
}: {
  token: string;
  submitted: boolean;
}) => {
  const rows = await prisma.eventInvite.findFirst({
    where: {
      token,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          location: true,
          eventDate: true,
          description: true,
          rsvp: {},
        },
      },
    },
  });

  if (!rows) return notFound();

  const e = rows.event;
  const event = {
    title: e.title,
    location: e.location,
    description: e.description,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
  };

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader className="space-y-3">
          <Badge className="w-fit" variant={"secondary"}>
            RSVP
          </Badge>
          <CardTitle>{event.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {event.eventDate
              ? new Date(event.eventDate).toLocaleString()
              : "No date selected"}

            {event.location ? ` - ${event.location}` : ""}
          </p>
          {event.description ? (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          ) : (
            ""
          )}
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="mb-4 rounded-md border border-(--accent)/50 bg-(--accent)/15 p-3 text-sm text-[#e9dbff]">
              Thanks You. Your RSVP has been recorded (or updated).
            </p>
          ) : null}
          <form action={submitRsvpForToken}>
            <Field className="mb-4">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Your name...."
                required
              />

              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                placeholder="example@gmail.com"
                type="email"
                required
              />

              <FieldLabel htmlFor="status">Attendance</FieldLabel>
              <select
                name="status"
                id="status"
                required
                defaultValue={"going"}
                className="flex h-10 w-full rounded-md border border-border bg-(--surface) px-3 py-2 text-foreground text-sm"
              >
                <option value="going">Going</option>
                <option value="maybe">Maybe</option>
                <option value="not_going">Not Going</option>
              </select>
            </Field>
            <Button type="submit">Submit RSVP</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteRsvpContent;
