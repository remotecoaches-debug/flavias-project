import Anthropic from "@anthropic-ai/sdk";
import { BASE_SYSTEM_PROMPT, getMode } from "@/lib/modes";

export const runtime = "nodejs";
export const maxDuration = 120;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

const MAX_MESSAGES = 60;
const MAX_MESSAGE_LENGTH = 24_000;

interface ChatMessagePayload {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  let body: { mode?: string; messages?: ChatMessagePayload[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cerere invalidă." }, { status: 400 });
  }

  const mode = getMode(body.mode ?? "");
  if (!mode) {
    return Response.json({ error: "Mod necunoscut." }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter(
      (m): m is ChatMessagePayload =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m?.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

  if (messages.length === 0 || messages[0].role !== "user") {
    return Response.json({ error: "Conversația trebuie să înceapă cu un mesaj." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Serverul nu este configurat (lipsește ANTHROPIC_API_KEY)." },
      { status: 500 },
    );
  }

  const stream = getClient().messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: `${BASE_SYSTEM_PROMPT}\n\n${mode.systemPrompt}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => {
        controller.enqueue(encoder.encode(delta));
      });
      stream.on("error", (err) => {
        console.error("Anthropic stream error:", err);
        controller.enqueue(
          encoder.encode("\n\n⚠️ A apărut o eroare. Te rog încearcă din nou."),
        );
        controller.close();
      });
      stream.on("end", () => {
        controller.close();
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
