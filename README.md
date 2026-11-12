# Identyca — marketing site (Next.js rebuild)

Premium, minimal rebuild of identyca.io. Next.js 16 (App Router, Cache Components),
Tailwind CSS v4, [BoardUI](https://www.boardui.com) components, `motion` for animation, Lenis smooth scroll.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` to enable ROI report emails.

## Design system

- **BoardUI** foundations in `src/styles/{theme,typography,globals}.css`, components in `src/components/base/**`.
  Rules for agents/devs: `AGENTS.md` and `.claude/skills/boardui`.
- **Brand layer** `src/styles/brand.css` (imported via `src/styles/app.css`): Manrope (sans), Instrument Serif
  italic accents (`<Accent>` / `font-accent`), JetBrains Mono eyebrows, warm "paper" ground, fluid type
  utilities (`text-hero`, `text-section`, `text-subsection`, `text-lead`, `text-stat`, `eyebrow`) and semantic
  marketing tokens (`signal`, `warm`, `positive`, `border-hairline`, `background-sunken|elevated`).
  New `text-*` styles must also be registered in `src/utils/cx.ts`.
- **Dark sections** reuse BoardUI's tokens by scoping `.dark` (`<Section tone="ink">`). Site-wide theme
  toggle lives in the footer.
- **Motion**: `src/components/site/motion.tsx` (Reveal, Stagger, SplitWords, CountUp). Reduced motion is handled
  globally by `MotionProvider`; never branch render output on the preference (use
  `components/site/use-reduced-motion.ts` when you need the flag).

## Map

| Route | Source |
|---|---|
| `/` | `src/app/page.tsx`, `src/components/home/*` |
| `/problem`, `/real-time`, `/event-intelligence`, `/spaces` | `src/app/<route>/page.tsx` |
| `/solutions`, `/solutions/[slug]` (11 org types) | `src/content/solutions.ts`, `src/components/solutions/*` |
| `/roi-calculator` + `POST /api/roi-report` | `src/lib/roi/*` (engine, fees, PDF), `src/components/roi/*` |
| `/insights`, `/insights/[slug]` | `src/content/posts/*`, `src/lib/posts.ts`, `src/components/insights/*` |
| `/about`, `/vision`, `/privacy-policy`, `/demo` | `src/app/<route>/page.tsx` |

ROI math self-check: `npx tsx src/lib/roi/selfcheck.ts`.
Lead forms post to the existing worker endpoint (`src/components/site/lead-form.tsx`).
