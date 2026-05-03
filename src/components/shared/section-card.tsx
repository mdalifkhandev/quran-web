export function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="surface p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </section>
  );
}
