import { useCallback, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getThreads } from "../services/threads.service";
import { useIntersection } from "../hooks/useIntersection.js";
import ThreadItem from "./ThreadItem.jsx";

// Cursor pagination is already wired with useInfiniteQuery.
//
// Automatic infinite scroll uses a sentinel observed by useIntersection.
//   1. Write a useIntersection(ref, onIntersect) hook (see src/hooks/useIntersection.js).
//   2. Create a sentinelRef with useRef and render <div ref={sentinelRef} /> after the list.
//   3. Build a guarded onIntersect: only fetchNextPage() when hasNextPage && !isFetchingNextPage.
//   4. Call useIntersection(sentinelRef, onIntersect).
//   5. Keep a "Loading more…" indicator driven by isFetchingNextPage.
export default function ThreadList() {
  const sentinelRef = useRef(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["threads"],
    queryFn: ({ pageParam }) => getThreads({ cursor: pageParam, take: 10 }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useIntersection(sentinelRef, onIntersect);

  if (isPending) return <p className="muted">Loading threads…</p>;
  if (isError) return <p className="error">Could not load threads: {error.message}</p>;

  const threads = data.pages.flatMap((page) => page.threads);

  return (
    <div>
      <ul className="threads">
        {threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </ul>

      <div ref={sentinelRef} className="sentinel" aria-hidden="true" />
      {isFetchingNextPage && <p className="loading-more">Loading more…</p>}
    </div>
  );
}
