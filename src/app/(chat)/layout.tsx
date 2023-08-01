export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full w-full max-w-4xl mx-auto">{children}</div>;
}
