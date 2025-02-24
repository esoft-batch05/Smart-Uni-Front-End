import React, { lazy, Suspense } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import Layout from "../Layout/Nav-Bar/NavBar";
import Home from "../Pages/Home/Home";
import MainLayout from '../Layout/ResponsiveLayout/SideBar'
import Dashboard from "../Pages/Dashboard/Dashboard";

function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Layout>
          <Suspense>
            <Outlet />
          </Suspense>
        </Layout>
      ),
      children: [{ path: "/", element: <Home /> }],
    },

    //Main outlet
    {
      path: "/",
      element: (
        <MainLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </MainLayout>
      ),
      children: [{ path: "/dashboard", element: <Dashboard /> }, {path: "/projects", element: <Dashboard />}],
    },
  ]);

  return routes;
}

export default Router;
