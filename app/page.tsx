import Link from "next/link";
import { MODES } from "@/lib/modes";

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-header">
        <span className="landing-badge">În română · fără prompturi · pas cu pas</span>
        <h1 className="landing-title">
          Asistentul <em>tău</em> AI
        </h1>
        <p className="landing-sub">
          Alege ce vrei să rezolvi azi. Tu apeși pe butoane, asistentul te ghidează
          pas cu pas până la rezultat.
        </p>
      </header>

      <section className="mode-grid">
        {Object.values(MODES).map((mode) => (
          <Link key={mode.id} href={`/asistent/${mode.id}`} className="mode-card">
            <span className="emoji" aria-hidden>
              {mode.emoji}
            </span>
            <h2>{mode.title}</h2>
            <p>{mode.tagline}</p>
          </Link>
        ))}
      </section>

      <footer className="landing-footer">
        Creat pentru comunitatea Flaviei 💛
      </footer>
    </main>
  );
}
