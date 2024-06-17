import useAsync from "../../hooks/useAsync";
import { get_data } from "../../hooks/useFetch";
import { useEffect, useLayoutEffect } from "react";
import { create_item } from "../../hooks/useStore";
import { useDispatch } from "react-redux";
import useSession from "../../hooks/useSession";

export default function Sidebar() {
  const { run, isLoading, data } = useAsync();
  const dispatch = useDispatch();
  const { session } = useSession();

  useLayoutEffect(() => {
    run(
      get_data({
        url: "/sidebar",
        headers: {
          "X-CSRF-TOKEN": session.token,
        },
      })
    );
  }, [run]);

  useEffect(() => {
    const obj = !isLoading ? data : {};
    dispatch(create_item(obj));
  }, [data, isLoading, dispatch])

  return (
    <>
      {console.log(data)}
      <div className="sidebar"></div>
    </>
  );
}
