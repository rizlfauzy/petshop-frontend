const { VITE_PREFIX } = import.meta.env;

export default function FooterLogin() {
  return <script src={`${VITE_PREFIX}assets/js/sweetalert2@11.js`}></script>;
}
