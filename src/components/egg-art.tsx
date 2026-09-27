import { clsx } from "clsx";

type EggArtProps = {
  color: string;
  speckled?: boolean;
  className?: string;
  /** Deterministic seed so speckles don't jump between renders. */
  seed?: string;
  style?: React.CSSProperties;
};

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** A shaded SVG egg in the product's real shell colour. */
export function EggArt({ color, speckled, className, style, seed = color }: EggArtProps) {
  const id = `egg-${seed.replace(/[^a-z0-9]/gi, "")}`;
  const rand = hash(seed);
  const speckles = speckled
    ? Array.from({ length: 34 }, () => ({
        cx: 22 + rand() * 56,
        cy: 20 + rand() * 88,
        r: 0.6 + rand() * 1.8,
        o: 0.25 + rand() * 0.45,
      }))
    : [];

  return (
    <svg
      viewBox="0 0 100 128"
      className={clsx("drop-shadow-[0_10px_12px_rgb(46_34_25/0.18)]", className)}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-shade`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.65" />
          <stop offset="35%" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M50 4C24 4 6 48 6 78c0 26 19 46 44 46s44-20 44-46C94 48 76 4 50 4Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="100" height="128" fill={color} />
        {speckles.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#3b2415" opacity={s.o} />
        ))}
        <rect width="100" height="128" fill={`url(#${id}-shade)`} />
      </g>
    </svg>
  );
}
