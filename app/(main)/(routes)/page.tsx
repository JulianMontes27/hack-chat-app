import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { ModeToggle } from "@/components/providers/toggle-theme";

export default async function HomePage() {
  const { userId } = auth();

  return (
    <div>
      <div className="bg-secondary">Home page</div>
      {userId ? (
        <div className="flex justify-between p-5">
          <ModeToggle />
          <UserButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
