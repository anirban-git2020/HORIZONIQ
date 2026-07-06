import { cn } from "@/lib/utils";

type ContentPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function ContentPage({
  title,
  description,
  children,
  className,
}: ContentPageProps) {
  return (
    <div className={cn("container max-w-3xl py-12 md:py-16", className)}>
      <header className="mb-10 space-y-3 border-b border-border/50 pb-8">
        <h1 className="display-title text-3xl md:text-4xl">{title}</h1>
        {description && (
          <p className="prose-lead text-muted-foreground">{description}</p>
        )}
      </header>
      <article className="space-y-10">{children}</article>
    </div>
  );
}

export function ContentSection({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h2 className="section-title text-xl font-semibold">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
        {children}
      </div>
    </section>
  );
}

export function ContentList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
