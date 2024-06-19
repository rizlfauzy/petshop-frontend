import { useSelector } from "react-redux";

export default function Loading() {
  const show_loading = useSelector((state) => state.conf.show_loading);

  return (
    show_loading && (
      <div id="overlay-spinner">
        <div className="loader"></div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  );
}