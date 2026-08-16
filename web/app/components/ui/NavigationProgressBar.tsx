"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import styles from "./NavigationProgressBar.module.css";
import {
  getNavigationPendingServerSnapshot,
  getNavigationPendingSnapshot,
  patchViewTransitionProgress,
  subscribeNavigationPending,
} from "@/app/lib/navigationProgress";

type Phase = "idle" | "loading" | "done" | "fading";

export default function NavigationProgressBar() {
  const isPending = useSyncExternalStore(
    subscribeNavigationPending,
    getNavigationPendingSnapshot,
    getNavigationPendingServerSnapshot,
  );
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    patchViewTransitionProgress();
  }, []);

  useEffect(() => {
    if (isPending) {
      setPhase("loading");
    } else {
      setPhase((current) => (current === "loading" ? "done" : current));
    }
  }, [isPending]);

  useEffect(() => {
    if (phase === "done") {
      const timeout = setTimeout(() => setPhase("fading"), 200);
      return () => clearTimeout(timeout);
    }
    if (phase === "fading") {
      const timeout = setTimeout(() => setPhase("idle"), 200);
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  return (
    <div
      aria-hidden='true'
      className={clsx(styles.bar, phase !== "idle" && styles[phase])}
    />
  );
}
