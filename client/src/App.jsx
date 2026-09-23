import ThreadList from "./components/ThreadList.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        Cursor pagination is wired with <code>useInfiniteQuery</code>. Scroll through the
        feed to trigger <strong>automatic infinite scroll</strong> — a{" "}
        <code>useIntersection</code> hook watches a sentinel <code>div</code> and calls{" "}
        <code>fetchNextPage</code> as you scroll.
      </p>
      <ThreadList />
    </div>
  );
}
