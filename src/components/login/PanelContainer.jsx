const VITE_PREFIX = import.meta.env.VITE_PREFIX;

export default function PanelContainer() {
  return (
    <div className="panels-container">
      <div className="panel left-panel">
        <div className="content flex justify-center">
          <img style={{ width: "30%" }} src={`${VITE_PREFIX}assets/img/pet-shop.png`} className="image" alt="" />
          <p>{/* <!-- <b><-?= $toko->nama ?></b> --> */}</p>
          <p style={{ fontSize: "1.05rem" }}>{/* <!-- <-?= $toko->alamat ?> --> */}</p>
        </div>
      </div>
    </div>
  );
}