import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import BusRoute from "@/pages/BusRoute";
import Bus from "@/pages/Bus";
import BusType from "@/pages/BusType";
import BusStop from "@/pages/BusStop";
import Driver from "@/pages/Driver";
import Trip from "@/pages/Trip";
import Schedule from "@/pages/Schedule";
import Users from "@/pages/Users";
import LostNFound from "@/pages/LostNFound";
import BusLiveMap from "@/pages/BusLocation";
import LogIn from "@/pages/LogIn";
import Signup from "@/pages/Signup";
import ProtectedRoutes from "@/ProtectedRoutes";
import LogoutButton from "@/components/shared/main/LogoutButton";

import DynamicTrackingWrapper from "@/pages/DynamicTrackingWrapper";

// const urlParams = new URLSearchParams(window.location.search);
// const driverId = urlParams.get("driverId");

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/tracking",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <DynamicTrackingWrapper />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/route",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <BusRoute />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/bus",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Bus />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/bus-type",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <BusType />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/bus-stop",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <BusStop />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/driver",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Driver />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/trip",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Trip />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/schedule",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Schedule />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Users />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/lost-and-found",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <LostNFound />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/bus-live-map",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <BusLiveMap />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/testlogout",
    element: <LogoutButton isSidebarOpen={true} />,
  },
]);

export function AppRouter() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
