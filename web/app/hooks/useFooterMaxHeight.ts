import { useEffect, useRef, useState } from "react";

export function useFooterMaxHeight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const footerContent = ref.current?.querySelector(
        ".card__footer-content .card__btns .card__btns-conntent",
      );
      if (footerContent) {
        const footerContentBounding = footerContent.getBoundingClientRect();
        setStyle(
          (prev) =>
            ({
              ...prev,
              "--footer-max-height": `${footerContentBounding.height}px`,
            }) as React.CSSProperties,
        );
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return { ref, style };
}
