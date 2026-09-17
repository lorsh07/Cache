const GRADIENTS: [string, string][] = [
  ["#FF9A8B", "#FF6A88"],
  ["#A18CD1", "#FBC2EB"],
  ["#84FAB0", "#8FD3F4"],
  ["#F6D365", "#FDA085"],
  ["#89F7FE", "#66A6FF"],
  ["#FDCBF1", "#E6DEE9"],
];

export function placeholderImage(seed: number, label: string): string {
  const [c1, c2] = GRADIENTS[Math.abs(seed) % GRADIENTS.length];
  const safeLabel = label.replace(/[<&>]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="480" height="640" fill="url(#g)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="-apple-system, sans-serif" font-size="30" fill="rgba(255,255,255,0.92)" font-weight="600">
      ${safeLabel}
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
