"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ChatProps {
  modeId: string;
  emoji: string;
  title: string;
  tagline: string;
  welcome: string;
  quickStarts: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTION_MARKER = "⟦SUGESTII⟧";

/** Extrage sugestiile din finalul răspunsului și le scoate din textul afișat. */
function splitSuggestions(text: string): { visible: string; suggestions: string[] } {
  const idx = text.lastIndexOf(SUGGESTION_MARKER);
  if (idx === -1) return { visible: text, suggestions: [] };
  const visible = text.slice(0, idx).trimEnd();
  const suggestions = text
    .slice(idx + SUGGESTION_MARKER.length)
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 80)
    .slice(0, 4);
  return { visible, suggestions };
}

export default function Chat({ modeId, emoji, title, tagline, welcome, quickStarts }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(quickStarts);
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamingText]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const history = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(history);
    setInput("");
    setSuggestions([]);
    setBusy(true);
    setStreamingText("");

    let full = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: modeId, messages: history }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        // Ascundem linia de sugestii în timp ce se scrie
        setStreamingText(splitSuggestions(full).visible);
      }
    } catch {
      full =
        full ||
        "⚠️ Nu am putut primi răspunsul. Verifică conexiunea și încearcă din nou.";
    }

    const { visible, suggestions: parsed } = splitSuggestions(full);
    setMessages([...history, { role: "assistant", content: visible }]);
    setSuggestions(parsed);
    setStreamingText(null);
    setBusy(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <Link href="/" className="chat-back" aria-label="Înapoi" role="button">
          ←
        </Link>
        <div className="chat-header-titles">
          <h1>
            {emoji} {title}
          </h1>
          <p>{tagline}</p>
        </div>
      </header>

      <div className="chat-scroll" ref={scrollRef}>
        <div className="bubble assistant">{welcome}</div>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {streamingText !== null &&
          (streamingText.length > 0 ? (
            <div className="bubble assistant">{streamingText}</div>
          ) : (
            <div className="typing">Asistentul scrie…</div>
          ))}
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((s) => (
            <button
              key={s}
              className="suggestion-btn"
              disabled={busy}
              onClick={() => send(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="chat-inputbar">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Scrie aici… (sau apasă un buton de mai sus)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
        />
        <button className="chat-send" onClick={() => send(input)} disabled={busy || !input.trim()}>
          Trimite
        </button>
      </div>
    </div>
  );
}
