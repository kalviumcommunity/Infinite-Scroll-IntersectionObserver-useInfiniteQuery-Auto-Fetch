import ThreadList from "./components/ThreadList.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        Threads load automatically as you scroll, using <code>useInfiniteQuery</code> and
        <code> IntersectionObserver</code> to fetch the next page.
      </p>
      <ThreadList />
    </div>
  );
}
