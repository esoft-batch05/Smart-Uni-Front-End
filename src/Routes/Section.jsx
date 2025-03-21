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
import EventCard from "../Pages/Event/Event";
import Resource from "../Pages/Resources/Resource";
import SettingPage from "../Pages/Setting/SettingPage";
import Message from "../Pages/Message/Message";
import CampusMapExample from "../Pages/Tasks/Tasks";
import Library from "../Pages/Library/Library";
import Classes from "../Pages/Classes/Classes";
import Shop from "../Pages/Shop/Shop";
import ForgotPassword from "../Pages/Forgot Password/ForgotPassword";
import AdminShopPage from "../Pages/Products/AddProducts";

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
    { path: "/forgot-password", element: <ForgotPassword /> },

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
        { path: "/lecturer-events", element: <EventCard /> }, 
        { path: "/lecturer-classes", element: <Classes /> }, 
        { path: "/lecturer-library", element: <Library /> }, 
        { path: "/lecturer-resources", element: <Resource /> },
        { path: "/lecturer-settings", element: <SettingPage /> },
        { path: "/lecturer-message", element: <Message /> },
        { path: "/tasks", element: <CampusMapExample /> },
        { path: "/shop", element: <Shop /> },
      ],
    },
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
        { path: "/student-dashboard", element: <Dashboard /> }, 
        { path: "/student-events", element: <EventCard /> }, 
        { path: "/student-classes", element: <Classes /> }, 
        { path: "/student-library", element: <Library /> }, 
        { path: "/student-resources", element: <Resource /> }, 
        { path: "/student-settings", element: <SettingPage /> }, 
        { path: "/student-message", element: <Message /> },
        { path: "/tasks", element: <CampusMapExample /> },
        { path: "/shop", element: <Shop /> },
      
      ],
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
        { path: "/admin-events", element: <EventCard /> }, 
        { path: "/admin-classes", element: <Classes /> }, 
        { path: "/admin-library", element: <Library /> }, 
        { path: "/admin-resources", element: <Resource /> }, 
        { path: "/admin-settings", element: <SettingPage /> }, 
        { path: "/admin-message", element: <Message /> },
        { path: "/map", element: <CampusMapExample /> },
        { path: "/admin-shop", element: <AdminShopPage /> },

      ],
    },
  ]);

  return routes;
}

export default Router;
