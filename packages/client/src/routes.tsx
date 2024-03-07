import { MainLayout } from "./layouts";
import { routes as patientRoutes } from "./patients";
import { useRoutes } from "react-router-dom";

const Routes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [...patientRoutes],
    },
  ]);

  return routes;
};

export default Routes;
