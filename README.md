# Asistentul tău AI 🤖

O aplicație simplă, în română, unde urmăritorii tăi aleg ce au nevoie și primesc rezultate — **butoane, nu prompturi**.

| Mod | Ce face |
|---|---|
| 📄 Îmbunătățește-mi CV-ul | Diagnostic pe CV, rescriere cu rezultate măsurabile, optimizare ATS, scrisoare de intenție |
| 🎤 Pregătește-mă de interviu | Simulare de interviu cu feedback pe metoda STAR, întrebări capcană, negociere de salariu |
| 💡 Ajută-mă să încep un business | De la idee la validare și primii clienți plătitori, plan de acțiune pe 30 de zile |
| 📱 Creează-mi conținut | Piloni de conținut, scripturi de Reels cu hook-uri, calendar pe 30 de zile |

Fiecare mod are un **framework de coaching integrat** în promptul de sistem — asistentul conduce conversația pas cu pas, pune o singură întrebare pe rând și oferă butoane cu răspunsuri sugerate la fiecare pas, ca utilizatorul să nu trebuiască să scrie niciodată un „prompt".

## Cum funcționează tehnic

- **Next.js 15** (App Router) + TypeScript, fără alte dependențe de UI.
- **`/api/chat`** — route handler care face streaming de la Claude API (`@anthropic-ai/sdk`, model `claude-opus-4-8`, adaptive thinking, prompt caching pe promptul de sistem).
- **Butoanele sugerate** — modelul e instruit să încheie fiecare răspuns cu o linie `⟦SUGESTII⟧ opțiune 1 | opțiune 2 | ...`; clientul o extrage din text și o transformă în butoane.
- Modurile și prompturile de sistem sunt definite într-un singur loc: [`lib/modes.ts`](lib/modes.ts).

## Rulare locală

```bash
cp .env.example .env        # pune cheia ta ANTHROPIC_API_KEY
npm install
npm run dev                 # http://localhost:3000
```

## Publicare (Vercel)

1. Împinge repo-ul pe GitHub (deja făcut).
2. Importă proiectul pe [vercel.com](https://vercel.com) → adaugă variabila de mediu `ANTHROPIC_API_KEY` → Deploy.

## Pașii următori (pentru modelul de abonament la 19 €/lună)

Aplicația de față este produsul complet, fără monetizare. Pentru abonamente ai nevoie de:

1. **Autentificare** — de ex. [Clerk](https://clerk.com) sau [NextAuth](https://authjs.dev) (login cu email/Google).
2. **Plăți recurente** — [Stripe Billing](https://stripe.com/billing) cu un singur produs (19 €/lună) + webhook care marchează abonamentul activ.
3. **Poartă de acces** — în `app/api/chat/route.ts`, verifică abonamentul înainte de a apela modelul; utilizatorii fără abonament primesc de ex. 5 mesaje gratuite (numărate în baza de date).
4. **Bază de date** — de ex. [Neon](https://neon.tech) (Postgres) pentru utilizatori, abonamente și, opțional, istoricul conversațiilor.
5. **Versiunea în engleză** — adaugă un al doilea set de prompturi în `lib/modes.ts` și un selector de limbă; restul aplicației rămâne identic.
