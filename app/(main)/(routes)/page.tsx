import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = auth();

  return (
    <div>
      <div className="bg-secondary">Home page</div>
      {userId ? (
        <div className="flex justify-between p-5">
          <UserButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
