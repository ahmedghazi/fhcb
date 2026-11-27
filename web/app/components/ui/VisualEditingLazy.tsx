"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, type ComponentProps } from "react";

const VisualEditingBase = dynamic(
  () => import("next-sanity/visual-editing").then((mod) => mod.VisualEditing),
  { ssr: false },
);

type Props = Omit<ComponentProps<typeof VisualEditingBase>, "refresh">;
type RefreshPayload = Parameters<
  NonNullable<ComponentProps<typeof VisualEditingBase>["refresh"]>
>[0];

// Studio edits ("mutation") are left to <SanityLive includeDrafts /> (see
// layout.tsx): it fires once the draft is saved in the Content Lake, so the
// refetch can't read stale content. Manual refreshes re-render right away.
const VisualEditing = (props: Props) => {
  const router = useRouter();
  const refresh = useCallback(
    (payload: RefreshPayload) => {
      if (payload.source === "mutation") return false;
      router.refresh();
      return new Promise<void>((resolve) => setTimeout(resolve, 200));
    },
    [router],
  );

  return <VisualEditingBase {...props} refresh={refresh} />;
};

export default VisualEditing;
