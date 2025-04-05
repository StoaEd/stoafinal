export default function Page() {
  return(
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="bg-secondary/50 aspect-video rounded-xl border-2 border-soft-line" />
      <div className="bg-secondary/50 aspect-video rounded-xl border-2 border-soft-line" />
      <div className="bg-secondary/50 aspect-video rounded-xl border-2 border-soft-line" />
    </div>
    <div className="bg-secondary/50 border-soft-line border-2 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
  </div>
  )
}
