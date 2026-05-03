export function ReaderLayout({ left, center, right }: { left: React.ReactNode; center: React.ReactNode; right: React.ReactNode }) {
  return <div className="grid gap-3 xl:grid-cols-[330px_minmax(760px,1fr)_335px] xl:items-start">{left}{center}{right}</div>;
}
