import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = auth();

  return (
    <div>
      <div className="bg-secondary">Home page</div>
      {userId ? <SignOutButton /> : <SignInButton />}
    </div>
  );
}
