"use client";

import { clsx } from "clsx";
import Image from "next/image";
import { useState } from "react";
import { EggArt } from "./egg-art";

type Props = {
  src?: string | null;
  alt: string;
  /** Egg illustration used when there is no photo or it fails to load. */
  fallback: { color: string; speckled?: boolean; seed: string };
  className?: string;
  imgClassName?: string;
  eggClassName?: string;
  sizes?: string;
  priority?: boolean;
};

/** A remote photo of the bird, filling its (relatively positioned) container. */
export function BirdPhoto({
  src,
  alt,
  fallback,
  className,
  imgClassName,
  eggClassName = "h-3/5",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={clsx("absolute inset-0 grid place-items-center", className)}>
        <EggArt color={fallback.color} speckled={fallback.speckled} seed={fallback.seed} className={eggClassName} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      // Wikimedia already serves a resized copy, so skip the Next.js optimizer.
      unoptimized
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={clsx("object-cover", className, imgClassName)}
    />
  );
}
