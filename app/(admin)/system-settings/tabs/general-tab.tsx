export const General = () => {
  return (
    <div className='space-y-4'>
      <div>
        <h2 className="text-lg font-bold">
          General
        </h2>
        <p className="text-muted-foreground text-sm">
          General settings.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
          <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
          <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
        </div>
        <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min animate-pulse" />
      </div>
    </div>
  )
}