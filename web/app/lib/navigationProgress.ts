// Tracks whether a view transition (page navigation) is in flight, by
// wrapping document.startViewTransition — the promise passed to it only
// resolves once the new route has actually rendered, which is exactly the
// window during which the UI would otherwise look frozen.
type Listener = () => void;

let pending = false;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

export const subscribeNavigationPending = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getNavigationPendingSnapshot = () => pending;
export const getNavigationPendingServerSnapshot = () => false;

let patched = false;

export const patchViewTransitionProgress = () => {
  if (patched || typeof document === "undefined") return;
  if (!("startViewTransition" in document)) return;
  patched = true;

  const nativeStartViewTransition = document.startViewTransition.bind(document);

  document.startViewTransition = ((callback?: () => void | Promise<void>) => {
    pending = true;
    emit();

    const transition = nativeStartViewTransition(callback);

    transition.finished.finally(() => {
      pending = false;
      emit();
    });

    return transition;
  }) as typeof document.startViewTransition;
};
