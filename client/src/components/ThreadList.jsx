import { useCallback, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersection from "../hooks/useIntersection";
import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";

export default function ThreadList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["threads"],
    queryFn: ({ pageParam }) =>
      getThreads({
        cursor: pageParam,
        take: 10,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ?? undefined,
  });

  // Sentinel element reference
  const sentinelRef = useRef(null);

  // Automatically fetch the next page when the sentinel is visible
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Watch the sentinel
  useIntersection(sentinelRef, onIntersect);

  if (isPending) {
    return <p>Loading…</p>;
  }

  if (isError) {
    return <p>Could not load threads.</p>;
  }

  const threads = data.pages.flatMap((page) => page.threads);

  return (
    <div>
      <ul>
        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
          />
        ))}
      </ul>

      {/* Sentinel: triggers automatic loading when it enters the viewport */}
      <div ref={sentinelRef} />

      {/* Loading indicator */}
      {isFetchingNextPage && (
        <p className="loading-more">
          Loading more…
        </p>
      )}
    </div>
  );
}