"use client";
import dynamic from "next/dynamic";

const VisualEditing = dynamic(
  () => import("next-sanity/visual-editing").then((mod) => mod.VisualEditing),
  { ssr: false },
);

export default VisualEditing;
