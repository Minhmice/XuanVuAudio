export function ProductGallery({ imageUrls }: { imageUrls: string[] }) {
  const primary = imageUrls[0];
  const rest = imageUrls.slice(1, 5);

  return (
    <div className="space-y-3">
      <div className="aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        {primary ? (
          <img src={primary} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Ảnh</div>
        )}
      </div>
      {rest.length > 0 ? (
        <ul className="grid grid-cols-4 gap-2">
          {rest.map((url, i) => (
            <li key={`${url}-${i}`} className="aspect-square overflow-hidden rounded-md border bg-muted">
              <img src={url} alt="" className="h-full w-full object-cover" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
