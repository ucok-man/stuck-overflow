import { SignedIn, UserButton } from "@clerk/nextjs";

export default function AuthButton() {
  return (
    <SignedIn>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-10 w-10",
          },
          variables: {
            colorPrimary: "#ff7000",
          },
        }}
      />
    </SignedIn>
  );
}
