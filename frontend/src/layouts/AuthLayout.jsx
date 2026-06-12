import { Outlet } from "react-router-dom";

/** Layout mínimo; LoginPage define su propio diseño a pantalla completa */
export default function AuthLayout() {
  return <Outlet />;
}
