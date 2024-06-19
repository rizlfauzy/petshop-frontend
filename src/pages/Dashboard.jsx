import HeaderPage from "../components/HeaderPage";
import PropTypes from "prop-types";
import moment from "moment";
import Chart from "../components/main/dashboard/Chart";
import useSocketIo from "../hooks/useSocketIo";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { set_show_loading, set_graph } from "../hooks/useStore";
import { useEffect } from "react";
import { useRef } from "react";

export default function Dashboard({ icon, title }) {
  const span_year = useRef(null);
  const socket = useSocketIo();
  const dispatch = useDispatch();
  const graph = useSelector((state) => state.conf.graph);
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
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
        text: "Chart.js Bar Chart",
      },
    },
  };

  useEffect(() => {
    socket.connect();
    socket.emit("graph", {
      year: span_year.current.innerText,
    });
    socket.on("graph", (sales) => {
      dispatch(set_show_loading(true));
      setTimeout(() => {
        const data = {
          labels: sales.map(({ periode }) =>
            new Date(periode).toLocaleDateString("id-ID", {
              month: "short",
            })
          ),
          datasets: [
            {
              label: `Omset Bulanan Tahun ${sales[0].periode.split("-")[0]}`,
              data: sales.map(({ penjualan }) => Number(penjualan)),
              borderColor: "green",
              fill: false,
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
              text: "Chart.js Bar Chart",
            },
          },
        };
        dispatch(set_graph({ data, options }));
        // setData({ data, options });
        dispatch(set_show_loading(false));
      }, 1000);
    });
    return () => {
      socket.disconnect();
    };
  }, [ ]);
  return (
    <>
      <HeaderPage icon={icon} title={title} />
      <Loading />
      <div className="col-full table-responsive">
        <div className="row">
          <div className="sm:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-lg">DATA OMSET</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="col-full">
                    <div className="row justify-center items-center">
                      <button type="button" className="bg-slate-100 text-center px-3 py-[0.15rem] text-gray-700 align-middle leading-[1.5] rounded-lg mb-0">
                        &laquo;
                      </button>
                      <span className="mx-3 align-middle text-[12px]" ref={span_year}>{moment().format("YYYY")}</span>
                      <button type="button" className="bg-slate-100 text-center px-3 py-[0.15rem] text-gray-700 align-middle leading-[1.5] rounded-lg mb-0">
                        &raquo;
                      </button>
                    </div>
                  </div>
                  {console.log(graph)}
                  <Chart data={data} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
