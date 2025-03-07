import React, { lazy, Suspense } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import Layout from "../Layout/Nav-Bar/NavBar";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Signup/Signup";

import LecturerLayout from "../Layout/ResponsiveLayout-lecturer/SideBar";
import StudentLayout from "../Layout/ResponsiveLayout-student/SideBar";
import AdminLayout from "../Layout/ResponsiveLayout-Admin/SideBar";
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
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },

    // Main Outlet
    {
      path: "/",
      element: (
        <LecturerLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </LecturerLayout>
      ),
      children: [
        { path: "/lecturer-dashboard", element: <Dashboard /> }, 
        { path: "/lecturer-events", element: <Dashboard /> }, 
        { path: "/lecturer-classes", element: <Dashboard /> }, 
        { path: "/lecturer-library", element: <Dashboard /> }, 
        { path: "/lecturer-resources", element: <Dashboard /> }, 
      ],
    },
    {
      path: "/",
      element: (
        <StudentLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </StudentLayout>
      ),
      children: [
        { path: "/student-dashboard", element: <Dashboard /> }, 
        { path: "/student-events", element: <Dashboard /> }, 
        { path: "/student-classes", element: <Dashboard /> }, 
        { path: "/student-library", element: <Dashboard /> }, 
        { path: "/student-resources", element: <Dashboard /> },       ],
    },
    {
      path: "/",
      element: (
        <AdminLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </AdminLayout>
      ),
      children: [
        { path: "/admin-dashboard", element: <Dashboard /> }, 
        { path: "/projects", element: <Dashboard /> }, 
      ],
    },
  ]);

  return routes;
}

export default Router;
