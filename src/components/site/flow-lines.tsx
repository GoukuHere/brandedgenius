/*
  Thin lines of light along long curves, after Kokonut UI's Background Paths. The paths are drawn once and the
  two layers drift and breathe with CSS transforms, which the GPU moves without repainting the lines. (Animating
  each path's dash every frame cost a full repaint of a 1600px SVG per frame.)
*/
function Paths({ position, className }: { position: number; className: string }) {
  const paths = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 8 * position} -${189 + i * 9}C-${380 - i * 8 * position} -${189 + i * 9} -${312 - i * 8 * position} ${216 - i * 9} ${152 - i * 8 * position} ${343 - i * 9}C${616 - i * 8 * position} ${470 - i * 9} ${684 - i * 8 * position} ${875 - i * 9} ${684 - i * 8 * position} ${875 - i * 9}`,
    width: 0.6 + i * 0.05,
  }));

  return (
    <svg className={`absolute inset-0 size-full ${className}`} viewBox="0 0 696 316" fill="none">
      {paths.map((path) => (
        <path key={path.id} d={path.d} stroke="currentColor" strokeWidth={path.width} strokeOpacity={0.12 + path.id * 0.03} />
      ))}
    </svg>
  );
}

export function FlowLines({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <Paths position={1} className="flow-drift" />
      <Paths position={-1} className="flow-drift-alt" />
    </div>
  );
}
