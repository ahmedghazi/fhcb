import { useEffect, useRef, useState } from "react";

export function useFooterMaxHeight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const footerInfo = ref.current?.querySelector(
        ".card__footer .card__info",
      );
      if (footerInfo) {
        const footerInfoBounding = footerInfo.getBoundingClientRect();
        setStyle(
          (prev) =>
            ({
              ...prev,
              "--footer-max-height": `${footerInfoBounding.height + 30 + 12}px`,
            }) as React.CSSProperties,
        );
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return { ref, style };
}
