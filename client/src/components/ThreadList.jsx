import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { getThreads } from "../services/threads.service";
import { useIntersection } from "../hooks/useIntersection";

import ThreadItem from "./ThreadItem.jsx";

// Cursor pagination is already wired with useInfiniteQuery.
//
// Automatic infinite scroll is implemented using an IntersectionObserver
// sentinel at the bottom of the thread list.

export default function ThreadList() {
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
    queryFn: ({ pageParam }) =>
      getThreads({ cursor: pageParam, take: 10 }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ?? undefined,
  });

  const sentinelRef = useRef(null);

  const onIntersect = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useIntersection(sentinelRef, onIntersect);

  if (isPending) {
    return <p className="muted">Loading threads…</p>;
  }

  if (isError) {
    return (
      <p className="error">
        Could not load threads: {error.message}
      </p>
    );
  }

  const threads = data.pages.flatMap((page) => page.threads);

  return (
    <div>
      <ul className="threads">
        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
          />
        ))}
      </ul>

      {hasNextPage && (
        <>
          <div ref={sentinelRef} />

          {isFetchingNextPage && (
            <div className="load-more">
              Loading more…
            </div>
          )}
        </>
      )}
    </div>
  );
}