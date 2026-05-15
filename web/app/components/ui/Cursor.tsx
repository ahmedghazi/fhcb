"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./cursor.module.css";

type CProps = {
  color: string;
  size: number;
};

interface Style {
  x: number;
  y: number;
  opacity: number;
}

const Cursor = ({ color, size }: CProps) => {
  const [css, setCss] = useState<Style>({ x: 0, y: 0, opacity: 0 });
  const [isAnchorOrButton, setIsAnchorOrButton] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.add("has-custom-cursor");
    return () => document.body.classList.remove("has-custom-cursor");
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", _onMouseMove);
    document.addEventListener("mousedown", _onMouseDown);
    document.addEventListener("mouseup", _onMouseUp);

    return () => {
      document.removeEventListener("mousemove", _onMouseMove);
      document.removeEventListener("mousedown", _onMouseDown);
      document.removeEventListener("mouseup", _onMouseUp);
    };
  }, [size]);

  const _onMouseMove = (e: MouseEvent) => {
    const isTouch = window.innerWidth < 1080;
    if (isTouch) return;

    const __isAnchorOrButton = _getIsAnchorOrButton(e.target as Element);
    setIsAnchorOrButton(__isAnchorOrButton);

    const offset = size / 2;
    setCss((prev) => ({ ...prev, x: e.clientX - offset, y: e.clientY - offset, opacity: 1 }));
  };

  const _onMouseDown = () => setIsMouseDown(true);
  const _onMouseUp = () => setIsMouseDown(false);

  const _getIsAnchorOrButton = (target: Element) => {
    return (
      target.tagName.toLowerCase() === "a" ||
      target.tagName.toLowerCase() === "button" ||
      target.classList.contains("button") ||
      target.classList.contains("btn") ||
      target.classList.contains("cursor-pointer")
    );
  };

  const style = {
    "--color": color,
    "--size": size + "px",
    transform: `translate(${css.x}px, ${css.y}px)`,
    opacity: css.opacity,
  } as CSSProperties;

  return (
    <div
      className={clsx(
        styles.cursor,
        "cursor",
        isAnchorOrButton && styles.cursorOnButton,
        isMouseDown && styles.cursorClick,
      )}
      style={style}>
      <div className={styles.dot}></div>
    </div>
  );
};

export default Cursor;
