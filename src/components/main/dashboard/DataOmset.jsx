import { useEffect, useCallback, useState, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "./Chart";
import { set_show_loading, set_graph } from "../../../hooks/useStore";
import useFormating from "../../../hooks/useFormating";
import moment from "moment";
import useSocket from "../../../hooks/useSocket";

export default function DataOmset() {
  const span_year = useRef(null);
  const btn_prev = useRef(null);
  const btn_next = useRef(null);
  const [graphState, setGraphState] = useState(null);
  const dispatch = useDispatch();
  const graph = useSelector((state) => state.conf.graph);
  const { format_rupiah } = useFormating();
  const socket = useSocket("graph", (res) => {
    setGraphState(res);
  })

  useLayoutEffect(() => {
    socket.emit("graph", { year: span_year.current.innerText })
  }, [socket])

  useEffect(() => {
    dispatch(set_show_loading(true));
    setTimeout(() => {
      if (!graphState) return;
      const { data: list } = graphState;
      const item = {
        labels: list?.map(({ periode }) =>
          new Date(periode).toLocaleDateString("id-ID", {
            month: "short",
          })
        ),
        datasets: [
          {
            label: `Omset Bulanan Tahun ${list[0].periode.split("-")[0]}`,
            data: list?.map(({ penjualan }) => Number(penjualan)),
            borderColor: "green",
            fill: false,
            parsing: true,
            pointBackgroundColor: "brown",
            pointBorderColor: "brown",
            pointRadius: 3,
          },
        ],
      };
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
          },
        },
      };
      dispatch(set_graph({ data: item, options }));
      dispatch(set_show_loading(false));
    }, 1000);
  }, [dispatch, graphState]);

  useEffect(() => {
    if (span_year.current.innerHTML == new Date().getFullYear()) btn_next.current.disabled = true;
    else btn_next.current.disabled = false;
  }, []);

  const handle_change_year = useCallback((e) => {
    if (e.target.id == "btn_prev") span_year.current.innerHTML = Number(span_year.current.innerHTML) - 1;
    if (e.target.id == "btn_next") span_year.current.innerHTML = Number(span_year.current.innerHTML) + 1;

    if (span_year.current.innerHTML == new Date().getFullYear()) btn_next.current.disabled = true;
    else btn_next.current.disabled = false;
    // run_socket("graph", {
    //   year: span_year.current.innerHTML,
    // });
    socket.emit("graph", { year: span_year.current.innerHTML });
  }, [socket]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-[14px]">DATA OMSET</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <div className="col-full">
            <div className="row justify-center items-center">
              <button
                ref={btn_prev}
                id="btn_prev"
                type="button"
                onClick={(e) => handle_change_year(e)}
                className="bg-slate-100 text-center px-3 py-[0.15rem] text-gray-700 align-middle leading-[1.5] rounded-lg mb-0 disabled:bg-slate-50 disabled:text-gray-50 hover:bg-slate-300 hover:text-gray-900"
              >
                &laquo;
              </button>
              <span className="mx-3 align-middle text-[12px]" ref={span_year}>
                {moment().format("YYYY")}
              </span>
              <button
                ref={btn_next}
                id="btn_next"
                type="button"
                onClick={(e) => handle_change_year(e)}
                className="bg-slate-100 text-center px-3 py-[0.15rem] text-gray-700 align-middle leading-[1.5] rounded-lg mb-0 disabled:bg-slate-50 disabled:text-gray-50 hover:bg-slate-300 hover:text-gray-900"
              >
                &raquo;
              </button>
            </div>
          </div>
          {graph && (
            <>
              <Chart data={graph?.data} options={graph?.options} />
              <div id="dec_graph" className="flex flex-wrap">
                {graphState?.data?.map(({ periode, penjualan }) => {
                  const period = new Date(periode).toLocaleDateString("id-ID", {
                    month: "short",
                  });
                  return (
                    <div className="col-quarter" key={periode}>
                      <div className="card">
                        <div className="card-body">
                          <span className="text-[12px]">{period}</span> <p className="card-text text-[12px]">{format_rupiah(penjualan)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
