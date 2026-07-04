import Link from "next/link";
import { MODES } from "@/lib/modes";

export default function Home() {
  const modes = Object.values(MODES);

  return (
    <main className="landing">
      <header className="landing-header">
        <span className="kicker">În română · fără prompturi · pas cu pas</span>
        <h1 className="landing-title">
          Asistentul <span className="hl">tău</span>
          <br />
          AI
        </h1>
        <p className="landing-sub">
          Alege ce vrei să rezolvi azi. Tu apeși pe butoane, asistentul te
          ghidează pas cu pas până la rezultat.
        </p>
      </header>

      <section className="mode-list">
        {modes.map((mode, i) => (
          <Link key={mode.id} href={`/asistent/${mode.id}`} className="mode-row">
            <span className="mode-num">{String(i + 1).padStart(2, "0")}</span>
            <div className="mode-body">
              <h2>
                <span className="mode-emoji" aria-hidden>
                  {mode.emoji}
                </span>
                {mode.title}
              </h2>
              <p>{mode.tagline}</p>
            </div>
            <span className="mode-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </section>

      <footer className="landing-footer">
        <span>făcut cu drag pentru comunitatea Flaviei 💛</span>
        <span className="kicker">est. 2026</span>
      </footer>
    </main>
  );
}
