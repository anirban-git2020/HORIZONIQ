const CARDS = [
  {
    title: "Signals",
    description: "See emerging trends early.",
  },
  {
    title: "Skills",
    description: "Learn what skills are rising.",
  },
  {
    title: "Opportunities",
    description:
      "Discover jobs, businesses, and markets gaining momentum.",
  },
] as const;

export function WhyHorizonIQ() {
  return (
    <section
      aria-labelledby="why-horizoniq-heading"
      className="mt-16 border-t border-border/50 pt-12 md:mt-20 md:pt-14"
    >
      <h2
        id="why-horizoniq-heading"
        className="text-center text-2xl font-semibold tracking-tight md:text-[1.75rem]"
      >
        Why HorizonIQ?
      </h2>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <li
            key={card.title}
            className="rounded-xl border border-border/70 bg-card px-6 py-7"
          >
            <h3 className="text-base font-semibold tracking-tight">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {card.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
