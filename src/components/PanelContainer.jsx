const VITE_PREFIX = import.meta.env.VITE_PREFIX;

export default function PanelContainer() {
  return (
    <div className="panels-container">
      <div className="panel left-panel">
        <div className="content flex justify-center">
          <img style={{ width: "30%" }} src={`${VITE_PREFIX}assets/img/pet-shop.png`} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}