import { useEffect } from "react";

// TODO: implement this custom hook.
//
// It should observe the element held in `ref` and call `onIntersect()` whenever
// that element scrolls into the viewport.
//
// Steps:
//   1. Inside a useEffect, read el = ref.current; if it's null, return early.
//   2. Create: new IntersectionObserver((entries) => { ... }, { threshold: 0.1 })
//      — when entries[0].isIntersecting is true, call onIntersect().
//   3. observer.observe(el) to start watching.
//   4. Return () => observer.disconnect() so the observer is cleaned up on unmount.
//   5. Dependency array: [ref, onIntersect].
export function useIntersection(ref, onIntersect) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, onIntersect]);
}
