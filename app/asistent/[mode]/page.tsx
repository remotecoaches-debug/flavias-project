import { notFound } from "next/navigation";
import { getMode, MODES } from "@/lib/modes";
import Chat from "./chat";

export function generateStaticParams() {
  return Object.keys(MODES).map((mode) => ({ mode }));
}

export default async function AsistentPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode: modeId } = await params;
  const mode = getMode(modeId);
  if (!mode) notFound();

  return (
    <Chat
      modeId={mode.id}
      emoji={mode.emoji}
      title={mode.title}
      tagline={mode.tagline}
      welcome={mode.welcome}
      quickStarts={mode.quickStarts}
    />
  );
}
