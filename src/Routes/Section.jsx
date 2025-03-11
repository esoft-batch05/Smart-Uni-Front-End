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
        { path: "/lecturer-events", element: <EventCard /> }, 
        { path: "/lecturer-classes", element: <Dashboard /> }, 
        { path: "/lecturer-library", element: <Dashboard /> }, 
        { path: "/lecturer-resources", element: <Resource /> },
        { path: "/lecturer-settings", element: <SettingPage /> },
        { path: "/lecturer-message", element: <Message /> },
        { path: "/tasks", element: <CampusMapExample /> },
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
        { path: "/student-classes", element: <Dashboard /> }, 
        { path: "/student-library", element: <Dashboard /> }, 
        { path: "/student-resources", element: <Resource /> }, 
        { path: "/student-settings", element: <SettingPage /> }, 
        { path: "/student-message", element: <Message /> },
        { path: "/tasks", element: <CampusMapExample /> },
      
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
        { path: "/admin-dashboard", element: <Dashboard /> }, 
        { path: "/admin-events", element: <EventCard /> }, 
        { path: "/admin-classes", element: <Dashboard /> }, 
        { path: "/admin-library", element: <Dashboard /> }, 
        { path: "/admin-resources", element: <Resource /> }, 
        { path: "/admin-settings", element: <SettingPage /> }, 
        { path: "/admin-message", element: <Message /> },
        { path: "/tasks", element: <CampusMapExample /> },

        
      ],
    },
  ]);

  return routes;
}

export default Router;
