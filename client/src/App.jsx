import ThreadList from "./components/ThreadList.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        Browse the latest discussions with <strong>automatic infinite scroll</strong>.
        More threads load as you reach the end of the list.
      </p>
      <ThreadList />
    </div>
  );
}
