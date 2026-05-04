"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";

function parseCreateEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3 || title.length > 120) {
    throw new Error("Title must be between 3 and 120 characters.");
  }
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  return {
    title,
    description: description.length ? description.slice(0, 2000) : null,
    location: location.length ? location.slice(0, 200) : null,
    eventDate: eventDate.length ? eventDate : null,
  };
}

export async function createEventAction(formData: FormData) {
  const session = await getSession();
  const userId = session.data?.user.id;
  const input = parseCreateEvent(formData);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const created = await prisma.event.create({
      data: {
        ownerUserId: userId,
        title: input.title,
        description: input.description,
        location: input.location,
        eventDate: input.eventDate ? new Date(input.eventDate) : null,
      },
    });

    redirect(`/events/${created.id}`);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}
