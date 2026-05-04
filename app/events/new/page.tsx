import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/lib/actions/events";
import Link from "next/link";

export default async function NewEventPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEventAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Team Dinner...."
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Description...."
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="Optional Location"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="eventDate">Date and time</FieldLabel>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="datetime-local"
                  required
                  placeholder="Optional Location"
                />
                <FieldDescription>
                  Optional, you can set it later
                </FieldDescription>
              </Field>

              <div className="flex items-center gap-3">
                <Button type="submit">Create event</Button>
                <Button type="button" variant={"outline"} asChild>
                  <Link href={"/dashboard"}>Cancel</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
