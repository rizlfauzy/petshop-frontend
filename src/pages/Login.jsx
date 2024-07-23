import HeaderLogin from "../templates/login/HeaderLogin";

import { useLocation, Navigate } from "react-router-dom";
import useSession from "../hooks/useSession";
import PanelContainer from "../components/PanelContainer";
import FormContainer from "../components/login/FormContainer";

const { VITE_PREFIX } = import.meta.env;

export default function Login() {
  const location = useLocation();
  const { session } = useSession();

  return (
    <>
      {/* jika ada session maka otomatis redirect ke halaman dashboard */}
      {session && <Navigate to={VITE_PREFIX} replace state={{ from: location }} />}

      {/* Component header untuk login */}
      <HeaderLogin title="LOGIN" />

      <div className="container">
        {/* Component untuk input username dan password */}
        <FormContainer />
        {/* Component letak icon web  */}
        <PanelContainer />
      </div>
    </>
  );
}
