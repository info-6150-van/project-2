export default async function ObserverPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  return (
    <main className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">Observer: {handle}</h1>
      <p className="text-muted-foreground">Public profile coming soon.</p>
    </main>
  );
}
