"use client";

import { useEffect, useState } from "react";

type InlineSvgProps = {
  src: string;
  className?: string;
};

export default function InlineSvg({ src, className }: InlineSvgProps) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setSvg(text);
      })
      .catch((err) => {
        console.error("❌ Error cargando SVG:", err);
        if (!cancelled) setSvg("");
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!svg) {
    return <div className={className}>Cargando mapa...</div>;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}