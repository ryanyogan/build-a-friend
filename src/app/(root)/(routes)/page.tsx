import { UserButton } from "@clerk/nextjs";


export default function RootPage() {
  return (
    <div>
      Protected
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
