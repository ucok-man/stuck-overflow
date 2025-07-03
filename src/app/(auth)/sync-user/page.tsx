/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SyncUserPage() {
  const user = await currentUser();

  // Condition 1: If there's no user, redirect immediately.
  if (!user) {
    redirect("/sign-in");
  }

  // Condition 2: Check if the user already exists in your DB.
  // This prevents running the upsert logic unnecessarily if the page is reloaded.
  const existingUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  // If user is already synced, redirect to the dashboard.
  if (existingUser) {
    redirect("/");
  }

  // Condition 3: If user doesn't exist, perform the sync operation.
  try {
    await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.fullName ?? "?",
        username: user.fullName ?? "?",
        picture: user.imageUrl,
      },
    });
  } catch (error: any) {
    // This catch block is for DATABASE errors, not redirect errors.
    console.error("Error creating user during sync:", error);
    // You should render an error UI here so the user isn't stuck on a blank page.
    return (
      <div>
        <h1>Synchronization Failed</h1>
        <p>
          Could not sync your account to our database. Please try again later.
        </p>
      </div>
    );
  }

  // IMPORTANT: After a successful database operation, call redirect.
  // There are no try/catch blocks around it. Its thrown error will be
  // handled by Next.js to perform the redirection.
  redirect("/");
}
